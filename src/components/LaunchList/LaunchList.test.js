import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";

import LaunchList from "./LaunchList";

import { fetchPastLaunches } from "../../utils/api";
jest.mock("../../utils/api");

const mockLaunches = [
  {
    rocket: {
      rocket_name: "Falcon 9",
      second_stage: {
        payloads: [
          {
            payload_type: "Crew Dragon",
          },
        ],
        block: 5,
      },
    },
    launch_date_utc: "2020-11-15T00:49:00.000Z",
    mission_name: "Crew-1",
    id: "107",
    links: {
      mission_patch_small: null,
    },
  },
  {
    rocket: {
      rocket_name: "Falcon 9",
      second_stage: {
        payloads: [
          {
            payload_type: "Satellite",
          },
        ],
        block: 5,
      },
    },
    launch_date_utc: "2020-11-01T00:00:00.000Z",
    mission_name: "SXM-7",
    id: "110",
    links: {
      mission_patch_small: null,
    },
  },
  {
    rocket: {
      rocket_name: "Falcon 9",
      second_stage: {
        payloads: [
          {
            payload_type: "Dragon 1.1",
          },
        ],
        block: 5,
      },
    },
    launch_date_utc: "2020-12-02T17:50:00.000Z",
    mission_name: "CRS-21",
    id: "112",
    links: {
      mission_patch_small: null,
    },
  },
];

beforeEach(() => {
  fetchPastLaunches.mockResolvedValue(mockLaunches);
});

test("the user can see a list of past launches", async () => {
  act(() => {
    render(<LaunchList limit={10} />);
  });

  const items = await screen.findAllByRole("listitem");
  expect(items.length).toBe(mockLaunches.length);

  expect(fetchPastLaunches).toBeCalledTimes(1);
});

test("the user can sort and reorder launches by mission name", async () => {
  act(() => {
    render(<LaunchList limit={10} />);
  });

  const sortDropdown = await screen.findByLabelText("Sort");
  const orderDropdown = await screen.findByLabelText("Order");

  expect(sortDropdown).toBeInTheDocument();
  expect(orderDropdown).toBeInTheDocument();

  act(() => {
    fireEvent.change(sortDropdown, {
      target: {
        value: "mission_name",
      },
    });
  });

  expect(fetchPastLaunches).toBeCalledWith({
    search: "",
    limit: 10,
    sort: "mission_name",
    order: "ASC",
  });

  act(() => {
    fireEvent.change(orderDropdown, {
      target: {
        value: "DESC",
      },
    });
  });

  expect(fetchPastLaunches).toBeCalledWith({
    search: "",
    limit: 10,
    sort: "mission_name",
    order: "DESC",
  });
});

test("the user can sort and reorder launches by launch date", async () => {
  act(() => {
    render(<LaunchList limit={10} />);
  });

  const sortDropdown = await screen.findByLabelText("Sort");
  const orderDropdown = await screen.findByLabelText("Order");

  expect(sortDropdown).toBeInTheDocument();
  expect(orderDropdown).toBeInTheDocument();

  act(() => {
    fireEvent.change(sortDropdown, {
      target: {
        value: "launch_date_utc",
      },
    });
  });

  expect(fetchPastLaunches).toBeCalledWith({
    search: "",
    limit: 10,
    sort: "launch_date_utc",
    order: "ASC",
  });

  act(() => {
    fireEvent.change(orderDropdown, {
      target: {
        value: "DESC",
      },
    });
  });

  expect(fetchPastLaunches).toBeCalledWith({
    search: "",
    limit: 10,
    sort: "launch_date_utc",
    order: "DESC",
  });
});

test("the user can filter the launch list by entering a mission name", async () => {
  act(() => {
    render(<LaunchList limit={10} />);
  });

  const searchInput = await screen.findByLabelText("Search");

  expect(searchInput).toBeInTheDocument();

  act(() => {
    fireEvent.change(searchInput, {
      target: {
        value: "Falcon",
      },
    });
  });

  expect(fetchPastLaunches).toBeCalledWith({
    search: "Falcon",
    limit: 10,
    sort: "mission_name",
    order: "ASC",
  });
});
