const express = require("express");
const Projects = require("./controllers/Projects.js");
const routes = express.Router();

routes.route("/projects").get(Projects.get);

module.exports = routes;
