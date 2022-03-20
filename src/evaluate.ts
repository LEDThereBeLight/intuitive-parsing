const globalEnv = () => ({
  "+": (l, r) => l + r,
  "-": (l, r) => l - r,
  "*": (l, r) => l * r,
  "/": (l, r) => l / r,
})

export const binopAp = ([l, op, r]: [Expr, string, Expr]): Binop => ({
  t: "binop",
  op,
  l,
  r,
})
export const partialBinopAp = ([op, r]: [string, Expr]): PartialBinop => ({
  t: "partialbinop",
  op,
  r,
})

export const evaluate = (expr: Expr, env = globalEnv()): number => {
  if (typeof expr === "number") return expr
  if (expr.t === "binop")
    return env[expr.op](evaluate(expr.l), evaluate(expr.r))
}
