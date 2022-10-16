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

function doShuffle(cards) {
    let rest = cards.filter(e => !e.selected)
    rest.sort((a, b) => a.layerNum * 10000 + a.rowNum * 100 + a.rolNum - (b.layerNum * 10000 + b.rowNum * 100 + b.rolNum))
    console.log('shuffle========', rest.length)
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


function afterOut(out, topList, cards) {
    out.forEach(e => {
        topList.push(e)
        cards[e].parent = []
        cards[e].children = []
        cards.forEach(e1 => {
            removeItem(e1.parent, e)
        })
    })
}

function doOut(selected, topList, cards) {
    let out = []
    for (let e of Object.values(selected)) {
        let n = e.length % 3
        if (n > 0) {
            for (let e1 of e.slice(-n)) {
                e.pop()
                out.push(e1) // note order 
                if (out.length == 3) {
                    console.log('out===========', out)
                    return afterOut(out, topList, cards)
                }
            }
        }
    }
}

export default {
    doShuffle,
    doOut,
}