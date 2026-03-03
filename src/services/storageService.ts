import { supabase } from "@/integrations/supabase/client";
import imageCompression from "browser-image-compression";

export async function uploadImages(files: File[]) {
  const urls: string[] = [];
  let error: Error | null = null;

  try {
    for (const file of files) {
      // Compress image
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("listing-images")
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("listing-images").getPublicUrl(filePath);

      urls.push(publicUrl);
    }
  } catch (err) {
    console.error("Error uploading images:", err);
    error = err as Error;
  }

  return { urls: urls.length > 0 ? urls : null, error };
}

export async function deleteImage(url: string) {
  try {
    const path = url.split("/").pop();
    if (!path) return { error: new Error("Invalid URL") };

    const { error } = await supabase.storage
      .from("listing-images")
      .remove([path]);
      
    return { error };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { error: error as Error };
  }
}