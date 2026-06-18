import { useState } from "react";
import { createClient } from "../lib/supabase-client";

/*
#Plan:
1. Accept file and validate file type
2. Validate Max File Size (10kb = 10 * 1024 bytes)
3. Wrap validation and upload in a Promise to fix the async execution flow
4. Upload to Supabase Bucket
*/

export const BUCKET_NAME = "securegate-logos"; // Exporting bucket name for consistent reference across the app

export type ImageUploadResult = {
  path: string;
  publicUrl: string;
};

export const useImageUpload = ({userId}: {userId: string}) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null); // Local state retained

  // Return a Promise containing the path string or null so it can be awaited reliably
  const handleFileUpload = async (
    file: File | undefined,
  ): Promise<ImageUploadResult | null> => {
    if (!file) return null;

    setError(null);
    setSuccess(null);
    setPublicUrl(null);

    // Step 1. Accept file and validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return null;
    }

    // 2. Validate Max File Size (10kb = 10 * 1024 bytes)
    const maxSizeInBytes = 10 * 1024;
    if (file.size > maxSizeInBytes) {
      setError("File size exceeds the 10kb maximum.");
      return null;
    }

    setLoading(true);

    // 3. Wrap validation and upload in a Promise to fix the async execution flow
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = async () => {
        URL.revokeObjectURL(objectUrl); // Clean up memory

        if (img.width !== 80 || img.height !== 80) {
          setError(
            `Invalid dimensions: ${img.width}x${img.height}. Image must be exactly 80px by 80px.`,
          );
          setLoading(false);
          resolve(null);
          return;
        }

        // 4. Upload to storage Bucket
        try {
          const supabase = createClient(); // Instanced securely inside the execution scope
          const fileExt = file.name.split(".").pop();

          // Using crypto over Math.random prevents duplicate file overwrite issues
          const uniqueId =
            crypto.randomUUID?.() || Math.random().toString(36).substring(2);
          const fileName = `${uniqueId}.${fileExt}`;
          const bucketName = BUCKET_NAME;
          const filePath = `${userId}/${fileName}`;

          const { data, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
              contentType: file.type,
            });

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

          // Save the actual relative path returned by Supabase ('data.path')
          setPublicUrl(publicUrlData.publicUrl);
          setSuccess("Image successfully uploaded");

          console.log("Upload successful:", data);
          console.log("Public URL:", publicUrlData.publicUrl);

          // Resolves the promise with the path and publicUrl values
          resolve({
            path: data.path,
            publicUrl: publicUrlData.publicUrl,
          });
        } catch (err: any) {
          console.error("Upload failed:", err);
          setError(err.message || "Failed to upload image.");
          resolve(null);
        } finally {
          setLoading(false);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setError("Failed to load image for validation.");
        setLoading(false);
        resolve(null);
      };

      img.src = objectUrl;
    });
  };

  return {
    handleFileUpload,
    error,
    success,
    loading,
    publicUrl,
  };
};
