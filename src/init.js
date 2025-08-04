// // init.js
// import { createFolder } from "./utils/index.js"
// import { createSpinner } from 'nanospinner'
// import { success, error } from "./utils/chalk.js";
// import { selectTemplateStyle } from "./selectTemplate.js"
// import { creatingProject } from "./creatingProject.js";

// export default async function init(inputPath) {
//     const targetPath = inputPath === '.' ? process.cwd() : inputPath;
//     console.log(targetPath);

//     if (inputPath !== '.') {
//         try {
//             const spinner = createSpinner('creating directories ...').start()
//             await createFolder(targetPath)
//             success(`\n Created main directory: ${targetPath}`);
//             try {
//                 spinner.success()
//                 const temp = await selectTemplateStyle()
//                 await creatingProject(temp, targetPath)
//             } catch (err) {
//                 console.error(`Error creating subdirectories: ${err}`);
//             }
//         } catch (err) {
//             error(`Error creating main directory: ${err}`);
//             return;
//         }
//     } else {
//         const spinner = createSpinner('creating directories ...').start()
//         try {
//             spinner.success()
//           const temp = await selectTemplateStyle()
//                 await creatingProject(temp, targetPath)
//             // success(`\n Created subdirectories: ${folder1} and ${folder2} in ${targetPath}`);
//         } catch (err) {
//             error(`Error creating subdirectories: ${err}`);
//         }
//     }
// }

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

// import { execa } from 'execa';

// const shouldInitGit = await confirm({ message: "📦 Initialize a Git repository?", default: true });
// if (shouldInitGit) {
//   await execa("git", ["init"], { cwd: targetPath });
//   success("Initialized empty Git repo");
// }
