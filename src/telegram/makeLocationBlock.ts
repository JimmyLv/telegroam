import { createNestedBlock } from '../roam/createNestedBlock'
import { mapLocation } from './mapLocation'

export function makeLocationBlock(uid, location) {
  let mapuid = `${uid}-map`;
  let { embed, osm, gmaps } = mapLocation(location);

  createNestedBlock(uid, {
    uid: mapuid,
    string: embed,
    children: [
      {
        uid: `${mapuid}-link-osm`,
        string: osm,
      },
      {
        uid: `${mapuid}-link-gmaps`,
        string: gmaps,
      },
    ],
  });
}
