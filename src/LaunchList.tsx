import React from "react";

import { LaunchData } from './types';

import { fetchPastLaunches } from './api';
import LaunchListEntry from './LaunchListEntry';

type Props = {
    limit?: number
}

type OrderOption = 'name-asc' | 'name-desc';

type OrderOptions = {
    value: OrderOption,
    name: string,
}[];

const orderOptions: OrderOptions = [
    {
        value: 'name-asc',
        name: 'Mission Name (asc)',
    },
    {
        value: 'name-desc',
        name: 'Mission Name (desc)',
    },
];

const defaultOrderValue: OrderOption = 'name-desc';

const LaunchList: React.FC<Props> = ({limit = 10}) => {
    const [entries, setEntries] = React.useState<LaunchData[]>([]);

    React.useEffect(() => {
        const retrieveListItems = async () => {
            const results = await fetchPastLaunches(limit);

            setEntries(results)
        };

        retrieveListItems();
    }, [setEntries, limit]);

    return (
        <section className="App-list">
            <h4>Past Launches</h4>
            <p>List of past SpaceX launches</p>
            <div className="App-list-controls">
                <div className="App-list-control">
                    <label htmlFor="sortOrder">
                        Sort by
                    </label>
                    <select name="sortOrder" id="sortOrder" data-testid="sortOrder" defaultValue="">
                        <option disabled value="">-</option>
                        {
                            orderOptions.map(optionPair => {
                                return (
                                    <option
                                        key={optionPair.value}
                                        value={optionPair.value}
                                    >
                                        {optionPair.name}
                                    </option>
                                );
                            })
                        }
                    </select>
                </div>
                <div className="App-list-control">
                    <label htmlFor="textSearch">
                        Search
                    </label>
                    <input name="textSearch" id="textSearch"
                        placeholder="Type mission name..."
                        data-testid="textSearch"/>
                </div>
            </div>
            <ul>{
                entries.map((entry) => <li key={entry.id}>
                    <LaunchListEntry entry={entry}/>
                </li>)
            }</ul>
        </section>
    )
};

export default LaunchList;