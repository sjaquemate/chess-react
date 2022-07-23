import * as tf from '@tensorflow/tfjs-core';
import { useEffect, useRef, useState } from 'react';
import { DisplayOptionSelect } from './components/DisplayOptionSelect';
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
  const [processConfirugation, setProcessConfirugation] = useState(defaultProcessConfiguration)
  const [processedOutput, setProcessedOutput] = useState<ProcessedOutput>()

  const [displayOptionFn, setDisplayOptionFn] = useState<DisplayOptionFn>() 
  const [msCounter, setMsCounter] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const imageElement = inputImageRef.current
      if (!imageElement) return

      const start = performance.now()
      setProcessedOutput(processImage(imageElement, processConfirugation))
      const end = performance.now()
      setMsCounter(end-start)

    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvasElement = outputCanvasRef.current
    if (!canvasElement) return

    if (!processedOutput) return
    if (!displayOptionFn) return  
    console.log(displayOptionFn)

    const tensor = displayOptionFn(processedOutput)

    const normalizedTensor = convertToNormalizedImage(tensor)
    displayTensorToCanvasElement(normalizedTensor, canvasElement)

  }, [processedOutput, displayOptionFn])



  return (
    <div className="bg-blue-100 w-1/3 h-screen">
      <DisplayOptionSelect setDisplayOptionFn={setDisplayOptionFn} />
      <div> {msCounter} </div>
      <img
        src={"images/chessboard_4.png"}
        ref={inputImageRef}
      >
      </img>
      <canvas
        ref={outputCanvasRef}
      >
      </canvas>
    </div>
  );
}

export default App;
