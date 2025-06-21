import formidable from "formidable";
import fs from "fs";
import imagekit from "@/lib/imagekit";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ message: "Upload error", error: err });
    }

    const file = files?.file;

    // ✅ Cek apakah file tersedia & valid
    if (!file || !file.filepath) {
      return res.status(400).json({ message: "No file uploaded or invalid file" });
    }

    try {
      const stream = fs.createReadStream(file.filepath);

      const result = await imagekit.upload({
        file: stream,
        fileName: file.originalFilename || `product_${Date.now()}`,
        folder: "/products",
      });

      return res.status(200).json({ url: result.url });
    } catch (uploadError) {
      console.error("Upload failed:", uploadError);
      return res.status(500).json({ message: "ImageKit upload failed", error: uploadError.message });
    }
  });
}
