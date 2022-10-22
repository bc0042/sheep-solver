import { spawn } from 'child_process'

let promise1 = () => {
  return new Promise(resolve => {
    let child = spawn('node', ['util/get', 'match'])
    child.stdout.on('data', d => {
      console.log(d.toString().trim())
    })
    child.on('exit', c => {
      console.log('exit get match===================')
      resolve(c)
    })
  })
}

let promise2 = () => {
  return new Promise(resolve => {
    let child = spawn('node', ['step1'])
    child.stdout.on('data', d => {
      let line = d.toString().trim()
      console.log(line)
    })
    child.on('exit', c => {
      console.log('exit step1===================')
      resolve(c)
    })
  })
}
let promise3 = (code) => {
  if (code === 101) {
    console.log('skip step2..')
    return null
  } else if (code === 999) {
    console.log('ok=================')
    process.exit()
  }

  return new Promise(resolve => {
    let child = spawn('node', ['step2'])
    child.stdout.on('data', d => {
      let line = d.toString().trim()
      console.log(line)
    })
    child.on('exit', c => {
      if (c === 999) {
        console.log('ok=================')
        process.exit()
      } else if (c === 998) {
        console.log('possible=================')
        process.exit()
      }
      console.log('exit step2===================')
      resolve(c)
    })
  })
}

let round = 0
while (1) {
  console.log('>>>>>>>>>new match<<<<<<<<<<')
  console.log('round:', ++round)
  await Promise.resolve()
    .then(promise1)
    .then(promise2)
    .then(promise3)
}
