import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faDownload, faFolder } from "@fortawesome/free-solid-svg-icons";
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

const dialog = remote.require("electron").dialog;

export const App = () => {
  const [newUrl, setNewUrl] = React.useState<string>("");
  const updateUrl = (e:React.ChangeEvent<HTMLInputElement>) => {setNewUrl(e.currentTarget.value);}

  const [urls, setUrls] = React.useState<string[]>([]);
  const addUrl = (e:SyntheticEvent<any>) => {
    e.preventDefault();
    if(!newUrl) {return;}
    setUrls(oldUrls => [...oldUrls, newUrl]);
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

    <form onSubmit={addUrl}>
      <input id="url-input" placeholder="Video URL" value={newUrl} onChange={updateUrl} />
      <button type="submit"><FontAwesomeIcon icon={faDownload} /></button>
    </form>

    <ul id="download-list">
      <li>
        <button onClick={chooseDirectory}><FontAwesomeIcon icon={faFolder} /> Save in...</button>
        {path}
      </li>
      {urls.map(url => <DownloadListItem key={url} url={url} path={path}/>)}
    </ul>
  </>;
}
