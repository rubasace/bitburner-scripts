const THIS_NAME = 'spread.js'
const FILES_ROOT = 'https://raw.githubusercontent.com/rubasace/bitburner-scripts/main/src/'
const sleepSeconds = 1

export const FILES = [THIS_NAME, 'root.js', 'hack.js', 'cleanup.js', 'do_hack.js']
export const FLAG_FILE = '.29.txt'

/** @param {NS} ns **/
export async function main(ns) {
    try {
        const currentServer = ns.getHostname()
        const id = ns.args[0] ? ns.args[0] : new Date().getTime().toString()
        if (id === ns.read(FLAG_FILE)) {
            ns.tprint(`Skipping ${currentServer}: already infected`)
            return
        }
        await installFiles(ns)
        ns.tprint(`Spreading from ${currentServer}`)
        await ns.write(FLAG_FILE, id, "w")
        const reachableServers = ns.scan()
        for (let server of reachableServers) {
            try {
                ns.exec(THIS_NAME, server, 1, id)
                await ns.sleep(sleepSeconds * 1000)
            } catch (e) {
                ns.tprint(`Error spreading to ${server}: ${e.toString()}`)
            }
        }
    } catch (e) {
        ns.print(`An error occurred while spreading: ${e.toString()}`)
    }
}

export async function installFiles(ns) {
    for (const file of FILES) {
        await ns.wget(FILES_ROOT + file, file)
    }
}