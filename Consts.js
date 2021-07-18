const path = require("path");

module.exports = {
    USER: process.env.USER || "root",
    PASSWORD: process.env.PASSWORD || "",
    DATABASE: process.env.DATABASE || "",
    __dirname: path.resolve(path.dirname("")),
};
