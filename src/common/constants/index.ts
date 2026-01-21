export const UPLOAD_PROVIDER = Symbol("UPLOAD_PROVIDER");
export const EMAIL_PROVIDER = Symbol("EMAIL_PROVIDER");

export const SUPPORTED_UPLOAD_PROVIDERS = {
  CLOUDINARY: "cloudinary",
  INTERNAL: "internal",
};

export const SUPPORTED_EMAIL_PROVIDERS = {
  SMTP: "smtp",
};
