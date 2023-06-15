import React from "react";

import { RoverData } from './types';
import { fetchRovers } from './api';
import RoverManifest from './RoverManifest';

type RoverListState = {
  rovers: RoverData[],
  selectedRover?: RoverData,
}

const RoverList: React.FC = () => {
    const [state, setState] = React.useState<RoverListState>({rovers:[]});

    React.useEffect(() => {
      if(state.rovers.length !== 0) {
        return;
      }
      const retrieveRoverList = async () => {
        const results = await fetchRovers();
        setState({...state, rovers: results});
      };

      retrieveRoverList();
    }, [state, setState]);

    const selectRoverHandler = React.useCallback((event) => {
      event.stopPropagation();
      const value = event.target.value;
      const rover = state.rovers.find(rover => rover.name === value);
      setState({...state, selectedRover: rover});
    }, [state, setState]);

    return (
      <><section className="App-list">
        <h4>Mars Rovers</h4>
        <div className="App-list-controls">
          <label htmlFor="rover">
            Select Rover
          </label>
          <select name="rover" id="rover" data-testid="rover" onChange={selectRoverHandler}>
            <option value="">-</option>
            {state.rovers.map((rover) => <option key={rover.id} value={rover.name}>{rover.name}</option>)}
          </select>
        </div>
      </section>
      <RoverManifest rover={state.selectedRover?.name} cameras={state.selectedRover?.cameras} />
    </>
    )
};

export default RoverList;