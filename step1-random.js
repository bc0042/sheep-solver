import match from './util/match.js'
import helper from './util/helper.js'

const limit = 7
const timeout = 3
const optionsCount = 10
const resultFile = 'game1.json'
const follow = []

let stage1
let timeoutCount
let cards, matchInfo
let selected, topList, stepList

function init() {
  let m = match.local()
  cards = m.cards
  topList = helper.init(cards)
  matchInfo = m.matchInfo

  selected = {}
  stepList = []
  stage1 = parseInt(cards.length * 0.6)+20
  timeoutCount = 0

  if (follow.length > 0) {
    console.log('follow====', follow.join(','))
    follow.forEach(e => select(e))
  }

  console.log('round:', ++round)
  console.log('options:', topList.length)
  console.log('try:', stage1)
  // process.exit()
}

function print(list) {
  let a = list.map(e => cards[e].name)
  console.log(a.join(','))
}

function removeItem(list, e) {
  let i = list.indexOf(e)
  if (i >= 0) {
    list.splice(i, 1)
  }
}

function selectedCount() {
  let size = Object.values(selected).map(e => e.length % 3).reduce(((a, b) => a + b), 0)
  return size
}

function select(id) {
  removeItem(topList, id)
  let c = cards[id]
  c.selected = 1
  c.parent.forEach(e => {
    let c1 = cards[e]
    c1.children = c1.children.filter(e1 => e1 != id)
    if (c1.children.length == 0) {
      topList.unshift(c1.idx)
    }
  })
  stepList.push(id)
  let arr = selected[c.type]
  if (!arr) {
    arr = []
    selected[c.type] = arr
  }
  arr.push(id)
}

function undo() {
  let last = stepList.pop()
  let c = cards[last]
  c.selected = 0
  c.parent.forEach(e => {
    let c1 = cards[e]
    c1.children.push(c.idx)
    removeItem(topList, c1.idx)
  })
  topList.push(last)
  removeItem(selected[c.type], last)
}

function run() {
  let t2 = new Date().getTime()
  let count = selectedCount()
  if (count >= limit) {
    return 0
  }

  if (stepList.length >= stage1 && topList.length >= optionsCount) {
    // print(stepList)
    console.log('cost:', (t2 - t1))
    console.log('done:', stepList.length)
    console.log('selected:', count)
    console.log('options:', topList.length)
    console.log(stepList.join(','))
    // console.log('types', stepList.map(e => cards[e] && cards[e].type).join(','))
    helper.save({ stepList, topList, selected, cards, matchInfo }, resultFile)
    process.exit(0)
  }

  if (t2 - t1 > timeout * 1000) {
    if (timeoutCount++ <= 10) {
      console.log('timeout, steps', stepList.length, topList.length, count)
    }
    return 1
  }

  sort()
  let options = topList.concat()
  for (let i = 0; i < options.length; i++) {
    select(options[i])
    run()
    undo()
  }
}

function sort() {
  topList.sort(() => Math.random() - 0.5)
}


let t1, round = 0
while (1) {
  t1 = new Date().getTime()
  init()
  run()
}