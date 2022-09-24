import { mapLocation } from './mapLocation'

export function handleLiveLocationUpdate(edited_message) {
  let message = edited_message;
  let uid = `telegram-${message.chat.id}-${message.message_id}`;
  let mapuid = `${uid}-map`;

  let { embed, osm, gmaps } = mapLocation(edited_message.location);

  window.roamAlphaAPI.updateBlock({
    block: {
      uid: mapuid,
      string: embed,
    },
  });

  window.roamAlphaAPI.updateBlock({
    block: {
      uid: `${mapuid}-link-osm`,
      string: osm,
    },
  });

  window.roamAlphaAPI.updateBlock({
    block: {
      uid: `${mapuid}-link-gmaps`,
      string: gmaps,
    },
  });
}
