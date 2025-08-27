import { model, Schema } from "mongoose";

const userSchema = new Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
        }
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    password: {
        type: String,
    },
}, { timestamps: true });


const userModel = model("user", userSchema);

export default userModel;