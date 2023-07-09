import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destinationPath = "";
    switch (file.fieldname) {
      case "profile":
        destinationPath = path.join(__dirname, "../../uploads/profiles");
        break;
      case "product":
        destinationPath = path.join(__dirname, "../../uploads/products");
        break;
      case "document":
        destinationPath = path.join(__dirname, "../../uploads/documents");
        break;
    }
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export { upload };
