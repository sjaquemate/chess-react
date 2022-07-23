import * as tf from '@tensorflow/tfjs-core';

export const perspectiveTransform = (image: tf.Tensor2D) => {
  const a0 = 1
  const a1 = 0.1
  const a2 = 0 
  const b0 = 0 
  const b1 = 1 
  const b2 = 0.1 
  const c0 = 0.001
  const c1 = 0 
  const transforms = tf.tensor2d([a0, a1, a2, b0, b1, b2, c0, c1], [1, 8])
  const h = image.shape[0]
  const w = image.shape[1]
  const imageRank4 = tf.reshape(image, [1, h, w, 1]) as tf.Tensor4D
  let warped = tf.image.transform(imageRank4, transforms, "bilinear")
  warped = tf.sum(warped, 0)
  const warpedResized = tf.sum(warped, -1) as tf.Tensor2D
  return warpedResized
}