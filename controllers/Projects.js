const fs = require("fs");
const axios = require("axios");
const puppeteer = require("puppeteer");
const Cheerio = require("cheerio");
const Project = require("../db/Models/Project.js");
const path = require("path");
// const { __dirname } = require("../Consts.js");

class Projects {
    myProjects;
    response;

    constructor() {
        this.myProjects = [
            {
                url: "https://brennonaleatorio.com.br",
                name: "brennonaleatorio.png",
            },
            {
                url: "https://www.hilbertfirearms.com.br/",
                name: "hilbertfirearms.png",
            },
            {
                url: "https://hogwartshmrpg.netlify.app/",
                name: "hogwartshmrpg.png",
            },
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
        this.response = [];
    }

    get = async (req, res) => {
        this.response = [];
        let projects = await Project.find();

        if (projects?.length < this.myProjects.length) {
            await this.downloadImage();
            await this.getInfos();
            projects = await Project.find();
        }

        res.status(200).json({ dir: process.cwd(), data: projects });
    };

    downloadImage = async () => {
        await (async () => {
            var dir = process.cwd() + "/controllers/images/";
            !fs.existsSync(dir) && fs.mkdirSync(dir);

            for (let i = 0; i < this.myProjects.length; i++) {
                var name = this.myProjects[i].name;
                var url = this.myProjects[i].url;
                try {
                    if (
                        !fs.existsSync(
                            process.cwd() + "/controllers/images/" + name
                        )
                    ) {
                        const browser = await puppeteer.launch({
                            args: ["--no-sandbox", "--disable-setuid-sandbox"],
                        });
                        const page = await browser.newPage();
                        await page.goto(url);
                        await page.screenshot({
                            path: process.cwd() + "/controllers/images/" + name,
                        });
                        await browser.close();
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        })();
    };

    getInfos = async () => {
        let projectExists;

        try {
            for (let i = 0; i < this.myProjects.length; i++) {
                var name = this.myProjects[i].name;
                var url = this.myProjects[i].url;

                let projectExists = await Project.find({
                    url: url,
                }).select("_id");
                if (!projectExists || projectExists.length < 1) {
                    let html = await axios.get(url);

                    const $ = await Cheerio.load(html.data);
                    let description = $('meta[name="description"]')
                        .first()
                        .attr("content")
                        ? $('meta[name="description"]').first().attr("content")
                        : "Site ainda sem descrição";
                    let title = $("title").first().text();

                    console.log(title);

                    this.response.push({
                        name: name,
                        url,
                        title,
                        description,
                        image: name,
                    });
                } else {
                    this.response.push({
                        alreadyExists: true,
                    });
                }
            }

            // const promises = this.response.map(async (val) => {
            // });

            // await Promise.all(promises);

            for (let i = 0; i < this.response.length; i++) {
                let val = this.response[i];
                if (!val.alreadyExists) {
                    let file = path.resolve(__dirname, "./images/" + val.name);
                    let data = await fs.readFileSync(file);
                    if (data) {
                        console.log(data);
                        console.log(
                            process.cwd() + "/controllers/images/" + val.name
                        );
                        console.log(
                            fs.existsSync(
                                process.cwd() +
                                    "/controllers/images/" +
                                    val.name
                            )
                        );
                        await Project.create({
                            title: val.title,
                            description: val.description,
                            url: val.url,
                            picture: data,
                        }).catch((err) => {
                            console.log(err);
                        });
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }

        // fs.writeFile("projects.json", JSON.stringify(response), function (err) {
        //     if (err) return console.log(err);
        // });
    };
}

module.exports = new Projects();
