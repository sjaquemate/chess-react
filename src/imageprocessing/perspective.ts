import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-core/dist/public/chained_ops/register_all_chained_ops';
import fixperspective from 'fix-perspective';

type ProjectionMatrixCoefficients = {
  a0: number
  a1: number
  a2: number 
  b0: number
  b1: number
  b2: number
  c0: number
  c1: number
}
type Point = {x: number, y: number}

export const perspectiveTransformFromCoefficients = (
  image: tf.Tensor2D, 
  coeficients: ProjectionMatrixCoefficients) => {
  const transforms = tf.tensor2d([
    coeficients.a0, 
    coeficients.a1, 
    coeficients.a2, 
    coeficients.b0, 
    coeficients.b1, 
    coeficients.b2, 
    coeficients.c0, 
    coeficients.c1], [1, 8])
  const w = image.shape[0]
  const h = image.shape[1]
  const imageRank4 = image.reshape([1, w, h, 1]) as tf.Tensor4D
  let warped = tf.image.transform(imageRank4, transforms, "bilinear")
  const warpedResized = warped.reshape([w, h]) as tf.Tensor2D
  return warpedResized
}

export const calculatePerspectiveMatrixCoefficientsFromPoints = (from: Point[], to: Point[]) => {
  
  const transformation = fixperspective(from, to)
  const H = transformation.H
  const coefficients: ProjectionMatrixCoefficients = {
    a0: H[0][0],
    a1: H[0][1],
    a2: H[0][2],
    b0: H[1][0],
    b1: H[1][1],
    b2: H[1][2], 
    c0: H[2][0],
    c1: H[2][1],
  }
  // {
  //   a0: 1,
  //   a1: 0.1,
  //   a2: 0,
  //   b0: 0,
  //   b1: 1,
  //   b2: 0.1, 
  //   c0: 0.00,
  //   c1: 0,
  // }
  return coefficients
} 

