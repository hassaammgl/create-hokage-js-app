const tryCatch = require("../utils/tryCatch");
const User = require("../models/user");

const controller = tryCatch(async (req, res) => {
    const { name } = req.body;
    const user = new User({ name });
    await user.save();

    res.status(201).json({
        success: true,
        data: user
    });
});
module.exports = { controller };