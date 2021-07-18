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

// app.get("/downloadImages", async (req, res) => {
//     if (!fs.existsSync(__dirname + "/images.zip")) {
//         await (async () => {
//             var dir = __dirname + "/images/";
//             !fs.existsSync(dir) && fs.mkdirSync(dir);

//             for (let i = 0; i < MyProjects.length; i++) {
//                 var name = MyProjects[i].name;
//                 var url = MyProjects[i].url;
//                 try {
//                     if (!fs.existsSync(__dirname + "/images/" + name)) {
//                         const browser = await puppeteer.launch({
//                             args: ["--no-sandbox", "--disable-setuid-sandbox"],
//                         });
//                         const page = await browser.newPage();
//                         await page.goto(url);
//                         await page.screenshot({ path: "images/" + name });
//                         await browser.close();
//                     }
//                 } catch (err) {
//                     console.log(err);
//                 }
//             }
//         })();
//         await zip(__dirname + "/images", __dirname + "/images.zip");
//     }
//     res.sendFile(__dirname + "/images.zip");
// });

// app.get("/newBot", async (req, res) => {
//     let response = [];
//     let html = await axios.get("https://brennonaleatorio.com.br/");

//     const $ = cheerio.load(html.data);

//     response.push($("meta").attr("href"));

//     console.log($("title").first().text());
//     res.json({ ola: "response" });
// });

// app.get("/reset", (req, res) => {
//     if (fs.existsSync(__dirname + "/currículo.pdf")) {
//         fs.rmSync(__dirname + "/currículo.pdf");
//     }
//     if (fs.existsSync(__dirname + "/projects.json")) {
//         fs.rmSync(__dirname + "/projects.json");
//     }
//     res.send("Reset");
// });

// app.get("/projects", async (req, res) => {
//     let response = [];
//     let file;

//     if (fs.existsSync(__dirname + "/projects.json")) {
//         file = fs.readFileSync("projects.json");
//         file = JSON.parse(file);
//     }

//     try {
//         for (let i = 0; i < MyProjects.length; i++) {
//             var name = MyProjects[i].name;
//             var url = MyProjects[i].url;

//             if (file) {
//                 let exists = false;
//                 for (let x = 0; x < file.length; x++) {
//                     if (file[x] && file[x].image === name) {
//                         response.push(file[x]);
//                         exists = true;
//                         break;
//                     }
//                 }
//                 if (exists) continue;
//             }

//             let html = await axios.get(url);

//             const $ = await cheerio.load(html.data);
//             let description = $('meta[name="description"]')
//                 .first()
//                 .attr("content")
//                 ? $('meta[name="description"]').first().attr("content")
//                 : "Site ainda sem descrição";
//             let title = $("title").first().text();

//             console.log(title);

//             response.push({ url, title, description, image: name });
//         }
//     } catch (err) {
//         console.log(err);
//     }

//     fs.writeFile("projects.json", JSON.stringify(response), function (err) {
//         if (err) return console.log(err);
//     });

//     res.json(response);
// });

// app.get("/resume/:isPdf?", async (req, res) => {
//     let isPdf = req.params.isPdf;
//     if (!isPdf) {
//         res.json(resumeInfo);
//         return;
//     }

//     if (fs.existsSync(__dirname + "/currículo.pdf")) {
//         res.sendFile(__dirname + "/currículo.pdf");
//         return;
//     }

//     var resume = await fs.readFileSync("pdf.html", "utf8");

//     var options = {
//         format: "A3",
//         orientation: "portrait",
//         border: "10mm",
//     };
//     var document = {
//         html: resume,
//         data: resumeInfo,
//         path: "./currículo.pdf",
//         type: "",
//     };

//     await pdf
//         .create(document, options)
//         .then((res) => {
//             console.log(res);
//         })
//         .catch((error) => {
//             console.error(error);
//         });

//     await new Promise((r) => setTimeout(r, 2000));
//     res.sendFile(__dirname + "/currículo.pdf");
// });

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
    console.log(process.env.USER);
    console.log(process.env.PASSWORD);
    console.log(process.env.DATABASE);
});
