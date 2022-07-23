import { MenuItem, Select } from "@mui/material";
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
export const WebcamCapture = ({ webcamRef }: Props) => {
  const [deviceId, setDeviceId] = useState<string>()
  const [devices, setDevices] = useState<any[]>([]);

  const handleDevices = React.useCallback(
    (mediaDevices: any) =>
      setDevices(mediaDevices.filter(({ kind }: any) => kind === "videoinput")),
    [setDevices]
  )
  useEffect(
    () => {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
    },
    [handleDevices]
  )

  return (
    <>
      <div>
        {JSON.stringify(devices)}
      </div>
      <Select
        value={deviceId}
        label="Age"
        onChange={(e) => setDeviceId(e.target.value)}
      >
        {devices.map( device => (
          <MenuItem value={device.deviceId}>{device.label}</MenuItem>
        ))}
        
      </Select>
      <Webcam
        audio={false}
        // height={720}
        // width={1280}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={deviceId ? {deviceId: deviceId, ...videoConstraints} : videoConstraints}
        mirrored
      />
      {/* <button onClick={capture}>Capture photo</button> */}
    </>
  )
}