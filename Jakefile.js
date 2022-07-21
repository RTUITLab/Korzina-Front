const fs = require("fs");
const { readdir } = require('fs').promises;
const exec = require("child_process").exec;

task("default", [
    "create courseData.js file",
    "create footer.pug file",
    "create profile files",
    "build prod version",
], function () {
});

desc("Creating courseData.js file from /data/courses/");
task("create courseData.js file", function () {
    return new Promise(async (resolve, reject) => {
        const dir = await readdir('./data/courses');
        fs.rmSync('./src/data', { recursive: true, force: true });
        fs.mkdirSync('./src/data');

        let result = [];
        let file;

        for (let i of dir) {
            let data = fs.readFileSync('./data/courses/' + i, 'utf-8')
            result.push(JSON.parse(data))
        }
        result.sort((a,b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
        file = "const data = " + JSON.stringify(result) + "\nexport default data;";
        fs.writeFileSync(`./src/data/coursesData.js`, file, "utf-8");
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

desc("Creating profile .pug files from /data/courses/");
task("create profile files", function () {
    return new Promise(async (resolve, reject) => {
        const dir = await readdir('./data/courses');
        fs.rmSync('./src/profiles', { recursive: true, force: true });
        fs.mkdirSync('./src/profiles');

        let result = [];
        for (let i of dir) {
            let data = fs.readFileSync('./data/courses/' + i, 'utf-8')
            result.push(JSON.parse(data))
        }
        result.sort((a,b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0));
        for (let j in result) {
            fs.writeFileSync(`./src/profiles/${result[j].fileName}`,  "extends ../layout/profilePageTemplate/profilePageTemplate.pug\n\nblock variables\n\t-\n\t\tlet obj = " + JSON.stringify(result[j]) + "\n\t\tvar headerLink = '../compare/compare.pug'", 'utf-8');
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
            + "&& parcel build ./src/profiles/*.pug --dist-dir build/profiles --public-url ./ --no-cache "
            + "&& parcel build ./src/compare/compare.pug --dist-dir build/compare --public-url ./ --no-cache "
            + "&& cp -a ./assets ./build/ "
            + "&& node ./postbuild.js && node ./postbuild.js profiles && node ./postbuild.js compare"
            + "&& exit 0";

        if (process.platform === "win32") command =
            "parcel build ./src/index.pug --dist-dir build --public-url ./ --no-cache "
        	+ "&& parcel build ./src/profiles/*.pug --dist-dir build/profiles --public-url ./ --no-cache "
        	+ "&& parcel build ./src/compare/compare.pug --dist-dir build/compare --public-url ./ --no-cache "
            + "&& mkdir .\\build\\assets "
            + "&& xcopy /E .\\assets .\\build\\assets\\ "
        	+ "&& node .\\postbuild.js && node .\\postbuild.js profiles && node .\\postbuild.js compare "
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
