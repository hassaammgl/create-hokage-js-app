import { tryCatch } from "../utils/tryCatch.js"
import { User } from "../models/user.js"

export const controller = tryCatch(async (req, res) => {
    const { name } = req.body;
    const user = new User({ name });
    await user.save();

    res.status(201).json({
        success: true,
        data: user
    })
})