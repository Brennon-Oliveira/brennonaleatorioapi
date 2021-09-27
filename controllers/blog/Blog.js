const Topic = require("../../db/Models/Topics");

class Blog {
    getTopics = async (req, res) => {
        let topics = await Topic.find({});
        res.json(topics);
    };
}

module.exports = new Blog();
