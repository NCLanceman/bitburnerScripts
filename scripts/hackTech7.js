/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0]
  const host = ns.args[1]
  const hTime = Math.floor(ns.getHackTime(target))
  const wTime = Math.floor(ns.getWeakenTime(target))
  const gTime = Math.floor(ns.getGrowTime(target))

  let availableServerRAM = serverRamCalc(ns, host)
  const hScriptRAM = ns.getScriptRam("/scripts/simpleHack.js")
  const wScriptRAM = ns.getScriptRam("/scripts/simpleWeaken.js")
  const gScriptRAM = ns.getScriptRam("/scripts/simpleGrow.js")

  //With this script we peg the max amount of money the server can have
  //and only hack if within 80% of that number.
  const serverTopCash = ns.getServerMaxMoney(target)
  const serverBottomCash = serverTopCash * 0.8

  //Print Outputs (Test)
  ns.print("Analytics Per Server:")
  ns.print("-------------------------------")
  ns.print("Hack Time: " + ns.tFormat(hTime))
  ns.print("Weaken Time: " + ns.tFormat(wTime))
  ns.print("Growth Time: " + ns.tFormat(gTime))
  ns.print("-------------------------------")
  ns.print("Needed Threads for Optimial Timing:")
  let wQuotent = Math.floor(wTime / hTime)
  let gQuotent = Math.floor(gTime / hTime)

  ns.print("Weaken / Hack: " + wQuotent)
  ns.print("Growth / Hack: " + gQuotent)
  ns.print("-------------------------------")
  ns.print("Available RAM: " + availableServerRAM)
  ns.print("Hack Script RAM: " + hScriptRAM + " | " + Math.floor(availableServerRAM / hScriptRAM))
  ns.print("Weaken Script RAM: " + wScriptRAM + " | " + Math.floor(availableServerRAM / wScriptRAM))
  ns.print("Growth Script RAM: " + gScriptRAM + " | " + Math.floor(availableServerRAM / gScriptRAM))
  ns.print("-------------------------------")
  let minLoad = (hScriptRAM + (wScriptRAM * wQuotent) + (gScriptRAM * gQuotent))
  ns.print("Minimum Load: " + minLoad)
  ns.print("Hack Script: " + hScriptRAM)
  ns.print("Weaken Scripts: " + (wScriptRAM * wQuotent))
  ns.print("Grow Scripts: " + (gScriptRAM * gQuotent))
  ns.print("Possible?: " + (availableServerRAM > minLoad))
  ns.print("-------------------------------")
  let doubleLoad = (hScriptRAM + (wScriptRAM * wQuotent * 2) + (gScriptRAM * gQuotent * 2))
  ns.print("Double Load: " + doubleLoad)
  ns.print("Hack Script: " + hScriptRAM)
  ns.print("Weaken Scripts, 2 Threaded: " + (wScriptRAM * wQuotent * 2))
  ns.print("Grow Scripts, 2 Threaded: " + (gScriptRAM * gQuotent * 2))
  ns.print("Possible?: " + (availableServerRAM > doubleLoad))
  ns.print("-------------------------------")
  ns.print("BEGINNING DEPLOYMENT")

  //Nuke and open ports and such
  //First, ensure host is owned
  ns.print("Opening Ports on " + host + "...")
  if (ns.fileExists("BruteSSH.exe", "home")){
    ns.brutessh(host);
  }
  if (ns.fileExists("FTPCrack.exe", "home")){
    ns.ftpcrack(host);
  }
  if (ns.fileExists("relaySMTP.exe", "home")){
    ns.relaysmtp(host);
  }
  if (ns.fileExists("HTTPWorm.exe", "home")){
    ns.httpworm(target);
  }
  if (ns.fileExists("SQLInject.exe","home")){
    ns.sqlinject(target);
  }

  ns.print("Ensuring takeover of Host: " + host + "...");
  ns.nuke(host);

  ns.print("Opening Ports on " + target + "...");
  if (ns.fileExists("BruteSSH.exe", "home")) {
    ns.brutessh(target);
  }
  if (ns.fileExists("FTPCrack.exe", "home")) {
    ns.ftpcrack(target);
  }
  if (ns.fileExists("relaySMTP.exe", "home")) {
    ns.relaysmtp(target)
  }
  if (ns.fileExists("HTTPWorm.exe", "home")){
    ns.httpworm(target);
  }
  if (ns.fileExists("SQLInject.exe","home")){
    ns.sqlinject(target);
  } 

  ns.print("Nuking " + target + "...")
  ns.nuke(target);

  if (!ns.fileExists("/scripts/simpleWeaken.js", host)){
    ns.scp("/scripts/simpleWeaken.js", host)
  }
  if (!ns.fileExists("/scripts/simpleGrow.js", host)){
    ns.scp("/scripts/simpleGrow.js", host) 
  }
  if (!ns.fileExists("/scripts/simpleHack.js", host)){
    ns.scp("/scripts/simpleHack.js", host)
  }


  //Deployment
  //Spin up the Grow and Weaken Scripts, deploying them at the necessary deltas
  for (let i = 0; i < wQuotent; i++) {
    if (availableServerRAM > doubleLoad) {
      //ns.run("/scripts/simpleWeaken.js",2, target)
      ns.exec("/scripts/simpleWeaken.js", host, 2, target)
    }
    else {
      //ns.run("/scripts/simpleWeaken.js",1,target)
      ns.exec("/scripts/simpleWeaken.js", host, 1, target)
    }
    await ns.sleep(Math.floor((hTime / wQuotent)))
  }

  for (let i = 0; i < gQuotent; i++) {
    if (availableServerRAM > doubleLoad) {
      //ns.run("/scripts/simpleGrow.js", 2, target)
      ns.exec("/scripts/simpleGrow.js", host, 2, target)
    }
    else {
      //ns.run("/scripts/simpleGrow.js",1,target)
      ns.exec("/scripts/simpleGrow.js", host, 1, target)
    }
    await ns.sleep(Math.floor((hTime / gQuotent)))
  }


  //ns.run("/scripts/simpleHack.js",1,target)
  ns.exec("/scripts/simpleHack.js", host, 1, target, serverBottomCash)


  //if remaining memory on server, add growth and weaken threads
  availableServerRAM = serverRamCalc(ns, host)
  let gThreads = Math.floor((availableServerRAM * 0.60) / gScriptRAM)
  let wThreads = Math.floor((availableServerRAM * 0.30) / wScriptRAM)
  let hThreads = Math.floor((availableServerRAM * 0.10) / hScriptRAM)

  if (gThreads >= 0 || wThreads >= 0) {
    if (gThreads > 0) {
      ns.exec("/scripts/simpleGrow.js", host, gThreads, target)
      await ns.sleep(Math.floor((hTime / gQuotent)))
    }
    if (wThreads > 0) {
      ns.exec("/scripts/simpleWeaken.js", host, wThreads, target)
      await ns.sleep(Math.floor((hTime/wQuotent)))
    }
    if (hThreads > 0) {
      ns.exec("/scripts/simpleHack.js", host, hThreads, target, serverBottomCash)
    }
  }
}

function serverRamCalc(ns, server) {
  return ns.getServer(server).maxRam - ns.getServer(server).ramUsed
}