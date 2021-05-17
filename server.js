
import express from 'express';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

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

const preparePageForTests = async (page) => {
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.setUserAgent(userAgent);
}


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

            if(fs.existsSync(__dirname+'/images/'+name)){

                const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
                const page = await browser.newPage();

                await preparePageForTests(page);
                await page.goto(url);

                const data = await page.evaluate(()=>{
                    var description = document.querySelector('meta[name="description"]').content;
                    description = description===''? 'Site ainda sem descrição': description;
                    var title = document.querySelector('title').innerHTML;
            
                    const list = {title: title, description: description };
            
                    return list;
                })
                await browser.close();

                response.push({url:url, ...data, image:name})
            }
        }
    } catch(err){console.log(err)}

    fs.writeFile('projects.json', JSON.stringify(response), function (err) {
        if (err) return console.log(err);
    });

    res.json(response)
})

app.get('/images/:name',(req, res)=>{
    var name = req.params.name;
    try{
        if(fs.existsSync(__dirname+'/images/'+name)){
            res.sendFile(__dirname+'/images/'+name);
        }else {
            res.json({error:true})
        }
    } catch(err){console.log(err)}
})

app.listen(PORT,()=>{
    console.log(`Running on port ${PORT}`)
})