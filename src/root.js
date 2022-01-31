const WAIT_MINS = 1
/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0]

    if (ns.hasRootAccess(target)) {
        ns.tprint(`Already have root access for ${target}, skipping...`)
        // openBackDoor(ns, target)
        return
    }

    ns.tprint(`Forcing root access for ${target}`)

    await tryFunction(ns.brutessh, target)
    await tryFunction(ns.ftpcrack, target)
    await tryFunction(ns.relaysmtp, target)
    await tryFunction(ns.httpworm, target)
    await tryFunction(ns.sqlinject, target)

    try {
        ns.nuke(target)
        ns.tprint(`Succesfully got root access for ${target}`)
        // openBackDoor(ns, target)
    } catch (e) {
        ns.tprint(`Failed to gain root access for ${target}: ${e.toString()}`)
    }
}

// export function openBackDoor(ns, target) {
//     try {
//         ns.tprint(`Trying to install backdoor in ${target}`)
//         ns.installBackdoor(target)
//         ns.tprint(`Backdoor succesfully installed in ${target}`)
//     } catch (e) {
//         ns.tprint(`Failed to install backdoor in ${target}: ${e.toString()}`)
//     }
// }

export async function tryFunction(f, target) {
    try {
        ns.tprint(`Trying to execute ${f} on ${target}`)
        await f(target)
        ns.tprint(`Succesfully executed ${f} on ${target}`)
    } catch {
        ns.tprint(`Failed to execute ${f} on ${target}: ${e.toString()}`)
    }
}