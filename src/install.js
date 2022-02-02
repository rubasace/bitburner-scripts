const THIS_NAME = 'install.js'

export const FILES_ROOT = 'https://raw.githubusercontent.com/rubasace/bitburner-scripts/main/src/'
export const FILES = [THIS_NAME, 'spread.js', 'root.js', 'hack.js', 'cleanup.js']

/** @param {NS} ns **/
export async function main(ns) {
    let currentServer = ns.getHostname();
    ns.tprint(`installing files in ${currentServer}`)
    for (const file of FILES) {
        await ns.wget(FILES_ROOT + file, file, currentServer)
    }
}