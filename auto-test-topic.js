import { spawn } from 'child_process'

function getTopic() {
  return new Promise(resolve => {
    let child = spawn('node', ['util/get', 'topic'])
    child.stdout.on('data', d => {
      console.log(d.toString().trim())
    })
    child.on('exit', c => {
      resolve(c)
    })
  })
}

function copyTopic() {
  return new Promise(resolve => {
    console.log('copy topic================')
    let child = spawn('cp', ['data/topic', 'data/match'])
    child.stdout.on('data', d => {
      console.log(d.toString().trim())
    })
    child.on('exit', c => {
      resolve(c)
    })
  })
}
function step1() {
  return new Promise(resolve => {
    let child = spawn('node', ['step1', '0'])
    console.log('start step1 mode0===================')
    child.stdout.on('data', d => {
      let line = d.toString().trim()
      console.log(line)
    })
    child.on('exit', c => {
      if (c == 99) {
        console.log('step1 ok <<<<<<<<<<<<<<<')
        // process.exit()
      }
      resolve(c)
    })
  })
}

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
        console.log('success <<<<<<<<<<<<<<<<')
        process.exit()
      }
      resolve(c)
    })
  })
}

function step1Plus(num) {
  return new Promise(resolve => {
    let child = spawn('node', ['step1', 0, num])
    console.log('start step1 ===================')
    child.stdout.on('data', d => {
      let line = d.toString().trim()
      console.log(line)
    })
    child.on('exit', c => {
      if (c == 101) {
        console.log('failed and exit=================')
        // process.exit()
      }
      resolve(c)
    })
  })
}

let round = 1
while (1) {
  console.log('>>>>>>>>>>>>>>>>>>> topic', round)
  await getTopic()
  // await copyTopic()
  let code = await step1()
  if (code == 99) {
    let num = 1
    while (1) {
      await step2Out2()
      console.log('>>>>>>>>> try topic', round, num)
      let code2 = await step1Plus(num++)
      if (code2 == 101) break
    }
  }
  round++
}