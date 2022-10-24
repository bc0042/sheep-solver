import match from './util/match.js'
import helper from './util/helper.js'

/**
 * 直接跑出结果
 */

const limit = 7
const timeout = 6 * 10 //运算时间(秒)
const resultFile = 'game1.json'
const sortType = process.argv[2]

let highLevelSize 
let timeoutCount
let cards, matchInfo
let selected, topList, stepList
let situation

function init() {
  let m = match.local()
  cards = m.cards
  topList = helper.init(cards)
  matchInfo = m.matchInfo
  timeoutCount = 0
  situation = new Set()

  if (process.argv[3]) {
    highLevelSize += parseInt(process.argv[3])
  }

  selected = {}
  stepList = []
  console.log('options:', topList.length)
  console.log('========')
  // process.exit()
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

function getSel() {
  let sel = []
  for (let e of Object.values(selected)) {
    let n = e.length % 3
    if (n > 0) {
      sel = sel.concat(e.slice(-n))
    }
  }
  return sel
}


function run() {
  let t2 = new Date().getTime()
  let count = selectedCount()
  if (count >= limit) {
    return 0
  }

  let hc = 0
  // let hc = highLevelCount()
  // if (hc >= highLevelSize && stepList.length <= hc + lowLevelSize) {
  if (stepList.length >= cards.length) {
    // print(stepList)
    let sel = getSel()
    console.log('cost:', (t2 - t1))
    console.log('selected:', count)
    console.log(sel.map(e => cards[e].name))
    console.log('options:', topList.length)

    console.log('========')
    console.log(stepList.join(','))
    console.log('========')
    // console.log('types', stepList.map(e => cards[e] && cards[e].type).join(','))
    helper.save({ stepList, topList, selected, cards, matchInfo }, resultFile)
    process.exit(99)
  }

  if (t2 - t1 > timeout * 1000) {
    if (timeoutCount++ <= 10) {
      console.log('timeout, steps', stepList.length, hc, topList.length, count)
    }
    return 1
  }

  sort()
  if (remember()) return 2
  else situation.add(topList.join(','))

  let options = topList.concat()
  for (let i = 0; i < options.length; i++) {
    select(options[i])
    run()
    undo()
  }
}

function remember() {
  let s = topList.join(',')
  return situation.has(s)
}

function sort() {
  topList.sort((a, b) => {
    let c1 = cards[a]
    let c2 = cards[b]
    if (sortType == 1) {
      return c2.idx - c1.idx
    } else if (sortType == 2) {
      return c2.layerNum - c1.layerNum
    } else {
      if (c2.layerNum == c1.layerNum) {
        return c2.idx - c1.idx
      } else {
        return c2.layerNum - c1.layerNum
      }
    }
  })
}


let t1
while (1) {
  t1 = new Date().getTime()
  init()
  run()
  console.log('failed')
  process.exit(101)
}