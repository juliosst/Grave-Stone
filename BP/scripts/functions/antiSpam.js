let spamList = {}

export function antiSpam(id = 'id', ms = 0) {

    const output = (spamList[id] > Date.now()) ? true : false

    spamList[id] = (Date.now() + ms)

    return output
} 