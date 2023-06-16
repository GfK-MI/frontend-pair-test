import React from "react";

import { Photo } from './types';

export type PhotoViewerProps = {
  photos: Photo[]
}

type PhotoViewerState = {
  selectedPhoto: number
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({photos}) => {
  const [state, setState] = React.useState<PhotoViewerState>({selectedPhoto: 0});
  
  React.useEffect(() => {
    setState({selectedPhoto: 0});
  }, [photos, setState]);

  const clickPhotoListHandler = React.useCallback((event) => {
    event.stopPropagation();
    const photoIndex = event.currentTarget.getAttribute('data-index') || 0;
    setState({...state, selectedPhoto: Number(photoIndex)});
  }, [state, setState]);
  
  if (photos.length === 0) {
    return null;
  }

  return <div className="App-Photo-Viewer">
    <div className="App-Photo-list">
      <ul>
        {
          photos.map((photo, index) => 
          <li key={photo.id}  data-index={index} onClick={clickPhotoListHandler}>
            <div className="App-Photo-wrp">
              <div className="App-Photo-wrp-img">
                <img alt={photo.camera.full_name} src={photo.img_src} />
              </div>
              <div className="App-Photo-text">
                <p>Camera: {photo.camera.full_name}</p>
                <p>Date: {photo.earth_date}</p>
              </div>
            </div>
          </li>)
        }
      </ul>
    </div>
    <div className="App-Photo-Selected">
        <img alt={photos[state.selectedPhoto].camera.full_name} src={photos[state.selectedPhoto].img_src} />
      </div>
  </div>
}

export default PhotoViewer;