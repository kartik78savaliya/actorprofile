import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema(
    {
        id: {
            type: String,
            default: function () {
                return this._id.toString();
            }
        },
        name: {
            type: String,
            required: true,
        },
        subdepartment: {
            type: Schema.Types.ObjectId,
            ref: "Subdepartment",
            required: true
        },
        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: true
        }
    },
    {
        timestamps: true,
    }
);

export const dbRole = mongoose.model("Role", roleSchema);