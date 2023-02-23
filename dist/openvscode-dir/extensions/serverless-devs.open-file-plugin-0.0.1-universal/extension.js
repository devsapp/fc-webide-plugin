/* eslint-disable arrow-parens */
/* eslint-disable no-unused-vars */

// You can find more demos via https://github.com/microsoft/vscode-extension-samples
const vscode = require("vscode");
const { access } = require("fs/promises");
const { constants } = require("fs");

const DEFAULT_FILES_PATH = [
  "index.js",
  "app.js",
  "server.js",
  "index.py",
  "app.py",
  "app.py",
  "server.py",
  "index.php",
  "app.php",
  "server.php",
];
async function openDefaultFile(filePath) {
  let baseFile =
    process.env.WEBIDE_FUNCTION_TYPE === "small_account"
      ? "/mnt/webide_workspace/"
      : "/code/";
  try {
    const path = baseFile + filePath;
    await access(path, constants.R_OK | constants.W_OK);
    vscode.window.showTextDocument(vscode.Uri.file(path));
  } catch (e) {}
}

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  if (process.env.WEBIDE_WORKSPACE_TYPE === "oss") {
    vscode.workspace
      .getConfiguration()
      .update("git.showCommitInput", false, vscode.ConfigurationTarget.Global);

    vscode.workspace.getConfiguration().update(
      "git.showActionButton",
      {
        commit: false,
        publish: false,
        sync: false,
      },
      vscode.ConfigurationTarget.Global
    );
  }

  if (process.env.DEFAULT_OPEN_FILE_PATH) {
    openDefaultFile(process.env.DEFAULT_OPEN_FILE_PATH);
  } else {
    DEFAULT_FILES_PATH.forEach((filePaht) => {
      openDefaultFile(filePaht);
    });
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
