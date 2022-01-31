const THIS_NAME = 'install.js'
const sleepSeconds = 1


export const FILES_ROOT = 'https://raw.githubusercontent.com/rubasace/bitburner-scripts/main/src/'
export const FILES = [THIS_NAME, 'root.js', 'hack.js', 'cleanup.js']

/** @param {NS} ns **/
export async function main(ns) {

    await ns.wget(FILES_ROOT + THIS_NAME, file, server)
}

async function installFiles(ns, server) {

}