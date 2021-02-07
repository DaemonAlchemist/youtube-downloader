import { exec } from "child_process";
import { createWriteStream, unlink } from 'fs';
import sanitize from 'sanitize-filename';
import youtubedl from 'youtube-dl';

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
    format: string;
    onGetTitle: (title:string) => void;
    onGetSize: (size:number) => void;
    onProgress: (percentDone:number) => void;
    onSetStatus: (status:string) => void;
    onComplete: () => void;
}

export const download = (options:IDownloadOptions) => {
    console.log("Getting title");
    options.onSetStatus("Initializing...");
    getTitle(options.url).then((title:string) => {
        console.log(`Got title: ${title}`);
        options.onGetTitle(title);

        console.log(`Starting download of ${title}`);
        options.onSetStatus("Downloading...");
        const video = youtubedl(
            options.url,
            options.format === "mp4" ? ['--format', 'mp4'] : ['--format', 'bestaudio', '--extract-audio', '--audio-format', 'mp3'],
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

        const ext = options.format === "mp4" ? "mp4" : "m4a";
        const fullFileName = `${options.path}/${sanitize(title)}.${ext}`;
        console.log(`Saving to ${fullFileName}`);

        video.on('end', () => {
            if(options.format === "mp4") {
                options.onComplete();
                options.onSetStatus("Done!");
            } else {
                const mp3FileName = `${options.path}/${sanitize(title)}.mp3`;
                options.onSetStatus("Converting to MP3...");
                exec(`ffmpeg -i "${fullFileName}" "${mp3FileName}"`, () => {
                    unlink(fullFileName, () => {});
                    options.onComplete();
                    options.onSetStatus("Done!");
                })
            }
        });

        video.pipe(createWriteStream(fullFileName));
    });
}