/* eslint-disable arrow-parens */
/* eslint-disable no-unused-vars */

// You can find more demos via https://github.com/microsoft/vscode-extension-samples

const { rename } = require("fs/promises");
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

  if (process.env.MQ_QUICK_START_IDE_DEMO === "fcWebIde") {
    prepareMqQuickStartConfig(context);
  } else {
    prepareDefaultConfig();
  }
}

function deactivate() {}

async function prepareMqQuickStartConfig(context) {
  let codeFilePath = process.env.CODE_FILE_PATH;

  if (process.env.LANGUAGE === "java") {
    context.subscriptions.push(
      vscode.commands.registerCommand("FcWebIDE.runJava", () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
          const { document } = editor;
          let fileContent = document.getText();

          if (
            fileContent.includes('ACCESS_KEY = "YOUR_ALIYUN_ACCESS_KEY_ID"') ||
            fileContent.includes('SECRET_KEY = "YOUR_ALIYUN_ACCESS_KEY_SECRET"')
          ) {
            vscode.window.showInformationMessage(
              process.env.I18N === "zh"
                ? "您需要将阿里云密钥信息填写到代码中的 ACCESS_KEY 和 SECRET_KEY 的变量中。如果您还没有密钥，您可以在 RAM 控制台中创建密钥 https://ram.console.aliyun.com/manage/ak"
                : "Please replace the ACCESS_KEY and SECRET_KEY in the code with your Aliyun AK and SK first."
            );

            return;
          }
        }

        vscode.commands.executeCommand("java.debug.runJavaFile");
      })
    );

    vscode.workspace
      .getConfiguration()
      .update("FcWebIDE.runJava", true, vscode.ConfigurationTarget.Global);

    vscode.workspace
      .getConfiguration()
      .update(
        "java.configuration.maven.userSettings",
        "/root/.mvn/settings.xml",
        vscode.ConfigurationTarget.Global
      );

    vscode.workspace
      .getConfiguration()
      .update("git.enabled", false, vscode.ConfigurationTarget.Global);

    const terminal = vscode.window.createTerminal();
    terminal.sendText("mv /code/.local-m2 /root && mv /code/.mvn /root");

    await rename(codeFilePath, `${codeFilePath}.java`);
    await rename("/code/pom", "/code/pom.xml");

    codeFilePath = `${codeFilePath}.java`;

    vscode.window.showInformationMessage(
      process.env.I18N === "zh"
        ? "请点击右上方的“橙色执行按钮”运行程序。"
        : "Please click the Run button at the top right corner to run the code."
    );
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
            process.env[toReplace].trim()
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
}

module.exports = {
  activate,
  deactivate,
};
