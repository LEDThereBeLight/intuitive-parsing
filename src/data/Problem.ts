export type Problem =
  // numbers
  | { t: 'expecting_int' }
  | { t: 'expecting_hex' }
  | { t: 'expecting_oct' }
  | { t: 'expecting_bin' }
  | { t: 'expecting_float' }
  | { t: 'expecting_num' }
  // strings
  | { t: 'expecting'; v: string }
  | { t: 'expecting_sym'; v: string }
  | { t: 'expecting_kwd'; v: string }
  | { t: 'problem'; v: string }
  | { t: 'expecting_var' }
  // other
  | { t: 'expecting_end' }
  | { t: 'unexpected_char' }
  | { t: 'bad_repeat' }

export const problemToString = (p: Problem) => {
  switch (p.t) {
  case 'expecting':
    return
  case 'expecting_int':
    return
  case 'expecting_hex':
    return
  case 'expecting_oct':
    return
  case 'expecting_bin':
    return
  case 'expecting_float':
    return
  case 'expecting_num':
    return
  case 'expecting_var':
    return
  case 'expecting_sym':
    return
  case 'expecting_kwd':
    return
  case 'expecting_end':
    return
  case 'problem':
    return
  case 'unexpected_char':
    return
  case 'bad_repeat':
    return
  }
}
