const THIS_NAME = 'spread.js'
const SLEEP_TIME = 1*1000
// const FILES_ROOT =
const FILES = []
/** @param {NS} ns **/
export async function main(ns) {
    const currentServer = ns.getHostname()
    ns.print(`Spreading from server ${currentServer}`)
    const reachableServers = ns.scan()
    for (let server of reachableServers) {
        try {
            await getFiles()
            await ns.scp(script, server)
            await ns.scp(THIS_SCRIPT, server)
            ns.exec(script, currentServer, 1, server)
            await ns.sleep(SLEEP_TIME)
            ns.exec(THIS_SCRIPT, server, 1, script, server)
            await ns.sleep(SLEEP_TIME)
        } catch (e) {
            ns.tprint(`Error spreading to ${server}, trying next one: ${e.toString()}`)
        }
    }

    //ns.tprint(`Finished spreading from server ${currentServer}`)
    //Done like this so exec fails on second attempts
    await ns.sleep(5*60*1000)
}

async function getFiles(){
    for(const file of FILES){
        ns.wget()
    }
}