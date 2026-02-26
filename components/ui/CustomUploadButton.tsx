import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

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
                        bg-green-900/20 text-green-400 border border-green-500/40 shadow-none">
          <span>✓</span>
          <span>Letter Attached</span>
        </div>
      ) : (
        <UploadButton<OurFileRouter, "pdfUploader">
          {...uploadProps}
          content={{
            button({ isUploading }) {
              if (isUploading) return "Uploading...";
              return "Upload Letter";
            },
            allowedContent: () => null,
          }}
          appearance={{
            button: "bg-[#EAB308] !text-black hover:bg-[#CA8A04] w-full shadow-none ring-0",
            container: "p-0 border-none",
            allowedContent: "hidden",
          }}
        />
      )}
    </div>
  );
}
