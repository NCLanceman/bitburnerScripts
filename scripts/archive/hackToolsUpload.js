/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0]

  ns.tprint("Uploading hack tools to " + target)
  //Upload current hack tools to a given server
  //let r1 = ns.scp("/scripts/hackTech5.js", target)
  let r2 = ns.scp("/scripts/simpleHack.js", target)
  let r3 = ns.scp("/scripts/simpleGrow.js", target)
  let r4 = ns.scp("/scripts/simpleWeaken.js", target)

  ns.tprint("Transfer Results: ")
  //ns.tprint("HackTech5: " + r1)
  ns.tprint("SimpleHack: " + r2) 
  ns.tprint("SimpleGrow: " + r2)
  ns.tprint("SimpleWeaken: " + r4)
  ns.tprint("-------------------------")
  ns.tprint("END OF PROGRAM")
}