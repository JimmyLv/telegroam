import { urlWithParams } from '../helpers/url'

export function mapLocation({ latitude, longitude }) {
  let d = 0.004;
  let bb = [longitude - d, latitude - d, longitude + d, latitude + d];
  let bbox = bb.join("%2C");
  let marker = [latitude, longitude].join("%2C");

  let osm = urlWithParams("https://www.openstreetmap.org/", {
    mlat: latitude,
    mlon: longitude,
  });

  let gmaps = urlWithParams("https://www.google.com/maps/search/", {
    api: "1",
    query: `${latitude},${longitude}`,
  });

  let url = urlWithParams(
    "https://www.openstreetmap.org/export/embed.html",
    {
      layer: "mapnik",
      bbox,
      marker,
    },
  );

  return {
    embed: `:hiccup[:iframe {
            :width "100%" :height "400"
            :src "${url}"
          }]`,
    osm: `[View on OpenStreetMap](${osm})`,
    gmaps: `[View on Google Maps](${gmaps})`,
  };
}
