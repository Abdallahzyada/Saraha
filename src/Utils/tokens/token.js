import jwt from "jsonwebtoken";
import { RoleEnum, SignatureEnum } from "../enums/user.enum.js";
import { ACCESS_TOKEN_ADMIN_EXPIRES_IN,
    ACCESS_TOKEN_ADMIN_SECRET,
    ACCESS_TOKEN_USER_EXPIRES_IN, 
    ACCESS_TOKEN_USER_SECRET, 
    REFRESH_TOKEN_ADMIN_EXPIRES_IN, 
    REFRESH_TOKEN_ADMIN_SECRET, 
    REFRESH_TOKEN_USER_EXPIRES_IN, 
    REFRESH_TOKEN_USER_SECRET } from "../../../Config/config.service.js";
export const generateToken = ({payload, secretKey, option={expiresIn: ACCESS_TOKEN_EXPIRES_IN}})=>{
    return jwt.sign(payload, secretKey, option);
};

export const verifyToken = ({token, secretKey})=>{
    return jwt.verify(token, secretKey);
};

export const getSignature = ({signatureLevel = SignatureEnum.USER})=>{
    let segature = {accessSignature:undefined, refreshSignature:undefined};
    switch (signatureLevel) {
        case SignatureEnum.Admin:
            segature.accessSignature = ACCESS_TOKEN_ADMIN_SECRET;
            segature.refreshSignature = REFRESH_TOKEN_ADMIN_SECRET;
            break;
        case SignatureEnum.User:
            segature.accessSignature = ACCESS_TOKEN_USER_SECRET;
            segature.refreshSignature = REFRESH_TOKEN_USER_SECRET;
            break;
        default:
            segature.accessSignature = ACCESS_TOKEN_USER_SECRET;
            segature.refreshSignature = REFRESH_TOKEN_USER_SECRET;
            break;
    }
    return segature;
};

export const getNewLoginCredentials = async (user)=>{
    let signature = await getSignature({signatureLevel: 
        user.role != RoleEnum.ADMIN ? SignatureEnum.User: SignatureEnum.Admin
    });
    
    const accessToken = generateToken({
        payload:{id:user._id},
        secretKey: signature.accessSignature,
        option:{expiresIn: user.role != RoleEnum.ADMIN ? Number(ACCESS_TOKEN_USER_EXPIRES_IN): Number(ACCESS_TOKEN_ADMIN_EXPIRES_IN)}
    });
    const refreshToken = generateToken({
        payload:{id:user._id},
        secretKey: signature.refreshSignature,
        option:{expiresIn: user.role != RoleEnum.ADMIN ? Number(REFRESH_TOKEN_USER_EXPIRES_IN): Number(REFRESH_TOKEN_ADMIN_EXPIRES_IN)}
    });

    return {accessToken, refreshToken};
}