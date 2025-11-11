/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0]

  const hTime = Math.floor(ns.getHackTime(target))
  const wTime = Math.floor(ns.getWeakenTime(target))
  const gTime = Math.floor(ns.getGrowTime(target))

  const availableServerRAM = ns.getServer().maxRam - ns.getServer().ramUsed
  const hScriptRAM = ns.getScriptRam("/scripts/simpleHack.js")
  const wScriptRAM = ns.getScriptRam("/scripts/simpleWeaken.js")
  const gScriptRAM = ns.getScriptRam("/scripts/simpleGrow.js")


  //Print Outputs (Test)
  ns.tprint("Analytics Per Server:")
  ns.tprint("-------------------------------")
  ns.tprint("Hack Time: " + hTime)
  ns.tprint("Weaken Time: " + wTime)
  ns.tprint("Growth Time: " + gTime)
  ns.tprint("-------------------------------")
  ns.tprint("Needed Threads for Optimial Timing:")
  let wQuotent = Math.floor(wTime / hTime)
  let gQuotent = Math.floor(gTime / hTime)

  ns.tprint("Weaken / Hack: " + wQuotent)
  ns.tprint("Growth / Hack: " + gQuotent)
  ns.tprint("-------------------------------")
  ns.tprint("Available RAM: " + availableServerRAM)
  ns.tprint("Hack Script RAM: " + hScriptRAM + " | " + Math.floor(availableServerRAM/hScriptRAM))
  ns.tprint("Weaken Script RAM: " + wScriptRAM + " | " + Math.floor(availableServerRAM/wScriptRAM))
  ns.tprint("Growth Script RAM: " + gScriptRAM + " | " + Math.floor(availableServerRAM/gScriptRAM))
  ns.tprint("-------------------------------")
  let minLoad = (hScriptRAM + (wScriptRAM * wQuotent) + (gScriptRAM * gQuotent))
  ns.tprint("Minimum Load: " + minLoad)
  ns.tprint("Hack Script: " + hScriptRAM)
  ns.tprint("Weaken Scripts: " + (wScriptRAM * wQuotent))
  ns.tprint("Grow Scripts: " + (gScriptRAM * gQuotent))
  ns.tprint("Possible?: " + (availableServerRAM > minLoad))
  ns.tprint("-------------------------------")
  let doubleLoad = (hScriptRAM + (wScriptRAM* wQuotent*2) + (gScriptRAM * gQuotent * 2)) 
  ns.tprint("Double Load: " + doubleLoad)
  ns.tprint("Hack Script: " + hScriptRAM)
  ns.tprint("Weaken Scripts, 2 Threaded: " + (wScriptRAM * wQuotent*2))
  ns.tprint("Grow Scripts, 2 Threaded: " + (gScriptRAM * gQuotent * 2))
  ns.tprint("Possible?: " + (availableServerRAM > doubleLoad))
  ns.tprint("-------------------------------")

  ns.tprint("END OF PROGRAM");
}