test('parser', () => {
  it('works', () => {
    const string = '(list 1 2 foo (list nice 3 56 989 asdasdas))'

    // Just an api playground at this point
    /*

    backtrackable: lookAheadFor()

    .then(P.backtrack)?

      let theString = s => s
      let word = (s) = P.make(s => s)
        .from(P.string(s).ignore().then(P.backtrack))
        .from(P.any(
          P.chompIf(isVarChar).map(() => true).backtrack()
          P.succeed(false)
        ).keep())
        .then(checkEnding(s))


    const Atom = (text: string) => ({
      type: 'atom',
      text,
    })
    const atom = () => {}
    const Num = () => {}
    const number = () => {}
    const List = () => {}

    const ListItem = P.any(
      P.create(Atom).from(atom),
      P.create(Num).from(number),
      P.create(List).from(listParser)
    )

    // which syntax is better?
    const ListItem2 = P.create(Atom)
      .from(atom)
      .or(P.create(Num).from(number))
      .or(P.create(List).from(listParser))

    function listParser() {
      return P.create(List).from(
        P.sequence({
          start: '(',
          end: ')',
          separator: P.spaces,
          item: ListItem,
          allowEmpty: false,
        })
      )
    }

    const listParser2 = P.create(List)
      .ignoring(P.string('('))
      .ignoring(P.spaces.optionally)
      .keeping(ListItem.oneOrMore.separatedBy(P.spaces))
      .ignoring(P.spaces.optionally)
      .ignoring(P.string(')'))

    const listParser3 = P.create(List).keeping(
      ListItem.oneOrMore.separatedBy(P.spaces).wrappedBy({
        left: P.string('(').then(P.spaces.optionally),
        right: P.spaces.optionally.then(P.string(')')),
      })
    )

    listParser()
    */
  })
})
