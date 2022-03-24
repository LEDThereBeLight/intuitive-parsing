import {DeadEnd} from './DeadEnd'
/* As we Look for a destiation, we mark each waypoint we've visited and what we were expecting to find at that location. If our path is straight and we never run into a fork, our record will look like a line. But if there are forks with multiple paths we can take, we may need to backtrack if we reach a deadend before finding our destination. In this case, our record will look like a tree.

creates this on backtracking -> failures add to this with the location info provided by the bound loc variable in each parser
*/

type Marker = 'empty' | 'deadend' | 'straight' | 'forked'
export type DirectionsT =
  | { t: 'empty' }
  | { t: 'deadend'; deadEnd: DeadEnd }
  | { t: 'straight'; deadEnd: DeadEnd; pathAhead: DirectionsT }
  | { t: 'forked'; deadEnd: DeadEnd; pathAhead: DirectionsT }

function Directions(t: 'empty'): DirectionsT
function Directions(t: 'deadend', deadEnd: DeadEnd): DirectionsT
function Directions(
  t: 'straight' | 'forked',
  deadEnd: DeadEnd,
  pathAhead: DirectionsT
): DirectionsT
function Directions(t: Marker, deadEnd?: DeadEnd, pathAhead?: DirectionsT) {
  if (t === 'empty') return { t }
  if (t === 'deadend') return { t, deadEnd }
  if (t === 'straight') return { t, deadEnd, pathAhead }
  if (t === 'forked') return { t, deadEnd, pathAhead }
}

function empty() {
  return Directions('empty')
}
function hitDeadend(deadEnd: DeadEnd) {
  return Directions('deadend', deadEnd)
}

function wentStraight(deadEnd: DeadEnd, pathAhead: DirectionsT): DirectionsT {
  return Directions('straight', deadEnd, pathAhead)
}

function tookFork(deadEnd: DeadEnd, pathAhead: DirectionsT): DirectionsT {
  return Directions('forked', deadEnd, pathAhead)
}

// TODO: Trampoline
// Check this logic
function toList(d: DirectionsT, acc = []): DeadEnd[] {
  if (d.t === 'empty') return acc
  if (d.t === 'deadend') {
    acc.push(d)
    return acc
  }
  acc.push(d)
  return toList(d.pathAhead, acc)
}
export default {
  empty,
  hitDeadend,
  wentStraight,
  tookFork,
  toList,
}
