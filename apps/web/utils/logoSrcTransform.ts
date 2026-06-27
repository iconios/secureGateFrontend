const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET_NAME = "securegate-logos";

export const getLogoSrc = (logoUrl?: string | null) => {
  const value = logoUrl?.trim();

  if (!value) return null;

  // Already a full URL
  if (value.startsWith("https://") || value.startsWith("http://")) {
    return value;
  }

  // Local/public asset
  if (value.startsWith("/")) {
    return value;
  }

  // Old Supabase path from Redux/database
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${value}`;
};
