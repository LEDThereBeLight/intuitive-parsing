type Ok<Value> = { t: 'ok'; value: Value }
type Failure<Reason extends string> = { t: 'failure'; value: Reason }

class Result<Value> {
  value: Ok<Value> | Failure<string>

  constructor(value: Ok<Value> | Failure<string>) {
    this.value = value
  }

  valueOrDefault<Default>(defaultingTo: Default) {
    return match(this.value)
      .with({ t: 'ok', value: select() }, id)
      .with({ t: 'failure' }, () => defaultingTo)
  }

  static Fail<Reason extends string>(value: Reason) {
    return new Result({ t: 'failure', value })
  }

  static Ok<Value>(value: Value) {
    return new Result({ t: 'ok', value })
  }
}
const Ok = Result.Ok
const Fail = Result.Fail
