// regex functions
// any character except newline
// add indentation support
// add custom context implementations

// Parser options:
// .optionally         ?
// .required (for whitespace)
// .oneOrMore          +
// .zeroOrMore         *
// .repeat(min, max)   {min, max}
// .atLeast(min)       {min, inf}
// .atMost(max)        {0,   max}

// Add the full stack trace on errors ->
// On failure, pull out the x and push a new error with the expected value from that location


// Add recursion detector -> same method called with same index?
// Maybe just detect if same method is called immediately afterwards with same index
// (this is pure left recursion)
// Would need map to memoize, would this mess up backtrackers?

// map trail
// expedition
// trailhead
// destination
// junction, fork
// path
// explore
// record deadends -> either along same path or down a new path
// report deadend?
// return trip -> report?

// parsing:
// walk path, report deadends with trail info, return mapping
