import React, { SyntheticEvent } from 'react';
import './App.global.css';
import {remote} from "electron";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload, faFolder, faTimes} from "@fortawesome/free-solid-svg-icons";
import {faYoutube} from "@fortawesome/free-brands-svg-icons";
import { download, IVideoInfo } from './downloader';

interface IOpenFileResults {
  canceled: boolean;
  filePaths: string[];
  bookmarks: string[];
}

const dialog = remote.require("electron").dialog;

const DownloadListItem = (props:{url:string, path:string}) => {
  const [path] = React.useState<string>(props.path);
  const [title, setTitle] = React.useState<string>("");
  const [totalBytes, setTotalBytes] = React.useState(0);
  const [percentDone, setPercentDone] = React.useState(0);
  const [complete, setComplete] = React.useState(false);

  React.useEffect(() => {
    download({
      url: props.url,
      onComplete: () => {
        console.log("Download complete");
        setTimeout(() => setComplete(true), 5000);
      },
      onGetTitle: setTitle,
      onGetSize: setTotalBytes,
      onProgress: setPercentDone,
      path,
    });
  }, [props.url]);

  return <>
    {!complete && <li key={props.url}>
      <div className="progress-bar" style={{width: `${percentDone * 100}%`}} />
      Downloading <em>{title || props.url} ({totalBytes} bytes)</em>
    </li>}
  </>;
}

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

  const [path, setPath] = React.useState<string>(__dirname);
  const chooseDirectory = (e:SyntheticEvent<any>) => {
    e.preventDefault();
    dialog.showOpenDialog({properties: ['openDirectory']}).then((results:IOpenFileResults) => {
      console.log(results);
      if(!results.canceled && results.filePaths.length > 0) {
        setPath(results.filePaths[0]);
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
