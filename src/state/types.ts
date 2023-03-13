
// Lookups
export type Key = string | number;
export type Path = Key[];

//State
export type NextState<T> = (state: T) => T;
export type Update<T> = T | { [s: string]: any };
export type Updater<T> = (update: Update<T>, cb?: NextState<T>) => void;
export type TaggedUpdater<T> = Updater<T> & { meta?: any };
export type Setter<T> = (value: T | NextState<T>) => void;

//React-like
export type Init<T> = T | (() => T);
export type State<T> = [T, Setter<T>];
export type Cursor<T> = [T, TaggedUpdater<T>];

// State/cursor hooks
export type UseState<T, S extends State<T>> = (i: Init<T>, ...rest: any[]) => S;
export type UseUpdateState<T, C extends Cursor<T>> = (i: Init<T>, ...rest: any[]) => C;
