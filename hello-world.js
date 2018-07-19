const MarkdownIt = require("markdown-it"),
  md = new MarkdownIt();

//requiring path and fs modules
const path = require("path");
const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const ejsLint = require("ejs-lint");
//joining path of directory
let directoryPath = path.join(__dirname, "content");
//passsing directoryPath and callback function

let fileLists = [];
let directories = fs.readdirSync(directoryPath);
directories.forEach((directory, index) => {
  fileLists.push(fs.readdirSync(`./content/${directory}`));
});
console.log(fileLists);

const indexHtmlFormat = fs.readFileSync("./public/index.html", "utf8");
const sidebarHtmlFormat = fs.readFileSync("./public/sidebar.html", "utf8");
const mainHtmlFormat = fs.readFileSync("./public/main.html", "utf8");
const homeHtmlFormat = fs.readFileSync("./public/home.html", "utf8");

let sidebar = ejs.render(sidebarHtmlFormat, {
  folderList: directories
});

fileLists.forEach((fileList, index) => {
  let main = ejs.render(mainHtmlFormat, {
    fileList: fileList,
    folderName: directories[index]
  });
  let html = ejs.render(indexHtmlFormat, {
    folderList: directories,
    main: main,
    sidebar: sidebar
  });

  fs.writeFileSync(`./deploy/${directories[index]}-index.html`, html);
  fileList.forEach(file => {
    // markdown to html file
    const markdownFile = fs.readFileSync(
      `./content/${directories[index]}/${file}`,
      "utf-8"
    );
    let convertedFile = md.render(markdownFile);

    let html = ejs.render(indexHtmlFormat, {
      main: convertedFile,
      sidebar: sidebar
    });
    let n = file.indexOf(".");
    let fileName = file.slice(0, n);
    fs.writeFileSync(`./deploy/${fileName}.html`, html);
  });
});

html = ejs.render(indexHtmlFormat, {
  sidebar: sidebar,
  main: homeHtmlFormat
});
fs.writeFileSync("./deploy/home.html", html);
