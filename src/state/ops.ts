import { Key } from "./types";
export const TypedArray = Object.getPrototypeOf(Int8Array);
const EMPTY_ARRAY: any = [];
const EMPTY_OBJECT: any = {};

type KeyValuePairs = { [s: string]: any };

const $NOP = { $nop: true };
const $DELETE = { $delete: true };

// $op encoders
export const $set = (x: any) => ({ $set: x });
export const $apply = (x: any) => ({ $apply: x });
export const $patch = (x: any) => ({ $patch: x });
export const $merge = (x: any) => ({ $merge: x });
export const $nop = () => $NOP;
export const $delete = () => $DELETE;

// JSON helpers
export const clone = <T>(x: T) => (x != null ? JSON.parse(JSON.stringify(x)) : x) as T;
export const equal = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

// Immutable object patching. Pass a sparse version of `a` as `b` to apply updates.
// Use {$ops: value} to control merge/overwrite behavior.
// Default is to merge.
export const patch = (a: any, b: any = undefined): any => {
    if (b && b.constructor === Object) {
        if (b.hasOwnProperty('$set')) return b.$set;
        if (b.hasOwnProperty('$apply')) return b.$apply(a);
        if (b.hasOwnProperty('$patch')) return patch(a, b.$patch(a));
        if (b.hasOwnProperty('$merge')) return patchMerge(a, b.$merge);
        if (b.hasOwnProperty('$nop')) return a;
        if (b.hasOwnProperty('$delete')) return undefined;
    }
    return patchMerge(a, b);
}

// Recursive merge helper which calls out to patch() to resolve $ops on sub-trees or individual values
export const patchMerge = (a: any, b?: any): any => {
    // Missing value = NOP
    if (b === undefined) return a;

    // Set null
    if (b === null) return b;

    if (a) {
        // Patch array
        if (Array.isArray(a)) {

            // Replace whole array if given one
            if (Array.isArray(b)) return b;
            const out: any[] = [];

            // Patch existing elements, including those set to undefined
            for (let i = 0; i < a.length; ++i) out.push(
                b.hasOwnProperty(i) && b[i] === undefined ? b[i] : patch(a[i], b[i])
            );

            // Add new elements at given index (b is an object, not an array)
            for (let k in b) if (out[+k] === undefined) out[+k] = patch(undefined, b[+k]);

            // Remove elements that were set to `undefined`
            return out.filter(x => x !== undefined);
        }

        // Patch binary array
        if (a instanceof TypedArray) {

            // Replace whole array if given one
            if (b instanceof TypedArray) return b;

            // Binary array can only change values in-place
            const out = a.slice();

            // Patch existing elements
            for (let i = 0; i < a.length; ++i) {
                out[i] = patch(a[i], b[i]);
            }

            return out;
        }

        // Patch object
        if (typeof a === 'object') {
            const out: any = {};

            // Copy existing properties
            // but remove properties that are `undefined`
            for (let k in a) if (!b.hasOwnProperty(k) ||
                b[k] !== undefined) {
                const v = patch(a[k], b[k]);
                if (v !== undefined) out[k] = v;
            }

            // Set new properties
            for (let k in b) if (!a.hasOwnProperty(k) &&
                b[k] !== undefined) {
                const v = patch(undefined, b[k])
                if (v !== undefined) out[k] = v;
            }

            return out;
        }
    }

    // Merge in new ops into non-existent props
    if (b instanceof TypedArray) return b.slice();
    if (Array.isArray(b)) return patch(EMPTY_ARRAY, b);
    if (b && typeof b === 'object') return patch(EMPTY_OBJECT, b);

    // a and b must be primitive values... replace
    return b;
}

// Build sparse update object setting the property at the given path to 'value'
export const wrap = (path: Key[], value: any) =>
    path.slice().reverse().reduce(
        (update: any, key: Key) => ({ [key]: update })
        , value);