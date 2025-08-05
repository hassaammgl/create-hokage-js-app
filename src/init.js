import path from "path";
import fs from "fs-extra";
import { confirm } from "@inquirer/prompts";
import { createSpinner } from "nanospinner";

import { createFolder } from "./utils/index.js";
import { success, error, info } from "./utils/chalk.js";
import { selectTemplateStyle } from "./selectTemplate.js";
import { creatingProject } from "./creatingProject.js";

export default async function init(inputPath) {
  const targetPath = path.resolve(inputPath === "." ? process.cwd() : inputPath);

  try {
    const exists = await fs.pathExists(targetPath);

    if (exists && inputPath !== ".") {
      const overwrite = await confirm({
        message: "⚠️ Target folder already exists. Overwrite contents?",
        default: false,
      });

      if (!overwrite) {
        info("❌ Project setup cancelled.");
        return;
      }

      await fs.emptyDir(targetPath); // clean it out if overwrite = true
    }

    const spinner = createSpinner("⚙️ Creating directories...").start();

    await createFolder(targetPath);

    spinner.success({ text: `📁 Directory ready at: ${targetPath}` });

    const template = await selectTemplateStyle();

    await creatingProject(template, targetPath);

    success("\n🎉 All set! Project created successfully.");
  } catch (err) {
    error("💥 Initialization failed:");
    error(err.message || err);
    process.exit(1);
  }
}
