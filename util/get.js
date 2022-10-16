import fs from 'fs'
import ax from './ax.js'


let url1 = 'https://cat-match.easygame2021.com/sheep/v1/game/personal_info?t='
let url2 = 'https://cat-match.easygame2021.com/sheep/v1/game/skin/info'
let url3 = 'https://cat-match.easygame2021.com/sheep/v1/game/map_info_ex?matchType=3'
let url4 = 'https://cat-match-static.easygame2021.com/maps/'

let urlmap = {
    me: url1,
    skin: url2,
    match: url3,
    map: url4,
}

let argv = process.argv[2]
let url = urlmap[argv]
if (url) {
    let req
    if (argv == 'map') {
        let str = fs.readFileSync('data/match')
        let match = JSON.parse(str)
        let name = match.data.map_md5[1] + '.txt'
        url += name
        console.log(url)
        // console.log(axios.defaults.headers)
        req = ax.get(url, {
            'headers': {
                'Host': ''
            }
        })
    } else {
        req = ax.get(url)
    }
    req.then((resp) => {
        console.log(resp.data)
        fs.writeFileSync('./data/' + argv, JSON.stringify(resp.data))
    }).catch(e => {
        console.log(e)
    })
}


