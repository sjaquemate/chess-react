import * as tf from '@tensorflow/tfjs-core';

export const displayTensorToCanvasElement = (image: tf.Tensor3D, canvasElement: HTMLCanvasElement) => 
  tf.browser.toPixels(image, canvasElement)

export const getTensorFromImageElement = (imageElement: HTMLImageElement) =>
  tf.browser.fromPixels(imageElement, 3) as tf.Tensor3D 

export const rgbToGrayScale = (image: tf.Tensor3D) => {
  const rgb_weights = [0.2989, 0.5870, 0.1140]
  let tmp = tf.cast(image, "float32")
  tmp = tf.mul(tmp, rgb_weights)
  const grayImage = tf.sum(tmp, -1) as tf.Tensor2D
  return grayImage
}

export const selectRegion = (image: tf.Tensor2D, x1: number, y1: number, width: number, height: number) => {
  return tf.slice(image, [x1, y1], [width, height])
}

export const convertToNormalizedImage = (image: tf.Tensor2D) => {
  const max_val = tf.max(image)
  const min_val = tf.min(image)
  
  let tmp = tf.sub(image, min_val)
  tmp = tf.div(tmp, tf.add(min_val, max_val) )
  tmp = tf.mul(tmp, 255) 
  tmp = tf.cast(tmp, "int32")
  tmp = tf.expandDims(tmp, -1)
  const normalized = tmp as tf.Tensor3D
  return normalized
}
