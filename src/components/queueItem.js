import { 
  Text, 
  Window, 
  hot, 
  View, 
  PlainTextEdit, 
  Button, 
  ProgressBar, 
  FileDialog, 
  ComboBox, 
  CheckBox, 
  GridView, 
  GridRow, 
  GridColumn,
  BoxView
} from "@nodegui/react-nodegui";
import { 
  QPlainTextEditSignals, 
  QFileDialog, 
  FileMode, 
  QMessageBox, 
  Direction,
  QIcon
} from "@nodegui/nodegui";
import React, {useState, useRef, useEffect} from "react";
import * as  YoutubeDlWrap from "youtube-dl-wrap";
const youtubeDlWrap = new YoutubeDlWrap("youtube-dl");

const QueueItem = ({parameters, url, onDownloaded}) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [title, setTitle] = useState("fetching name...");
  
  useEffect(() => {
    console.log(parameters);
    console.log(url);
  
    
    youtubeDlWrap.getVideoInfo(url).then((e) => {
      setTitle(e.fulltitle);
    });
    
    let youtubeDlEmitter_Downloader = youtubeDlWrap.exec(parameters.filter((e) => {return e.length}))
    .on("progress", (progress) => 
      setDownloadProgress(progress.percent))
    .on("error", (error) => {
      console.error(error);
    })
    .on("close", () => {
      onDownloaded();
    }); 
  }, []);
    
  return ( 
    <View style={containerStyle}>   
      <Text style={"flex: 5; padding-right: 5px;"}>{title}</Text>
      <Text style={"flex: 1"}>{downloadProgress+"%"}</Text>
    </View>  
  );
}
const containerStyle = `
  flex-direction: "row";
  width: 200px;
  padding: 2px;
`;

export default QueueItem;
 
