import { model, Schema } from "mongoose";



const messageSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    chatID: {
        type: Schema.Types.ObjectId,
        ref: "chat",
        required: true
    },
    role: {
        type: String,
        enum: ["user", "model","system"],
        default: "user",
       
    }
},{timestamps: true})

const messageModel = model("message", messageSchema);

export default messageModel;