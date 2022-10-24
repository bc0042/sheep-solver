import helper from './helper.js'
import axios from './ax.js'
import { getSkinName } from '../data/skin.js'

let send = 1
let gameFile = process.argv[2]
let gameType = process.argv[3] || 3
let game = helper.load(gameFile)
let params = {
    "MapSeed2": "",
    // "MatchPlayInfo": "",
    "Version": "0.0.1",
    "rank_role": 1,
    "rank_score": 1,
    "rank_state": 1,
    "rank_time": 333,
    "skin": 1
}
params.MapSeed2 = game.matchInfo.data.map_seed_2


function toHex(n) {
    n = parseInt(n)
    let h = n.toString(16)
    if (n < 16) h = '0' + h
    return h
}

let types = []
let arr = game.stepList.map(e => {
    if (e === -3) {
        params.rank_role = 2
        return '221608fdffffffffffffffff0110fdffffffffffffffff01'
    } else if (e === -1) {
        params.rank_role = 2
        return '221608ffffffffffffffffff0110ffffffffffffffffff01'
    } else if (e === -4) {
        params.rank_role = 2
        return '221608fcffffffffffffffff0110fcffffffffffffffff01'
    }

    let type = toHex(game.cards[e].type)
    types.push(type)
    let n = parseInt(e)
    let h = toHex(n)
    let line
    if (n < 128) {
        line = '220408' + h + '10' + type
    } else {
        line = '220508' + h + '0110' + type
    }
    return line
})



let url_over
if (gameType == 3) {
    arr.unshift('0803') //daily
    let str = arr.join('')
    console.log(str)
    params.MatchPlayInfo = Buffer.from(str, 'hex').toString('base64')
    url_over = 'https://cat-match.easygame2021.com/sheep/v1/game/game_over_ex?'
} else {
    arr.unshift('0804') //toppic
    let str = arr.join('')
    console.log(str)
    params.play_info = Buffer.from(str, 'hex').toString('base64')
    url_over = 'https://cat-match.easygame2021.com/sheep/v1/game/topic/game_over?'
}

// console.log(arr)
// console.log(info)
// console.log(types.join(','))

console.log(params)
console.log('gametype:', gameType)


if (send) {
    axios.post(url_over, params).then(res => {
        console.log(res.data)
        console.log('skin name:', getSkinName(res.data.data.skin_id))
    })
}