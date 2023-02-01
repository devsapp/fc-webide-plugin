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
