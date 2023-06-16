
export interface Photo {
  id: number,
  img_src: string,
  earth_date: string,
  sol: number,
  camera: Camera,
  rover: {
    id: number,
    landing_date: string,
    launch_date: string,
    name: string,
    status: Status,
  }
}

export interface PhotoDetail {
  cameras: CameraName[],
  earth_date: string,
  sol: number,
  total_photos: number,
}
export interface Manifest {
  landing_date: string,
  launch_date: string,
  max_date: string,
  max_sol: number,
  name: string,
  photos: PhotoDetail[],
  status: Status,
  total_photos: number,
}

export enum CameraName {
  FHAZ = 'FHAZ',
  RHAZ = 'RHAZ',
  MAST = 'MAST',
  CHEMCAM	= 'CHEMCAM',
  MAHLI = 'MAHLI',
  MARDI = 'MARDI',
  NAVCAM = 'NAVCAM',
  PANCAM = 'PANCAM',
  MINITES = 'MINITES',
}

export interface Camera {
  id: number,
  name: CameraName,
  rover_id: number,
  full_name: string,
}

export enum Status {
  ACTIVE = 'active',
  COMPLETE = 'complete',
}

export interface RoverData {
  id: number,
  name: string,
  landing_date: string,
  launch_date: string,
  status: Status,
  max_sol: number,
  max_date: string,
  total_photos: number,
  cameras: Camera[],
}
