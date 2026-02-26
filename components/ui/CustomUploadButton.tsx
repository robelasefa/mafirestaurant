import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

interface CustomUploadButtonProps {
  letterUrl: string | null;
  setLetterUrl: (url: string | null) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
}

export default function CustomUploadButton({
  letterUrl,
  setLetterUrl,
  isUploading,
  setIsUploading
}: CustomUploadButtonProps) {
  const uploadProps = {
    endpoint: "pdfUploader" as const,
    onClientUploadBegin: () => setIsUploading(true),
    onClientUploadComplete: (res: any[]) => {
      setIsUploading(false);
      if (res && res.length > 0) {
        setLetterUrl(res[0].ufsUrl);
      }
    },
    onUploadError: (error: Error) => {
      setIsUploading(false);
    },
  };

  return (
    <div className="relative w-full">
  {letterUrl ? (
    <div className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                    bg-green-900/20 text-green-400 border border-green-500/40 shadow-none
                    animate-success-pop">
      <span>✓</span>
      <span className="font-medium">Letter Attached</span>
    </div>
  ) : (
    <div className={cn(isUploading ? "opacity-90" : "opacity-100", "transition-opacity duration-300")}>
      <UploadButton<OurFileRouter, "pdfUploader">
        {...uploadProps}
        content={{
          button({ isUploading }) {
            return isUploading ? "Uploading..." : "Upload Letter";
          },
          allowedContent: () => null,
        }}
        appearance={{
          button: "w-full h-11 px-4 py-2 font-medium shadow-none ring-0 border-none transition-none",
          container: "w-full p-0 border-none",
          allowedContent: "hidden",
        }}
      />
    </div>
  )}
</div>
  );
}
