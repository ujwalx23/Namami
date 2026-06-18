export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function canShareFiles(file: File): boolean {
  if (!navigator.share) return false;
  if (!navigator.canShare) return true;
  return navigator.canShare({ files: [file] });
}

/** Opens the OS share sheet with an image file (mobile). Returns true if shared or user cancelled. */
export async function shareImageNative(opts: {
  blob: Blob;
  filename: string;
  title?: string;
  text?: string;
}): Promise<"shared" | "cancelled" | "failed"> {
  if (!navigator.share) return "failed";

  const type = opts.blob.type || "image/png";
  const file = new File([opts.blob], opts.filename, { type });
  if (!canShareFiles(file)) return "failed";

  try {
    await navigator.share({
      files: [file],
      title: opts.title,
      text: opts.text,
    });
    return "shared";
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return "cancelled";
    return "failed";
  }
}

/** Opens the native WhatsApp app with a pre-filled message (mobile fallback). */
export function openWhatsAppApp(message: string): void {
  const encoded = encodeURIComponent(message);
  window.location.href = `https://api.whatsapp.com/send?text=${encoded}`;
}
