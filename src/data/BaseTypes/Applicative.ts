import {Functor} from './Functor'

export interface Applicative<I> extends Functor<I> {
  apply<A, B>(
    this: Applicative<(a: A) => B>,
    arg: Applicative<A>
  ): Applicative<B>
}
