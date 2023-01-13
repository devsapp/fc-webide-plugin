/* eslint-disable arrow-parens */
/* eslint-disable no-unused-vars */

// You can find more demos via https://github.com/microsoft/vscode-extension-samples

const { rename } = require("fs/promises");
const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  if (process.env.MQ_QUICK_START_IDE_DEMO === "fcWebIde") {
    prepareMqQuickStartConfig();
  } else {
    prepareDefaultConfig();
  }
}

function deactivate() {}

async function prepareMqQuickStartConfig() {
  let codeFilePath = process.env.CODE_FILE_PATH;

  if (process.env.LANGUAGE === "java") {
    vscode.workspace
      .getConfiguration()
      .update(
        "java.configuration.maven.userSettings",
        "/root/.mvn/settings.xml",
        vscode.ConfigurationTarget.Global
      );

    const terminal = vscode.window.createTerminal();
    terminal.sendText("mv /code/.local-m2 /root && mv /code/.mvn /root");

    await rename(codeFilePath, `${codeFilePath}.java`);
    await rename("/code/pom", "/code/pom.xml");

    codeFilePath = `${codeFilePath}.java`;
  }

  vscode.window.showTextDocument(vscode.Uri.file(codeFilePath)).then(() => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const { document } = editor;
      let fileContent = document.getText();
      const toReplaces = process.env.REPLACES.split(",");
      for (let index = 0; index < toReplaces.length; index++) {
        const toReplace = toReplaces[index];
        if (process.env[toReplace]) {
          fileContent = fileContent.replace(
            `\${${toReplace}}`,
            process.env[toReplace]
          );
        }
      }
      vscode.window.activeTextEditor.edit((builder) => {
        builder.replace(
          new vscode.Range(
            document.lineAt(0).range.start,
            document.lineAt(document.lineCount - 1).range.end
          ),
          fileContent
        );
      });
    }
  });
}

function prepareDefaultConfig() {
  vscode.window.showTextDocument(vscode.Uri.file("/code/index.js"));
  vscode.window.showTextDocument(vscode.Uri.file("/code/app.js"));
  vscode.window.showTextDocument(vscode.Uri.file("/code/server.js"));

  vscode.window.showTextDocument(vscode.Uri.file("/code/index.py"));
  vscode.window.showTextDocument(vscode.Uri.file("/code/app.py"));
  vscode.window.showTextDocument(vscode.Uri.file("/code/server.py"));

  vscode.window.showTextDocument(vscode.Uri.file("/code/index.php"));
  vscode.window.showTextDocument(vscode.Uri.file("/code/app.php"));
  vscode.window.showTextDocument(vscode.Uri.file("/code/server.php"));

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
}

module.exports = {
  activate,
  deactivate,
};
