export function eq(a: any, b: any) {
  let idx = 0
  if (a === b) {
    return true
  }
  if (typeof a.equals === 'function') {
    return a.equals(b)
  }
  if (a.length > 0 && a.length === b.length) {
    for (; idx < a.length; idx += 1) {
      if (!eq(a[idx], b[idx])) {
        return false
      }
    }
    return true
  }
  return false
}

export interface Eq<T> {
  equals(t: T): boolean
}

export interface Monad<T> {
  unit<U>(t: U): Monad<U>
  bind<U>(f: (t: T) => Monad<U>): Monad<U>
  of<U>(t: U): Monad<U>
  chain<U>(f: (t: T) => Monad<U>): Monad<U>
}

export interface Functor<T> {
  fmap<U>(f: (t: T) => U): Functor<U>
  lift<U>(f: (t: T) => U): Functor<U>
  map<U>(f: (t: T) => U): Functor<U>
}
