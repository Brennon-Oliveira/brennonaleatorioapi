const mongoose = require("..");

const topicSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    pages: {
        type: [{}],
        required: true,
    },
});

const Topic = mongoose.model("Topic", topicSchema);
module.exports = Topic;
