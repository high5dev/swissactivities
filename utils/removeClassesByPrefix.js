export const removeClassByPrefix = (node, prefix) => {
  const regx = new RegExp("\\b" + prefix + "[^ ]*[ ]?\\b", "g");
  node.className = node.className.replace(regx, "");
  return node;
};
