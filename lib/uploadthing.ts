import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  fileUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
    blob: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(({ req }) => {
      return {};
    })
    .onUploadComplete(({ file }) => {
      console.log("Upload complete for file:", file);

      return {
        uploadedBy: "user",
        fileUrl: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
