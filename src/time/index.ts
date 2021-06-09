/**
 * Wrapper type for time representation.
 * Either a `number` as milliseconds, or
 * an object with optional number properties:
 *   - `ms` for milliseconds
 *   - `s`  for seconds
 *   - `m`  for minutes
 *   - `h`  for hours
 */
export type Time =
    | number
    | {
          ms?: number;
          s?: number;
          m?: number;
          h?: number;
      };

export type TimeMs = Time & number;
export type TimeObj = Time & object;

export * from "./conversion";
export * from "./math";
