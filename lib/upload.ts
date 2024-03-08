import { FileRejection } from "react-dropzone";
import { toast } from "sonner";

export const handleFileUpload = (
  acceptedFiles: File[],
  rejectedFiles: FileRejection[],
  onSuccess: () => void
) => {
  if (rejectedFiles.length)
    return toast("Invalid File type", {
      description: "Please upload a valid image file",
    });
  else if (acceptedFiles.length) return onSuccess();
  else
    return toast("An error occurred while uploading the file", {
      description: "Please try again later.",
    });
};
