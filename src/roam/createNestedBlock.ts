import { findMaxOrder } from "./findMaxOrder";

type Block = {
  string?: string;
  uid?: string;
  order?: number;
  children?: Block[];
};

export function createNestedBlock(
  parent,
  { uid, order, string, children = [] }: Block
) {
  if (uid === undefined) {
    uid = window.roamAlphaAPI.util.generateUID();
  }

  if (order === undefined) {
    order = findMaxOrder(parent) + 1;
  }

  window.roamAlphaAPI.createBlock({
    location: { "parent-uid": parent, order },
    block: { uid, string },
  });

  for (let child of children) {
    createNestedBlock(uid, child);
  }

  return uid;
}
