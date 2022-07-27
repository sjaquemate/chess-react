import { MenuItem, Select } from "@mui/material";
import React, { useCallback } from "react";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import { useResizeDetector } from "react-resize-detector";

interface Props {
  setPreviewImage: (image: string) => void
}
export const WebcamCapture = ({ setPreviewImage }: Props) => {
  // const [deviceId, setDeviceId] = useState<string>()
  const [devices, setDevices] = useState<any[]>([]);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")

  const webcamRef = useRef<any>()

  const capture = React.useCallback(
    () => {
      const webcam = webcamRef.current
      if(!webcam) return 
      const image: string = webcam.getScreenshot()
      setPreviewImage(image)
    },
    [webcamRef]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      capture()
    }, 100)
    return () => clearInterval(interval)
  }, [])

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

  const videoConstraints: MediaTrackConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode,
  }

  const { width, height, ref } = useResizeDetector();
  type CameraPadding = {
    top: number,
    left: number,
    bottom: number,
    right: number,
  }
  const [hi, setHi] = useState("")
  useEffect(() => {
    const left = Math.floor(width ? 30 : 0)
    console.log(left)
    setHi(`absolute top-0 left-0 w-full h-full 
    border-l-[${left}px] border-black border-opacity-50`)

  }, [width])

  return (
    <>
      {/* <div>
        {JSON.stringify(devices)}
      </div> */}
      <div className="relative" ref={ref}>
        <Webcam
          audio={false}
          // height={720}
          // width={1280}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          mirrored
        />
        {/* <div className={hi}>  */}

        {/* </div> */}
        {/* <button onClick={capture}>Capture photo</button> */}

        <div className="">
          <Select
            value={facingMode}
            label="facing mode"
            onChange={(e) => setFacingMode(e.target.value as "user" | "environment")}
          >
            <MenuItem value={"user"}>user</MenuItem>
            <MenuItem value={"environment"}>env</MenuItem>
          </Select>
        </div>
      </div>
    </>
  )
}