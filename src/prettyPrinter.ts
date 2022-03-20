const indent = n => {
  let s = ""
  for (let i = 0; i < n; i++) s += "  "
  return s
}

export const printExpr = (expr: Expr, indents = 0) => {
  const tabs = indent(indents)
  if (typeof expr === "number") return ` ${String(expr)}`
  return `
${tabs}(${expr.op}${printExpr(expr.l, indents + 1)}${printExpr(
    expr.r,
    indents + 1
  )})`
}
