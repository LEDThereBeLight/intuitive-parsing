import { match, select } from "ts-pattern";

type FailureReason = {};
const id = (x: any) => x;

type Parser<Value> = {
  t: "Parser";
  failureReason: FailureReason;
  value: Value;
};
// type Value = any
// type Error = any
type Result<Value, Failure = any> =
  | { t: "ok"; value: Value }
  | { t: "failure"; reason: Failure };
const Ok = <Value>(value: Value): Result<Value> => ({ t: "ok", value });
const Failure = <Failure>(reason: Failure) => ({ t: "failure", reason });
type Failure = any[];

type Parse<Value> = (
  parser: Parser<Value>
) => (source: string) => Result<Value, Error[]>;

type valueOrDefault<TheDefault> = (
  defaulting: TheDefault
) => (res: Result<TheDefault, Failure>) => TheDefault;
const valueOrDefault: valueOrDefault<TheDefault> = <TheDefault = any>(
  defaulting: TheDefault,
  result: Result<TheDefault>
) =>
  match<Result<any, any>>(result)
    .with({ t: "ok", value: select() }, id)
    .with({ t: "failure" }, () => defaulting);

const map = <Target>(f: (x: any) => Target, result: Result<Target>) =>
  match(result)
    .with({ t: "ok", value: select() }, (value) => Ok(f(value)))
    .otherwise(id);

    andThen : (a -> Result x b) -> Result x a -> Result x b
    andThen callback result =
        case result of
          Ok value ->
            callback value
    
          Err msg ->
            Err msg