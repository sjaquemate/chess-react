// import EasyWebWorker from "easy-web-worker"
// import * as tf from '@tensorflow/tfjs-core';
// import { resizeImage, rgbToGray, selectCenteredSquare } from "./images";
// import { calculateFourierMagnitude, logMagnitude, selectMaskedMagnitudeCenter } from "./fourier";
// import { calculatePerspectiveMatrixCoefficientsFromPoints, perspectiveTransformFromCoefficients } from "./perspective";

export const zero = 0
// export const processImage = (imgRGB: tf.Tensor3D,
//   processConfirugation: ProcessConfiguration): ProcessedOutput => {

//   const imgGray = rgbToGray(imgRGB)
//   let imgSquare = selectCenteredSquare(imgGray)
//   imgSquare = resizeImage(imgSquare, [128, 128])

//   const imgFourierMagnitude = calculateFourierMagnitude(imgSquare)
//   const imgFourierLogMagnitude = logMagnitude(imgFourierMagnitude)
  
//   const magnitudeCenter = selectMaskedMagnitudeCenter(imgFourierMagnitude)
  
//   // const coefficients = calculatePerspectiveMatrixCoefficientsFromPoints(
//   //   [
//   //     {x: 4, y: 4},
//   //     {x: -4, y: 4},
//   //     {x: -4, y: -4},
//   //     {x: 4, y: -4},
//   //   ],
//   //   [
//   //     {x: 3, y: 3},
//   //     {x: -6, y: 5},
//   //     {x: -3, y: -4},
//   //     {x: 9, y: -4},
//   //   ],
//   // )
//   // const warped = perspectiveTransformFromCoefficients(imgSquare, coefficients)

//   return {
//     imgGray: imgSquare,
//     imgFourierLogMagnitude: imgFourierLogMagnitude,
//     imgMagnitudeCenter: magnitudeCenter,
//     warped: imgSquare,
//   }
// }

// export const backgroundWorker = new EasyWebWorker<tf.Tensor3D, string>((easyWorker) => {
//   easyWorker.onMessage((message) => {
//     const imgRGB = message.payload

//     const start = performance.now()
//     const output = processImage(imgRGB, defaultProcessConfiguration)
//     const end = performance.now()
//     // setMsCounter(end - start)

//     message.resolve(`this is  a message from the worker: ${imgRGB.shape}`);
//   });
// });
