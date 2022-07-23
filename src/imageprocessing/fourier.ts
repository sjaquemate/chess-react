import * as tf from '@tensorflow/tfjs-core';

export const calculateFourierMagnitude = (image: tf.Tensor2D) => {
  const real = image
  const complex = tf.complex(real, tf.zerosLike(real))
  const fftHorizontal = tf.fft(complex)
  const fft2D = tf.transpose(tf.fft(tf.transpose(fftHorizontal)))
  const magnitude = tf.abs(fft2D) 
  return magnitude as tf.Tensor2D
}

export const calculateLogarithmicMagnitude = (magnitude: tf.Tensor2D) =>
  tf.log(tf.add(tf.onesLike(magnitude), magnitude)) as tf.Tensor2D






