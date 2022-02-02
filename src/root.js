/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0]

    if (ns.hasRootAccess(target)) {
        ns.print(`Already have root access for ${target}, skipping...`)
        // openBackDoor(ns, target)
        return
    }

    ns.print(`Forcing root access for ${target}`)

    await tryFunction(ns, ns.brutessh, target)
    await tryFunction(ns, ns.ftpcrack, target)
    await tryFunction(ns, ns.relaysmtp, target)
    await tryFunction(ns, ns.httpworm, target)
    await tryFunction(ns, ns.sqlinject, target)

    try {
        ns.nuke(target)
        ns.tprint(`Succesfully got root access for ${target}`)
        // openBackDoor(ns, target)
    } catch (e) {
        ns.print(`Failed to gain root access for ${target}: ${e.toString()}`)
    }
}

// export function openBackDoor(ns, target) {
//     try {
//         ns.print(`Trying to install backdoor in ${target}`)
//         ns.installBackdoor(target)
//         ns.print(`Backdoor succesfully installed in ${target}`)
//     } catch (e) {
//         ns.print(`Failed to install backdoor in ${target}: ${e.toString()}`)
//     }
// }

export async function tryFunction(ns, f, target) {
    try {
        ns.print(`Trying to execute ${f} on ${target}`)
        await f(target)
        ns.print(`Succesfully executed ${f} on ${target}`)
    } catch (e) {
        ns.print(`Failed to execute ${f} on ${target}: ${e.toString()}`)
    }
}