const fs = require("fs");
const path = require("path");
const pdf = require("pdf-creator-node");

class Resume {
    resumeInfo;

    constructor() {
        this.resumeInfo = {
            name: "Brennon Gabriel de Oliveira",
            nationality: "Brasileiro",
            state: "Solteiro",
            age: 17,
            email: "brennonoliveira20014@gmail.com",
            number: "42999017838",
            goals: "Atuar como Desenvolvedor Web",
            formation: [
                "Ensino Médio. Padre Pedro Grzelczak, previsão de conclusão em 2021.",
            ],
            professionalExperience: [
                {
                    title: "2021-2021 - Autônomo",
                    office: ["Desenvolvedor Web"],
                },
            ],
            qualifications: [
                "Curso Webmaster Front-End Completo (Danki Code, 2020 - Carga Horária: 80 horas)",
                "Curso Design de Aplicativos (Danki Code, 2021 - Carga Horária: 3 horas)",
                "Curso de JavaScript (SoloLearn, 2020)",
                "Curso Produtividade para Programadores (Danki Code, 2021 - Carga Horária: 3 horas)",
                "Curso Agência Web de Sucesso (Danki Code, 2021 - Carga Horária: 6 horas)",
                "Curso de HTML (SoloLearn, 2020)",
                "Curso de CSS (SoloLearn, 2020)",
                "Conhecimento em React e React native",
                "Curso de PHP (SoloLearn, 2020)",
                "Curso de Java (SoloLearn, 2020)",
                "Curso Git e contribuições para projetos Open Source (Udemy, 2021 - 3,5 horas)",
            ],
            additionalInfos: [
                "Conhecimento em Inglês",
                "Conhecimento em Windows e Linux",
            ],
        };
    }

    getInfo = (req, res) => {
        res.json(this.resumeInfo);
        return;
    };

    downloadPdf = async (req, res) => {
        try {
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=currículo.pdf"
            );

            if (fs.existsSync(path.resolve(__dirname, "./currículo.pdf"))) {
                res.send(path.resolve(__dirname, "./currículo.pdf"));
                return;
            } else {
            }
            var resume = await fs.readFileSync(
                path.resolve(__dirname, "./pdf.html"),
                "utf8"
            );

            var options = {
                format: "A3",
                orientation: "portrait",
                border: "10mm",
            };
            var document = {
                html: resume,
                data: this.resumeInfo,
                path: path.resolve(__dirname, "./currículo.pdf"),
                type: "",
            };

            await pdf
                .create(document, options)
                .then((res) => {
                    console.log(res);
                })
                .catch((error) => {
                    console.error(error);
                });

            await new Promise((r) => setTimeout(r, 2000));
            res.sendFile(path.resolve(__dirname, "./currículo.pdf"));
        } catch (err) {
            console.log(err);
        }
    };
}

module.exports = new Resume();
