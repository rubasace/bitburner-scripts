const sleepTime = 1000
const OWN_SERVERS = ['home', 'nasvigo', 'darkweb']
const THIS_NAME = 'hack.js'

/** @param {NS} ns **/
export async function main(ns) {
    const id = ns.args[0] ? ns.args[0] : new Date().getTime().toString()
    const currentServer = ns.getHostname()
    await executeAndWait(ns, 'spread.js', currentServer, id);
    while (true) {
        const reachableServers = findServers(ns, currentServer)
        const availableRam = ns.getServerMaxRam(currentServer) - ns.getServerUsedRam(currentServer)
        const scriptRam = ns.getScriptRam(THIS_NAME)
        const maxScriptsInMemory = Math.floor(availableRam / scriptRam)
        ns.print(`Available RAM: ${availableRam}\nScript RAM: ${scriptRam}\nMax number of runs with available RAM: ${maxScriptsInMemory}`)
        const threadsPerTarget = Math.max(1, Math.floor(maxScriptsInMemory / reachableServers.length))
        const remainingThreads = Math.max(0, Math.floor(maxScriptsInMemory - threadsPerTarget * reachableServers.length))
        ns.print(`Reachable servers: ${reachableServers}\nThreads per server: ${threadsPerTarget}\nRemaining threads: ${remainingThreads}`)
        for (const [i, targetServer] of reachableServers.entries()) {
            const execThreads = i === 0 ? threadsPerTarget + remainingThreads : threadsPerTarget
            if (!ns.hasRootAccess(targetServer)) {
                await executeAndWait(ns,'root.js', currentServer, targetServer);
            }
            if (!ns.isRunning(THIS_NAME, targetServer, 1, id)) {
                ns.exec(THIS_NAME, targetServer, 1, id)
            }
            ns.exec('do_hack.js', currentServer, execThreads, targetServer, execThreads)
        }
        await ns.sleep(sleepTime)
    }
}

async function executeAndWait(ns, script, server, ...args) {
    const pid = ns.exec(script, server, 1, ...args)
    while (ns.isRunning(pid)) {
        await ns.sleep(sleepTime)
    }
}

function findServers(ns, currentServer) {
    const reachableServers = ns.scan()
        .filter(e => e !== currentServer)
        .filter(e => !OWN_SERVERS.includes(e))
        // .filter(hasLevel)
    return shuffle(reachableServers);
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

async function hasLevel(ns, target) {
    const requiredLevel = await ns.getServerRequiredHackingLevel(target)
    const currentLevel = ns.getHackingLevel()
    return currentLevel >= requiredLevel
}

