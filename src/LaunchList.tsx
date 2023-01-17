import React, { ChangeEventHandler } from "react";

import { LaunchData, SearchFilter, SortObject, SortOptions } from './types';

import { fetchPastLaunches } from './api';
import LaunchListEntry from './LaunchListEntry';

type Props = {
    limit?: number
}

export const sortByNameOptions: SortOptions = {
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

export const sortByDateOptions: SortOptions = {
    'launch_date_utc-asc' : {
        order: 'asc',
        property: 'launch_date_utc',
        name: 'Launch Date (asc)',
    },
    'launch_date_utc-desc': {
        order: 'desc',
        property: 'launch_date_utc',
        name: 'Launch Date (desc)',
    },
};

const LaunchList: React.FC<Props> = ({limit = 10}) => {
    const [entries, setEntries] = React.useState<LaunchData[]>([]);
    const [sortRequest, setSortRequest] = React.useState<SortObject>();
    const [searchRequest, setSearchRequest] = React.useState<SearchFilter>();

    React.useEffect(() => {
        const retrieveListItems = async () => {
            const results = await fetchPastLaunches(limit, sortRequest, searchRequest);

            setEntries(results);
        };

        retrieveListItems();
    }, [limit, sortRequest, searchRequest]);

    const resetSelect = (id: string) => {
        const select = document.getElementById(id) as HTMLSelectElement;

        select.value = select.options[0].value;
    }


    const onSortByNameChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        setSortRequest(sortByNameOptions[event.target.value]);
        resetSelect('sortByDateOrder');
    }


    const onSortByDateChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
        setSortRequest(sortByDateOptions[event.target.value]);
        resetSelect('sortByNameOrder');
    }

    const onSearchByNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setSearchRequest(event.target.value)
    }

    return (
        <section className="App-list">
            <h4>Past Launches</h4>
            <p>List of past SpaceX launches</p>
            <div className="App-list-controls">
                <div className="App-list-control">
                    Sort by
                    &nbsp;
                    <select
                        name="sortByNameOrder"
                        id="sortByNameOrder"
                        data-testid="sortByNameOrder"
                        defaultValue=""
                        onChange={onSortByNameChange}
                    >
                        <option disabled value="">(mission name)</option>
                        {Object.keys(sortByNameOptions).map(optionKey =>
                            <option
                                key={`${sortByNameOptions[optionKey].property}-${sortByNameOptions[optionKey].order}`}
                                value={`${sortByNameOptions[optionKey].property}-${sortByNameOptions[optionKey].order}`}
                            >
                                {sortByNameOptions[optionKey].name}
                            </option>
                        )}
                    </select>
                    &nbsp;
                    <select
                        name="sortByDateOrder"
                        id="sortByDateOrder"
                        data-testid="sortByDateOrder"
                        defaultValue=""
                        onChange={onSortByDateChange}
                    >
                        <option disabled value="">(launch date)</option>
                        {Object.keys(sortByDateOptions).map(optionKey =>
                            <option
                                key={`${sortByDateOptions[optionKey].property}-${sortByDateOptions[optionKey].order}`}
                                value={`${sortByDateOptions[optionKey].property}-${sortByDateOptions[optionKey].order}`}
                        >
                            {sortByDateOptions[optionKey].name}
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
                        onChange={onSearchByNameChange}
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
