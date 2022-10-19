import axios from 'axios'
import fs from 'fs'

let token = fs.readFileSync('data/token.txt')
let headers = {
    'Host': 'cat-match.easygame2021.com',
    'Connection': 'keep-alive',
    'xweb_xhr': '1',
    't': token.toString().trim(),
    // 'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/7.0.4.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF',
    'user-agent': 'Mozilla/5.0 (Linux; Android 9; MI 9 Build/PQ3A.190705.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Safari/537.36 MicroMessenger/8.0.2.1860(0x28000234) Process/appbrand1 WeChat/arm32 Weixin Android Tablet NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android',
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Sec-Fetch-Site': 'cross-site',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    // 'Referer': 'https://servicewechat.com/wx141bfb9b73c970a9/33/index.html',
    'Referer': 'https://servicewechat.com/wx141bfb9b73c970a9/34/page-frame.html',
    'Accept-Language': 'en-us,en',
    'Accept-Encoding': 'gzip, deflate',
}

let ax = axios.create({
    headers
})
export default ax