const cloudinary = require('../../config/cloudinary');
const { sendSuccess, sendError } = require('../../utils/response.util');

/**
 * Upload image to Cloudinary
 * Expects base64 image data or file upload
 */
exports.uploadImage = async (req, res) => {
    try {
        const { image, folder = 'profile-pictures' } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                error: 'No image provided',
            });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: `ttrushpro/${folder}`,
            transformation: [
                { width: 500, height: 500, crop: 'fill', gravity: 'face' },
                { quality: 'auto:good' },
                { fetch_format: 'auto' },
            ],
        });

        sendSuccess(
            res,
            {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
            },
            'Image uploaded successfully'
        );
    } catch (error) {
        console.error('Image upload error:', error);
        sendError(res, error);
    }
};

/**
 * Delete image from Cloudinary
 */
exports.deleteImage = async (req, res) => {
    try {
        const { publicId } = req.body;

        if (!publicId) {
            return res.status(400).json({
                success: false,
                error: 'No public ID provided',
            });
        }

        await cloudinary.uploader.destroy(publicId);

        sendSuccess(res, null, 'Image deleted successfully');
    } catch (error) {
        console.error('Image delete error:', error);
        sendError(res, error);
    }
};
