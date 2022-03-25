# Intuitive Parsing

## In progress

A TypeScript parser combinator library focused on ease of use and a simple API.
Initially it will allow parsing RegEx and CFGs before adding support for
indentation-sensitive grammars.

## Motivation

The JS ecosystem has a lot of different options for parsing text, but most are
either heavy-duty implementations built in mind for parsing languages with
pre-written grammars (e.g. Ohm.js), or assume you already have a strong sense
for how parsing works and how to compose parsing functions (e.g. Parsimmon.js).

Parsing is a great solution for many problems that involve working with strings,
and often these benefits aren't obvious to developers who need to do something
simple (like validate and pull out a YouTube video ID from a url) - so they just
resort to regex, which ends up being nearly impossible to read and verify
whether it works or not.

There aren't many good options that bridge the gap between allowing you to solve
simple problems involving strings with something super easy to read and compose
and, on the other end, heavy-duty language parsing where you've already thought
about the language grammar, know how to handle left-recursion, and then want to
create an AST from the resulting parse.

This library is meant to handle both ends by providing an API that's as obvious
as possible and built-in simple error messages to help more developers realize
the benefits of parsers for things they'd normally jump to regex for.

For example, here's how you might parse a video embed:

```typescript
const videoEmbed = (videoId: string) => ({ src: videoId /* other fields */ })
const vimeo = ...

const videoEmbedParser = make(videoEmbed)
  .ignoring(string('http')
    .ignoring(string('s').optional())
    .ignoring(string('://'))
    .optional())
  .ignoring(string('www.').optional())
  .keeping(
    oneOf(
      vimeo,
      oneOf(
        string("youtube.com"),
        string("youtu.be"))
      .ignoring("?v=")
      .keeping(alphaNumeric)))

// or

const videoEmbedParser = make(videoEmbed)
  .keeping(oneOf(
    eatWhile(c => c !== '?')
      .ignoring(string("?v="))
      .keeping(alphaNumeric),
    vimeo))

```

## Prior Work

The implementation is a parser combinator pipeline with ideas from these
sources:

- Software Design for Flexibility, a book by Gerald Sussman and Chris Hanson
- Nimble Parsec, a great parser combinator library ported to many different
  languages
- The core Elm parser
