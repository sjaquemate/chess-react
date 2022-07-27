import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-core/dist/public/chained_ops/register_all_chained_ops';

export const displayTensorToCanvasElement = (image: tf.Tensor3D, canvasElement: HTMLCanvasElement) => 
  tf.browser.toPixels(image, canvasElement)

export const getTensorFromImageElement = (imageElement: HTMLImageElement) =>
  tf.browser.fromPixels(imageElement, 3) as tf.Tensor3D 

export const rgbToGray = (image: tf.Tensor3D) => {
  const rgbWeights = [0.2989, 0.5870, 0.1140]
  const gray = image.cast("float32").mul(rgbWeights).sum(-1) as tf.Tensor2D
  return gray
}

export const selectRegion = (image: tf.Tensor2D, x1: number, y1: number, width: number, height: number) => {
  return tf.slice(image, [x1, y1], [width, height])
}

export const resizeImage = (image: tf.Tensor2D, newShape: [number, number]) => {
  const resized = (
    tf.image.resizeBilinear(
      image.reshape([...image.shape, 1]) as tf.Tensor3D,
      newShape
    ).reshape(newShape)
  )
  return resized as tf.Tensor2D
}
export const selectCenteredSquare = (image: tf.Tensor2D) => {
  const w = image.shape[0]
  const h = image.shape[1]
  const s = Math.min(w, h)
  const x1 = Math.floor((w-s)/2)
  const y1 = Math.floor((h-s)/2)
  const centeredSquare = selectRegion(image, x1, y1, s, s)
  return centeredSquare
}

export const convertToNormalizedImage = (image: tf.Tensor2D) => {
  const maxVal = image.max()
  const minVal = image.min()
  const normalized = image.sub(minVal).div(maxVal.sub(minVal))
  const img255 = normalized.mul(255).cast("int32").expandDims(-1) as tf.Tensor3D 
  return img255
}

export const createCircularMask = (shape: [number, number], 
  minRadius: number, maxRadius: number) => { 
  const [w, h] = shape
  const xspace = tf.linspace(0, w-1, w).sub(Math.floor(w/2))
  const yspace = tf.linspace(0, h-1, h).sub(Math.floor(h/2))
  const X = xspace.reshape([1, w]).tile([w, 1])
  const Y = yspace.reshape([w, 1]).tile([1, w])
  const R = (X.square().add(Y.square())).sqrt()
  const condition = R.greater(minRadius).logicalAnd(R.less(maxRadius))
  const mask = tf.where(condition, 1, 0)
  return mask as tf.Tensor2D
}
