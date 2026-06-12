import * as React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Download, Check, Link } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataUrl: string | null;   // Canvas data URL OR regular https:// image URL
  imageBlob: Blob | null;   // Image blob for clipboard copy (may be null for external URLs)
  imageUrl: string;         // Direct image URL
  pageUrl: string;          // Page share link
  text: string;             // Quote text or caption
  title?: string;
  downloadFilename?: string;
}

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  dataUrl,
  imageBlob,
  imageUrl,
  pageUrl,
  text,
  title,
  downloadFilename,
}) => {
  const { lang } = useLang();
  const hi = lang === "hi";

  const [copiedLink, setCopiedLink] = useState(false);
  const [whatsappSharing, setWhatsappSharing] = useState(false);

  // Check if the image source is a data: URL (canvas-generated, e.g. Sandesh)
  // vs a regular https:// URL (external, e.g. Pinterest/Supabase gallery images)
  const isDataUrl = dataUrl?.startsWith("data:") ?? false;

  // WhatsApp share:
  //   - If we have a blob (canvas-generated Sandesh): copy image to clipboard → open WhatsApp Web → user pastes
  //   - If no blob (external URL like Pinterest): copy image to clipboard if possible, else share link
  const handleWhatsAppShare = async () => {
    setWhatsappSharing(true);

    let imageCopied = false;

    if (imageBlob) {
      try {
        const clipBlob = imageBlob.type === "image/png"
          ? imageBlob
          : new Blob([await imageBlob.arrayBuffer()], { type: "image/png" });

        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": clipBlob }),
        ]);
        imageCopied = true;
      } catch (clipErr) {
        console.warn("[ShareModal] Clipboard write failed:", clipErr);
      }
    }

    // Open WhatsApp Web
    window.open("https://web.whatsapp.com/", "_blank", "noopener,noreferrer");

    if (imageCopied) {
      toast.success(
        hi
          ? "✅ फोटो कॉपी हो गई! व्हाट्सएप में किसी भी चैट में Ctrl+V दबाएँ।"
          : "✅ Photo copied! Press Ctrl+V in any WhatsApp chat to send.",
        { duration: 6000 }
      );
    } else {
      // No blob available (external URL) — share the link instead
      try {
        await navigator.clipboard.writeText(`${text}\n${pageUrl}`);
        toast.success(
          hi
            ? "लिंक कॉपी हो गया! व्हाट्सएप में Ctrl+V दबाकर भेजें।"
            : "Link copied! Press Ctrl+V in WhatsApp to send.",
          { duration: 5000 }
        );
      } catch {
        toast(
          hi
            ? "व्हाट्सएप वेब खुल गया।"
            : "WhatsApp Web opened.",
          { duration: 3000 }
        );
      }
    }

    setWhatsappSharing(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopiedLink(true);
      toast.success(hi ? "लिंक कॉपी हो गया!" : "Link copied!");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast.error(hi ? "कॉपी करने में विफल" : "Failed to copy link");
    }
  };

  const handleDownload = async () => {
    const src = dataUrl || imageUrl;
    if (!src) return;

    // For data: URLs (canvas-generated Sandesh cards) — direct download always works
    if (src.startsWith("data:")) {
      const a = document.createElement("a");
      a.href = src;
      a.download = downloadFilename || `namami_vindhyavasini_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success(hi ? "डाउनलोड शुरू!" : "Download started!");
      return;
    }

    // For https:// URLs — try blob download first, fallback gracefully
    if (imageBlob) {
      // We already have the blob (fetched earlier)
      const blobUrl = URL.createObjectURL(imageBlob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = downloadFilename || `namami_vindhyavasini_${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      toast.success(hi ? "डाउनलोड शुरू!" : "Download started!");
      return;
    }

    // No blob available (CORS blocked, e.g. Pinterest) — open in new tab
    // The user can long-press (mobile) or right-click > Save As (desktop)
    window.open(src, "_blank");
    toast(
      hi
        ? "फोटो नई टैब में खुली — राइट-क्लिक करके 'Save Image As' चुनें।"
        : "Photo opened in new tab — right-click and choose 'Save Image As'.",
      { duration: 5000, icon: "💡" }
    );
  };

  // Preview source — works for both data: and https:// URLs
  const previewSrc = dataUrl || imageUrl || null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-[#FFFDF6] border-2 border-gold/40 rounded-2xl shadow-sacred p-0 overflow-hidden text-foreground">

        {/* Decorative top stripe */}
        <div className="h-2 bg-gradient-to-r from-maroon via-saffron to-maroon w-full" />

        <div className="p-5 pb-6 space-y-5">
          <DialogHeader className="space-y-1">
            <div className="text-center font-serif text-maroon text-[10px] tracking-[0.25em] font-semibold uppercase opacity-70 mb-0.5">
              {hi ? "॥ श्री विन्ध्यवासिनी ॥" : "|| Shri Vindhyavasini ||"}
            </div>
            <DialogTitle className="text-xl font-display font-semibold text-center text-maroon">
              {title || (hi ? "साझा करें" : "Share")}
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-[11px] font-medium">
              {hi
                ? "व्हाट्सएप पर भेजें, डाउनलोड करें, या लिंक कॉपी करें"
                : "Send on WhatsApp, download, or copy link"}
            </DialogDescription>
          </DialogHeader>

          {/* Image Preview — centered, no crossOrigin so external URLs work */}
          <div className="flex justify-center">
            <div className="rounded-xl bg-amber-50/40 border border-gold/20 shadow-inner p-2.5 inline-block">
              {previewSrc ? (
                <div className="relative group max-h-[240px] max-w-[180px] overflow-hidden rounded-lg border-2 border-gold/30 shadow-md transition-transform duration-300 hover:scale-[1.02]">
                  <img
                    src={previewSrc}
                    alt="Share Preview"
                    className="max-h-[240px] w-full object-cover pointer-events-none select-none"
                  />
                </div>
              ) : (
                <div className="h-[200px] w-[150px] flex items-center justify-center text-muted-foreground text-xs border border-dashed border-gold/30 rounded-lg">
                  {hi ? "लोड हो रही है..." : "Loading..."}
                </div>
              )}
            </div>
          </div>

          {/* 3 Action Buttons — clean vertical stack */}
          <div className="flex flex-col gap-2.5">

            {/* 1. WhatsApp — primary, most prominent */}
            <button
              onClick={handleWhatsAppShare}
              disabled={whatsappSharing}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-green-300 bg-gradient-to-r from-green-50 to-green-50/50 hover:from-green-100 hover:to-green-50 text-green-700 font-semibold text-sm transition-all duration-200 active:scale-[0.98] shadow-sm disabled:opacity-60"
            >
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                <WhatsAppIcon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold">{hi ? "व्हाट्सएप पर भेजें" : "Send on WhatsApp"}</p>
                <p className="text-[10px] text-green-600/80 font-normal mt-0.5">
                  {isDataUrl
                    ? (hi ? "फोटो कॉपी → व्हाट्सएप → Ctrl+V" : "Photo copied → WhatsApp → Ctrl+V")
                    : (hi ? "लिंक कॉपी → व्हाट्सएप → Ctrl+V" : "Link copied → WhatsApp → Ctrl+V")}
                </p>
              </div>
            </button>

            {/* 2. Download Photo */}
            <button
              onClick={handleDownload}
              disabled={!dataUrl && !imageUrl}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gold/30 bg-white hover:bg-gold/5 text-maroon font-semibold text-sm transition-all duration-200 active:scale-[0.98] shadow-sm disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center text-saffron shrink-0">
                <Download size={18} />
              </div>
              <div className="text-left">
                <p>{hi ? "फोटो डाउनलोड करें" : "Download Photo"}</p>
                <p className="text-[10px] text-muted-foreground font-normal mt-0.5">
                  {hi ? "डिवाइस में सेव करें" : "Save to your device"}
                </p>
              </div>
            </button>

            {/* 3. Copy Page Link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gold/30 bg-white hover:bg-gold/5 text-maroon font-semibold text-sm transition-all duration-200 active:scale-[0.98] shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center text-saffron shrink-0">
                  {copiedLink ? <Check size={18} className="text-green-600" /> : <Link size={18} />}
                </div>
                <div className="text-left">
                  <p>{hi ? "लिंक कॉपी करें" : "Copy Link"}</p>
                  <p className="text-[10px] text-muted-foreground font-normal mt-0.5">
                    {hi ? "वेबसाइट का लिंक" : "Website URL"}
                  </p>
                </div>
              </div>
              {copiedLink && (
                <span className="text-xs text-green-600 font-bold animate-in fade-in">
                  {hi ? "कॉपी!" : "Copied!"}
                </span>
              )}
            </button>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
