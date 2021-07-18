const mongoose = require("..");

const ProjectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    picture: {
        type: Buffer,
        required: true,
    },
});

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
