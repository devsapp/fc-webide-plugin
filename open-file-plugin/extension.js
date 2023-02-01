/* eslint-disable arrow-parens */
/* eslint-disable no-unused-vars */

// You can find more demos via https://github.com/microsoft/vscode-extension-samples

const { rename, access } = require("fs/promises");
const { constants } = require("fs");

const vscode = require("vscode");

async function waiting(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

/**
 * @param {vscode.ExtensionContext} context
 */

async function activate(context) {
  if (process.env.MQ_QUICK_START_IDE_DEMO === "fcWebIde") {
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

    const codeFilePaths = process.env.CODE_FILE_PATHS;
    let defaultFilePath;

    if (process.env.LANGUAGE === "java") {
      context.subscriptions.push(
        vscode.commands.registerCommand("FcWebIDE.runJava", () => {
          const editor = vscode.window.activeTextEditor;

          if (editor) {
            const { document } = editor;
            let fileContent = document.getText();

            if (
              fileContent.includes(
                'ACCESS_KEY = "YOUR_ALIYUN_ACCESS_KEY_ID"'
              ) ||
              fileContent.includes(
                'SECRET_KEY = "YOUR_ALIYUN_ACCESS_KEY_SECRET"'
              )
            ) {
              vscode.window.showWarningMessage(
                process.env.I18N === "zh"
                  ? "您需要将具有相关权限的阿里云密钥信息填写到代码中的 ACCESS_KEY 和 SECRET_KEY 的变量中。如果您还没有密钥，您可以在 RAM 控制台中创建密钥 https://ram.console.aliyun.com/manage/ak"
                  : "Please replace the ACCESS_KEY and SECRET_KEY in the code with your Aliyun AK and SK first.",
                {
                  modal: true,
                }
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

      try {
        await access("/code/pom", constants.R_OK | constants.W_OK);
        vscode.window.showInformationMessage(
          process.env.I18N === "zh"
            ? "您需要将具有相关权限的阿里云密钥信息填写到代码中的 ACCESS_KEY 和 SECRET_KEY 的变量中。然后点击右上角的橙色“执行按钮”运行程序。"
            : "Please click the Run button at the top right corner to run the code.",
          {
            modal: true,
          }
        );
        const terminal = vscode.window.createTerminal();
        terminal.sendText("mv /code/.local-m2 /root && mv /code/.mvn /root");
        await waiting(5);
        await rename("/code/pom", "/code/pom.xml");
      } catch (e) {}

      const filesToRename = codeFilePaths.split(",");

      for (let index = 0; index < filesToRename.length; index++) {
        const filePath = filesToRename[index];
        try {
          await access(filePath, constants.R_OK | constants.W_OK);
          await rename(filePath, `${filePath}.java`);
        } catch (e) {}
      }

      defaultFilePath = `${filesToRename[0]}.java`;
    }

    try {
      await access(defaultFilePath, constants.R_OK);
      vscode.window
        .showTextDocument(vscode.Uri.file(defaultFilePath))
        .then(() => {
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
    } catch (e) {}
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};