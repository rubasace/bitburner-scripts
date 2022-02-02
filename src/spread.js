const THIS_NAME = 'spread.js'
const sleepSeconds = 1

export const FLAG_FILE = '.29.txt'

/** @param {NS} ns **/
export async function main(ns) {
    const currentServer = ns.getHostname()
    const id = ns.args[0] ? ns.args[0] : new Date().getTime().toString()
    //Update files in home
    if (!ns.args[0]) {
        executeAndWait(ns, 'install.js', currentServer)
    }
    if (id === ns.read(FLAG_FILE)) {
        ns.print(`Skipping ${currentServer}: already infected`)
        return
    }
    ns.tprint(`Spreading from ${currentServer}`)
    await ns.write(FLAG_FILE, id, "w")
    const reachableServers = ns.scan()
    for (let server of reachableServers) {
        try {
            executeAndWait(ns, 'install.js', currentServer)
            ns.exec(THIS_NAME, server, 1, id)
            await ns.sleep(sleepSeconds * 1000)
        } catch (e) {
            ns.print(`Error spreading to ${server}: ${e.toString()}`)
        }
    }
}

//TODO move to common utility
async function executeAndWait(ns, script, server, ...args) {
    const pid = ns.exec(script, server, 1, ...args)
    while (ns.isRunning(pid)) {
        await ns.sleep(sleepTime)
    }
}