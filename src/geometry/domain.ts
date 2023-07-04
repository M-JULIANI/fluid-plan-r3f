import {Point} from './types';

export enum MinMax{
    Min =0,
    Max =1
}

export enum Direction{
    X =0,
    Y=1
}

export const getMin = (direction: Direction, pts: Point[][])=>{
    if(direction === Direction.X){
        return pts.flatMap(p=>p).sort((a, b)=> a[0] - b[0])[0][0];
    }
    return pts.flatMap(p=>p).sort((a, b)=> a[1] - b[1])[0][1];
}

export const getMax = (direction: Direction, pts: Point[][])=>{
    if(direction === Direction.X){
        return pts.flatMap(p=>p).sort((a, b)=> b[0] - a[0])[0][0];
    }
    return pts.flatMap(p=>p).sort((a, b)=> b[1] - a[1])[0][1];
}

export const getDomain = (direction: Direction, pts: Point[][])=>{
    const max = getMax(direction, pts);
    const min = getMin(direction, pts);
    return {min: min, max: max};
}