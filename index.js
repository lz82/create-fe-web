#!/usr/bin/env node
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');

const clear = require('clear');

const figlet = require('figlet');

const CLI = require('clui');

const Spinner = CLI.Spinner;

const download = require('download-git-repo');

const files = require('./lib/files.js');

const inquirer = require('./lib/inquirer.js');

var async = require('async');

var Metalsmith = require('metalsmith');

var render = require('consolidate').handlebars.render;

const SimpleGit = require('simple-git');

const templateList = [
  "lz82/cra-ts-redux-template#master",
  "lz82/cra-js-redux-template#master",
];

// 清除屏幕
clear();

// 打印Banner
console.log(
	chalk.yellow(
		figlet.textSync('Welcome To Use This', {
			horizontalLayout: 'full',
			verticalLayout: 'default',
		})
	)
);

function emptyDir(val) {
	const files = fs.readdirSync(val);
	files.forEach((file) => {
		fs.unlinkSync(path.join(val, file));
	});
	fs.rmdirSync(val);
}

const run = async () => {
	const { name } = await inquirer.askName();

	const { version } = await inquirer.askVersion();

	const { desc } = await inquirer.askDesc();

	const { template } = await inquirer.askTemplate();

	// 判断当前目录下是否存在name文件夹
	if (files.directoryExists(name)) {
		console.log(chalk.red(`已存在该文件夹：${name}`));
		process.exit();
	} else {
		console.log(chalk.blue('任务开始....'));
		// files.mkdir(name);
		const status = new Spinner(chalk.blue('开始拉取项目模板....'), ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷']);
		status.start();
		download(
			templateList[template - 1],
			name,
			{
				clone: false,
			},
			function (err) {
				if (err) {
					process.stdout.write('\n');
					console.log(chalk.red('拉取项目模板失败....'), err);
					status.stop();
				}
				process.stdout.write('\n');
				// modify package.json
				var metalsmith = Metalsmith(name)
					.source('template')
					.use((files, metalsmith, done) => {
						let metadata = metalsmith.metadata();
						metadata['name'] = name;
						metadata['version'] = version;
						metadata['desc'] = desc;
						done();
					})
					.use(function (files, metalsmith, done) {
						var keys = Object.keys(files);
						var metadata = metalsmith.metadata();

						async.each(keys, run, done);

						function run(file, done) {
							var str = files[file].contents.toString();
							render(str, metadata, function (err, res) {
								if (err) {
									console.log(err);
								}
								files[file].contents = new Buffer(res);
								fs.writeFileSync(path.join(name, 'package.json'), res);
								// 删除template文件夹
								emptyDir(path.join(name, 'template'));
							});
						}
					})
					.build(function (err) {
						if (err) {
							console.log(err);
						}
						console.log('ok');
					});
				console.log(chalk.green('拉取项目模板完成....'));
				status.stop();
				console.log(chalk.yellow(`已经成功拉取项目模板\n\n`));
				console.log(chalk.blue('初始化git'));
				const git = SimpleGit({
					baseDir: path.join(process.cwd(), name),
				});
				git.init((err) => {
					if (err) {
						console.log(chalk.red('初始化git失败', err));
					}
					console.log(chalk.green('git初始化完成...'));
				});
				console.log(
					chalk.yellow(
						`\n\n` +
							`使用\n` +
							` cd ${name} \n` +
							`yarn 或 npm install \n` +
							`yarn start 或 npm start即可运行`
					)
				);
			}
		);
	}
};

run();
