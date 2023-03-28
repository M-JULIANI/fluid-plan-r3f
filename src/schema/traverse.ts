import { Node, NodeGetter } from "./types";


export const getNodeKeys = (root: Node, path: string[], getNode: NodeGetter): (string | number)[] | null => {
    let list = root.children;
    const out: (string | number)[] = [];
  
    for (const id of path) {
      let child: Node | undefined;
      const index = list.findIndex((shape: Node) => {
        if (shape.id === id) {
          child = shape;
          return true;
        } else if (shape.props.symbol && shape.props.symbol === id) {
          child = getNode(shape.props.symbol);
          return true;
        }
        return false;
      });
      if (!child) return null;
  
      out.push('children', index);
      list = child.children;
    }
  
    return out;
  };