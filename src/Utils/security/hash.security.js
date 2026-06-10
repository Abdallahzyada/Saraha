import * as bcrypt from "bcrypt";
import * as argon2 from "argon2";
import { SALT_ROUND } from "../../../Config/config.service.js";
import { HashEnum } from "../enums/security/security.enum.js";
import { BadRequestException } from "../response/error.response.js";

export const generateHash = async ({
    plainText, 
    saltRound = parseInt(SALT_ROUND),
    algorithm = HashEnum.Bcrypt}
    ) => {
    let hashResult = "";
    switch (algorithm) {
        case HashEnum.Bcrypt:
            hashResult = await bcrypt.hash(plainText, saltRound);
            break;
        case HashEnum.Argon2:
            hashResult = await argon2.hash(plainText);
            break;
        default:
            throw BadRequestException("Unsupported hashing argorithm");
    };
    return hashResult;
};

export const compareHash = async ({
    plainText, 
    cipherText,
    algorithm = HashEnum.Bcrypt}
    ) => {
    let match = false;
    switch (algorithm) {
        case HashEnum.Bcrypt:
            match = await bcrypt.compare(plainText, cipherText);
            break;
        case HashEnum.Argon2:
            match = await argon2.verify(plainText, cipherText);
            break;
        default:
            throw BadRequestException("Unsupported hashing argorithm");
    };
    return match;
};