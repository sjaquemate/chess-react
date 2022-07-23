import React from "react";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  }
  
  interface Props {
    webcamRef: any | null
  }
  export const WebcamCapture = ({webcamRef}: Props) => {
    const [deviceId, setDeviceId] = useState({});
    const [devices, setDevices] = useState([]);
  
    const handleDevices = React.useCallback(
      (mediaDevices: any) =>
        setDevices(mediaDevices.filter(({ kind }: any) => kind === "videoinput")),
      [setDevices]
    );
    useEffect( () => {
      console.log('devices', devices)
      // setDeviceId((devices[0] as any).deviceId)
    }, [devices])
  
    useEffect(
      () => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
      },
      [handleDevices]
    )
    return (
      <>
        <Webcam
          audio={false}
          // height={720}
          // width={1280}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints} //deviceId ? {deviceId: deviceId, ...videoConstraints} :
          mirrored
  
        />
        {/* <button onClick={capture}>Capture photo</button> */}
      </>
    );
  };