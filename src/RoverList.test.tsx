import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';

import { CameraName, RoverData, Status } from './types';
import RoverList from './RoverList';

import { fetchRovers } from './api';
jest.mock('./api');

const roverData: RoverData[] = [
  {
    id: 1,
    name: 'Rover 1',
    landing_date: '2012-12-01',
    launch_date: '2012-10-01',
    status: Status.ACTIVE,
    max_sol: 500,
    max_date: '2023-10-01',
    total_photos: 123,
    cameras: [
      {
        id: 11,
        name: CameraName.CHEMCAM,
        rover_id: 1,
        full_name: 'CHEM CAM',
      }
    ],
  },
  {
    id: 2,
    name: 'Rover 2',
    landing_date: '2018-05-01',
    launch_date: '2018-01-01',
    status: Status.ACTIVE,
    max_sol: 400,
    max_date: '2023-10-01',
    total_photos: 456,
    cameras: [
      {
        id: 9,
        name: CameraName.FHAZ,
        rover_id: 2,
        full_name: 'FRONT HAZARD',
      }
    ],
  }
];

beforeEach(() => {
  (fetchRovers as jest.Mock).mockResolvedValue(roverData)
})

test('renders title and calls api', async () => {
  render(<RoverList/>);
  await act(async () => {
    const titleElement = screen.getByText("Mars Rovers");
    expect(titleElement).toBeInTheDocument();

    expect(fetchRovers).toBeCalledTimes(1);
  })

  
});

test('renders selection list for the default and each rover', async () => {
  render(<RoverList/>);
  await act(async () => {
    await waitFor(() => expect(fetchRovers).toHaveBeenCalledTimes(1))
    expect(screen.getAllByRole('option').length).toBe(3);
    expect(screen.getByRole('option', { name: '-' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Rover 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Rover 2' })).toBeInTheDocument();
  })
});

