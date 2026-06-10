import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../Utils/enums/user.enum.js";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: [true, "Enter first name"],
        minLength: 2,
        maxLength: 30
    },
    lastName:{
        type:String,
        required: [true, "Enter last name"],
        minLength: 2,
        maxLength: 30
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:function(){
            return this.provider === ProviderEnum.SYSTEM;
        }
    },
    DOB:Date,
    phoneNumber:String,
    gender:{
        type: Number,
        enum: Object.values(GenderEnum),
        default: GenderEnum.MALE
    },
    role:{
        type: Number,
        enum: Object.values(RoleEnum),
        default: RoleEnum.USER
    },
    provider:{
        type: Number,
        enum: Object.values(ProviderEnum),
        default: ProviderEnum.SYSTEM
    },
    confirmEmail: Date,
    profilePic: String,


}, 
    {timestamps: true,
        toObject:{virtuals: true},
        toJSON:{virtuals: true}
    });

userSchema.virtual("username").set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [ ];
    this.set({firstName, lastName});
}).get(function(){
    return this.firstName + " " + this.lastName;
});


const userModel = mongoose.model("User", userSchema);

export default userModel;