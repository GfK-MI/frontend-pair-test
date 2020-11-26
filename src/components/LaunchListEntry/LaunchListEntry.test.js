import React from "react";
import { fireEvent, render, screen, act } from "@testing-library/react";

import LaunchListEntry from "./LaunchListEntry";

const props = {
  entry: {
    mission_name: "ZUMA",
    launch_date_local: "2018-01-07T20:00:00-05:00",
    launch_site: {
      site_name_long:
        "Cape Canaveral Air Force Station Space Launch Complex 40",
    },
    links: {
      article_link:
        "https://spaceflightnow.com/2018/01/08/spacex-kicks-off-ambitious-2018-schedule-with-launch-for-u-s-government/",
      video_link: "https://www.youtube.com/watch?v=0PWu3BRxn60",
    },
    rocket: {
      rocket_name: "Falcon 9",
      first_stage: {
        cores: [
          {
            flight: 1,
            core: {
              reuse_count: 1,
              status: "lost",
            },
          },
        ],
      },
      second_stage: {
        payloads: [
          {
            payload_type: "Satellite",
            payload_mass_kg: null,
            payload_mass_lbs: null,
          },
        ],
      },
    },
    ships: [],
  },
};

test("the user can click the entry to show / hide additional info", () => {
  act(() => {
    render(<LaunchListEntry {...props} />);
  });

  const container = screen.getByTestId("entryContainer");
  const rocket = props.entry.rocket.rocket_name;
  const payload = props.entry.rocket.second_stage.payloads[0].payload_type;

  // Extra info should be not be rendered by default.
  expect(screen.queryByText(rocket)).not.toBeInTheDocument();
  expect(screen.queryByText(payload)).not.toBeInTheDocument();

  act(() => {
    fireEvent.click(container);
  });

  // Extra info should now be showing.
  expect(screen.queryByText(rocket)).toBeInTheDocument();
  expect(screen.queryByText(payload)).toBeInTheDocument();
});
