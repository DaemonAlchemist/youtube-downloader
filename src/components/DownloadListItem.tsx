import React from 'react';
import { download } from '../lib/downloader';

export const DownloadListItem = (props:{url:string, path:string}) => {
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
  