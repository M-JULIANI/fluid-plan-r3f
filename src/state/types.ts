
export type NextState<T> = (state: T) => T;
export type Update<T> = T | { [s: string]: any };
export type Updater<T> = (update: Update<T>, cb?: NextState<T>) => void;