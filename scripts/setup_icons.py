#!/usr/bin/env python3
"""
Quick Icon Setup Script
Converts an image to favicon and app icons with proper formats
Requires: Pillow library

Install: pip install Pillow

Usage:
  python scripts/setup_icons.py /path/to/image.png
  python scripts/setup_icons.py --help
"""

import argparse
import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow library not installed")
    print("Install it with: pip install Pillow")
    sys.exit(1)


def resize_image(input_path: str, output_path: str, size: tuple) -> bool:
    """Resize image to specified size with proper formatting"""
    try:
        with Image.open(input_path) as img:
            # Convert RGBA to proper format
            if img.mode != "RGBA":
                img = img.convert("RGBA")

            # Resize with proper aspect ratio
            img.thumbnail(size, Image.Resampling.LANCZOS)

            # Create new image with size and paste centered
            background = Image.new("RGBA", size, (255, 255, 255, 0))
            offset = (
                (size[0] - img.width) // 2,
                (size[1] - img.height) // 2,
            )
            background.paste(img, offset, img)

            # Convert to RGB for PNG with white background
            final = Image.new("RGB", size, (255, 255, 255))
            final.paste(background, (0, 0), background)
            final.save(output_path, "PNG", quality=95)

            return True
    except Exception as e:
        print(f"Error processing image: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Convert an image to favicon and app icons",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python scripts/setup_icons.py deity.png
  python scripts/setup_icons.py /path/to/deity.png
        """,
    )

    parser.add_argument(
        "image",
        help="Path to the image file (PNG, JPG, etc.)",
    )

    parser.add_argument(
        "--output-dir",
        default="public",
        help="Output directory for icons (default: public)",
    )

    args = parser.parse_args()

    # Verify input file exists
    input_path = Path(args.image)
    if not input_path.exists():
        print(f"Error: Image file not found: {args.image}")
        sys.exit(1)

    # Create output directory
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Icons to generate: (filename, size)
    icons = [
        ("favicon.png", (32, 32)),
        ("icon-192.png", (192, 192)),
        ("icon-512.png", (512, 512)),
        ("apple-touch-icon.png", (180, 180)),
    ]

    print(f"Converting image: {input_path}")
    print(f"Output directory: {output_dir}")
    print()

    success_count = 0
    for filename, size in icons:
        output_path = output_dir / filename
        print(f"Generating {filename} ({size[0]}x{size[1]})...", end=" ")

        if resize_image(str(input_path), str(output_path), size):
            print(f"✓ Created")
            success_count += 1
        else:
            print(f"✗ Failed")

    print()
    if success_count == len(icons):
        print(f"✅ Success! All {len(icons)} icons created.")
        print(f"📁 Icons are in: {output_dir}")
        print()
        print("Next steps:")
        print("1. Commit the icons to version control")
        print("2. Rebuild your app: npm run build")
        print("3. Deploy to production")
    else:
        print(f"⚠️  Created {success_count}/{len(icons)} icons")
        sys.exit(1)


if __name__ == "__main__":
    main()
