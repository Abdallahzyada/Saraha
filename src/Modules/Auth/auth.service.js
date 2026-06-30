import jwt from "jsonwebtoken";
import { create, findOne } from "../../DB/database.repository.js";
import userModel from "../../DB/Models/user.model.js";
import { HashEnum } from "../../Utils/enums/security/security.enum.js";
import { BadRequestException, ConflictException, globalErrorHandler, NotFoundException } from "../../Utils/response/error.response.js";
import { successResponse } from "../../Utils/response/success.response.js";
import { decrypt, encrypt } from "../../Utils/security/encryption.security.js";
import { compareHash, generateHash } from "../../Utils/security/hash.security.js";
import { generateToken, getNewLoginCredentials } from "../../Utils/tokens/token.js";
import {OAuth2Client} from'google-auth-library';
import { CLIENT_ID } from "../../../Config/config.service.js";
import { ProviderEnum } from "../../Utils/enums/user.enum.js";

export const signUp = async (req, res) => {
    try {
        const {username, email, password, phoneNumber} = req.body;
        if(await findOne({model: userModel, filter:{email}})) 
            throw ConflictException("user already exists");

        const hashPassword = await generateHash({plainText:password,
            algorithm:HashEnum.Bcrypt});
        
        const encryptPhone = encrypt(phoneNumber);


        const user = await create({
            model: userModel,
            data: [{username, email, password:hashPassword, phone: encryptPhone}]
        });
        

        return successResponse({res:res, statusCode:201, message:"User created", data: { user }});
    } catch (error) {
        return globalErrorHandler(error, req, res);
    }
};

export const logIn = async (req, res) => {
    try {
        const { email, password, rememberMe} = req.body;

        const user = await findOne({model: userModel, filter:{email}});
        if(!user) 
            throw NotFoundException("user Not Found");

        const isMatch = await compareHash({
            plainText: password,
            cipherText: user.password,
            algorithm: HashEnum.Bcrypt
        });

        if(!isMatch)throw BadRequestException("Invalid Password or email");
        const tokens = await getNewLoginCredentials(user, rememberMe);

        return successResponse({res:res, statusCode:200, message:"User logged in ", data: { tokens }});
    } catch (error) {
        return globalErrorHandler(error, req, res);
    }
};

export const refreshToken = async (req, res) => {
    const {accessToken} = await getNewLoginCredentials(req.user);
    return successResponse({res, statusCode:200, data:{accessToken}, message:"Done"});
}

async function verifyGoogleToken(idToken) {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
};
export const loginWithGoogle = async (req, res) => {
    try {
        const {idToken} = req.body;
        const {email, email_verified, given_name, family_name, picture} = await verifyGoogleToken(idToken);
        if(!email_verified) throw BadRequestException("Email not verified");
        const user = await findOne({model: userModel, filter:{email}});

        if(user){
            if(user.provider === ProviderEnum.GOOGLE){
                const credential = await getNewLoginCredentials(user);
                return successResponse({
                    res,
                    data:{
                        messsge:"Login Successfully",
                        credential,
                    },
                    statusCode:200
                });
            };
        }

        const newUser = await create({model:userModel,
            data:[
                {
                    firstName: given_name,
                    lastName: family_name,
                    email,
                    profilePic: picture,
                    provider: ProviderEnum.GOOGLE
                }

            ]
        });

        const credential = await getNewLoginCredentials(newUser);
            return successResponse({
                res,
                data:{
                    messsge:"Login Successfully",
                    credential
                },
                statusCode:201
            });
    } catch (error) {
        return globalErrorHandler(error);
    }
};