import {Parser} from '../Parser'

type SpacesSpec = {
  tabs: boolean
  spaces: boolean
  newlines: boolean
  garbage: boolean
}

declare module '../Parser' {
  export interface Parser<V> {
    spaces: () => {}
  }
}

function spaces(
  spacesSpec: SpacesSpec = {
    tabs: true,
    spaces: true,
    newlines: true,
    garbage: false,
  }
): Parser<string> {
  // Decide what the default should be. Required whitespace or no?
  // Probably match 0 or more \t \n \r ' ' by default
  // Maybe skip tabs?
  return Parser.of(s => {})
}

const garbageNewlines = {
  0x000b: true, // vertical tab
  0x000c: true, // form feed
  0x0085: true, // next line
  0x2028: true, // line separator
  0x2029: true, // paragraph separator
}

const garbageSpaces = {
  0x00a0: true, // &nbsp
  0x1680: true, // the rest of these are junk unicode spaces
  0x2000: true,
  0x2001: true,
  0x2002: true,
  0x2003: true,
  0x2004: true,
  0x2005: true,
  0x2006: true,
  0x2007: true,
  0x2008: true,
  0x2009: true,
  0x200a: true,
  0x202f: true,
  0x205f: true,
  0x3000: true,
  0x180e: true,
  0x200b: true,
  0x200c: true,
  0x200d: true,
  0x2060: true,
  0xfeff: true,
}

const carriageReturn = 0x000d
const lineFeed = 0x000a
const space = 0x0020
const tab = 0x0009
