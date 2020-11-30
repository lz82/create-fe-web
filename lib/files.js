const fs = require('fs');

const path = require('path');

const _ = require('lodash');

module.exports = {
	getCurrentDirectoryBase() {
		return path.basename(process.cwd());
	},

	directoryExists(filePath) {
		try {
			console.log(filePath);
			return fs.statSync(filePath).isDirectory();
		} catch (err) {
			return false;
		}
	},

	getCurrentDirectoryFileList() {
		return _.without(fs.readdirSync('.'), '.git', '.gitignore');
	},

	mkdir(name) {
		fs.mkdirSync(name);
	},

	emptyDir(path) {
		const files = fs.readFileSync(path);
		files.forEach((file) => {
			fs.unlinkSync(path + file);
		});
		fs.rmdirSync(path);
	},
};
