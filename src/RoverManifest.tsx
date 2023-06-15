import React from "react";

import { Camera, Manifest } from './types';
import { fetchRoverManifest } from './api';
import RoverMissionPhotos from './RoverMissionPhotos';

type ManifestProps = {
  rover?: string,
  cameras?: Camera[]
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
};

export default RoverManifest;