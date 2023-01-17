export interface StagePayload {
    payload_type: string;
}

export interface Rocket {
    rocket_name: string;
    second_stage: {
        payloads: StagePayload[];
        block: number;
    }
}

export interface LaunchData {
    rocket: Rocket,
    launch_date_utc: string;
    mission_name: string;
    id: string;
    links: {
        mission_patch_small: string | null;
    }
}

export type SortOption = 'asc' | 'desc';

export type SortProperty = 'mission_name' | 'launch_date_utc';

export type SortObject = {
    order: SortOption,
    property: SortProperty,
    name: string,
};

export type SearchFilter = string;

export type SortOptions = { [key: string]: SortObject };
