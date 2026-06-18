import { findById } from "../DB/database.repository.js";
import userModel from "../DB/Models/user.model.js";
import { SignatureEnum, TokenTypeEnum } from "../Utils/enums/user.enum.js";
import { NotFoundException } from "../Utils/response/error.response.js";
import { getSignature, verifyToken } from "../Utils/tokens/token.js";

export const decodedToken = async ({authorization, 
    tokenType = TokenTypeEnum.Access}) => {
    const [Bearer, token] = authorization.split(' ') || [];
    
    let signature = await getSignature({
        signatureLevel: Bearer === "ADMIN" 
        ? SignatureEnum.Admin
        : Bearer ==="User"
        ? SignatureEnum.User
        : new Error("Invalid Signature")

    });
    const decoded = verifyToken({token, 
        secretKey:
        tokenType === TokenTypeEnum.Access
        ?signature.accessSignature
        :signature.refreshSignature
    });

    const user = await findById({model: userModel, id:decoded.id});
    if(!user) throw NotFoundException("User not found");
    return {user, decoded};
};

export const authentication = ({tokenType=TokenTypeEnum.Access, })=>{
    return async (req, res, next) => {
        const {user, decoded} = await decodedToken({
            authorization: req.headers.authorization,
            tokenType
        }) || {};
        req.user = user;
        req.decoded = decoded;
        return next();
    };

};