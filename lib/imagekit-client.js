import ImageKit from "imagekit-javascript";

export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  authenticationEndpoint: "/api/imagekit-auth" // Pastikan endpoint ini benar
});