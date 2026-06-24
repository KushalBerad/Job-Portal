import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
    // Fail early with an explicit message if the file object is missing
    if (!file || !file.originalname || !file.buffer) {
        throw new Error("Invalid file attachment payload passed to DataUri parser.");
    }
    
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
};

export default getDataUri;
