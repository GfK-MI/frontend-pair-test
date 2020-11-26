import { LaunchDataVariables, LaunchEntry } from "../types";

export async function fetchPastLaunches({
  search,
  limit,
  sort,
  order,
}: LaunchDataVariables): Promise<LaunchEntry[]> {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const body = JSON.stringify({
    query: `
      query GetLaunches($find: LaunchFind!, $limit: Int!, $sort: String!, $order: String!) {
        launchesPast(find: $find, limit: $limit, sort: $sort, order: $order) {
          rocket {
            rocket_name
            second_stage {
              payloads {
                payload_type
              }
              block
            }
          }
          launch_date_utc
          mission_name
          id
          links {
            mission_patch_small
          }
        }
      }
    `,
    variables: {
      find: { mission_name: search },
      limit,
      sort,
      order,
    },
  });

  const options: RequestInit = {
    method: "POST",
    redirect: "follow",
    headers,
    body,
  };

  try {
    const request = await fetch("https://api.spacex.land/graphql/", options);
    const response = await request.json();
    return response.data.launchesPast;
  } catch (e) {
    console.error(e);
    return [];
  }
}
