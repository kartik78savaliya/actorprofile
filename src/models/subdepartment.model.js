import mongoose, { Schema } from "mongoose"

const subdepartmentSchema = new Schema(
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
        department: {
            type: Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },
    },
    {
        timestamps: true
    }
)

export const dbSubdepartment = mongoose.model("Subdepartment", subdepartmentSchema)