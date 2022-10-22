import fs from 'fs'

let width = 60, scale = 8

function init(cards) {
  let cardMap = {}
  for (let i = 0; i < cards.length; i++) {
    let c = cards[i]
    c.idx = i
    c.children = []
    c.parent = []
    c.selected = 0
    let arr = cardMap[c.layerNum]
    if (!arr) arr = []
    arr.push(c)
    cardMap[c.layerNum] = arr

  }
  return addCards(cardMap, cards)
}

function addCards(cardMap, cards) {
  let topList = []
  Object.keys(cardMap).forEach(l => {
    let currLayer = cardMap[l]
    if (l == 1) {
      topList = topList.concat(currLayer.map(e => e.idx))
    } else {
      overlap(currLayer, cards, topList)
    }
  })
  return topList
}

function overlap(currLayer, cards, topList) {
  let oldList = []
  currLayer.forEach(c1 => {
    let isOverlap = false
    cards.filter(e => e.layerNum < c1.layerNum).forEach(e => {
      let c2 = e
      let xdiff = Math.abs(c1.rolNum - c2.rolNum) * scale
      let ydiff = Math.abs(c1.rowNum - c2.rowNum) * scale
      if (xdiff < width && ydiff < width) {
        // console.log(xdiff,ydiff,'==')
        c1.parent.push(c2.idx)
        c2.children.push(c1.idx)
        oldList.push(c2.idx)
        if (topList.indexOf(c1.idx) < 0) {
          topList.push(c1.idx)
        }
        isOverlap = true
      }
    })
    if (!isOverlap) {
      topList.push(c1.idx)
    }
  })
  oldList.forEach(e => {
    removeItem(topList, e)
  })
}

function removeItem(list, e) {
  let i = list.indexOf(e)
  if (i >= 0) {
    list.splice(i, 1)
  }
}

function save(obj, name) {
  fs.writeFileSync('data/' + name, JSON.stringify(obj))
  console.log('save', name)
}

function load(name) {
  let s = fs.readFileSync('data/' + name)
  // console.log('load game')
  return JSON.parse(s)
}

export default {
  init,
  save,
  load,
}