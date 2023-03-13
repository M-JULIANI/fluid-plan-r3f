import uuid from 'uuid';
import { Node } from './types';

export const makeNode = (object: any): Node => {
    return {
        ...object,
        type: 'guide',
        children: []
    }
}