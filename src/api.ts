import { CameraName, Manifest, Photo, RoverData } from './types';

const baseUrl = 'https://api.nasa.gov/mars-photos/api/v1';
const apiKey = 'Qnj7RDjOMR8QZslgPoulob2Bj8BBdXqah18CjXLg';
const headers = new Headers({'Content-Type': 'application/json',"Access-Control-Allow-Origin":"*"});

export async function fetchRovers(): Promise<RoverData[]> {
  const url = `${baseUrl}/rovers?api_key=${apiKey}`;
  const options: RequestInit = {
      method: "GET",
      headers,
  };

  const request = await fetch(url, options);
  const response = await request.json();

  return response.rovers;
}

export async function fetchRoverManifest(rover: string): Promise<Manifest> {
  const url = `${baseUrl}/manifests/${rover}?api_key=${apiKey}`;
    const options: RequestInit = {
        method: "GET",
        headers,
    };

    const request = await fetch(url, options);
    const response = await request.json();

    return response.photo_manifest;
}

export async function fetchRoverMissionPhotos(params: {rover: string, missionDay: number, page:number, camera?: CameraName}): Promise<Photo[]> {
  const {rover, missionDay, page, camera} = params;
  const searchParams = new URLSearchParams(
    { 
      api_key: apiKey, 
      sol: missionDay.toString(),
      page: page.toString(),
    }
  );
  
  if (camera) {
    searchParams.append('camera', camera);
  }

  const url = `${baseUrl}/rovers/${rover}/photos?${searchParams}`;
    const options: RequestInit = {
        method: "GET",
        headers,
    };

    const request = await fetch(url, options);
    const response = await request.json();

    return response.photos;
}
