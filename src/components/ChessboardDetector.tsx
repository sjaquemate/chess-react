import { useEffect, useRef, useState } from "react"
import { convertToNormalizedImage, createCircularMask, displayTensorToCanvasElement, getTensorFromImageElement, resizeImage, rgbToGray, selectCenteredSquare } from "../imageprocessing/images"
import { DisplayOptionSelect } from "./DisplayOptionSelect"
import * as tf from '@tensorflow/tfjs-core';
import { calculateFourierMagnitude, findFourierPeak, logMagnitude, selectMaskedMagnitudeCenter } from "../imageprocessing/fourier";
import { createQuadrantKernel } from "../imageprocessing/corners";


interface ProcessConfiguration {
  imgSize: 64 | 128 | 256
}

export interface ProcessedOutput {
  imgGray: tf.Tensor2D
  imgFourierLogMagnitude: tf.Tensor2D
  imgMagnitudeCenter: tf.Tensor2D
}

export const defaultProcessConfiguration: ProcessConfiguration = {
  imgSize: 128
}

export type DisplayOptionFn = (output: ProcessedOutput) => tf.Tensor2D


const processImage = (imgRGB: tf.Tensor3D,
  processConfirugation: ProcessConfiguration) => {

  const imgGray = rgbToGray(imgRGB)
  let imgSquare = selectCenteredSquare(imgGray)
  imgSquare = resizeImage(imgSquare, [128, 128])

  const imgFourierMagnitude = calculateFourierMagnitude(imgSquare)
  const imgFourierLogMagnitude = logMagnitude(imgFourierMagnitude)
  
  const magnitudeCenter = selectMaskedMagnitudeCenter(imgFourierMagnitude)
  
  // findFourierPeak(magnitudeCenter)
  const q1 = createQuadrantKernel(7, 1, "q1")
  const q2 = createQuadrantKernel(7, 1, "q2")
  const q3 = createQuadrantKernel(7, 1, "q3")
  const q4 = createQuadrantKernel(7, 1, "q4")

  const meanConvolve = (image: tf.Tensor2D, kernel: tf.Tensor2D) => {
    return tf.conv2d(
      image.reshape([1, ...image.shape, 1]) as tf.Tensor4D, 
      kernel.reshape([...kernel.shape, 1, 1]) as tf.Tensor4D,
      1, 
      "same").reshape(image.shape) as tf.Tensor2D
  }
  const dilateImage = (image: tf.Tensor2D, kernel: tf.Tensor2D, numIterations: number) => {
    return tf.dilation2d(
      image.reshape([...image.shape, 1]) as tf.Tensor3D, 
      kernel.reshape([...kernel.shape, 1]) as tf.Tensor3D, 
      1,
      "same",
      numIterations,
    ).reshape(image.shape) as tf.Tensor2D
  }

  const mu1 = meanConvolve(imgSquare, q1.div(10000))
  const mu2 = meanConvolve(imgSquare, q2.div(10000))
  const mu3 = meanConvolve(imgSquare, q3.div(10000))
  const mu4 = meanConvolve(imgSquare, q4.div(10000))
  const corners = (
    mu1.mul(mu3).mul(2)
    .add( mu2.mul(mu4).mul(2) )
    .sub( mu1.mul(mu2) )
    .sub( mu2.mul(mu3) )
    .sub( mu3.mul(mu4) )
    .sub( mu4.mul(mu1) )
    ) as tf.Tensor2D

  const k = 5
  
  const kernel = tf.ones([5, 5]).div(100000000000000000000000000) as tf.Tensor2D // createCircularMask([k, k], -1, k/2)
  // kernel.print()
  const e = 0.000000001
  const cornersPlusNoise = corners // corners.add(tf.randomUniform(corners.shape, -e, +e)) as tf.Tensor2D
  const dilated = dilateImage(cornersPlusNoise, kernel, 1)
  // const d = 0.001
  console.log('difference')
  dilated.max().print()
  cornersPlusNoise.max().print()
  const d = 0.000000000000000001
  const condition = cornersPlusNoise.less(dilated.add(d)).greater(dilated.sub(d))
  const peaks = tf.where(condition, 1, 0) as tf.Tensor2D
  // const peaks = dilated 
  // peaks.min().print()
  // peaks.max().print()

  // const hi = magnitudeCenter.data()
  // const coefficients = calculatePerspectiveMatrixCoefficientsFromPoints(
  //   [
  //     {x: 4, y: 4},
  //     {x: -4, y: 4},
  //     {x: -4, y: -4},
  //     {x: 4, y: -4},
  //   ],
  //   [
  //     {x: 3, y: 3},
  //     {x: -6, y: 5},
  //     {x: -3, y: -4},
  //     {x: 9, y: -4},
  //   ],
  // )
  // const warped = perspectiveTransformFromCoefficients(imgSquare, coefficients)

  return {
    imgGray: dilated,
    imgFourierLogMagnitude: imgFourierLogMagnitude,
    imgMagnitudeCenter: magnitudeCenter,
  }
}

interface Props {
  previewImage?: string
  setMs: (ms: number) => void
}
export const ChessboardDetector = ({ previewImage, setMs }: Props) => {
  
  const inputImageRef = useRef<HTMLImageElement>(null)
  const outputCanvasRef = useRef<HTMLCanvasElement>(null)
  const [displayOptionFn, setDisplayOptionFn] = useState<DisplayOptionFn>()
  const [processedOutput, setProcessedOutput] = useState<ProcessedOutput>()

  useEffect(() => {

    const interval = setInterval(async() => {
      const imageElement = inputImageRef.current
      if (!imageElement) return 
      if(imageElement.width === 0 || imageElement.height === 0) return 

      const imgRGB = getTensorFromImageElement(imageElement)
      
      const start = performance.now()
      const output = processImage(imgRGB, defaultProcessConfiguration)
      const end = performance.now()
      setProcessedOutput(output)
      setMs(end-start)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

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
  <div>
          <DisplayOptionSelect setDisplayOptionFn={setDisplayOptionFn} />

    <div className="absolute invisible">
      <img
        src={process.env.PUBLIC_URL + "/images/chessboard.png"}
        // src={previewImage}
        ref={inputImageRef}
      >
      </img>
    </div>
    <div className="w-1/2 h-1/2">

      <canvas
        ref={outputCanvasRef}
      >
        hi
      </canvas>
    </div>
  </div >
  )
}
