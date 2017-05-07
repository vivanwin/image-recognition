let express = require('express');
let app = express()
const port = 80;

const path = require('path');
const uuidV4 = require('uuid/v4');
const multer = require('multer')
const request = require('request');

let storage = multer.diskStorage({
    destination: './upload/',
    filename: function (req, file, cb) {

        cb(null, uuidV4() + path.extname(file.originalname))

    },
    preservePath: true
})
let upload = multer({ storage: storage, preservePath: true })


app.get('/', function (req, res) {
    res.set('Content-Type', 'text/html');
    res.sendFile('./home.html',{root:__dirname});
})

app.post('/upload', upload.single('pic'), function (req, res) {
    let options = {
        url: 'http://localhost:12800/login',
        json: true,
        method: 'POST',
        body: {
            "username": "admin",
            "password": "YOUR PASSWORD HERE"
        }
    }
    request.post(options, (err, result) => {
        if (!err) {
            let optionsPic = {
                url: 'http://localhost:12800/api/fruit/v1.0.0',
                method: 'POST',
                json: true,
                body: {
                    'name': `${require('path').dirname(require.main.filename).replace(/\\/g, "/")}/upload/${req.file.filename}`
                },
                headers: {
                    "Authorization": `Bearer ${result.body.access_token}`
                }
            }
            request.post(optionsPic, (err, resultPic) => {
                res.json(resultPic)
            })

        } else {
            res.json({ err: err })
        }
    })

})
app.listen(port, function () {
    console.log('running ' + port)
})