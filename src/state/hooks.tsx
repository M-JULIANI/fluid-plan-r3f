import { useRef, useState, useCallback, useEffect } from "react";
import { Path, Update, Updater, TaggedUpdater } from './types'
import { Init, State, Cursor, UseState, UseUpdateState } from './types';

import { equal, patch, wrap } from './ops'

const NO_PATH: Path = [];
const ROOT_UPDATER = { path: NO_PATH, name: 'state' };

// Tag function once with lazily evaluated metadata
export const tagFunction = <T,>(f: Updater<T>, meta: () => any = () => ({})): TaggedUpdater<T> => {
  const tf = f as unknown as TaggedUpdater<T>;
  if (tf.meta === undefined) tf.meta = meta();
  return tf;
};
// Variant of useState that merges sparse updates using patch
export const makeUseUpdate = <T,>(useState: UseState<T, State<T>>): UseUpdateState<T, Cursor<T>> =>
  (initial: Init<T>, ...rest: any): Cursor<T> => {
    const [value, setState] = useState(initial, ...rest);

    const updateState = tagFunction(
      useCallback((update: Update<T>) => {
        // Apply as sparse update
        // @ts-ignore
        setState((value: any) => patch(value, update));
      }, []),
      () => ROOT_UPDATER);
    return [value, updateState];
  }
export const useUpdateState = <T,>(i: Init<T>, ...r: any) => makeUseUpdate(useState)(i, ...r) as unknown as Cursor<T>;

export const useRefineState = (value: any, updateState: TaggedUpdater<any>):
  ((...path: Path) => [any, TaggedUpdater<any>]) => {

  const useCursor = (...path: (string | number)[]) => {
    // Keep hook dependency checker happy
    const updateStateInner = updateState;

    // Look up child value
    let child: any = value;
    for (const key of path) if (child) {
      child = child[key]
    }

    // Create updater for child value
    const updateChild = tagFunction(
      useCallback((value) => {

        // Build sparse update object with the affected property
        const update = wrap(path, value);
        updateStateInner(update);

      }, [path, updateStateInner]),
      () => ({
        path: ((updateState.meta && updateState.meta.path) || []).concat(path),
        name: ((updateState.meta && updateState.meta.name) || '') + '-' + path.join('-'),
      })
    );

    return [child, updateChild] as [any, Updater<any>];
  };

  return useCursor;
};