import { generateStreamToken } from "../config/stream"

export const getStreamToken = async (req, res) => {
    try {
        const token = await generateStreamToken(req.auth.userId)
    } catch (error) {
        
    }
}