import match from './util/match.js'
import helper from './util/helper.js'

/**
 * 第一步目标：
 * 完成高层卡牌数 >= 总数 * percentage1
 * 并且消耗的低层卡牌数 <= 总数 * percentage2
 */

const limit = 7
const timeout = 6 * 2 //运算时间(秒)
const percentage1 = 0.64 //高层卡牌百分比
const percentage2 = 0.16 //低层卡牌百分比
const layerLine = 6 //基准线，layer>=6层视为高层，其它为低层
const resultFile = 'game1.json'
const sortType = process.argv[2]

let highLevelSize, lowLevelSize
let timeoutCount
let cards, matchInfo
let selected, topList, stepList

function init() {
  let m = match.local()
  cards = m.cards
  topList = helper.init(cards)
  matchInfo = m.matchInfo
  timeoutCount = 0
  highLevelSize = parseInt(cards.length * percentage1)
  lowLevelSize = parseInt(cards.length * percentage2)

  selected = {}
  stepList = []
  console.log('options:', topList.length)
  console.log('target stage1:', highLevelSize + lowLevelSize, highLevelSize, lowLevelSize)
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

function highLevelCount() {
  return stepList.filter(e => cards[e].layerNum >= layerLine).length
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

  let hc = highLevelCount()
  if (hc >= highLevelSize && stepList.length <= hc + lowLevelSize) {
    // print(stepList)
    let sel = getSel()
    console.log('cost:', (t2 - t1))
    console.log('selected:', count)
    console.log(sel.map(e => cards[e].name))
    console.log('options:', topList.length)

    let hl = stepList.filter(e => cards[e].layerNum >= layerLine)
    let ll = stepList.filter(e => cards[e].layerNum < layerLine)
    console.log('stage1:', stepList.length, hl.length, ll.length)
    console.log('========')
    console.log(stepList.join(','))
    console.log('========')
    let rest = cards.filter(e => !e.selected)
    let hl2 = rest.filter(e => e.layerNum >= layerLine).map(e => e.idx)
    let ll2 = rest.filter(e => e.layerNum < layerLine).map(e => e.idx)
    console.log('rest of high level:', hl2.length)
    console.log(hl2.join(','))
    console.log('rest of low level:', ll2.length)
    console.log(ll2.join(','))
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
  let options = topList.concat()
  for (let i = 0; i < options.length; i++) {
    select(options[i])
    run()
    undo()
  }
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