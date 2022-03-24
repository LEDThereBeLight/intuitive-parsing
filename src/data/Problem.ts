export type Problem =
  | { t: 'expecting'; v: string }
  | { t: 'expecting_int' }
  | { t: 'expecting_hex' }
  | { t: 'expecting_oct' }
  | { t: 'expecting_bin' }
  | { t: 'expecting_float' }
  | { t: 'expecting_num' }
  | { t: 'expecting_var' }
  | { t: 'expecting_sym'; v: string }
  | { t: 'expecting_kwd'; v: string }
  | { t: 'expecting_end' }
  | { t: 'problem'; v: string }
  | { t: 'unexpected_char' }
  | { t: 'bad_repeat' }
