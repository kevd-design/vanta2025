type AnyFunction = (...args: unknown[]) => unknown;

export function throttle<T extends AnyFunction>(func: T, wait: number): T & { cancel: () => void } {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: unknown = null; // Store 'this' context
  
  // Create the throttled function with correct typing
  const throttled = function(this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - lastCall);
    
    // Store the latest arguments and context
    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    // If it's the first call or enough time has elapsed
    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      return func.apply(this, args) as ReturnType<T>; // Cast the return value
    } 
    
    // Set up the delayed call if not already pending
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        if (lastArgs && lastThis) {
          func.apply(lastThis as object, lastArgs);
          // Clear references to avoid memory leaks
          lastArgs = null;
          lastThis = null;
        }
      }, remaining);
    }
    
    return undefined as unknown as ReturnType<T>; // Cast undefined to match return type
  };
  
  // Create the result object with both the function and cancel method
  const result = throttled as unknown as T & { cancel: () => void };
  
  result.cancel = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      // Clean up references
      lastArgs = null;
      lastThis = null;
    }
  };
  
  return result;
}