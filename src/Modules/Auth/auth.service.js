import { create, findOne } from "../../DB/database.repository.js";
import userModel from "../../DB/Models/user.model.js";
import { HashEnum } from "../../Utils/enums/security/security.enum.js";
import { BadRequestException, ConflictException, globalErrorHandler, NotFoundException } from "../../Utils/response/error.response.js";
import { successResponse } from "../../Utils/response/success.response.js";
import { compareHash, generateHash } from "../../Utils/security/hash.security.js";

export const signUp = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if(await findOne({model: userModel, filter:{email}})) 
            throw ConflictException("user already exists");

        const hashPassword = await generateHash({plainText:password, algorithm:HashEnum.Bcrypt});

        const user = await create({
            model: userModel,
            data: [{username, email, password:hashPassword}]
        });
        

        return successResponse({res:res, statusCode:201, message:"User created", data: { user }});
    } catch (error) {
        return globalErrorHandler(error, req, res);
    }
};

export const logIn = async (req, res) => {
    try {
        const { email, password} = req.body;

        const user = await findOne({model: userModel, filter:{email}});
        if(!user) 
            throw NotFoundException("user Not Found");

        const isMatch = await compareHash({
            plainText: password,
            cipherText: user.password,
            algorithm: HashEnum.Bcrypt
        });

        if(!isMatch)throw BadRequestException("Invalid Password or email")

        return successResponse({res:res, statusCode:200, message:"User logged in ", data: { user }});
    } catch (error) {
        return globalErrorHandler(error, req, res);
    }
};