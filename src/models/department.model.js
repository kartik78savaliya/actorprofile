import mongoose, { Schema } from "mongoose"

const departmentSchema = new Schema(
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
    },
    {
        timestamps: true
    }
)

export const dbDepartment = mongoose.model("Department", departmentSchema)
