const SITE_URL = "namamivindhyavasini.in";
const SITE_NAME_HI = "॥ श्री विन्ध्यवासिनी ॥";
const SITE_NAME_EN = "Namami Vindhyavasini";

function loadImage(source: Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    let objectUrl: string | null = null;

    img.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for watermark"));
    };

    if (typeof source === "string") {
      img.src = source;
    } else {
      objectUrl = URL.createObjectURL(source);
      img.src = objectUrl;
    }
  });
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** Adds diagonal + footer watermark for gallery / shared images. */
export async function addGalleryWatermark(
  source: Blob | string,
  hi = false
): Promise<{ blob: Blob; dataUrl: string }> {
  const img = await loadImage(source);

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(img, 0, 0);

  // Diagonal repeating watermark
  ctx.save();
  ctx.rotate((-25 * Math.PI) / 180);
  const fontSize = Math.max(14, Math.round(canvas.width * 0.028));
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = "rgba(217, 56, 30, 0.085)";
  ctx.textAlign = "left";
  const stepX = fontSize * 14;
  const stepY = fontSize * 6;
  for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
    const xOffset = (y / stepY) % 2 === 0 ? 0 : stepX / 2;
    for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
      ctx.fillText(SITE_URL, x + xOffset, y);
    }
  }
  ctx.restore();

  // Bottom footer bar with site name + URL
  const barH = Math.max(48, Math.round(canvas.height * 0.055));
  const barY = canvas.height - barH - Math.round(canvas.height * 0.02);
  const barW = Math.round(canvas.width * 0.72);
  const barX = (canvas.width - barW) / 2;
  const radius = barH / 2;

  ctx.save();
  ctx.shadowColor = "rgba(217, 56, 30, 0.35)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = "#D9381E";
  drawRoundRect(ctx, barX, barY, barW, barH, radius);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "#D6A232";
  ctx.lineWidth = Math.max(2, Math.round(canvas.width * 0.003));
  drawRoundRect(ctx, barX + 3, barY + 3, barW - 6, barH - 6, radius - 3);
  ctx.stroke();

  const nameSize = Math.max(12, Math.round(canvas.width * 0.022));
  const urlSize = Math.max(10, Math.round(canvas.width * 0.018));
  ctx.fillStyle = "#FFFDF6";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `bold ${nameSize}px Georgia, serif`;
  ctx.fillText(hi ? SITE_NAME_HI : SITE_NAME_EN, canvas.width / 2, barY + barH * 0.38);
  ctx.font = `600 ${urlSize}px sans-serif`;
  ctx.fillText(SITE_URL, canvas.width / 2, barY + barH * 0.72);

  const dataUrl = canvas.toDataURL("image/png");
  const blob = await (await fetch(dataUrl)).blob();
  return { blob, dataUrl };
}
