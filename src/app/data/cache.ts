let c_id = "";
let cache: { [key: string]: unknown } = {};

export { c_id };

export function get<T>(key: string): T {
  return cache[key] as T;
}

export function set(key: string, val: unknown) {
  cache[key] = val;
  digest();
}

const digest = () => {

}