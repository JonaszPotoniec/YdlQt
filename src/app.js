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
  BoxView
} from "@nodegui/react-nodegui";
import { 
  QPlainTextEditSignals, 
  QFileDialog, 
  FileMode, 
  QMessageBox, 
  Direction,
  QIcon,
  QSystemTrayIcon
} from "@nodegui/nodegui";
import React, {useState, useRef, useEffect} from "react";
import * as  YoutubeDlWrap from "youtube-dl-wrap";
const youtubeDlWrap = new YoutubeDlWrap("youtube-dl");
import QueueItem from "./components/queueItem.js";
import icon from "../assets/icon.png";

const minSize = { width: 500, height: 400 };
const winIcon = new QIcon(icon);
const tray = new QSystemTrayIcon();
tray.setIcon(winIcon);
tray.show();

const App = () => {
  const [path, setPath] = useState(".");
  const [jobs, setJobs] = useState([]);
  const [maxResolution, setMaxResolution] = useState("");
  const urlEl = useRef(null);
  const pathEl = useRef(null);
  const qualityEl = useRef(null);
  const audioOnlyEl = useRef(null);
  const videoFormatEl = useRef(null);
  const audioFormatEl = useRef(null);
  let busyFlag = 0;
  
  const getQuality = () => {
    if(qualityEl.current.currentText() == "best") return "bestvideo+bestaudio";
    return `bestvideo[height<=${qualityEl.current.currentText()}]+bestaudio/best[height<=${qualityEl.current.currentText()}]`
  }
  
  const downloadedVideoEvent = () => {
    busyFlag--; 
    if(!busyFlag)
      tray.showMessage("youtube-dl", "All videos have been downloaded", winIcon, 3000);
  }
  
  const buttonHandler = {
    clicked: () => {
      busyFlag++;
      const parameters = [
        urlEl.current.toPlainText(),
        "-f", getQuality(),
        "-o", pathEl.current.toPlainText()+"/%(title)s.%(ext)s",
        audioOnlyEl.current.isChecked() ? "-x" : "",
        audioOnlyEl.current.isChecked() ? "--audio-format" : "", audioOnlyEl.current.isChecked() ? audioFormatEl.current.currentText() : "",
        videoFormatEl.current.currentText() !== "default" ? "--recode-video" : "",  videoFormatEl.current.currentText() !== "default" ? videoFormatEl.current.currentText() : ""];
      setJobs([...jobs, <QueueItem parameters={parameters} url={urlEl.current.toPlainText()} onDownloaded={() => downloadedVideoEvent()} key={Date.now() + "" + Math.random()}/>]);
    }
  };
  
  const pathButtonHandler = {
    clicked: () => {
      const fileDialog = new QFileDialog();
      fileDialog.setFileMode(FileMode.Directory);
      fileDialog.exec();

      const selectedFiles = fileDialog.selectedFiles();
      setPath(selectedFiles[0]);
    }
  };
    
  return (
    <Window
      windowIcon={winIcon}
      windowTitle="YdQ"
      minSize={minSize}
      styleSheet={styleSheet}
    >      
      <BoxView style={containerStyle} direction={Direction.LeftToRight}>   
        <View style={containerStyle}>
          <View style={containerStyle}>
              <View style={containerStyle}>
                <Text>Path:</Text>
                <Button on={pathButtonHandler} text={"Select path"} />
                <PlainTextEdit style={PlainTextEditStyle} ref={pathEl} text={path} ></PlainTextEdit>
              </View>
              <View style={containerStyle}>
                <Text>URL:</Text>
                <PlainTextEdit style={PlainTextEditStyle} ref={urlEl} ></PlainTextEdit>
              </View>
              <View style={containerStyle}>
                <Text>Max resolution:</Text>
                <ComboBox items={["best", "144", "240", "360", "480", "720", "1080", "1440", "2160"].map(e => ({text: e}))} ref={qualityEl} />
                <Text>Video format:</Text>
                <ComboBox items={["default", "mp4", "flv", "ogg", "webm", "mkv", "avi"].map(e => ({text: e}))} ref={videoFormatEl} />
                <CheckBox text={"audio only"} ref={audioOnlyEl}/>
                <Text>Audio format:</Text>
                <ComboBox items={["best", "aac", "flac", "mp3", "m4a", "opus", "vorbis", "wav"].map(e => ({text: e}))} ref={audioFormatEl} />
              </View>
              <View style={containerStyle}>
                <Button on={buttonHandler} text={"Download"} />
              </View>  
          </View>    
        </View>     
        <View style={"width: 200px"}>
          <Text>Queue:</Text>
          {jobs} 
        </View>    
      </BoxView>     
    </Window>
  );
}

          //<ComboBox items={["best", "144p", "240p", "360p", "480p", "720p", "1080", "4k", "8k"]} />
const containerStyle = `
  padding: 5px;
`;

const styleSheet = `
  #welcome-text {
    font-size: 24px;
    padding-top: 20px;
    qproperty-alignment: 'AlignHCenter';
    font-family: 'sans-serif';
  }

  #step-1, #step-2 {
    font-size: 18px;
    padding-top: 10px;
    padding-horizontal: 20px;
  }
`;

const PlainTextEditStyle = `
  font-size: 12px;
  height: 28px;
`;


export default hot(App);
