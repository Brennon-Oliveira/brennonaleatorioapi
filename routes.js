const express = require("express");
const Projects = require("./controllers/home/Projects.js");
const Resume = require("./controllers/home/Resume.js");
const routes = express.Router();

routes.route("/projects").get(Projects.get);

routes.route("/resume").get(Resume.getInfo);
routes.route("/resume/pdf").get(Resume.downloadPdf);

module.exports = routes;
