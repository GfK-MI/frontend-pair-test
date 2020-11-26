import React from "react";
import { LaunchEntry, LaunchDataVariables } from "../types";
import { fetchPastLaunches } from "./api";

export const useLaunchEntries = ({
  search = "",
  limit,
  sort,
  order,
}: LaunchDataVariables): LaunchEntry[] => {
  const [entries, setEntries] = React.useState<LaunchEntry[]>([]);

  React.useEffect(() => {
    const retrieveListItems = async () => {
      const results = await fetchPastLaunches({ search, limit, sort, order });
      setEntries(results);
    };

    retrieveListItems();
  }, [setEntries, search, limit, sort, order]);

  return entries;
};
