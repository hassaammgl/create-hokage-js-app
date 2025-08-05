#!/usr/bin/env node

import main from "./src/main.js";

main()

process.on("exit", () => {
    process.exit()
})