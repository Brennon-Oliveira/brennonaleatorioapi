const mongoose = require("..");

const PdfSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    pdf: {
        type: Buffer,
        required: true,
    },
});

const Pdf = mongoose.model("Pdf", PdfSchema);
module.exports = Pdf;
