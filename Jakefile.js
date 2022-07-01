const fs = require("fs");
const { readdir } = require('fs').promises;

task("default", [
    "create course.js file",
], function () {
});

desc("Creating course.js file from /data/data.json");
task("create course.js file", function () {
    return new Promise((resolve, reject) => {
        let data = require('./data/data.json')
        let file;
        fs.rmSync('./src/data', { recursive: true, force: true });
        fs.mkdirSync('./src/data');

        file = "const data = " + JSON.stringify(data.courses) + "\nexport default data;";
        fs.writeFileSync(`./src/data/data.js`, file, "utf-8");
        resolve();
    });
});