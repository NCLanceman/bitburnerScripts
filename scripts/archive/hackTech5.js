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
  ns.print("Analytics Per Server:")
  ns.print("-------------------------------")
  ns.print("Hack Time: " + hTime)
  ns.print("Weaken Time: " + wTime)
  ns.print("Growth Time: " + gTime)
  ns.print("-------------------------------")
  ns.print("Needed Threads for Optimial Timing:")
  let wQuotent = Math.floor(wTime / hTime)
  let gQuotent = Math.floor(gTime / hTime)

  ns.print("Weaken / Hack: " + wQuotent)
  ns.print("Growth / Hack: " + gQuotent)
  ns.print("-------------------------------")
  ns.print("Available RAM: " + availableServerRAM)
  ns.print("Hack Script RAM: " + hScriptRAM + " | " + Math.floor(availableServerRAM/hScriptRAM))
  ns.print("Weaken Script RAM: " + wScriptRAM + " | " + Math.floor(availableServerRAM/wScriptRAM))
  ns.print("Growth Script RAM: " + gScriptRAM + " | " + Math.floor(availableServerRAM/gScriptRAM))
  ns.print("-------------------------------")
  let minLoad = (hScriptRAM + (wScriptRAM * wQuotent) + (gScriptRAM * gQuotent))
  ns.print("Minimum Load: " + minLoad)
  ns.print("Hack Script: " + hScriptRAM)
  ns.print("Weaken Scripts: " + (wScriptRAM * wQuotent))
  ns.print("Grow Scripts: " + (gScriptRAM * gQuotent))
  ns.print("Possible?: " + (availableServerRAM > minLoad))
  ns.print("-------------------------------")
  let doubleLoad = (hScriptRAM + (wScriptRAM* wQuotent*2) + (gScriptRAM * gQuotent * 2)) 
  ns.print("Double Load: " + doubleLoad)
  ns.print("Hack Script: " + hScriptRAM)
  ns.print("Weaken Scripts, 2 Threaded: " + (wScriptRAM * wQuotent*2))
  ns.print("Grow Scripts, 2 Threaded: " + (gScriptRAM * gQuotent * 2))
  ns.print("Possible?: " + (availableServerRAM > doubleLoad))
  ns.print("-------------------------------")
  ns.print("BEGINNING DEPLOYMENT")

  //Nuke and open ports and such
  ns.print("Opening Ports on " + target + "...");
  if (ns.fileExists("BruteSSH.exe", "home")){
    ns.brutessh(target);
  }
  if (ns.fileExists("FTPCrack.exe","home")){
    ns.ftpcrack(target);
  }

  ns.print("Nuking " + target + "...")
  ns.nuke(target);

  //Deployment
  //Spin up the Grow and Weaken Scripts, deploying them at the necessary deltas
  for(let i = 0; i < wQuotent; i++){
    if(availableServerRAM > doubleLoad){
       ns.run("/scripts/simpleWeaken.js",2, target)
    }
    else{
       ns.run("/scripts/simpleWeaken.js",1,target)
    }
    await ns.sleep(Math.floor((hTime/wQuotent)))
  }

  for(let i=0; i < gQuotent; i++){
    if(availableServerRAM > doubleLoad){
      ns.run("/scripts/simpleGrow.js", 2, target)
    }
    else{
      ns.run("/scripts/simpleGrow.js",1,target)
    }
    await ns.sleep(Math.floor((hTime/gQuotent)))
  }


  ns.run("/scripts/simpleHack.js",1,target)

}