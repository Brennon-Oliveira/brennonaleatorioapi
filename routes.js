const express = require("express");
const Blog = require("./controllers/blog/Blog.js");
const Projects = require("./controllers/home/Projects.js");
const Resume = require("./controllers/home/Resume.js");
const routes = express.Router();

// Projects
routes.route("/projects").get(Projects.get);

// Resumes
routes.route("/resume").get(Resume.getInfo);
routes.route("/resume/pdf").get(Resume.downloadPdf);

// Blog
routes.route("/getTopics").get(Blog.getTopics);

module.exports = routes;
