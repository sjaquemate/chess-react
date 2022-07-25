import * as tf from '@tensorflow/tfjs-core';
import EasyWebWorker from 'easy-web-worker';
import { useEffect, useRef, useState } from 'react';
import { DisplayOptionSelect } from './components/DisplayOptionSelect';
import { WebcamCapture } from './components/WebcamCapture';
import { calculateFourierMagnitude, calculateLogarithmicMagnitude as logMagnitude } from './imageprocessing/fourier';
import { convertToNormalizedImage, displayTensorToCanvasElement, getTensorFromImageElement, rgbToGrayScale as rgbToGray } from './imageprocessing/images';
import { perspectiveTransform } from './imageprocessing/perspective';
interface ProcessConfiguration {
  imgSize: 64 | 128 | 256
}

export interface ProcessedOutput {
  imgGray: tf.Tensor2D
  imgFourierLogMagnitude: tf.Tensor2D
  warped: tf.Tensor2D
}

const processImage = (imageElement: HTMLImageElement,
  processConfirugation: ProcessConfiguration): ProcessedOutput => {
  const imgRGB = getTensorFromImageElement(imageElement)
  const imgGray = rgbToGray(imgRGB)
  const imgFourierMagnitude = calculateFourierMagnitude(imgGray)
  const imgFourierLogMagnitude = logMagnitude(imgFourierMagnitude)
  const warped = perspectiveTransform(imgGray)

  return {
    imgGray: imgGray,
    imgFourierLogMagnitude: imgFourierLogMagnitude,
    warped: warped,
  }
}

const defaultProcessConfiguration: ProcessConfiguration = {
  imgSize: 128
}

export type DisplayOptionFn = (output: ProcessedOutput) => tf.Tensor2D

const App = () => {

  const inputImageRef = useRef<HTMLImageElement>(null)
  const outputCanvasRef = useRef<HTMLCanvasElement>(null)
  const [previewImage, setPreviewImage] = useState<string>()
  const [processConfirugation, setProcessConfirugation] = useState(defaultProcessConfiguration)
  const [processedOutput, setProcessedOutput] = useState<ProcessedOutput>()

  const [displayOptionFn, setDisplayOptionFn] = useState<DisplayOptionFn>()
  const [msCounter, setMsCounter] = useState(0)

  const backgroundWorker = new EasyWebWorker<number, string>((easyWorker) => {
    easyWorker.onMessage((message) => {
      const { payload } = message;

      message.resolve(`this is  a message from the worker: ${payload}`);
    });
  });

  // useEffect(() => {

  //   const interval = setInterval(() => {
  //     const messageResult = backgroundWorker.override(5)
  //     messageResult.then(m => {
  //       console.log(m)
  //     })

  //     // const imageElement = inputImageRef.current
  //     // if (!imageElement) return
  //     // if(imageElement.width === 0 || imageElement.height === 0) return 

  //     // const start = performance.now()
  //     // setProcessedOutput(processImage(imageElement, processConfirugation))
  //     // const end = performance.now()
  //     // setMsCounter(end - start)

  //   }, 100);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const canvasElement = outputCanvasRef.current
    if (!canvasElement) return

    if (!processedOutput) return
    if (!displayOptionFn) return

    const tensor = displayOptionFn(processedOutput)

    const normalizedTensor = convertToNormalizedImage(tensor)
    displayTensorToCanvasElement(normalizedTensor, canvasElement)

  }, [processedOutput, displayOptionFn])

  return (
    <div className="bg-white flex flex-col">

      <div className="">
        <WebcamCapture setPreviewImage={setPreviewImage} />
      </div>

      <DisplayOptionSelect setDisplayOptionFn={setDisplayOptionFn} />
      <div className="font-bold"> {msCounter} </div>

      <div className="">
        <img
          src={process.env.PUBLIC_URL + "/images/chessboard.png"}
          ref={inputImageRef}
        >
        </img>
      </div>
      <div className="absolute w-1/2 h-1/2">

        <canvas
          ref={outputCanvasRef}
        >
        </canvas>
      </div>
    </div>
  );
}

export default App;
