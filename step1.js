import match from './util/match.js'
import helper from './util/helper.js'

/**
 * 第一步目标：
 * 完成高层卡牌数 >= 总数 * percentage1
 * 并且消耗的低层卡牌数 <= 总数 * percentage2
 */

const limit = 7
const timeout = 6 * 6 //运算时间(秒)
const percentage1 = 0.6 //高层卡牌百分比
const layerLine = 6 //基准线，layer>=6层视为高层，其它为低层
const resultFile = 'game1.json'
const sortType = process.argv[2]

let timeoutCount
let cards, matchInfo
let selected, topList, stepList
let situation

let hlTotal, llTotal, p1
let plus = parseInt(process.argv[3])

function init() {
  let m = match.local()
  cards = m.cards
  topList = helper.init(cards)
  matchInfo = m.matchInfo
  timeoutCount = 0
  situation = new Set()
  p1 = parseInt(cards.length * percentage1)

  selected = {}
  stepList = []
  console.log('options:', topList.length)
  console.log('========')

  hlTotal = cards.filter(e => e.layerNum >= layerLine).length
  llTotal = cards.length - hlTotal
  if (Number.isNaN(plus)) plus = 0
  console.log('stage1:', hlTotal, llTotal, plus, p1)
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
  let lc = stepList.length - hc
  let rhc = hlTotal - hc
  let rlc = llTotal - lc
  if ((rhc + plus) <= (rlc) && stepList.length >= p1) {
    // if (hc >= highLevelSize && (hlTotal-hc)<(llTotal-lc)) {
    // if (hc >= highLevelSize ) {
    // print(stepList)
    let sel = getSel()
    console.log('cost:', (t2 - t1))
    console.log('selected:', count)
    console.log(sel.map(e => cards[e].name))
    console.log('options:', topList.length)

    let ll = stepList.filter(e => cards[e].layerNum < layerLine)
    console.log('stage1:', stepList.length, hc, lc)
    console.log('========')
    console.log(stepList.join(','))
    console.log('========')
    let rest = cards.filter(e => !e.selected)
    let hl2 = rest.filter(e => e.layerNum >= layerLine).map(e => e.idx)
    let ll2 = rest.filter(e => e.layerNum < layerLine).map(e => e.idx)
    console.log('rest of high level:', rhc)
    console.log(hl2.join(','))
    console.log('rest of low level:', rlc)
    console.log(ll2.join(','))
    // console.log('types', stepList.map(e => cards[e] && cards[e].type).join(','))
    helper.save({ stepList, topList, selected, cards, matchInfo }, resultFile)
    process.exit(99)
  }

  if (t2 - t1 > timeout * 1000) {
    if (timeoutCount++ <= 10) {
      console.log('timeout, steps', stepList.length, rhc, rlc, topList.length, count)
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