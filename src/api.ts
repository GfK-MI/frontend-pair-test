import { LaunchData, SortObject } from './types';

export async function fetchPastLaunches(limit: number, sortRequest: SortObject | undefined): Promise<LaunchData[]> {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    let sortRequestString = '';

    if (sortRequest) {
        sortRequestString = `, sort: "${sortRequest.property}", order: "${sortRequest.order}"`;
    }

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
