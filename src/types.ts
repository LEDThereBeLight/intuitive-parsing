export interface Functor<T> {
  map<R>(f: (a: T) => R): Functor<R>
}

export interface Applicative<I> extends Functor<I> {
  apply<A, B>(
    this: Applicative<(a: A) => B>,
    arg: Applicative<A>
  ): Applicative<B>
}

export interface Alternative<T> {
  or(arg: Alternative<T>): Alternative<T>
}

export interface Monad<T> extends Applicative<T> {
  chain<B>(f: (a: T) => Monad<B>): Monad<B>
  // join<I>(this: Monad<Monad<I>>): Monad<I>
}
