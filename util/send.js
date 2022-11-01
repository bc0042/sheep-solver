import helper from './helper.js'
import axios from './ax.js'
import path from 'path'
import protobufjs from 'protobufjs'
import { getSkinName } from '../data/skins.js'

const send = 1
const gameFile = process.argv[2]
const gameType = process.argv[3] || 3
const game = helper.load(gameFile)

let stepInfoList = game.stepList.map(e => {
    let timeTag = e > 0 ? parseInt(game.cards[e].type) : e
    return {
        chessIndex: e,
        timeTag
    }
})


// console.log(game.stepList.join(','))
// console.log(stepInfoList)
let matchPlayInfo = await matchPlayInfoToStr(stepInfoList, gameType)
// console.log(matchPlayInfo)

function matchPlayInfoToStr(stepInfoList, gameType) {
    return new Promise((resolve) => {
        protobufjs.load(path.join(process.cwd(), "data", "yang.proto"), (_, root) => {
            const MatchPlayInfo = root.lookupType("yang.MatchPlayInfo");
            const matchPlayInfo = {
                gameType,
                stepInfoList,
            }
            const buf = MatchPlayInfo.encode(matchPlayInfo).finish();
            const b64 = Buffer.from(buf).toString("base64");

            resolve(b64);
        });
    });
}

let params = {
    "MapSeed2": "",
    "Version": "0.0.1",
    "rank_role": 2,
    "rank_score": 1,
    "rank_state": 1,
    "rank_time": 333,
    "skin": 1
}
params.MapSeed2 = game.matchInfo.data.map_seed_2

let url_over
if (gameType == 3) {
    params.MatchPlayInfo = matchPlayInfo
    url_over = 'https://cat-match.easygame2021.com/sheep/v1/game/game_over_ex?'
} else {
    params.play_info = matchPlayInfo
    url_over = 'https://cat-match.easygame2021.com/sheep/v1/game/topic/game_over?'
}


console.log(params)
console.log('gametype:', gameType)


if (send) {
    axios.post(url_over, params).then(res => {
        console.log(res.data)
        console.log('skin name:', getSkinName(res.data.data.skin_id))
    })
}