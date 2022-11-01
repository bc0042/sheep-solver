import { spawn } from 'child_process'

function step2Out2() {
  return new Promise(resolve => {
    let child = spawn('node', ['step2-out2'])
    console.log('start step2-out2 ===================')
    child.stdout.on('data', d => {
      let line = d.toString().trim()
      console.log(line)
    })
    child.on('exit', c => {
      if (c == 99) {
        console.log('success=================')
        process.exit()
      }
      resolve(c)
    })
  })
}

function step1() {
  return new Promise(resolve => {
    let child = spawn('node', ['step1', 0, round++])
    console.log('start step1 ===================')
    child.stdout.on('data', d => {
      let line = d.toString().trim()
      console.log(line)
    })
    child.on('exit', c => {
      if (c == 101) {
        console.log('failed and exit=================')
        process.exit()
      }
      resolve(c)
    })
  })
}

let round = 1
while (1) {
  await step2Out2()
  console.log('>>>>>>>>> round', round)
  await step1()
}