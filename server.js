const result = require("dotenv").config();

try {
    if (result.error) {
        throw result.error;
    }
} catch (err) {
    console.log(err);
}
const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const pdf = require("pdf-creator-node");
const resumeInfo = require("./resumeInfo.js");
const { zip } = require("zip-a-folder");
const routes = require("./routes.js");

console.log(result.parsed);

const app = express();
// const __dirname = path.resolve(path.dirname(""));
const PORT = process.env.PORT || 5000;
const MyProjects = [
    { url: "https://brennonaleatorio.com.br", name: "brennonaleatorio.png" },
    { url: "https://www.hilbertfirearms.com.br/", name: "hilbertfirearms.png" },
    { url: "https://hogwartshmrpg.netlify.app/", name: "hogwartshmrpg.png" },
    {
        url: "http://projetos.brennonaleatorio.com.br/little-invest/",
        name: "littleinvest.png",
    },
    {
        url: "http://projetos.brennonaleatorio.com.br/DiaDaMulher/",
        name: "DiaDaMulher.png",
    },
    {
        url: "http://projetos.brennonaleatorio.com.br/Monguilhott/",
        name: "Monguilhott.png",
    },
];

app.use(cors());
app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
    console.log(process.env.USER);
    console.log(process.env.PASSWORD);
    console.log(process.env.DATABASE);
});
