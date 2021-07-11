const express = require('express');
const router = express.Router();
// const { video } = require("../models/Video");
const path = require("path");
const {auth} = require("../middleware/auth");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg")
const {Video} = require("../models/Video");

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== ".mp4" && ext !== ".pdf") {
            return cb(res.status(400).end('only pdf, jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

const upload = multer({storage: storage}).single("file");
//=================================
//             Video
//=================================


router.post('/uploadFiles', (req, res) => {
    // 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if (err) {
            return res.json({success: false, err})
        } else {
            console.log(res.req.file.path);
            // console.log(req.res.file);
            return res.json({success: true, url: res.req.file.path, fileName: res.req.file.filename})
        }
    })
})

router.post('/thumbnail', (req, res) => {
    // 썸네일 생성 & 비디오 러닝타임도 가져오기

    let filePath = "";
    let fileNames = "";
    let fileDuration = "";

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metaData) {
        console.dir(metaData);
        console.log(metaData.format.duration);
        fileDuration = metaData.format.duration
    })


    // 썸네일 생성
    ffmpeg(req.body.url)
        .on('filenames', function(fileNames) {
            console.log("=================");
            console.log(`Will generate ${fileNames.join(', ')}`);
            console.log(fileNames);

            filePath = `uploads/thumbnails/${fileNames[0]}`
            console.log('===========>', filePath);
        })
        .on('end', function() {
            console.log("ScreenShots taken");
            return res.json({
                success: true,
                url: filePath,
                // fileName: fileNames,
                fileDuration: fileDuration
            })
        })
        .on('error', function(err) {
            console.error(err);
            return res.json({success: false, err});
        })
        .screenshots({
            count: 3,
            folder: 'uploads/thumbnails',
            size: '320x240',
            filename: 'thumbnail-%b.png'
        })
})

router.post('/uploadVideo', (req, res) => {
    const video = new Video(req.body)
    video.save((err, doc) => {
        if(err) {
            return res.json({success: false, err})
        }
        res.status(200).json({success: true});
    })
})


module.exports = router;