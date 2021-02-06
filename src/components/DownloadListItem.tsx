import { faSpinner, faVideo, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { IDownloadInfo } from '../App';
import { download } from '../lib/downloader';

export const DownloadListItem = (props:{info:IDownloadInfo}) => {
    const [title, setTitle] = React.useState<string>("");
    const [totalBytes, setTotalBytes] = React.useState(0);
    const [percentDone, setPercentDone] = React.useState(0);
    const [complete, setComplete] = React.useState(false);

    const {url, path, format} = props.info;
  
    React.useEffect(() => {
      download({
        url,
        format,
        onComplete: () => {
          console.log("Download complete");
          setTimeout(() => setComplete(true), 5000);
        },
        onGetTitle: setTitle,
        onGetSize: setTotalBytes,
        onProgress: setPercentDone,
        path,
      });
    }, [url]);
  
    return <>
      {!complete && <li key={url}>
        <div className="progress-bar" style={{width: `${percentDone * 100}%`}} />
        {format === "mp4" && <FontAwesomeIcon icon={faVideo} />}
        {format === "mp3" && <FontAwesomeIcon icon={faVolumeUp} />}
        &nbsp;
        Downloading <em>{title || url} {(!title || !totalBytes) && <FontAwesomeIcon icon={faSpinner} spin/>}</em>
        {!!totalBytes && <>({totalBytes} bytes)</>}
      </li>}
    </>;
  }
  