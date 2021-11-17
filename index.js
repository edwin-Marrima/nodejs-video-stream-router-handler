const express = require('express');
const app = express();
const fs = require('fs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/video', (req, res) => {
    const range = req.headers.range;
    if (!range) {
        return res.status(400).send("Requires Range header");
    }
    const videoPath = "video.mp4";
    const videoSize = fs.statSync(videoPath).size;

    const chunkSize = 1 * 1e6; //1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize, videoSize - 1);

    const contentLenght = end - start - 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLenght,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });

    videoStream.pipe(res);

})



app.listen(8080, () => {
    console.log('Listening to port 8080');
})