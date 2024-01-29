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

    if(process.env.WEBIDE_FUNCTION_TYPE !== "small_account"){
      vscode.window.onDidOpenTerminal((terminal) => {
        terminal.sendText("clear && printf '\\n使用必读：\\n\\n1. 在此 WebIDE 中，无法直接测试层的挂载以及 OSS、NAS 的挂载，也无法在 WebIDE 中测试通过 VPC 访问对应资源。您需要在“实例列表”中“登录实例”来测试真实环境。\\n2. 安装 Python 依赖时必须添加 -t . 才能正确将依赖安装到中。例如：pip install flask -t .\\n\\n'");
      });
    }
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
