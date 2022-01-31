const sleepTime = 1000
const OWN_SERVERS = ['home', 'nasvigo', 'darkweb']
const SCRIPT_NAME = 'hack.js'
const TARGET_SECURITY = 5
const TARGET_MONEY = 0.75
/** @param {NS} ns **/
export async function main(ns) {
    const currentServer = ns.args[0] ? ns.args[0] : 'home'
    const target = ns.args[1]
    const threads = ns.args[2] ? ns.args[2] : 2

    if (target) {
        await hack(ns, target, threads)
        return;
    }

    const reachableServers = ns.scan()
        .filter(e => e !== currentServer)
        .filter(e => !OWN_SERVERS.includes(e))
        .filter(ns.hasRootAccess)
        .filter(hasLevel)
    const availableRam = ns.getServerMaxRam(currentServer) - ns.getServerUsedRam(currentServer)
    const scriptRam = ns.getScriptRam(SCRIPT_NAME)
    const maxScriptsInMemory = Math.floor(availableRam / scriptRam)
    ns.tprint(`Available RAM: ${availableRam}\nScript RAM: ${scriptRam}\nMax number of runs with available RAM: ${maxScriptsInMemory}`)
    const threadsPerTarget = Math.max(1, Math.floor(maxScriptsInMemory / reachableServers.length))
    const remainingThreads = Math.max(0, Math.floor(maxScriptsInMemory - threadsPerTarget * reachableServers.length))
    ns.tprint(`Reachable servers: ${reachableServers}\nThreads per server: ${threadsPerTarget}\nRemaining threads: ${remainingThreads}`)
    for (const [i, server] of reachableServers.entries()) {
        const execThreads = i === 0 ? threadsPerTarget + remainingThreads : threadsPerTarget
        ns.exec(SCRIPT_NAME, currentServer, execThreads, currentServer, server, execThreads)
    }
}

export async function hack(ns, target, threads) {
    if (OWN_SERVERS.includes(target)) {
        ns.tprint(`Skipping own server ${target}`)
        return
    }
    ns.tprint(`Starting to infect ${target}`)

    const maxMoney = await ns.getServerMaxMoney(target)
    let minSecurityLevel = await ns.getServerMinSecurityLevel(target)
    while (true) {
        const currentMoney = await ns.getServerMoneyAvailable(target)
        const currentSecurityLevel = await ns.getServerSecurityLevel(target)
        if (currentSecurityLevel > minSecurityLevel + TARGET_SECURITY) {
            await ns.weaken(target, { threads })
        } else if (currentMoney < maxMoney * TARGET_MONEY) {
            await ns.grow(target, { threads })
        } else {
            await ns.hack(target, { threads })
        }
        await ns.sleep(sleepTime)
    }
}

export async function hasLevel(ns, target) {
    const requiredLevel = await ns.getServerRequiredHackingLevel(target)
    const currentLevel = ns.getHackingLevel()
    return currentLevel >= requiredLevel
}