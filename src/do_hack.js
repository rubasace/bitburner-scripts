const sleepTime = 1000
const TARGET_SECURITY = 5
const TARGET_MONEY = 0.75

/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0]
    const threads = ns.args[1] ? ns.args[1] : 1

    const maxMoney = await ns.getServerMaxMoney(target)
    let minSecurityLevel = await ns.getServerMinSecurityLevel(target)
    const currentMoney = await ns.getServerMoneyAvailable(target)
    const currentSecurityLevel = await ns.getServerSecurityLevel(target)
    if (currentSecurityLevel > minSecurityLevel + TARGET_SECURITY) {
        await ns.weaken(target, {threads})
    } else if (currentMoney < maxMoney * TARGET_MONEY) {
        await ns.grow(target, {threads})
    } else {
        await ns.hack(target, {threads})
    }
    await ns.sleep(sleepTime)

}
