import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { CameraName, Manifest, Photo, Status } from './types';
import { fetchRoverMissionPhotos } from './api';
import RoverMissionPhotos from './RoverMissionPhotos';

jest.mock('./api');

const roverManifest: Manifest = {
  name: 'Rover 1',
  landing_date: '2012-12-01',
  launch_date: '2012-10-01',
  status: Status.ACTIVE,
  max_sol: 500,
  max_date: '2023-10-01',
  total_photos: 123,
  photos: [{
    cameras: [CameraName.CHEMCAM, CameraName.FHAZ],
    earth_date: '2012-12-01',
    sol: 1,
    total_photos: 35,
  }],
};

const missionPhotos: Photo[] = [
  {
    camera: {
      full_name: '',
      id: 123,
      name: CameraName.CHEMCAM,
      rover_id: 1,
    },
    earth_date: '2012-12-01',
    id: 123,
    img_src: 'http://somelocation/img.png',
    rover: {
      id: 1,
      landing_date: '2012-12-01',
      launch_date: '2012-12-01',
      name: 'Rover 1',
      status: Status.ACTIVE,
    },
    sol: 1,
  }
]

beforeEach(() => {
  (fetchRoverMissionPhotos as jest.Mock).mockResolvedValue(missionPhotos)
})

test('renders camera list', async () => {
  const props = {
    missionManifest: roverManifest,
    missionCameras: [
      {
      id: 1,
      name: CameraName.CHEMCAM,
      rover_id: 1,
      full_name: 'CHEM CAM',
    },
    {
      id: 2,
      name: CameraName.FHAZ,
      rover_id: 1,
      full_name: 'FRONT HAZARD',
    }
  ]
  }
  render(<RoverMissionPhotos {...props} />);
  await act(async () => {
    expect(screen.getAllByRole('option').length).toBe(3);
    expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: props.missionCameras[0].full_name })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: props.missionCameras[0].full_name })).toBeInTheDocument();
  })
});

test('calls api with correct parameters', async () => {
  const props = {
    missionManifest: roverManifest,
    missionCameras: [
      {
      id: 1,
      name: CameraName.CHEMCAM,
      rover_id: 1,
      full_name: 'CHEM CAM',
    },
    {
      id: 2,
      name: CameraName.FHAZ,
      rover_id: 1,
      full_name: 'FRONT HAZARD',
    }
  ]
  }
  render(<RoverMissionPhotos {...props} />);
  await act(async () => {
    const missionDay = screen.getByLabelText("Select Mission Day") as HTMLInputElement;
    fireEvent.change(missionDay, {target: {value: 2}});
    await waitFor(() => expect(missionDay).toHaveValue(2));

    const selectedCamera = props.missionCameras[1].name;
    const selectCamera = screen.getByLabelText("Select Camera") as HTMLInputElement;
    fireEvent.change(selectCamera, {target: {value: selectedCamera}});
    await waitFor(() => expect(selectCamera).toHaveValue(selectedCamera));

    const fetchPhotoBtn = screen.getByText("Fetch Mission Photos");
    fireEvent.click(fetchPhotoBtn);
    expect(fetchRoverMissionPhotos).toBeCalledTimes(1);
    const {name: rover } = props.missionManifest;
    expect(fetchRoverMissionPhotos).toBeCalledWith({
      rover, 
      missionDay: 2, 
      camera: selectedCamera,
    });
  });

});

