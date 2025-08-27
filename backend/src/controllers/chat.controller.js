import chatModel from "../models/chat.model.js"


const createChat = async (req, res) => {
    const { title } = req.body
    const user = req.user

    const newChat = await chatModel.create({ title, user: user._id })

    res.status(201).json({ message: "Chat created successfully", chat: newChat })

}


const getChat = async (req, res) => {
    
}

export { createChat }