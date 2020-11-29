const inquirer = require("inquirer");

const files = require("./files.js");

module.exports = {
  askName() {
    var argv = require("minimist")(process.argv.slice(2));

    try {
      defaultName = argv["_"][0];
    } catch {}
    const question = [
      {
        name: "name",
        type: "input",
        default: defaultName,
        message: "1.请输入项目名称(英文）",
        validate(val) {
          if (val.length) {
            return true;
          } else {
            return "请输入至少一个字母";
          }
        },
      },
    ];
    return inquirer.prompt(question);
  },

  askVersion() {
    const question = [
      {
        name: "version",
        type: "input",
        default: "1.0.0",
        message: "2. 请输入版本号",
      },
    ];
    return inquirer.prompt(question);
  },

  askDesc() {
    const question = [
      {
        name: "desc",
        type: "input",
        default: "",
        message: "3. 请输入项目描述",
      },
    ];
    return inquirer.prompt(question);
  },

  askTemplate() {
    const question = [
      {
        name: "template",
        type: "list",
        message: "4. 请选择项目模板",
        choices: [
          {
            name: "基于antd、redux-toolkit、typescript的react中后台项目",
            value: 1,
          },
          {
            name: "基于antd、js的react中后台项目",
            value: 2,
          },
        ],
      },
    ];
    return inquirer.prompt(question);
  },
};
