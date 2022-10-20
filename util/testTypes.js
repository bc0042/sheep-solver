let ans = '01,08,06,01,0f,0e,01,08,0e,0e,0c,0c,0c,09,0f,0f,03,03,03,0c,0c,0c,0b,0b,0b,06,09,09,03,03,03,01,05,06,07,07,07,01,0a,01,05,0c,08,0d,0f,05,0a,05,0a,0c,06,0c,0f,0a,0f,0e,0d,0d,02,06,06,0b,05,05,03,0b,0b,03,0e,0e,09,02,02,0a,09,0a,0c,0b,09,0f,07,03,0d,0d,0d,0c,07,07,05,05,05,08,08,08,0e,0e,0e,02,0f,0f,0d,0b,0b,0d,02,0d,01,07,0c,0a,0d,02,06,01,01,09,06,06,05,0d,0d,0b,0f,0a,0d,06,0e,05,0a,0a,08,0e,0e,05,0c,05,06,0e,06,08,08,0b,0a,0a,0a,0f,0f,0f,0e,07,0e,03,07,07,0d,01,0d,0c,0b,0c,03,03,07,02,02,02,09,08,0b,07,01,01,0f,09,09,07,09,03,08,08,0f,03,09,09,0f,03,02,02,02'
let arr = []

function check() {
    let map = {}
    let t = null
    for(let e of arr){
        let a2 = map[e]
        if (!a2) a2 = []
        a2.push(1)
        map[e] = a2
        if(a2.length>=3){
            t=e
            break
        }
    }
    if(t){
        arr = arr.filter(e => e != t)
    }
}

let a=[]
ans.split(',').forEach(e => {
    arr.push(e)
    check()
    // console.log(arr.length)
    a.push(arr.length)
})
console.log(a.join(','))