export function findTextNodesUnderElement(element: Element) {
  const nodeArray: Node[] = [];

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

  let node: Node | null = walker.currentNode;

  while (node) {
    nodeArray.push(node);

    node = walker.nextNode();
  }
  return nodeArray;
}

export function isTextNode(node: Node): node is Text {
  return node.nodeName === '#text';
}
