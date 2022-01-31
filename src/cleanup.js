import {FILES, FLAG_FILE} from "./spread.js";

const filedToClean = FILES.concat(FLAG_FILE)
const THIS_NAME = 'cleanup.js'
const sleepSeconds = 1

/** @param {NS} ns **/
export async function main(ns) {
    const currentServer = ns.getHostname()
    ns.tprint(`Cleaning traces from ${currentServer}`)
    const reachableServers = ns.scan()
    for (let server of reachableServers) {
        try {
            const found = await cleanupFiles(ns, server)
            if (found) {
                ns.exec(THIS_NAME, server, 1)
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
        if (await ns.rm(file, server)) {
            found = true
        }
    }
    return found
}