import app from "./src/app.js";
import colors from "colors"
import connectDb from "./src/config/db.js"
import { checkEnvs } from "./src/config/constants.js";

checkEnvs()
connectDb()

const server = app.listen(5000, () => {
    console.log("listening on port 5000");
})

process.on("unhandledRejection", (err) => {
    console.log(colors.red(`Error: ${err.message}`));
    server.close(() => process.exit(1))
})
