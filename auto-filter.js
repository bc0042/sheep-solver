import { spawn } from 'child_process'

let get_match = () => {
  return new Promise(resolve => {
    let child = spawn('node', ['util/get', 'match'])
    child.stdout.on('data', d => {
      console.log(d.toString().trim())
    })
    child.on('exit', c => {
      resolve(c)
    })
  })
}


let step1_mode0 = () => {
  return new Promise(resolve => {
    let child = spawn('node', ['step1', '0'])
    console.log('start step1 mode0===================')
    child.stdout.on('data', d => {
      let line = d.toString().trim()
      console.log(line)
    })
    child.on('exit', c => {
      if (c == 99) {
        console.log('step1 ok=================')
        process.exit()
      }
      resolve(c)
    })
  })
}


let step1_mode1 = () => {
  return new Promise(resolve => {
    let child = spawn('node', ['step1', '1'])
    console.log('start step1 mode1===================')
    child.stdout.on('data', d => {
      let line = d.toString().trim()
      console.log(line)
    })
    child.on('exit', c => {
      if (c == 99) {
        console.log('step1 ok=================')
        process.exit()
      }
      resolve(c)
    })
  })
}


let step1_mode2 = () => {
  return new Promise(resolve => {
    let child = spawn('node', ['step1', '2'])
    console.log('start step1 mode2===================')
    child.stdout.on('data', d => {
      let line = d.toString().trim()
      console.log(line)
    })
    child.on('exit', c => {
      if (c == 99) {
        console.log('step1 ok=================')
        process.exit()
      }
      resolve(c)
    })
  })
}

let round = 0
while (1) {
  console.log('>>>>>>>>>new match<<<<<<<<<<')
  console.log('round:', ++round)
  await Promise.resolve()
    .then(get_match)
    .then(step1_mode0)
    .then(step1_mode1)
    .then(step1_mode2)
}