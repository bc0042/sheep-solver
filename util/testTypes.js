let ans = '7,9,5,13,2,7,7,5,9,9,11,13,5,15,2,2,9,9,13,14,1,9,10,14,14,12,1,1,8,8,8,8,15,15,6,8,8,6,9,6,12,3,12,2,10,10,7,2,2,12,3,3,12,11,11,14,14,14,4,4,4,1,1,1,3,3,3,10,2,12,13,13,13,6,9,9,11,11,11,4,4,4,6,12,6,1,1,1,5,5,5,8,8,8,14,7,7,11,14,14,8,11,11,12,9,12,15,9,9,2,15,15,7,5,2,14,10,10,6,3,4,4,4,1,6,6,13,13,13,15'
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