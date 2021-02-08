import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faFolder, faVideo, faVolumeUp, faCog, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { remote } from "electron";
import React, { SyntheticEvent } from 'react';
import './App.global.css';
import { DownloadListItem } from './components/DownloadListItem';

interface IOpenFileResults {
  canceled: boolean;
  filePaths: string[];
  bookmarks: string[];
}

export interface IDownloadInfo {
  url: string;
  path: string;
  format: string;
}

const dialog = remote.require("electron").dialog;

export const App = () => {
  const [newUrl, setNewUrl] = React.useState<string>("");
  const updateUrl = (e:React.ChangeEvent<HTMLInputElement>) => {setNewUrl(e.currentTarget.value);}

  const [downloads, setDownloads] = React.useState<IDownloadInfo[]>([]);
  const startDownload = (format:string) => () => {
    if(!newUrl) {return;}
    setDownloads(oldDownloads => [
      ...oldDownloads,
      {
        url: newUrl,
        path: format === "mp4" ? videoPath: audioPath,
        format
      }
    ]);
    setNewUrl("");
  }

  const startBothFormatDownload = () => {
    startDownload("mp4")();
    startDownload("mp3")();
  }

  const [videoPath, setVideoPath] = React.useState<string>(localStorage.getItem("currentVideoDirectory") || "C:/Movies");
  const [audioPath, setAudioPath] = React.useState<string>(localStorage.getItem("currentAudioDirectory") || "C:/Music");
  const chooseDirectory = (setPath:((path:string) => void), name:string) => (e:SyntheticEvent<any>) => {
    e.preventDefault();
    dialog.showOpenDialog({properties: ['openDirectory']}).then((results:IOpenFileResults) => {
      console.log(results);
      if(!results.canceled && results.filePaths.length > 0) {
        setPath(results.filePaths[0]);
        localStorage.setItem(name, results.filePaths[0]);
      }
    });
  }

  return <>
    <h1><FontAwesomeIcon icon={faYoutube} /> Youtube Downloader</h1>

    <div id="form">
      <input id="url-input" placeholder="Video URL" value={newUrl} onChange={updateUrl} />
      <button type="submit" onClick={startDownload("mp4")}><FontAwesomeIcon icon={faVideo} /> Download Video</button>
      <button type="submit" onClick={startDownload("mp3")}><FontAwesomeIcon icon={faVolumeUp} /> Download MP3</button>
      <button type="submit" onClick={startBothFormatDownload}><FontAwesomeIcon icon={faDownload} /> Download both</button>
    </div>

    <ul id="download-list">
      <li className="header"><h2><FontAwesomeIcon icon={faCog} /> Settings</h2></li>
      <li>
        <button onClick={chooseDirectory(setVideoPath, "currentVideoDirectory")}>
          <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon={faFolder} />
            <FontAwesomeIcon icon={faVideo} inverse transform="shrink-6" />
          </span>
          Save video in...
        </button>
        {videoPath}
      </li>
      <li>
        <button onClick={chooseDirectory(setAudioPath, "currentAudioDirectory")}>
        <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon={faFolder} />
            <FontAwesomeIcon icon={faVolumeUp} inverse transform="shrink-6" />
          </span>
          Save audio in...
        </button>
        {audioPath}
      </li>
      <li className="header"><h2><FontAwesomeIcon icon={faDownload} /> Downloads</h2></li>
      {downloads.map(download=> <DownloadListItem key={download.url} info={download}/>)}
    </ul>
  </>;
}
