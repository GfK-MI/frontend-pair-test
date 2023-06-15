import React from "react";

import { Camera, CameraName, Manifest, Photo, RoverData } from './types';

import { fetchRoverManifest, fetchRoverMissionPhotos, fetchRovers } from './api';


type Props = {
    limit?: number
}

type ManifestProps = {
  rover?: string,
  cameras?: Camera[]
}

type PhotoViewerProps = {
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
          <li id={photo.id.toString()}  data-index={index} onClick={clickPhotoListHandler}>
            <div className="App-Photo-wrp">
              <div className="App-Photo-wrp-img">
                <img alt={photo.camera.full_name} src={photo.img_src} />
              </div>
              <div className="App-Photo-text">
                <p>Camera: {photo.camera.full_name}</p>
                <p>Date: {photo.earth_date}</p>
              </div>
            </div>
          </li>
        )
        }
      </ul>
    </div>
    <div className="App-Photo-Selected">
        <img alt={photos[state.selectedPhoto].camera.full_name} src={photos[state.selectedPhoto].img_src} />
      </div>
  </div>
}

type MissionPhotosProps  = {
  missionManifest: Manifest,
  missionCameras: Camera[],
}

type MissionPhotosState  = {
  photos: Photo[],
  page: number,
  missionDay: number,
  camera: CameraName | undefined,
  photoListOffset: number,
}
const RoverMissionPhotos: React.FC<MissionPhotosProps> = ({missionManifest, missionCameras}) => {
  const { max_sol, name: rover } = missionManifest;
  
  const [state, setState] = React.useState<MissionPhotosState>(
    {
      missionDay: 1,
      page: 1,
      photos: [],
      camera: undefined,
      photoListOffset: 0,
    }
  );

  const fetchPhotos = React.useCallback(async () => {
    const { page, missionDay, camera } = state;
    setState({...state, photos: []})
    const result = await fetchRoverMissionPhotos({rover, missionDay, page, camera});
    setState({...state, photos: result});
  }, [state, rover, setState]);
  
  const missionDayChangeHandler = React.useCallback((event) => {
    const missionDay = event.target.value;
    setState({...state, missionDay});
  }, [state, setState]);
  
  const cameraChangeHandler = React.useCallback((event) => {
    const camera = event.target.value !== 'all' ? event.target.value : undefined;
    setState({...state, camera});
    
  }, [state, setState]);

  return (
    <div className="App-Mission-Photos">
      <h5>Mission Photos Day by Day</h5>
      <label htmlFor="missionDay">Select Mission Day</label>
      <input 
        name="missionDay" 
        type="number" 
        max={max_sol} 
        defaultValue="1" 
        onChange={missionDayChangeHandler}
      />
      <label htmlFor="roverCamera">
        Select Camera
      </label>
      <select 
        name="roverCamera" 
        id="roverCamera" 
        data-testid="roverCamera" 
        onChange={cameraChangeHandler}
      >
        <option value="all">All</option>
        {
          missionCameras?.map(
            (camera) => 
              <option id={camera.name} value={camera.name}>{camera.full_name}</option>
            )
        }
      </select>
      <button onClick={(event) => {
        event.preventDefault();
        fetchPhotos();
      }} >Fetch Mission Photos</button>
      <hr/>
      <PhotoViewer photos={state.photos}/>
    </div>
  )

}

const RoverManifest: React.FC<ManifestProps> = ({rover, cameras}) => {
  const [manifest, setManifest] = React.useState<Manifest|undefined>();

  React.useEffect(() => {
    if(!rover) {
      return;
    }
    
    const retrieveRoverManifest = async () => {
      setManifest(undefined);
      const result = await fetchRoverManifest(rover);
      setManifest(result);
    };

    retrieveRoverManifest();
}, [rover]);

  if (!manifest || !cameras) {
    return null;
  }

  return (
    <section className="App-Manifest">
        <h3>{manifest.name}</h3>
        <ul>
          <li id="launchDate">Launch Date: <span></span>{manifest.launch_date}</li>
          <li id="landingDate">Landing Date: {manifest.landing_date}</li>
          <li id="status">Mission Status: {manifest.status}</li>
          <li id="missionDays">Number of Mission Days on Mars: {manifest.max_sol}</li>
          <li id="missionPhotos">Number of Mission Photos: {manifest.total_photos}</li>
        </ul>
        <hr/>
        <RoverMissionPhotos missionManifest={manifest} missionCameras={cameras} />
    </section>
  )
}

const RoverList: React.FC<Props> = () => {
    const [rovers, setRovers] = React.useState<RoverData[]>([]);
    const [selectedRover, setSelectedRover] = React.useState<RoverData|undefined>();

    React.useEffect(() => {
      if(rovers.length !== 0) {
        return;
      }
      const retrieveRoverList = async () => {
          const results = await fetchRovers();
          setRovers(results);
      };

      retrieveRoverList();
    }, [rovers, setRovers]);

    return (
      <><section className="App-list">
        <h4>Mars Rovers</h4>
        <div className="App-list-controls">
          <div className="App-list-control">
            <label htmlFor="rover">
              Select Rover
            </label>
            <select name="rover" id="rover" data-testid="rover" onChange={(event) => {
              event.stopPropagation();
              setSelectedRover(rovers.find(rover => rover.name ===event.target.value));
            } }>
              <option value="">-</option>
              {rovers.map((rover) => <option id={rover.id.toString()} value={rover.name}>{rover.name}</option>)}
            </select>
          </div>
        </div>
      </section>
      <RoverManifest rover={selectedRover?.name} cameras={selectedRover?.cameras} />
    </>
    )
};

export default RoverList;