import crypto from "node:crypto";
import { ENC_KEY } from "../../../Config/config.service.js";


const IV_LENGTH = 16;
const ENCRYPTION_SECRET_KEY = Buffer.from(ENC_KEY);

export const encrypt = (text)=>{

    const iv = crypto.randomBytes(IV_LENGTH);
    const cypher = crypto.createCipheriv("aes-265-cbc", ENCRYPTION_SECRET_KEY, iv);
    let encryptData = cypher.update(text, "utf-8", "hex");
    encryptData += cypher.final("hex");
    return `${iv.toString("hex")}:${encryptData}`;
};

export const decrypt = (encryptData)=>{
    const [ivHex, encryptedText] = encryptData.split(":");
    const binaryLikeIv = Buffer.from(ivHex, "hex");

    const decypher = crypto.createDecipheriv("aes-265-cbc",
        ENCRYPTION_SECRET_KEY,
        binaryLikeIv
    );
    let decryptData = decypher.update(encryptedText, "hex", "utf-8");
    decryptData +=  decypher.final("utf-8");
    return decryptData;
};  