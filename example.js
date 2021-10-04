const path              = require('path');
const express           = require('express')                                        // 導入(require 相當於 "import") express 模組 (架設網站伺服器)
const app               = express();                                                // 初始化 express
const fs                = require('fs');                                            // require fs 模組 (檔案管理)

const bodyParser        = require('body-parser');                                   // require body-parser 模組 (取得 POST Body)
const jsonParser        = bodyParser.json();                                        // create application/json parser

const firestore         = require('./dht11firebase.js').Firestore;                      // require Firestore (自製外部 class)
const serviceAccount    = require("./serviceAccountKey.json");
const myFirestore       = new firestore(serviceAccount);                            // 初始化 Firestore 物件

const port              = process.env.PORT || 80;                                   // 設定 Heroku port 本機做測試時 port 改為 80

appGetByFile("/",       "./html/index.html");
appGetByFile("/main",   "./html/main.js", "javascript");

function appGetByFile(name, path, type = "html") {
    app.get(name, (req, res) => {
        const data = fs.readFileSync(path, 'utf8');
        let myHead = {
            "Content-Type":  `text/${type}; charset=UTF-8`,
            "Content-Length": Buffer.byteLength(data, 'utf8')
        }
        res.writeHead(200, myHead);
        res.write(data);
        res.end();
    });
}

app.post('/data/checkIdPasswd', jsonParser, async (req, res) => {
    console.log("Check ID Passwd:");
    console.log(req.body);
    res.writeHead(200, {"Content-Type": "text/json"});
    await myFirestore.checkIdPasswd(req.body)
        .then(success => {
            console.log("send:");
            console.log(success);
            res.write(JSON.stringify(success));
            res.end();
        })
        .catch(fail => {
            console.log(fail);
            res.end();
        });
});

app.post('/data/setDHT11Data', jsonParser, (req, res) => {
    console.log("Set DHT11 Data:");
    console.log(req.body);
    res.writeHead(200, {"Content-Type": "text/json"});
    myFirestore.setDHT11Data(req.body)
        .then(success => {
            console.log("send:");
            console.log(success);
            res.write(JSON.stringify(success));
            res.end();
        })
        .catch(fail => {
            console.log(fail);
            res.end();
        });
});

app.post('/data/getDHT11Data', jsonParser, async(req, res) => {
    console.log("Get DHT11 Data:");
    console.log(req.body);
    res.writeHead(200, {"Content-Type": "text/json"});
    await myFirestore.getDHT11Data(req.body)
        .then(success => {
            console.log("send:");
            console.log(success);
            res.write(JSON.stringify(success));
            res.end();
        })
        .catch(fail => {
            console.log(fail);
            res.end();
        });
});

app.listen(port);
