import {Applicative} from './Applicative'

export interface Monad<T> extends Applicative<T> {
  chain<B>(f: (a: T) => Monad<B>): Monad<B>
  // join<I>(this: Monad<Monad<I>>): Monad<I>
}
