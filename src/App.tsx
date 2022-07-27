import { useState } from 'react';
import { ChessboardDetector } from './components/ChessboardDetector';
import { WebcamCapture } from './components/WebcamCapture';

const App = () => {

  const [previewImage, setPreviewImage] = useState<string>()
  const [msCounter, setMsCounter] = useState(0)

  return (
    <div className="bg-white flex flex-col">
      <div className="mx-auto md:w-1/2">
        <WebcamCapture setPreviewImage={setPreviewImage} />
      </div>
      <ChessboardDetector
        previewImage={previewImage}
        setMs={setMsCounter}
      />
      <div className="font-bold"> {msCounter} </div>
    </div>
  )
}

export default App;
