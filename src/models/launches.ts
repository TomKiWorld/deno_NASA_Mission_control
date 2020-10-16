import { log, flatMap } from "../deps.ts";

interface Launch {
  flightNumber: number;
  launchDate: number;
  mission: string;
  rocket: string;
  rocketType: string;
  customers: Array<string>;
  upcoming: boolean;
  patch?: string;
  video?: string;
  success?: boolean;
  target?: string;
};

const launches = new Map<number, Launch>();

export const downloadLaunchData = async () => {
  log.info("Downloading Launch Data...")
  const response = await fetch("https://api.spacexdata.com/v3/launches");

  if (!response.ok) {
    log.warning("Problem downloading Launch Data...")
    throw new Error("Launch Data Download Failed.")
  }
  const launceData = await response.json();
  for (const launch of launceData) {
    const payloads = launch["rocket"]["second_stage"]["payloads"];
    const customers = flatMap(payloads, (payload: any) => {
      return payload["customers"];
    })
    const flightData = {
      flightNumber: launch["flight_number"],
      launchDate: launch["launch_date_unix"],
      mission: launch["mission_name"],
      rocket: launch["rocket"]["rocket_name"],
      rocketType: launch["rocket"]["rocket_type"],
      customers: customers,
      patch: launch["links"]["mission_patch_small"],
      video: launch["links"]["video_link"],
      success: launch["launch_success"],
      upcoming: launch["upcoming"]
    };

    launches.set(flightData.flightNumber, flightData);
  }

  return launches;
};

await downloadLaunchData();
log.info(`Downloaded data for ${launches.size} SpaceX launches.`);

export const getAll = () => {
  return Array.from(launches.values());
};

export const getOne = (id: number) => {
  if (launches.has(id)) {
    return launches.get(id);
  }
  return null;
};

export const removeOne = (id: number) => {
  const aborted = launches.get(id);
  if (aborted) {
    aborted.upcoming = false;
    aborted.success = false;
  }
  return aborted;
};

export const  addOne = (data: Launch) => {
  launches.set(
    data.flightNumber,
    Object.assign(data, {
      upcoming: true,
      customers: ["TomKi NASA Control"],
      rocketType: "TomKi 1"
    }),
  );
};
