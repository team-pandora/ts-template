import { Request as ExpressRequest } from 'express';

export type Modify<T, R> = Omit<T, keyof R> & R;

export type PartialKeys<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type RequiredKeys<T, K extends keyof T> = Pick<Required<T>, K> & Omit<T, K>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Request = ExpressRequest<any, any, any, any>;
