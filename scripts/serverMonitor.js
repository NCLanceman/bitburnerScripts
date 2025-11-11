/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0]
  ns.disableLog("getServerMoneyAvailable")
  ns.disableLog("getServerSecurityLevel")
  ns.disableLog("getServerMinSecurityLevel")

  //Every three minutes, log the server money, security level
  while(true){
  ns.print("-----------------------------")
  ns.print("Server Status: " + target)
  ns.print("Money: $" + ns.formatNumber(ns.getServerMoneyAvailable(target)))
  ns.print("Security (CURR/MIN): " + ns.formatNumber(ns.getServerSecurityLevel(target)) + " / " 
        + ns.getServerMinSecurityLevel(target))
  ns.print("-----------------------------")
  await ns.sleep(120000)

  }
}