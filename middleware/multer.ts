import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import "dotenv/config";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
interface params {
  folder: string;
  allowed_formats: string[];
  public_id: (req: any, file: Express.Multer.File) => string;
}
const params: params = {
  folder: "playground_uploads",
  allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],

  public_id: (req, file) => {
    const nameWithoutExtension = file.originalname.split(".")[0];
    return `${nameWithoutExtension}_${Date.now()}`;
  },
};
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params,
});

const upload = multer({ storage: storage });

export default upload;
