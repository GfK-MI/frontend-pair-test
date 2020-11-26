import React from "react";
import { LaunchEntry } from "../../types";
import { useLocalisedDate } from "../../utils/useLocalisedDate";

import "./LaunchListEntry.css";

interface Props {
  entry: LaunchEntry;
}

const LaunchListEntry = ({ entry }: Props): React.ReactElement => {
  const [isDetailVisible, setIsDetailVisible] = React.useState(false);

  const dateFormatted = useLocalisedDate(entry.launch_date_utc);

  const onEntryClicked = () => {
    setIsDetailVisible(!isDetailVisible);
  };

  const payload = entry?.rocket?.second_stage?.payloads[0]?.payload_type;
  const missionPatch = entry?.links?.mission_patch_small;

  return (
    <>
      <div
        className="Entry-title--clickable"
        data-testid="entryContainer"
        role="button"
        onClick={onEntryClicked}
      >
        <h4>{entry.mission_name}</h4>
        <h5>{dateFormatted}</h5>
      </div>
      {isDetailVisible && (
        <div className="Entry-body" data-testid="entryBody">
          {missionPatch && (
            <img
              width="100"
              height="100"
              src={missionPatch}
              alt={`${entry.mission_name} Mission Patch`}
            />
          )}
          <p>
            <strong>Rocket: </strong>
            {entry.rocket.rocket_name}
          </p>
          <p>
            <strong>Payload: </strong>
            {payload}
          </p>
        </div>
      )}
    </>
  );
};

export default LaunchListEntry;
