const fs = require("fs");
const data = require('./data/courses.json')
const { readdir } = require('fs').promises;
const exec = require("child_process").exec;

task("default", [
    "create course.js file",
    "create footer.pug file",
    "create profile files",
    "build prod version",
], function () {
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

desc("Creating course.js file from /data/courses.json");
task("create course.js file", function () {
    return new Promise((resolve, reject) => {
        let data = require('./data/courses.json')
        let file;
        fs.rmSync('./src/data', { recursive: true, force: true });
        fs.mkdirSync('./src/data');

        file = "const data = " + JSON.stringify(data.courses) + "\nexport default data;";
        fs.writeFileSync(`./src/data/coursesData.js`, file, "utf-8");
        resolve();
    });
});

desc("Creating profile .pug files from /data/courses.json");
task("create profile files", function () {
    return new Promise((resolve, reject) => {
        fs.rmSync('./src/profiles', { recursive: true, force: true });
        fs.mkdirSync('./src/profiles');
        let data = require('./data/courses.json')

        for (let j in data.courses) {
            fs.writeFileSync(`./src/profiles/${data.courses[j].fileName}`, "extends ../layout/profilePageTemplate/profilePageTemplate.pug\n\nblock variables\n\t-\n\t\tlet obj = " + JSON.stringify(data.courses[j]), 'utf-8');
        }
        resolve();
    });
})

desc("Build project Front prod");
task("build prod version", function () {
    return new Promise((resolve, reject) => {
        const rimraf = require("rimraf");
        rimraf.sync("./build");
        try {
            fs.mkdirSync("./build")
        }catch (e){}
        try {
            fs.mkdirSync("./build/dist")
        }catch (e){}

        let command = "parcel build ./src/index.pug --dist-dir build --public-url ./ --no-cache "
            + "&& parcel build ./src/profiles/*.pug --dist-dir build --public-url ./ --no-cache "
            + "&& cp -a ./assets ./build/ "
            + "&& node ./postbuild.js && node ./postbuild.js profiles"
            + "&& exit 0";
        if (process.platform === "win32") command =
        	"parcel build ./src/index.pug --dist-dir build --public-url ./ --no-cache"
        	+ "&& parcel build ./src/profiles/*.pug --dist-dir build/profiles --public-url ./ --no-cache"
        	+ "&& mkdir .\\build\\assets"
        	+ "&& xcopy /E .\\assets .\\build\\assets\\"
        	+ "&& node .\\postbuild.js && node .\\postbuild.js profiles"
        	+ "&& exit 0";

        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error(stderr);
                reject(stderr);
                // return;
            }

            // fs.copyFileSync("./src/images/favicon.ico","./build/favicon.ico")

            resolve(true);
        });
    });
});