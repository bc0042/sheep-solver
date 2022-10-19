import { shuffle } from './shuffle.js'

let type2name = {
  1: "青草",
  2: "萝卜",
  3: "玉米",
  4: "树桩",
  5: "叉子",
  6: "白菜",
  7: "羊毛",
  8: "刷子",
  9: "剪刀",
  10: "奶瓶",
  11: "水桶",
  12: "手套",
  13: "铃铛",
  14: "火堆",
  15: "毛球",
  16: "干草"
}

function doShuffle(stepList, cards) {
  stepList.push(-3)
  let rest = cards.filter(e => !e.selected)
  console.log('shuffle========', rest.length)
  rest.sort((a, b) => a.layerNum * 10000 + a.rowNum * 100 + a.rolNum - (b.layerNum * 10000 + b.rowNum * 100 + b.rolNum))
  let idxArr = rest.map(e => e.idx)
  let restTypes = rest.map(e => e.type)
  // console.log(restTypes)
  restTypes = shuffle(restTypes, null)
  // console.log(restTypes)
  // console.log(type2name[restTypes[0]], '===head')

  idxArr.forEach(e => {
    cards[e].type = restTypes.shift()
    cards[e].name = type2name[cards[e].type]
  })

}

function removeItem(list, e) {
  let i = list.indexOf(e)
  if (i >= 0) {
    list.splice(i, 1)
  }
}


function doOut(selected, topList, stepList, stepListOld, cards) {
  stepList.push(-4)

  let out = []
  for (let e of Object.values(selected)) {
    let n = e.length % 3
    if (n > 0) {
      out = out.concat(e.slice(-n))
    }
  }

  out.sort((a, b) => {
    return stepListOld.indexOf(a) - stepListOld.indexOf(b)
    // return cards[b].idx - cards[a].idx
  })
  out = out.slice(0, 3)
  console.log('out===========', out)

  for (let e of Object.values(selected)) {
    out.forEach(e1 => {
      removeItem(e, e1)
    })
  }
  out.forEach(e => {
    topList.push(e)
    cards[e].isOut = 1
    cards[e].parent = []
    cards[e].children = []
    cards.forEach(e1 => {
      removeItem(e1.parent, e)
    })

  })
  return out
}

function doOut2(selected, topList, stepList, stepListOld, cards) {
  let out1 = topList.filter(e => cards[e].isOut)
  let out2 = doOut(selected, topList, stepList, stepListOld, cards)
  stepList.pop()
  stepList.push(-1)
  for (let i in out1) {
    let c1 = cards[out1[i]]
    let c2 = cards[out2[i]]
    c1.children.push(c2.idx)
    c2.parent.push(c1.idx)
    removeItem(topList, c1.idx)
  }

}

export default {
  doShuffle,
  doOut,
  doOut2,
}