import {FILES, FLAG_FILE} from "./spread.js";

const filedToClean=FILES.concat(FLAG_FILE)
const THIS_NAME = 'spread.js'
const sleepSeconds = 1

/** @param {NS} ns **/
export async function main(ns) {
    const id = ns.args[0] ? ns.args[0] ? new Date().getTime().toString()
    if(id===ns.read(flagFile)){
        ns.tprint(`Skipping ${currentServer}: already cleaned up`)
        return
    }
    ns.tprint(`Cleaning traces from ${currentServer}`)
    const reachableServers = ns.scan()
    for (let server of reachableServers) {
        try {
            const found = await cleanupFiles()
            if(found){
                ns.exec(THIS_NAME, server, 1, script, server)
                await ns.sleep(sleepSeconds * 1000)
            }
        } catch (e) {
            ns.tprint(`Error spreading to ${server}: ${e.toString()}`)
        }
    }
}

async function cleanupFiles(ns, server) {
    let found = false
    for (const file of filedToClean) {
        ns.tprint(`Deleting ${file} from  ${server}`)
        if(await ns.rm(file, server)){
            found = true
        }
    }
    return found
}