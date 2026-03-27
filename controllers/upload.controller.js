const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");
const logger = require("../utils/logger");

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
          logger.error("Cloudinary upload error:", error);
          return res
            .status(500)
            .json({ message: "Upload failed", error: error.message });
        }

        // Copy to public collection folder using rename (creates duplicate)
        const originalPublicId = result.public_id;
        const collectionPublicId = `collection/${originalPublicId.split("/").pop()}`;

        cloudinary.uploader.rename(
          originalPublicId,
          collectionPublicId,
          (renameError, renameResult) => {
            if (renameError) {
              logger.error("Copy to collection failed:", renameError);
            } else {
              logger.info("Copied to collection:", renameResult.public_id);
            }

            res.status(200).json({
              message: "Image uploaded successfully",
              imageUrl: result.secure_url,
              collectionUrl: cloudinary.url(collectionPublicId, {
                secure: true,
              }),
              public_id: result.public_id,
              collectionPublicId: collectionPublicId,
              format: result.format,
              bytes: result.bytes,
            });
          },
        );
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
