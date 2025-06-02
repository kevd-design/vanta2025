export type DebouncedFunction<Args extends unknown[], Return> = {
  (...args: Args): Return
  cancel: () => void
  flush: () => void
}