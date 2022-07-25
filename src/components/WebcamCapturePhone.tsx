import { useEffect, useRef, useState } from "react"
import { Camera, CameraType } from "react-camera-pro"

export const zero = 0

interface Props {
  setPreviewImage: (image: string) => void
}
export const WebcamCapture = ({setPreviewImage}: Props) => {

  const [numberOfCameras, setNumberOfCameras] = useState(0)
  const cameraRef = useRef<CameraType>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  useEffect( () => {
    // cameraRef.current?.takePhoto
    const interval = setInterval(() => {
      const webcam = cameraRef.current
      if (!webcam) return
      try {
        const image = webcam.takePhoto()
        // setPreviewImage(image)
        setIsCameraActive(true)
        console.log('taking photo')
      }
      catch(error) { 
        setIsCameraActive(false)
        console.error(error)
      }
    }, 100)
    return () => clearInterval(interval);
  }, [])

  return (
  <div>
    <button onClick={cameraRef.current?.switchCamera}>
      switch camera
    </button>
    <Camera
        ref={cameraRef}
        aspectRatio={"cover"}
        numberOfCamerasCallback={setNumberOfCameras}
        errorMessages={{
          noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
          permissionDenied: 'Permission denied. Please refresh and give camera permission.',
          switchCamera:
            'It is not possible to switch camera to different one because there is only one video device accessible.',
          canvas: 'Canvas is not supported.',
        }}
        facingMode={"user"}
      />
  </div>
  )
}