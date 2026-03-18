const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload buffer to Cloudinary using stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "hotel_uploads",
        transformation: [
          { width: 1200, height: 1200, crop: "limit" },
          { quality: "auto:good" },
        ],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res
            .status(500)
            .json({ message: "Upload failed", error: error.message });
        }

        res.status(200).json({
          message: "Image uploaded successfully",
          imageUrl: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          bytes: result.bytes,
        });
      },
    );

    // Pipe the buffer to Cloudinary stream
    const stream = Readable.from(req.file.buffer);
    stream.pipe(uploadStream);
  } catch (error) {
    console.error("Upload controller error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

module.exports = { uploadImage };
