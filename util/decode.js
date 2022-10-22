let info = 'CAMiBQi2ARAMIgUIsQEQDCIFCLIBEAwiBQiqARANIgQIJBANIgUIsAEQBSIFCKwBEAwiBQiiARAMIgUImwEQDCIFCJoBEAUiBQimARAFIgUIngEQAyIFCKEBEAMiBQiEARADIgUImAEQDSIECB4QDyIFCK4BEA8iBQiAARAPIgUItAEQDSIFCKUBEA0iBQiJARANIgUIqwEQBiIFCIUBEAYiBQiMARAGIgUImQEQAyIFCJYBEAMiBQi1ARAIIgUIqQEQCSIFCI0BEAkiBQicARAJIgUIlAEQAyIFCJ8BEAsiBQiBARALIgUIrwEQCyIFCLMBEAwiBQikARAFIgUIoAEQBSIFCK0BEAUiBQinARABIgUIigEQASIECHkQASIFCIYBEA8iBQijARAPIgQIaRAPIgUIggEQDCIFCI4BEAYiBAhsEAwiBQiVARAOIgQIfRAOIgQIbRAOIgUIqAEQByIECH4QByIFCIsBEAciBQidARACIgUIkgEQAiIFCIgBEAIiBAh6EAMiBAhqEAgiBQiDARAIIgUIkwEQCiIECHsQASIECHIQASIFCIcBEAEiBQiPARANIgQIdRAKIgQIcxAKIgQIHRAGIgQIfBAHIgQIaxAGIgUIkAEQDyIFCJEBEAsiBAh2EAsiBAh4EAsiBAhvEAMiBAgUEAMiBQiXARAJIgQIfxAPIgQIbhAPIgQIcRAIIgQIdxACIgQIYxACIgQIZBACIgQIHxAIIgQIcBAIIgQIZxAJIgQIQxAJIgQIZhAHIgQIFRAHIgQIYBAFIgQIXxAFIgQIRBAFIgQIdBAMIgQIaBANIgQIYhAPIgQIXRAPIgQIYRAPIgQIPxAIIgQIOhANIgQIWxAOIgQIZRAMIgQIWhAIIgQIVxAMIgQIVRAIIgQIXhAKIgQIXBADIgQIWRAOIgQIWBAPIgQIVhAKIgQIIRAKIgQIUhAOIgQIUxABIgQIUBAOIgQITRAOIgQIFhAOIgQIPhACIgQIORABIgQINBABIgQIVBAHIgQIURANIgQITxACIgQIEBACIhYI////////////ARD///////////8BIgQITBAKIgQIThAMIgQISxAPIgQISBAKIgQIIBAKIgQIShAMIgQISRADIgQIRRAJIgQIQhAMIgQIDBAJIgQIDhAJIgQIRhAIIgQIRxADIgQIQBANIgQIPRADIgQIPBANIgQIQRAOIgQIOxAIIgQIOBAOIgQINRAOIgQIMBABIgQILBAJIgQIJhAIIgQINhALIgQINxAGIgQIMxAKIgQIMhAGIhYI/P//////////ARD8//////////8BIgQILxAFIgQIKBAGIgQIKhALIgQIMRALIgQILhAFIgQIKxABIgQIKRAGIgQIJRABIgQIMBABIgQIHBAGIgQIDRAHIgQIBBAGIgQIGxAPIgQISxAPIgQIWBAPIgQIExAHIgQIGBAHIgQIFxANIgQICRANIgQICxANIgQICBAOIgQIIhAOIgQIAxAOIgQIChADIgQIDxADIgQIXBADIgQIARAFIgQIGRALIgQIERAKIgQIAhAKIgQILRACIgQIJxAHIgQIIxACIgQIABACIgQIGhAJIgQIEhALIgQIBhALIgQILBAJIgQIBxAJIgQIBRAHIgQIVBAH'

function decode(info) {
    let buf = Buffer.from(info, 'base64')
    let hex = buf.toString('hex')
    return hex
}

function toSteps(hex) {
    hex = hex.replace(/2204/g, '\n2204')
    hex = hex.replace(/2205/g, '\n2205')
    hex = hex.replace(/2216/g, '\n2216')
    let steps = hex.split('\n').map(e => {
        let s = e
        if (e.startsWith('2204') || e.startsWith('2205')) {
            s = e.substring(6, 8)
            s = parseInt(s, 16)
        }
        return s
    })
    return steps
}

function playInfo(stepList, types, target) {
    let arr = []
    for (let i in stepList) {
        let t = toHex(types[i])
        let n = parseInt(stepList[i])
        let h = toHex(n)
        let line
        if (n < 128) {
            line = '220408' + h + '10' + t
        } else {
            line = '220508' + h + '0110' + t
        }
        arr.push(line)
    }

    if (target) {
        arr.splice(target, 0, '221608ffffffffffffffffff0110ffffffffffffffffff01')
    }

    arr.unshift('0803')
    let str = arr.join('')
    console.log(str)
    let b64 = Buffer.from(str, 'hex').toString('base64')
    console.log('seed2', match.data.map_seed_2)
    console.log(b64)
}
let hex = decode(info)
let steps = toSteps(hex)
console.log(steps.join(','))