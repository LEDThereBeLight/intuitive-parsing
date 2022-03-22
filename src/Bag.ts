export class Bag<X> {
  t: 'empty' | 'add_right' | 'append'
  v: any | undefined
  constructor(t: 'empty' | 'add_right' | 'append', v?: any) {
    this.v = v
    this.t = t
  }
  static Empty<X>() {
    return new Bag<X>('empty')
  }
  AddRight(problem: string) {
    this.v = problem
    return this
  }
  static AddRight<X>() {
    return new Bag<X>('empty').AddRight('deadend')
  }
  Append<X>(bag: Bag<X>) {
    return new Bag<X>('append', bag)
  }
}
