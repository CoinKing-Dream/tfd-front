import conf from "../config";
import _ from "lodash";
export const BaseTile = {
  STANDARD: {
    index: 0,
    key: "standard",
    string: "標準地図",
    url: `${conf.tileServer.url}/xyz/std/{z}/{x}/{y}.png`,
    attribution:
        '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'
  },
  PHOTO: {
    index: 1,
    key: "photo",
    string: "写真地図",
    url: `${conf.tileServer.url}/xyz/seamlessphoto/{z}/{x}/{y}.jpg`,
    attribution:
        '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'
  },
  GRAY: {
    index: 2,
    key: "gray",
    string: "淡色地図",
    url: `${conf.tileServer.url}/xyz/pale/{z}/{x}/{y}.png`,
    attribution:
        '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'
  },
  WHITE: {
    index: 3,
    key: "white",
    string: "白地図",
    url: `${conf.tileServer.url}/xyz/blank/{z}/{x}/{y}.png`,
    attribution:
        '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'
  },
  getBaseTileFromIndex(index) {
    return _.find(this, tile => {
      return _.isMatch(tile, { index: index });
    });
  }
};
