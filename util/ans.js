import { cards } from './map.js'
import axios from './ax.js'

let send = 0
let seed2 = '1664141283'
let step = '49,96,187,193,186,189,68,190,57,178,42,59,76,62,65,34,5,53,188,48,191,177,194,29,92,24,16,8,97,182,87,185,80,176,69,58,72,179,184,175,85,192,180,43,47,36,181,168,23,30,63,51,183,169,50,171,52,172,93,39,2,160,159,75,7,166,13,21,37,17,86,163,151,9,154,81,162,174,173,170,164,82,142,157,12,73,161,167,158,74,67,155,149,152,38,25,26,10,165,148,137,11,156,153,140,145,56,138,66,55,64,40,133,3,150,144,146,147,135,139,131,141,143,27,134,54,136,41,14,129,132,130,128,35,6,127,126,123,125,120,124,117,122,121,118,116,119,114,115,110,112,108,111,104,113,109,107,105,106,103,101,102,98,99,22,100,4,94,89,91,95,88,90,83,78,84,77,79,28,70,71,60,15,44,61,46,45,32,31,19,18,0,33,20,1'

function toHex(n) {
    n = parseInt(n)
    let h = n.toString(16)
    if (n < 16) h = '0' + h
    return h
}

let types = []
let arr = step.split(',').map(e => {
    let type = toHex(cards[e].type)
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
let en = Buffer.from(str, 'hex').toString('base64')
console.log(en)
console.log(types.join(','))

let url_over = 'https://cat-match.easygame2021.com/sheep/v1/game/game_over_ex?'
let params = {
    "MapSeed2": "",
    "MatchPlayInfo": "",
    "Version": "0.0.1",
    "rank_role": 1,
    "rank_score": 1,
    "rank_state": 1,
    "rank_time": 666,
    "skin": 1
}
params.MapSeed2 = seed2
params.MatchPlayInfo = en

if (send) {
    console.log(params)
    axios.post(url_over, params).then(res => {
        console.log(res.data)
    })
}