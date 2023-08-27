import { CloseIcon, FunnelIcon, UploadIcon } from "@/app/components/Icons";
import * as Dialog from "@radix-ui/react-dialog";
import { FormEvent, useState } from "react";
import { FunnelData, useFunnelData } from "@/app/providers/FunnelDataProvider";

const isValidFunnelData = (funnelData: FunnelData) => {
  return (
    funnelData &&
    funnelData.name &&
    funnelData.pages &&
    funnelData.pages.length > 0
  );
};

export const Upload = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState("");
  const { setFunnelData } = useFunnelData();
  const isSubmitDisabled = !fileData;

  const clearFileInfo = () => {
    setFileData("");
    setFileName("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      clearFileInfo();
    }

    setIsDialogOpen(open);
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (fileData) {
      const funnelData = JSON.parse(fileData);

      clearFileInfo();

      setFunnelData(funnelData);
      setIsDialogOpen(false);
    }
  };

  const handleChange = (evt: FormEvent<HTMLInputElement>) => {
    const file = (evt.currentTarget.files as FileList)[0];

    if (!file) {
      setFileData("");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (evt) => {
      const result = (evt.target as FileReader).result as string;

      setFileData(result);
    };

    reader.readAsText(file);
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-blue-600 text-white rounded flex items-center">
          <UploadIcon className="inline w-5 h-5 mr-1" />{" "}
          <span className="hidden md:block">Upload funnel data</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay opacity-80 fixed top-0 left-0 w-full h-full bg-black" />
        <Dialog.Content className="DialogContent absolute top-1/4 left-0 right-0 mx-4 md:mx-auto md:w-3/12 bg-white rounded p-4">
          <Dialog.Title className="DialogTitle font-bold text-lg mt-2">
            Upload funnel data
          </Dialog.Title>
          <Dialog.Description className="DialogDescription mt-2 opacity-80">
            Upload a json file containing funnel data to preview it on mobile
            devices
          </Dialog.Description>
          <form className="mt-2" onSubmit={handleSubmit} id="upload-form">
            <label
              htmlFor="upload-input"
              className="block w-full border border-dashed border-gray-300 p-8 text-center cursor-pointer"
            >
              Choose file to upload
            </label>
            <input
              id="upload-input"
              type="file"
              accept=".json"
              className="sr-only border border-solid rounded w-full p-2"
              onChange={handleChange}
            />
            {fileName && (
              <p className="flex gap-1 items-center mt-2">
                <FunnelIcon className="w-4 h-4" />
                {fileName}
              </p>
            )}

            <button
              type="submit"
              className={`px-4 py-2 mt-4 ${
                isSubmitDisabled
                  ? "bg-blue-200 cursor-not-allowed"
                  : "bg-blue-600"
              } text-white rounded flex items-center`}
              disabled={isSubmitDisabled}
            >
              Upload
            </button>
          </form>
          <Dialog.Close asChild>
            <button
              className="IconButton absolute top-2 right-2"
              aria-label="Close"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
