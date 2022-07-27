import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-core/dist/public/chained_ops/register_all_chained_ops';
import { createCircularMask, selectRegion } from './images';

export const zero = 0

export const createQuadrantKernel = (k: number, padding: number, quadrant: "q1" | "q2" | "q3" | "q4") => {
  const kHalf = Math.floor(k / 2)
  const circularMask = createCircularMask([k, k], padding, k / 2)

  switch (quadrant) {
    case "q2":
      return (
        tf.ones([kHalf, kHalf])
          .concat(tf.zeros([kHalf, kHalf + 1]), 1)
          .concat(tf.zeros([kHalf + 1, k]), 0)
      ).mul(circularMask) as tf.Tensor2D
    case "q1":
      return (
        tf.zeros([kHalf, kHalf+1])
          .concat(tf.ones([kHalf, kHalf]), 1)
          .concat(tf.zeros([kHalf + 1, k]), 0)
      ).mul(circularMask) as tf.Tensor2D
    case "q3":
      return (
        tf.zeros([kHalf + 1, k]).concat(
          tf.ones([kHalf, kHalf])
          .concat(tf.zeros([kHalf, kHalf+1]), 1)
        , 0)
      ).mul(circularMask) as tf.Tensor2D
    case "q4":
      return (
        tf.zeros([kHalf + 1, k]).concat(
          tf.zeros([kHalf, kHalf+1])
          .concat(tf.ones([kHalf, kHalf]), 1)
        , 0)
      ).mul(circularMask) as tf.Tensor2D
  }
} 