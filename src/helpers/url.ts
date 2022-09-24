export function stripTrailingSlash(url) {
  if (url.endsWith("/")) {
    return url.slice(0, -1);
  } else {
    return url;
  }
}

export function unlinkify(s) {
  if (s.match(/^\[.*?\]\((.*?)\)$/)) {
    return RegExp.$1;
  } else {
    return s;
  }
}
