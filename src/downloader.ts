import fs from 'fs';
import youtubedl from 'youtube-dl';
import sanitize from 'sanitize-filename';

export interface IVideoInfo {
    title: string;
    size: number;
}

const getTitle = (url:string):Promise<string> => new Promise((resolve, reject) => {
    youtubedl.getInfo(url, (err:any, info:IVideoInfo) => {
        console.log(info);
        resolve(info.title);
    })
});

interface IDownloadOptions {
    url: string;
    path: string;
    onGetTitle: (title:string) => void;
    onGetSize: (size:number) => void;
    onProgress: (percentDone:number) => void;
    onComplete: () => void;
}

export const download = (options:IDownloadOptions) => {
    getTitle(options.url).then((title:string) => {
        options.onGetTitle(title);

        const video = youtubedl(
            options.url,
            ['--format=18'],
            { cwd: __dirname }
        );

        let size = 0;
        video.on('info', (info:any) => {
            console.log('Download started')
            console.log('filename: ' + info._filename)
            console.log('size: ' + info.size)
            size = info.size;
            options.onGetSize(size);
        });

        let totalDownloaded = 0;
        video.on('data', (data:any) => {
            totalDownloaded += data.length;
            options.onProgress(totalDownloaded / size);
        })

        video.on('end', options.onComplete);

        const fullFileName = `${options.path}/${sanitize(title)}.mp4`;
        console.log(fullFileName);

        video.pipe(fs.createWriteStream(fullFileName));
    });
}