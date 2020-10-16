# NASA Mission Control Deno Project

## Preview
http://18.218.2.44:8000/

Fun project to book a fictive missile launch to a far away planet.

## Usage
- [Deno](https://deno.land) server.
- [SpaceX V3 API](https://api.spacexdata.com/v3/launches) to get SpaceX actual launch logs.
- [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/docs/data.html) for dataset of planets found by the Kepler space telescope.
- [Docker](https://hub.docker.com/repository/docker/tomkiworld/nasa-deno) to publish the image.
- [AWS](https://aws.amazon.com/) for hosting

## Installation
Ensure you have Deno installed: https://deno.land/

## Development
Run the following command from the root folder:

`deno run --allow-net --allow-read src/mod.ts`

## Docker
If you wish to use Docker run the following command, make sure to use your Docker username for the project:

`docker build -t username/nasa-deno .`

Once The project is built you can run it:

`docker run -t -p 8000:8000 username/nasa-deno`

## View the project
Browse to the Mission Control front end at http://localhost:8000 and schedule an interstellar mission launch!

## Locking Dependencies
If you work on the project and update some of the dependcies, make sure to update the lock file by running the following command:

`deno run --allow-net --allow-read --lock-write --lock=lock.json src/mod.ts`
