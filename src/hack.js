const sleepTime = 1000
const OWN_SERVERS = ['home', 'nasvigo', 'darkweb']
const SCRIPT_NAME = 'hack.js'
const TARGET_SECURITY = 5
const TARGET_MONEY = 0.75

/** @param {NS} ns **/
export async function main(ns) {

    while (true) {
        const reachableServers = findServers(ns)
        const availableRam = ns.getServerMaxRam(currentServer) - ns.getServerUsedRam(currentServer)
        const scriptRam = ns.getScriptRam(SCRIPT_NAME)
        const maxScriptsInMemory = Math.floor(availableRam / scriptRam)
        ns.tprint(`Available RAM: ${availableRam}\nScript RAM: ${scriptRam}\nMax number of runs with available RAM: ${maxScriptsInMemory}`)
        const threadsPerTarget = Math.max(1, Math.floor(maxScriptsInMemory / reachableServers.length))
        const remainingThreads = Math.max(0, Math.floor(maxScriptsInMemory - threadsPerTarget * reachableServers.length))
        ns.tprint(`Reachable servers: ${reachableServers}\nThreads per server: ${threadsPerTarget}\nRemaining threads: ${remainingThreads}`)
        for (const [i, targetServer] of reachableServers.entries()) {
            const execThreads = i === 0 ? threadsPerTarget + remainingThreads : threadsPerTarget
            // const pid = ns.exec('root.js', targetServer, 1)
            ns.exec(SCRIPT_NAME, targetServer, 1)
            ns.exec('do_hack.js', currentServer, execThreads, targetServer, execThreads)
        }
        await ns.sleep(1000)
    }
}

function findServers(ns) {
    const currentServer = ns.getHostname()
    const reachableServers = ns.scan()
        .filter(e => e !== currentServer)
        .filter(e => !OWN_SERVERS.includes(e))
        .filter(ns.hasRootAccess)
        .filter(hasLevel)
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

export async function hasLevel(ns, target) {
    const requiredLevel = await ns.getServerRequiredHackingLevel(target)
    const currentLevel = ns.getHackingLevel()
    return currentLevel >= requiredLevel
}