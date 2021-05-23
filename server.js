
import express from 'express';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';
import cors from 'cors';
import pdf from 'pdf-creator-node';
import resumeInfo from './resumeInfo.js';
import { zip } from 'zip-a-folder';

const app = express();
const __dirname = path.resolve(path.dirname(''));
const PORT = process.env.PORT || 5000;
const MyProjects = [
    {url: 'http://brennonaleatorio.com.br',name:'brennonaleatorio.png'},
    {url: 'https://www.hilbertfirearms.com.br/',name:'hilbertfirearms.png'},
    {url: 'https://hogwartshmrpg.netlify.app/',name:'hogwartshmrpg.png'},
    {url: 'http://projetos.brennonaleatorio.com.br/little-invest/',name:'littleinvest.png'},
    {url: 'http://projetos.brennonaleatorio.com.br/DiaDaMulher/',name:'DiaDaMulher.png'},
    {url: 'http://projetos.brennonaleatorio.com.br/Monguilhott/',name:'Monguilhott.png'},
];

app.use(cors())

app.get('/downloadImages',async(req,res)=>{
    if(!fs.existsSync(__dirname + '/images.zip')){
        await (async () => {
            var dir = __dirname+'/images/'
            !fs.existsSync(dir) && fs.mkdirSync(dir);
            
            for(let i = 0; i < MyProjects.length; i++){
                var name = MyProjects[i].name;
                var url = MyProjects[i].url;
                try{
                    if(!fs.existsSync(__dirname+'/images/'+name)){
                        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
                        const page = await browser.newPage();
                        await page.goto(url);
                        await page.screenshot({path: 'images/'+name});
                        await browser.close();
                        
                    }
                } catch(err){console.log(err)}
            }
        })();
        await zip(__dirname + '/images', __dirname + '/images.zip');
    }
    res.sendFile(__dirname+'/images.zip');
})

app.get('/newBot',async(req, res)=>{

    let response = [];
    let html = await axios.get('https://brennonaleatorio.com.br/');

    

    const $ = cheerio.load(html.data);

    response.push($('meta').attr('href'));

    console.log($('meta[name="description"]').attr('content'));
    res.json({'ola':response})

})

app.get('/projects',async(req, res)=>{

    let response = [];
    let file;

    if(fs.existsSync(__dirname + '/projects.json')){
        file = fs.readFileSync('projects.json')
        file = JSON.parse(file)
    }

    try{
        for(let i = 0; i < MyProjects.length; i++){
            var name = MyProjects[i].name;
            var url = MyProjects[i].url;

            if(file){
                let exists = false;
                for(let x = 0; x < file.length; x++){
                    if(file[x] && file[x].image === name){
                        response.push(file[x]);
                        exists = true;
                        break;
                    }
                }
                if(exists) continue;
            }
                // const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
                // const page = await browser.newPage();

                // await preparePageForTests(page);
                // await page.goto(url);

                // const data = await page.evaluate(()=>{
                //     var description = document.querySelector('meta[name="description"]').content;
                //     description = description===''? 'Site ainda sem descrição': description;
                //     var title = document.querySelector('title').innerHTML;
            
                //     const list = {title: title, description: description };
                // })
                // await browser.close();

                let html = await axios.get(url);

                const $ = await cheerio.load(html.data);
                let description = $('meta[name="description"]').attr('content') ? $('meta[name="description"]').attr('content') : 'Site ainda sem descrição';
                let title = $('title').text();
                
                response.push({url, title, description, image:name})
        }
    } catch(err){console.log(err)}

    fs.writeFile('projects.json', JSON.stringify(response), function (err) {
        if (err) return console.log(err);
    });

    
    res.json(response)
})

app.get('/resume/:isPdf?',async(req,res)=>{
    let isPdf = req.params.isPdf;
    if(!isPdf){
        res.json(resumeInfo);
        return;
    }

    var resume = await fs.readFileSync("pdf.html", "utf8");

    var options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
    };
    var document = {
        html: resume,
        data: resumeInfo,
        path: "./currículo.pdf",
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
    
    res.sendFile(__dirname + '/currículo.pdf');

})

app.listen(PORT,()=>{
    console.log(`Running on port ${PORT}`)
})