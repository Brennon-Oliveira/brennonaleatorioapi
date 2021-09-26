const mongoose = require("mongoose");
const [USER, PASSWORD, DATABASE] = [
    process.env.USER,
    process.env.PASSWORD,
    process.env.DATABASE,
];
const DB_URL = `mongodb+srv://${USER}:${PASSWORD}@brennon-oliveira.pqgrq.mongodb.net/${DATABASE}?retryWrites=true&w=majority`;
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;
