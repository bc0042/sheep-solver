import helper from './helper.js'
import axios from './ax.js'

let send = 1
let gameFile = process.argv[2] || 'game1.json'
let game = helper.load(gameFile)
let params = {
    "MapSeed2": "",
    "MatchPlayInfo": "",
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
    if (e === -1) {
        params.rank_role = 2
        return '221608ffffffffffffffffff0110ffffffffffffffffff01'
    }else if(e === -4){
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
// console.log(arr)
arr.unshift('0803')

let str = arr.join('')
console.log(str)
let info = Buffer.from(str, 'hex').toString('base64')
// console.log(info)
console.log(types.join(','))
params.MatchPlayInfo = info
console.log(params)

let url_over = 'https://cat-match.easygame2021.com/sheep/v1/game/game_over_ex?'
if (send) {
    axios.post(url_over, params).then(res => {
        console.log(res.data)
    })
}