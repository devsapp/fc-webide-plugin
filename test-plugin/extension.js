/* eslint-disable arrow-parens */
/* eslint-disable no-unused-vars */

// You can find more demos via https://github.com/microsoft/vscode-extension-samples
const vscode = require("vscode");

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

  vscode.window.showTextDocument(vscode.Uri.file("/code/index.js"));
  vscode.window.showTextDocument(vscode.Uri.file("/code/app.js"));
  vscode.window.showTextDocument(vscode.Uri.file("/code/server.js"));

  vscode.window.showTextDocument(vscode.Uri.file("/code/index.py"));
  vscode.window.showTextDocument(vscode.Uri.file("/code/app.py"));
  vscode.window.showTextDocument(vscode.Uri.file("/code/server.py"));

  vscode.window.showTextDocument(vscode.Uri.file("/code/index.php"));
  vscode.window.showTextDocument(vscode.Uri.file("/code/app.php"));
  vscode.window.showTextDocument(vscode.Uri.file("/code/server.php"));
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
