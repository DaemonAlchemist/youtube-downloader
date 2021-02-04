const fs = require('fs');
const youtubedl = require('youtube-dl');

const downloadDir = "E:/Movies/Youtube Downloads";

const ids = process.argv.slice(2);

const getUrl = id => `http://www.youtube.com/watch?v=${id}`;

const getTitle = id => new Promise((resolve, reject) => {
    youtubedl.getInfo(getUrl(id), (err, info) => {
        resolve(info.title);
    })
});

ids.forEach(id => {
    getTitle(id).then(title => {
        const video = youtubedl(
            getUrl(id),
            ['--format=18'],
            { cwd: __dirname }
        );

        video.on('info', function(info) {
            console.log('Download started')
            console.log('filename: ' + info._filename)
            console.log('size: ' + info.size)
        });

        video.pipe(fs.createWriteStream(`${downloadDir}/${title}.mp4`));
    });
});
