import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { config } from "../utils/config.js";

const actorSchema = new Schema(
    {
        id: {
            type: String,
            default: function () {
                return this._id.toString();
            }
        },
        userName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        },
        otp: {
            type: String
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        loginType: {
            type: String,
            default: 'user'
        }
    },
    {
        timestamps: true
    }
)

actorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

actorSchema.methods.isPasswordCorrect = async function (password) {
    const isPasswordCorrect = await bcrypt.compare(password, this.password)
    return isPasswordCorrect
}

actorSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
        },
        config.accessTokenSecret,
        {
            expiresIn: config.accessTokenExpiry
        }
    )
}

actorSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        config.refreshTokenSecret,
        {
            expiresIn: config.refreshTokenExpiry
        }
    )
}

export const dbActor = mongoose.model("Actor", actorSchema)