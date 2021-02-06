import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faFolder, faVideo, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
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
    setDownloads(oldDownloads => [...oldDownloads, {url: newUrl, path, format}]);
    setNewUrl("");
  }

  const [path, setPath] = React.useState<string>(localStorage.getItem("currentDirectory") || "C:/Movies");
  const chooseDirectory = (e:SyntheticEvent<any>) => {
    e.preventDefault();
    dialog.showOpenDialog({properties: ['openDirectory']}).then((results:IOpenFileResults) => {
      console.log(results);
      if(!results.canceled && results.filePaths.length > 0) {
        setPath(results.filePaths[0]);
        localStorage.setItem("currentDirectory", results.filePaths[0]);
      }
    });
  }

  return <>
    <h1><FontAwesomeIcon icon={faYoutube} /> Youtube Downloader</h1>

    <div id="form">
      <input id="url-input" placeholder="Video URL" value={newUrl} onChange={updateUrl} />
      <button type="submit" onClick={startDownload("mp4")}><FontAwesomeIcon icon={faVideo} /> Download Video</button>
      <button type="submit" onClick={startDownload("mp3")}><FontAwesomeIcon icon={faVolumeUp} /> Download MP3</button>
    </div>

    <ul id="download-list">
      <li>
        <button onClick={chooseDirectory}><FontAwesomeIcon icon={faFolder} /> Save in...</button>
        {path}
      </li>
      {downloads.map(download=> <DownloadListItem key={download.url} info={download}/>)}
    </ul>
  </>;
}
