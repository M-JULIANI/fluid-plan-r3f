import { Vec2 } from "geometry/vec2";

export interface NodeType<T extends string, P, C extends Node | void> {
    id: string;
    type: T;
    props: P;
    children: C[];
}

export type NodeGetter = (id?: string) => Node | undefined;

export type Node = NodeType<any, any, any>;
export type Nodes = {
    id: string;
    nodes: Record<string, Node>;
  };

export interface HasId {
    id: string;
  }

  export const emptyNode = (): Node => ({
    id: '',
    type: 'node',
    props: {},
    children: [],
  });

  export interface ChildrenMixin<T> {
    children: T[];
  }