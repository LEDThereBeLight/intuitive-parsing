export function string(target: string) {
  return this.token({
    t: 'token',
    v: target,
    problem: `Expecting ${target}`,
  })
}
