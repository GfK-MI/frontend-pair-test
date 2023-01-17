import React from 'react';
import { act, render, screen } from '@testing-library/react';

import { LaunchData } from './types';
import LaunchList, { sortByDateOptions, sortByNameOptions } from './LaunchList';

import { fetchPastLaunches } from './api';
import userEvent from '@testing-library/user-event';
jest.mock('./api');

const mockLaunches: LaunchData[] = [
  {
    "rocket": {
      "rocket_name": "Falcon 9",
      "second_stage": {
        "payloads": [
          {
            "payload_type": "Crew Dragon"
          }
        ],
        "block": 5
      }
    },
    "launch_date_utc": "2020-11-15T00:49:00.000Z",
    "mission_name": "Crew-1",
    "id": "107",
    "links": {
      "mission_patch_small": null
    }
  },
  {
    "rocket": {
      "rocket_name": "Falcon 9",
      "second_stage": {
        "payloads": [
          {
            "payload_type": "Satellite"
          }
        ],
        "block": 5
      }
    },
    "launch_date_utc": "2020-11-01T00:00:00.000Z",
    "mission_name": "SXM-7",
    "id": "110",
    "links": {
      "mission_patch_small": null
    }
  },
  {
    "rocket": {
      "rocket_name": "Falcon 9",
      "second_stage": {
        "payloads": [
          {
            "payload_type": "Dragon 1.1"
          }
        ],
        "block": 5
      }
    },
    "launch_date_utc": "2020-12-02T17:50:00.000Z",
    "mission_name": "CRS-21",
    "id": "112",
    "links": {
      "mission_patch_small": null
    }
  }
];

beforeEach(() => {
  (fetchPastLaunches as jest.Mock).mockResolvedValue(mockLaunches)
})

test('renders past launches', async () => {
  render(<LaunchList/>);

  const titleElement = screen.getByText("Past Launches");
  expect(titleElement).toBeInTheDocument();

  const items = await screen.findAllByRole('listitem');
  expect(items.length).toBe(mockLaunches.length);

  expect(fetchPastLaunches).toBeCalledTimes(1);
});

test('renders sort by name dropdown', async () => {
  render(<LaunchList/>);

  const dropdownElement = await (await screen.findByText('Mission Name (desc)'));
  expect(dropdownElement).toBeInTheDocument();
});

test('sort by name dropdown dropdown contains mission name (ascending)', async () => {
  render(<LaunchList/>);

  const option = await screen.getByRole('option', { name: 'Mission Name (asc)' }) as HTMLOptionElement;
  expect(option.value).toBe('mission_name-asc');
});

test('sort by dropdown dropdown contains mission name (descending)', async () => {
  render(<LaunchList/>);

  const option = await screen.getByRole('option', { name: 'Mission Name (desc)' }) as HTMLOptionElement;
  expect(option.value).toBe('mission_name-desc');
});

test('changing sort by name dropdown calls fetchPastLaunches correctly', async () => {
  render(<LaunchList />);
  const dropdownElements = await screen.findAllByRole('combobox');
  const optionsMember = 'mission_name-asc';

  act(() => {
    userEvent.selectOptions(dropdownElements[0], optionsMember);
  });

  expect(fetchPastLaunches).toBeCalledTimes(2); //Once on load, once on change
  expect(fetchPastLaunches).toHaveBeenCalledWith(10, sortByNameOptions[optionsMember], undefined);
});

test('changing sort by name resets sort by date', async () => {
  render(<LaunchList/>);
  const dropdownElements = await screen.findAllByRole('combobox');

  act(() => {
    userEvent.selectOptions(dropdownElements[1], 'launch_date_utc-asc');
    userEvent.selectOptions(dropdownElements[0], 'mission_name-asc');
  });

  const launchSelect = dropdownElements[1] as HTMLSelectElement;
  expect(launchSelect.value).toBe('');
});

test('renders sort by name dropdown', async () => {
  render(<LaunchList/>);

  const dropdownElement = await (await screen.findByText('Launch Date (desc)'));
  expect(dropdownElement).toBeInTheDocument();
});

test('sort by date dropdown dropdown contains launch date (ascending)', async () => {
  render(<LaunchList/>);

  const option = await screen.getByRole('option', { name: 'Launch Date (asc)' }) as HTMLOptionElement;
  expect(option.value).toBe('launch_date_utc-asc');
});

test('sort by date dropdown dropdown contains launch date (descending)', async () => {
  render(<LaunchList/>);

  const option = await screen.getByRole('option', { name: 'Launch Date (desc)' }) as HTMLOptionElement;
  expect(option.value).toBe('launch_date_utc-desc');
});

test('changing sort by date dropdown calls fetchPastLaunches correctly', async () => {
  render(<LaunchList />);
  const dropdownElements = await screen.findAllByRole('combobox');
  const optionsMember = 'launch_date_utc-asc';

  act(() => {
    userEvent.selectOptions(dropdownElements[1], optionsMember);
  });

  expect(fetchPastLaunches).toBeCalledTimes(2); //Once on load, once on change
  expect(fetchPastLaunches).toHaveBeenCalledWith(10, sortByDateOptions[optionsMember], undefined);
});

test('changing sort by date resets sort by name', async () => {
  render(<LaunchList/>);
  const dropdownElements = await screen.findAllByRole('combobox');

  act(() => {
    userEvent.selectOptions(dropdownElements[0], 'mission_name-asc');
    userEvent.selectOptions(dropdownElements[1], 'launch_date_utc-asc');
  });

  const launchSelect = dropdownElements[0] as HTMLSelectElement;
  expect(launchSelect.value).toBe('');
});

test('renders search input', async () => {
  render(<LaunchList/>);

  const searchInput = await screen.findByRole('textbox');
  expect(searchInput).toBeInTheDocument();
});

test('changing value of search field calls fetchPastLaunches correctly', async () => {
  render(<LaunchList />);
  const searchInput = await screen.findByRole('textbox');
  const searchString = 'test string';

  act(() => {
    userEvent.type(searchInput, searchString);
  });

  expect(fetchPastLaunches).toBeCalledTimes(2); //Once on load, once on change
  expect(fetchPastLaunches).toHaveBeenCalledWith(10, undefined, searchString);
});

test('changing value of search field calls fetchPastLaunches correctly if a sort field has been set', async () => {
  render(<LaunchList />);
  const searchInput = await screen.findByRole('textbox');
  const searchString = 'test string';
  const dropdownElements = await screen.findAllByRole('combobox');
  const optionsMember = 'launch_date_utc-asc';

  act(() => {
    userEvent.selectOptions(dropdownElements[1], optionsMember);
    userEvent.type(searchInput, searchString);
  });

  expect(fetchPastLaunches).toBeCalledTimes(2); //Once on load, once on change
  expect(fetchPastLaunches).toHaveBeenCalledWith(10, sortByDateOptions[optionsMember], searchString);
});

test('dates are formatted as dd/mm/yyyy format in the user\'s timezone', async () => {
  render(<LaunchList />);
  const firstDate = await screen.findAllByTestId('entryDate');

  expect(firstDate[0].innerHTML).toEqual('15/11/2020, 00:49:00 GMT');
})
