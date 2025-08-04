import { createFolder } from "./utils/index.js";
import { createSpinner } from "nanospinner";
import { success, error, info } from "./utils/chalk.js";
import { selectTemplateStyle } from "./selectTemplate.js";
import { creatingProject } from "./creatingProject.js";
import { confirm } from "@inquirer/prompts";
import fs from "fs-extra";
import path from "path";

export default async function init(inputPath) {
  const targetPath = path.resolve(inputPath === "." ? process.cwd() : inputPath);

  const exists = await fs.pathExists(targetPath);
  if (exists && inputPath !== ".") {
    const overwrite = await confirm({
      message: "⚠️ Target folder already exists. Overwrite contents?",
      default: false,
    });

    if (!overwrite) {
      info("❌ Project setup cancelled by user.");
      process.exit(0);
    }
  }

  const spinner = createSpinner("⚙️ Creating directories...").start();

  try {
    await createFolder(targetPath);
    spinner.success({ text: `✅ Created directory: ${targetPath}` });

    const template = await selectTemplateStyle();
    await creatingProject(template, targetPath);

    success("\n🎉 Project setup complete!");
  } catch (err) {
    spinner.error({ text: "❌ Failed to initialize project." });
    error(err.message);
  }
}
