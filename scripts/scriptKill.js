/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0]
  //const host = ns.args[1]

  ns.tprint("Killing hackTech processes on machine " + target)
  let wBool = ns.scriptKill("/scripts/simpleWeaken.js", target)
  let gBool = ns.scriptKill("/scripts/simpleGrow.js", target)
  let hBool = ns.scriptKill("/scripts/simpleHack.js", target)

  ns.print("Weaken scripts killed? : "+ wBool)
  ns.print("Grow scripts killed? : " + gBool)
  ns.print("Hack script killed? : " + hBool)
  ns.tprint("Scripts on " + target )
  ns.tprint("Weak?: " + wBool + ", Grow?: " + gBool + ", Hack?: " + hBool)
  ns.print("END OF PROGRAM")
  ns.tprint("END OF PROGRAM")
}