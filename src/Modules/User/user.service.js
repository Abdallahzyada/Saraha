import jwt from "jsonwebtoken";
import { successResponse } from "../../Utils/response/success.response.js";
import { findById } from "../../DB/database.repository.js";
import userModel from "../../DB/Models/user.model.js";
import { NotFoundException } from "../../Utils/response/error.response.js";
import { decrypt } from "../../Utils/security/encryption.security.js";

export const getProfile = async (req, res) => {
    const {authorization} = req.headers;

    const payload = jwt.verify(authorization, ACCESS_TOKEN_SECRET);

    const user = await findById({model:userModel, id:payload.id});
    if(!user) throw NotFoundException("User not found");
    user.phone = decrypt(user.phone)
    successResponse({res, statusCode:200, data:{user}});
}