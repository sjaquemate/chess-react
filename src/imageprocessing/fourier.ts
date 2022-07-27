import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-core/dist/public/chained_ops/register_all_chained_ops';
import { createCircularMask, selectRegion } from './images';

const getQuadrant = (image: tf.Tensor2D, quadrant: "q1"|"q2"|"q3"|"q4") => {
  const w = image.shape[0]
  const h = image.shape[1]
  const w1 = Math.floor(w/2)
  const w2 = w - w1 
  const h1 = Math.floor(h/2)
  const h2 = h - h1 
  switch(quadrant) {
    case "q1": return selectRegion(image, 0, 0, w1, h1)
    case "q2": return selectRegion(image, w1, 0, w2, h1)
    case "q3": return selectRegion(image, 0, h1, w1, h2)
    case "q4": return selectRegion(image, w1, h1, w2, h2)
  }
}
const shiftToCenter = (image: tf.Tensor2D) => {
  const q1 = getQuadrant(image, "q1")
  const q2 = getQuadrant(image, "q2")
  const q3 = getQuadrant(image, "q3")
  const q4 = getQuadrant(image, "q4")
  
  const top = q4.concat(q2, 1)
  const bottom = q3.concat(q1, 1)
  const shifted = top.concat(bottom, 0)
  return shifted 
}

export const calculateFourierMagnitude = (image: tf.Tensor2D) => {

  const windowX = tf.signal.hammingWindow(image.shape[0])
  const windowY = tf.signal.hammingWindow(image.shape[1])  
  const window = tf.outerProduct(windowX, windowY)

  const real = tf.mul(image, window)

  const complex = tf.complex(real, tf.zerosLike(real))

  const fftHorizontal = tf.fft(complex)
  const fft2D = tf.fft(fftHorizontal.transpose()).transpose()
  const magnitude = fft2D.abs() as tf.Tensor2D

  const shiftedMagnitude = shiftToCenter(magnitude) 
  return shiftedMagnitude
}

export const logMagnitude = (magnitude: tf.Tensor2D) => (
  magnitude.add(tf.onesLike(magnitude)).log() as tf.Tensor2D
)

export const findArgMax = (image: tf.Tensor2D) => {
  const w = image.shape[0]
  const h = image.shape[1]
  const flat = image.reshape([ w*h ])
  const flattenedIndexMax = flat.argMax()
  const i = tf.floor(flattenedIndexMax.div(h)).asScalar()
  const j = tf.mod(flattenedIndexMax, h).asScalar()
  // console.log('i, j')
  // i.print()
  // j.print()
  return [i, j]
}
export const findFourierPeak = async(magnitude: tf.Tensor2D) => {
  const [w, h] = magnitude.shape
  const cx = Math.floor(w/2)
  const cy = Math.floor(h/2) 
  const [i, j] = findArgMax(getQuadrant(magnitude, "q1"))
  // const ii = (await i.asScalar().data()).at(0)

  // return ii 
  // findArgMax(getQuadrant(magnitude, "q2"))
  // findArgMax(getQuadrant(magnitude, "q3"))
  // findArgMax(getQuadrant(magnitude, "q4"))
  
}
export const selectMaskedMagnitudeCenter = (magnitude: tf.Tensor2D) => {
  const [w, h] = magnitude.shape
  const cx = Math.floor(w/2)
  const cy = Math.floor(h/2)
  const maxRadius = 20
  const center = selectRegion(
    magnitude, cx-maxRadius, cy-maxRadius, 2*maxRadius, 2*maxRadius)
  
  const mask = createCircularMask(center.shape, 6, 20)
  const maskedCenter = center.mul(mask)
  return maskedCenter as tf.Tensor2D 
}




