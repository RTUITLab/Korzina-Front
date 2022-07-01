const fs = require("fs");
const { readdir } = require('fs').promises;

task("default", [
    "create course.js file",
    "create footer.pug file",
], function () {
});

desc("Creating course.js file from /data/courses.json");
task("create course.js file", function () {
    return new Promise((resolve, reject) => {
        let data = require('./data/courses.json')
        let file;
        fs.rmSync('./src/data', { recursive: true, force: true });
        fs.mkdirSync('./src/data');

        file = "const data = " + JSON.stringify(data.courses) + "\nexport default data;";
        fs.writeFileSync(`./src/data/data.js`, file, "utf-8");
        resolve();
    });
});

desc("Creating footer.pug file from /data/footer.json");
task("create footer.pug file", function () {
    return new Promise((resolve, reject) => {
        let data = require('./data/footer.json')
        let file;

        file = "-\n\tconst data = " + JSON.stringify(data.footer);
        fs.writeFileSync(`./src/data/footerData.pug`, file, "utf-8");

        resolve();
    });
});