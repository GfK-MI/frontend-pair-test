import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';

import { CameraName, Manifest, Status } from './types';
import { fetchRoverManifest } from './api';
import RoverManifest from './RoverManifest';

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

beforeEach(() => {
  (fetchRoverManifest as jest.Mock).mockResolvedValue(roverManifest)
})

test('calls api', async () => {
  const props = {
    rover: 'Rover 1',
    cameras: [{
      id: 1,
      name: CameraName.CHEMCAM,
      rover_id: 1,
      full_name: 'CHEM CAM',
    }]
  }
  render(<RoverManifest {...props} />);
  await act(async () => {
    expect(fetchRoverManifest).toBeCalledWith(props.rover);
    expect(fetchRoverManifest).toBeCalledTimes(1);
  })
});

test('renders manifest details', async () => {
  const props = {
    rover: 'Rover 1',
    cameras: [{
      id: 1,
      name: CameraName.CHEMCAM,
      rover_id: 1,
      full_name: 'CHEM CAM',
    }]
  }
  render(<RoverManifest {...props} />);
  await act(async () => {
    await waitFor(() => expect(fetchRoverManifest).toHaveBeenCalledTimes(1))
    
    const roverName = screen.getByText(roverManifest.name);
    expect(roverName).toBeInTheDocument();

    const launchDate = screen.getByText(`Launch Date: ${roverManifest.launch_date}`);
    expect(launchDate).toBeInTheDocument();
    
    const landingDate = screen.getByText(`Landing Date: ${roverManifest.landing_date}`);
    expect(landingDate).toBeInTheDocument();

    const missionStatus = screen.getByText(`Number of Mission Days on Mars: ${roverManifest.max_sol}`);
    expect(missionStatus).toBeInTheDocument();

    const missionPhotos = screen.getByText(`Number of Mission Photos: ${roverManifest.total_photos}`);
    expect(missionPhotos).toBeInTheDocument();
  })
});

