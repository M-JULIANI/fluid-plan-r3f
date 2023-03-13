import { Vec2 } from "geometry/Vec2";

export interface NodeType<T extends string, P, C extends Node | void> {
    id: string;
    type: T;
    props: P;
    children: C[];
}

export type Node = NodeType<any, any, any>;