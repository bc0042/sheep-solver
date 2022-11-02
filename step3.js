import helper from './util/helper.js'
import props from './util/props.js'

/**
 * 第三步目标：
 * 再使用一次移出道具
 * 完成全部卡牌
 */

const limit = 7
const timeout = 6
const layerLine = 6
const fromFile = 'game2.json'
const resultFile = 'game3.json'
const isRandom = process.argv[2]

let target
let timeoutCount
let cards, matchInfo
let selected, topList, stepList, stepListOld
let situation


function init() {
  let game = helper.load(fromFile)
  cards = game.cards
  topList = game.topList
  matchInfo = game.matchInfo
  stepListOld = game.stepList
  selected = game.selected
  target = cards.length
  timeoutCount = 0
  stepList = []
  situation = new Set()

  console.log('from:', stepListOld.length)
  console.log('total:', target)
  console.log('options:', topList.length, selectedCount())

  while (selectedCount() < limit - 4) {
    let id = topList[0]
    select(id)
    stepListOld.push(stepList.pop()) // bug fixed 
    console.log('init select', id)
  }

  props.doOut2(selected, topList, stepList, stepListOld, cards)
  target += 8

  console.log('options:', topList.length, selectedCount())
  console.log('target:', target)
}

function removeItem(list, e) {
  let i = list.indexOf(e)
  if (i >= 0) {
    list.splice(i, 1)
  }
}
function highLevelCount() {
  return stepList.filter(e => e >= 0 && cards[e].layerNum >= layerLine).length
}

function selectedCount() {
  return Object.values(selected).map(e => e.length % 3).reduce(((a, b) => a + b), 0)
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

  if (stepList.length + stepListOld.length >= target) {
    // print(stepList)
    stepList = stepListOld.concat(stepList)
    console.log('cost:', (t2 - t1))
    console.log('done:', stepList.length)
    console.log('selected:', count)
    console.log('options:', topList.length)
    console.log('==============')
    console.log(stepList.join(','))
    // console.log('types', stepList.map(e => cards[e] && cards[e].type).join(','))
    helper.save({ stepList, topList, selected, cards, matchInfo }, resultFile)
    process.exit(999)
  }

  if (t2 - t1 > timeout * 1000) {
    if (timeoutCount++ <= 10) {
      let hc = highLevelCount()
      console.log('timeout, steps', stepList.length, hc, topList.length, count)
      console.log(stepList.join(','))
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

function mapByType(list) {
  let map = {}
  list.forEach(e => {
    let c = cards[e]
    let t = c.type
    map[t] = map[t] || []
    map[t].push(1)
  })
  return map
}

function sort() {
  let mapTop = mapByType(topList)
  let mapSel = mapByType(getSel())

  topList.sort((a, b) => {
    return b-a
    // let t1 = cards[a].type
    // let t2 = cards[b].type
    // let d1 = (mapSel[t2] ? mapSel[t2].length : 0) - (mapSel[t1] ? mapSel[t1].length : 0)
    // let d2 = mapTop[t2].length - mapTop[t1].length
    // return d1 == 0 ? d2 : d1
  })
}


let t1
while (1) {
  t1 = new Date().getTime()
  init()
  run()
  console.log('failed')
  break
}