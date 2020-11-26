import React from "react";
import { useDebounce } from "use-debounce";
import { SortOrder, SortAttribute } from "../../types";

import "./LaunchList.css";

import LaunchListEntry from "../LaunchListEntry";
import { useLaunchEntries } from "../../utils/useLaunchEntries";

type Props = {
  limit?: number;
};

const LaunchList: React.FC<Props> = ({ limit = 10 }) => {
  const [search, setSearch] = React.useState<string>("");
  const [sort, setSort] = React.useState<SortAttribute>("mission_name");
  const [order, setOrder] = React.useState<SortOrder>("ASC");

  // Using debounce to prevent every key down from
  // triggering a search while the user is still typing.
  const [debouncedSearch] = useDebounce(search, 1000, { leading: true });

  const entries = useLaunchEntries({
    search: debouncedSearch,
    limit,
    sort,
    order,
  });

  return (
    <section className="List">
      <div className="List-controls">
        <div className="List-control List-control--search">
          <label htmlFor="textSearch">Search</label>
          <input
            name="textSearch"
            id="textSearch"
            placeholder="Type mission name..."
            data-testid="textSearch"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setSearch("")}>Reset</button>
        </div>
        <div className="List-control">
          <label htmlFor="sortAttribute">Sort</label>
          <select
            name="sortAttribute"
            id="sortAttribute"
            data-testid="sortAttribute"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortAttribute)}
          >
            <option value="launch_date_utc">Launch Date</option>
            <option value="mission_name">Mission Name</option>
          </select>
        </div>
        <div className="List-control">
          <label htmlFor="sortOrder">Order</label>
          <select
            name="sortOrder"
            id="sortOrder"
            data-testid="sortOrder"
            value={order}
            onChange={(e) => setOrder(e.target.value as SortOrder)}
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>
      </div>
      {entries && entries.length > 0 ? (
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>
              <LaunchListEntry entry={entry} />
            </li>
          ))}
        </ul>
      ) : (
        <div>
          {search.length !== 0 ? (
            <p>
              No launches found with your search term: <strong>{search}</strong>
              <button onClick={() => setSearch("")}>Reset</button>
            </p>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
    </section>
  );
};

export default LaunchList;
