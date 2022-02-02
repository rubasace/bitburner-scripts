const THIS_NAME = 'install.js'

export const FILES_ROOT = 'https://raw.githubusercontent.com/rubasace/bitburner-scripts/main/src/'
export const FILES = [THIS_NAME, 'spread.js', 'root.js', 'hack.js', 'do_hack.js', 'cleanup.js']

export const FLAG_FILE = '.29.txt'

/** @param {NS} ns **/
export async function main(ns) {
    let server = ns.args[0] ? ns.args[0] : ns.getHostname();
    const id = ns.args[1] ? ns.args[1] : new Date().getTime().toString()
    if (id === ns.read(FLAG_FILE)) {
        ns.print(`Skipping ${server}: already installed`)
        return
    }
    ns.tprint(`installing files in ${server}`)
    await ns.write(FLAG_FILE, id, "w")
    for (const file of FILES) {
        await ns.wget(FILES_ROOT + file, file, server)
    }
}