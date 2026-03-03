import { supabase } from "@/integrations/supabase/client";
import imageCompression from "browser-image-compression";

export async function uploadListingImage(
  file: File,
  listingId: string,
  index: number
): Promise<{ url: string | null; error: Error | null }> {
  try {
    // Compress image before upload
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);

    const fileExt = file.name.split(".").pop();
    const fileName = `${listingId}-${index}-${Date.now()}.${fileExt}`;
    const filePath = `listings/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("listings")
      .upload(filePath, compressedFile, {
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("listings").getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { url: null, error: error as Error };
  }
}

export async function deleteListingImage(
  url: string
): Promise<{ error: Error | null }> {
  try {
    // Extract file path from URL
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `listings/${fileName}`;

    const { error } = await supabase.storage.from("listings").remove([filePath]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { error: error as Error };
  }
}