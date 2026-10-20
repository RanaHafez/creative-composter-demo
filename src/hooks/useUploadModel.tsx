import { Upload } from "lucide-react";
import React, { useState, useCallback } from "react";

export type UploadType = {
  name: string;
  url: string;
};

function useUploadModel() {
  const [uploads, setUploads] = useState<UploadType[]>([]);
  function addUpload(newUpload: UploadType) {
    setUploads((prev) => [...prev, newUpload]);
    console.log("a new upload .. ");
  }

  const removeUpload = useCallback((id: string) => {
    /*
    setUploads((prev) => {
    //   const target = prev.find((u) => u.id === id);
    //   if (target) URL.revokeObjectURL(target.url); 
    //   return prev.filter((u) => u.id !== id);
    });
    */
  }, []);

  return { uploads, setUploads, addUpload, removeUpload };
}

export default useUploadModel;
