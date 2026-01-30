import multer from "multer";
const storage = multer.memoryStorage(); // local-la save aagathu
const upload = multer({ storage });
export default upload;
