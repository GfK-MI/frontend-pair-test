import { LaunchData, SearchFilter, SortObject } from './types';

export async function fetchPastLaunches(limit: number, sortRequest: SortObject | undefined, searchFilter: SearchFilter | undefined): Promise<LaunchData[]> {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    let sortRequestString = '';

    sortRequest && searchFilter ?
        sortRequestString = `, find: { mission_name: "${searchFilter}" }, sort: "${sortRequest.property}", order: "${sortRequest.order}"`
    : sortRequest ?
        sortRequestString = `, sort: "${sortRequest.property}", order: "${sortRequest.order}"`
    : searchFilter ?
        sortRequestString = `, find: { mission_name: "${searchFilter}" }`
    :
    sortRequestString = '';

    const body = JSON.stringify({
        query: `{
            launchesPast(limit: ${limit}${sortRequestString}) {
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
        }`,
        variables: {}
    });

    const options: RequestInit = {
        method: "POST",
        redirect: "follow",
        headers,
        body,
    };

    const request = await fetch("https://api.spacex.land/graphql/", options);
    const response = await request.json();

    return response.data.launchesPast;
}
