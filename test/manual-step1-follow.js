import match from '../util/match.js'
import helper from '../util/helper.js'
import props from '../util/props.js'

const limit = 7
const timeout = 3
const optionsCount = 10
const resultFile = 'game1.json'
const follow = [167,168,169,170,171,172,67,173,180,68,181,182,176,177,154,152,178,175,150,179,165,147,174,164,134,149,138,36,155,159,157,151,161,127,160,156,158,148,146,135,163,162,129,153,166,124,128,145,130,137,136,142,141,144,63,131,133,123,125,143,120,140,118,107,139,112,122,132,111,31,126,114,62,110,57,52,119,58,53,117,22,14,113,116,102,115,104,49,109,121,30,108,103,106,99,101,21,98,97,33,105,96,93,90,48,44,100,95,38,94,92,88,91,87,85,89,84,13,86,81,79]

let stage1
let timeoutCount
let cards, matchInfo
let selected, topList, stepList

function init() {
  let m = match.local()
  cards = m.cards
  topList = helper.init(cards)
  // cards.sort((a,b)=>b.children.length-a.children.length)
  // console.log(cards.map(e=>e.children.length).join(','))
  matchInfo = m.matchInfo

  selected = {}
  stepList = []
  stage1 = parseInt(cards.length * 0.6)+20
  timeoutCount = 0

  if (follow.length > 0) {
    console.log('follow====', follow.length)
    follow.forEach(e => {
      select(e)
      console.log(e, topList.length, selectedCount(), '===')
    })
  }

  console.log('options:', topList.length, selectedCount())
  print(topList)
  console.log(topList.map(e=>cards[e].idx).join(','))
  // helper.save({ stepList, topList, selected, cards, matchInfo }, resultFile)

  props.doShuffle(stepList, cards)
  print(topList)
  console.log(topList.map(e=>cards[e].idx).join(','))
  process.exit()
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