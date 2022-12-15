import React, { ChangeEventHandler } from "react";

import { LaunchData, SortObject, SortOptions } from './types';

import { fetchPastLaunches } from './api';
import LaunchListEntry from './LaunchListEntry';

type Props = {
    limit?: number
}

export const sortOptions: SortOptions = {
    'mission_name-asc' : {
        order: 'asc',
        property: 'mission_name',
        name: 'Mission Name (asc)',
    },
    'mission_name-desc': {
        order: 'desc',
        property: 'mission_name',
        name: 'Mission Name (desc)',
    },
};

const LaunchList: React.FC<Props> = ({limit = 10}) => {
    const [entries, setEntries] = React.useState<LaunchData[]>([]);
    const [sortRequest, setSortRequest] = React.useState<SortObject | undefined>();

    React.useEffect(() => {
        const retrieveListItems = async () => {
            const results = await fetchPastLaunches(limit, sortRequest);
console.log(results)
            setEntries(results);
        };

        retrieveListItems();
    }, [limit, sortRequest]);


    const onSortChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        setSortRequest(sortOptions[event.target.value]);
        console.log(event.target.value)
    }

    return (
        <section className="App-list">
            <h4>Past Launches</h4>
            <p>List of past SpaceX launches</p>
            <div className="App-list-controls">
                <div className="App-list-control">
                    <label htmlFor="sortOrder">
                        Sort by
                    </label>
                    <select
                        name="sortOrder"
                        id="sortOrder"
                        data-testid="sortOrder"
                        defaultValue=""
                        onChange={onSortChange}
                    >
                        <option disabled value="">-</option>
                        {Object.keys(sortOptions).map(optionKey =>
                            <option
                                key={`${sortOptions[optionKey].property}-${sortOptions[optionKey].order}`}
                                value={`${sortOptions[optionKey].property}-${sortOptions[optionKey].order}`}
                            >
                                {sortOptions[optionKey].name}
                            </option>
                        )}
                    </select>
                </div>
                <div className="App-list-control">
                    <label htmlFor="textSearch">
                        Search
                    </label>
                    <input
                        name="textSearch"
                        id="textSearch"
                        placeholder="Type mission name..."
                        data-testid="textSearch"
                    />
                </div>
            </div>
            <ul>
                {entries.map((entry) =>
                    <li key={entry.id}>
                        <LaunchListEntry entry={entry}/>
                    </li>
                )}
            </ul>
        </section>
    )
};

export default LaunchList;
