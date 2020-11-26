export interface StagePayload {
  payload_type: string;
}

export interface Rocket {
  rocket_name: string;
  second_stage: {
    payloads: StagePayload[];
    block: number;
  };
}

export type SortAttribute = "mission_name" | "launch_date_utc";
export type SortOrder = "ASC" | "DESC";

export interface LaunchDataVariables {
  search: string;
  limit: number;
  sort: SortAttribute;
  order: SortOrder;
}

export interface LaunchEntry {
  rocket: Rocket;
  launch_date_utc: string;
  mission_name: string;
  id: string;
  links: {
    mission_patch_small: string | null;
  };
}
