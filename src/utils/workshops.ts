
export function processPath(path: string) {
  let res = path.substr(0, path.lastIndexOf("."));
  res = res.substr(2);
  res = res.replaceAll(" ", "-");
  res = res.replaceAll("_index", "");
  res = res.replaceAll("_", "-");
  res = res.replaceAll(".", "-");
  res = './' + res
  return res
}




