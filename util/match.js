import fs from 'fs'
import ax from './ax.js'
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


function getMatch() {
    let match = JSON.parse(fs.readFileSync('data/match'))
    return match
}

function getMap() {
    let map = JSON.parse(fs.readFileSync('data/map'))
    return map
}

function getCards(match, map) {
    // console.log(map.blockTypeData)
    let layers = Object.keys(map.levelData)
    console.log('layers:', layers.length)

    let total = 0, cards = []
    for (let i of layers) {
        total += map.levelData[i].length
        map.levelData[i].forEach(e => {
            cards.push(e)
        })
    }
    console.log('total:', total)


    let blockData = map.blockTypeData
    let blockTypes = []
    Object.keys(blockData).forEach(e => {
        let count = blockData[e] * 3
        for (let i = 0; i < count; i++) {
            blockTypes.push(e)
        }
    })

    blockTypes = shuffle(blockTypes, match.data.map_seed)
    // console.log(blockTypes)

    let i = 0
    cards.forEach(c => {
        if (c.type == 0) {
            c.type = blockTypes[i++]
        }
        c.name = type2name[c.type]
    })
    return cards
}

function saveMatch(data) {
    fs.writeFileSync('data/match', JSON.stringify(data))
}

function local() {
    let matchInfo = getMatch()
    let map = getMap()
    let cards = getCards(matchInfo, map)
    return {
        matchInfo,
        cards,
    }
}

function create() {
    let url = 'https://cat-match.easygame2021.com/sheep/v1/game/map_info_ex?matchType=3'
    return new Promise(resolve => {
        ax.get(url).then(e => {
            console.log(e.data)
            let matchInfo = e.data
            saveMatch(matchInfo)
            let map = getMap()
            let cards = getCards(matchInfo, map)
            resolve({
                cards,
                matchInfo,
            })
        })
    })
}

export default {
    create,
    local,
}

