import * as React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Download, Check, Link, Facebook } from "lucide-react";
import { useLang } from "@/i18n/LangProvider";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataUrl: string | null;   // Canvas data URL OR regular https:// image URL
  imageBlob: Blob | null;   // Image blob for clipboard copy
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

  // Silently copy image to clipboard, then open WhatsApp Web
  // User just presses Ctrl+V in any WhatsApp chat to paste the actual image
  const handleWhatsAppShare = async () => {
    setWhatsappSharing(true);

    // Try to copy the image blob to clipboard first
    let imageCopied = false;
    const blobToCopy = imageBlob;

    if (blobToCopy) {
      try {
        // Ensure we have the correct blob type for clipboard
        const clipBlob = blobToCopy.type === "image/png"
          ? blobToCopy
          : new Blob([await blobToCopy.arrayBuffer()], { type: "image/png" });

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

    // Show helpful toast
    if (imageCopied) {
      toast.success(
        hi
          ? "✅ छवि कॉपी हो गई! व्हाट्सएप खुल गया — किसी भी चैट में Ctrl+V दबाकर भेजें।"
          : "✅ Image copied! WhatsApp opened — press Ctrl+V in any chat to send the photo.",
        { duration: 6000 }
      );
    } else {
      toast(
        hi
          ? "व्हाट्सएप वेब खुल गया। फोटो डाउनलोड करें और अटैच करें।"
          : "WhatsApp Web opened. Download the photo and attach it manually.",
        { duration: 5000 }
      );
    }

    setWhatsappSharing(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopiedLink(true);
      toast.success(hi ? "लिंक कॉपी हो गया!" : "Link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast.error(hi ? "कॉपी करने में विफल" : "Failed to copy link");
    }
  };

  const handleDownload = async () => {
    if (!dataUrl) return;
    // For https:// URLs, fetch blob then trigger download
    if (dataUrl.startsWith("http")) {
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = downloadFilename || `namami_vindhyavasini_${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
        toast.success(hi ? "डाउनलोड शुरू हो गया!" : "Download started!");
      } catch {
        window.open(dataUrl, "_blank");
      }
      return;
    }
    // For data: URLs — direct download
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = downloadFilename || `namami_vindhyavasini_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(hi ? "डाउनलोड शुरू हो गया!" : "Download started!");
  };

  const encodedPageUrl = encodeURIComponent(pageUrl);

  // Preview src works for both https:// URLs and data: URLs
  const previewSrc = dataUrl || imageUrl || null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-[#FFFDF6] border-2 border-gold/40 rounded-2xl shadow-sacred p-0 overflow-hidden text-foreground">

        {/* Decorative top stripe */}
        <div className="h-2 bg-gradient-to-r from-maroon via-saffron to-maroon w-full" />

        <div className="p-6 space-y-6">
          <DialogHeader className="space-y-1">
            <div className="text-center font-serif text-maroon text-xs tracking-widest font-semibold uppercase opacity-80 mb-1">
              {hi ? "॥ श्रीमद् विन्ध्यवासिनी विजयतेतराम् ॥" : "|| Shrimad Vindhyavasini Vijayatetram ||"}
            </div>
            <DialogTitle className="text-2xl font-display font-semibold text-center text-maroon">
              {title || (hi ? "साझा करें" : "Share")}
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-xs font-medium">
              {hi
                ? "व्हाट्सएप पर फोटो भेजें, डाउनलोड करें, या लिंक कॉपी करें।"
                : "Send the photo on WhatsApp, download it, or copy the link."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6 items-center">

            {/* Image Preview */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50/40 border border-gold/20 shadow-inner">
              {previewSrc ? (
                <div className="relative group max-h-[320px] max-w-[220px] overflow-hidden rounded-lg border-2 border-gold/30 shadow-md transition-transform duration-300 hover:scale-[1.02]">
                  <img
                    src={previewSrc}
                    alt="Share Preview"
                    className="max-h-[320px] w-full object-cover pointer-events-none select-none"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] bg-black/60 text-white font-medium px-2 py-1 rounded">
                      {hi ? "प्रीव्यू" : "Preview"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-[280px] w-[210px] flex items-center justify-center text-muted-foreground text-xs border border-dashed border-gold/30 rounded-lg">
                  {hi ? "छवि लोड हो रही है..." : "Loading preview..."}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">

              {/* WhatsApp — copies image + opens WhatsApp Web */}
              <button
                onClick={handleWhatsAppShare}
                disabled={whatsappSharing}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-green-200 bg-green-50/30 hover:bg-green-50 text-green-700 font-semibold text-sm transition-all duration-200 active:scale-[0.98] shadow-sm disabled:opacity-60"
              >
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p>{hi ? "व्हाट्सएप पर भेजें" : "Send on WhatsApp"}</p>
                  <p className="text-[10px] text-green-600/80 font-normal">
                    {hi
                      ? "फोटो कॉपी होगी → व्हाट्सएप खुलेगा → Ctrl+V से पेस्ट करें"
                      : "Photo copied → WhatsApp opens → Press Ctrl+V to send"}
                  </p>
                </div>
              </button>

              {/* Download Photo */}
              <button
                onClick={handleDownload}
                disabled={!dataUrl}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gold/30 bg-white hover:bg-gold/5 text-maroon font-semibold text-sm transition-all duration-200 active:scale-[0.98] shadow-sm disabled:opacity-50"
              >
                <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                  <Download size={18} />
                </div>
                <div className="text-left">
                  <p>{hi ? "फोटो डाउनलोड करें" : "Download Photo"}</p>
                  <p className="text-[10px] text-muted-foreground font-normal">
                    {hi ? "अपने डिवाइस में सेव करें" : "Save to your device"}
                  </p>
                </div>
              </button>

              {/* Facebook Share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedPageUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/30 hover:bg-blue-50 text-blue-700 font-semibold text-sm transition-all duration-200 active:scale-[0.98] shadow-sm"
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Facebook size={18} />
                </div>
                <div className="text-left">
                  <p>{hi ? "फेसबुक पर शेयर करें" : "Share on Facebook"}</p>
                  <p className="text-[10px] text-blue-600/80 font-normal">
                    {hi ? "फेसबुक पर पेज लिंक शेयर करें" : "Share page link on Facebook"}
                  </p>
                </div>
              </a>

              {/* Copy Page Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gold/30 bg-white hover:bg-gold/5 text-maroon font-semibold text-sm transition-all duration-200 active:scale-[0.98] shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                    {copiedLink ? <Check size={18} /> : <Link size={18} />}
                  </div>
                  <div className="text-left">
                    <p>{hi ? "पेज लिंक कॉपी करें" : "Copy Page Link"}</p>
                    <p className="text-[10px] text-muted-foreground font-normal">
                      {hi ? "वेबसाइट का लिंक कॉपी करें" : "Copy website URL"}
                    </p>
                  </div>
                </div>
                {copiedLink && (
                  <span className="text-xs text-green-600 font-semibold">
                    {hi ? "कॉपी!" : "Copied!"}
                  </span>
                )}
              </button>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
