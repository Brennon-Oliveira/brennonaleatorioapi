
import express from 'express';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
const __dirname = path.resolve(path.dirname(''));
const PORT = '3030';
const MyProjects = [
    {url: 'http://brennonaleatorio.com.br',name:'brennonaleatorio.png'},
    {url: 'https://www.hilbertfirearms.com.br/',name:'hilbertfirearms.png'},
    {url: 'https://hogwartshmrpg.netlify.app/',name:'hogwartshmrpg.png'},
];

app.use(cors())

const preparePageForTests = async (page) => {
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.setUserAgent(userAgent);
}

app.get('/updateFiles',async(req,res)=>{
    await (async () => {
        
        for(let i = 0; i < MyProjects.length; i++){
            var name = MyProjects[i].name;
            var url = MyProjects[i].url;
            try{
                if(!fs.existsSync(__dirname+'/images/'+name)){
                    console.log(__dirname+'/images/'+name)
                    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
                    const page = await browser.newPage();
                    await page.goto(url);
                    await page.screenshot({path: 'images/'+name});
                    await browser.close();
                    
                }
            } catch(err){console.log(err)}
        }
    })();
    res.json({status:'sucess'});
})

app.get('/projects',async(req, res)=>{
    var response = [];
    try{
        for(let i = 0; i < MyProjects.length; i++){
            var name = MyProjects[i].name;
            if(fs.existsSync(__dirname+'/images/'+name)){



                response.push({image:name})
            }
        }
    } catch(err){console.log(err)}
    res.json(response)
})

app.get('/images/:name',(req, res)=>{
    var name = req.params.name;
    res.sendFile(__dirname+'/buddy-screenshot.png');
})

app.listen(PORT,()=>{
    console.log(`Running on port ${PORT}`)
})