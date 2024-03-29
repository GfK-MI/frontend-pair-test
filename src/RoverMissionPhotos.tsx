import React from "react";

import { Camera, CameraName, Manifest, Photo } from './types';
import { fetchRoverMissionPhotos } from './api';
import PhotoViewer from "./PhotoViewer";

export type MissionPhotosProps  = {
  missionManifest: Manifest,
  missionCameras: Camera[],
}

type MissionPhotosState  = {
  photos: Photo[],
  missionDay: number,
  camera: CameraName | undefined,
  photoListOffset: number,
}
const RoverMissionPhotos: React.FC<MissionPhotosProps> = ({missionManifest, missionCameras}) => {
  const { max_sol, name: rover } = missionManifest;
  const [state, setState] = React.useState<MissionPhotosState>(
    {
      missionDay: 1,
      photos: [],
      camera: undefined,
      photoListOffset: 0,
    }
  );

  const fetchPhotos = React.useCallback(async () => {
    const { missionDay, camera } = state;
    setState({...state, photos: []});
    const result = await fetchRoverMissionPhotos({rover, missionDay, camera});
    setState({...state, photos: result});
  }, [state, rover, setState]);
  
  const missionDayChangeHandler = React.useCallback((event) => {
    const missionDay = Number(event.target.value);
    setState({...state, missionDay});
  }, [state, setState]);
  
  const cameraChangeHandler = React.useCallback((event) => {
    const camera = event.target.value !== 'all' ? event.target.value : undefined;
    setState({...state, camera});
    
  }, [state, setState]);

  return (
    <div className="App-Mission-Photos">
      <h5>Mission Photos Day by Day</h5>
      <label htmlFor="missionDay">
      Select Mission Day
      <input 
        id="missionDay" 
        name="missionDay" 
        type="number"
        defaultValue="1" 
        onChange={missionDayChangeHandler}
      />
      </label>
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
              <option key={camera.name} value={camera.name}>{camera.full_name}</option>
            )
        }
      </select>
      <button onClick={(event) => {
        event.preventDefault();
        fetchPhotos();
      }} >Fetch Mission Photos</button>
      <hr/>
      Page 1 <br />
      <button disabled>{'<< Previous Page'}</button> <button >{'Next Page >>'}</button>
      <hr/>
      <PhotoViewer photos={state.photos}/>
    </div>
  )
}

export default RoverMissionPhotos;