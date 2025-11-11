/** @param {NS} ns */
export async function main(ns) {
  //Get that shit outta here
  ns.disableLog("ALL")

  //I'm sure this tells people what lang I started with
  const target = ns.args[0]
  const maxServerCash = ns.getServerMaxMoney(target)
  const maxServerSecurity = ns.getServerMinSecurityLevel(target)
  let grownum = 0.00
  let cashPercent = 0.00
  let securityPercent = 0
  let currentServerCash = 0
  let currentSecurityLevel = 0

  
  currentServerCash = ns.getServerMoneyAvailable(target)
  currentSecurityLevel = ns.getServerSecurityLevel(target)
  securityPercent = (currentSecurityLevel/ maxServerSecurity).toPrecision(3)
  cashPercent = ((currentServerCash/ maxServerCash) * 100).toPrecision(3)
  
  //Print Initial Statement
  ns.print("---------------------")
  ns.print("BEGIN PROGRAM")
  ns.print("Growing Stock on server " + target)
  ns.print("Grow Time is: " + ns.tFormat(ns.getGrowTime(target)))
  ns.print("Server Currently at " + cashPercent + "% of Max Cash | " + securityPercent + "% of Max Security")
  ns.print("Current Cash: $" + ns.formatNumber(currentServerCash))

  //Actually do the thing
  while(1){
    grownum = await ns.grow(target, {stock: true})
    await ns.weaken(target)
    currentServerCash = ns.getServerMoneyAvailable(target)
    currentSecurityLevel = ns.getServerSecurityLevel(target)
    cashPercent = ((currentServerCash / maxServerCash) * 100).toPrecision(3)
    securityPercent = (currentSecurityLevel/ maxServerSecurity).toPrecision(3)
    ns.print("----------------------")
    ns.print("CURRENT REPORT FOR " + Date(Date.now()).toString())
    ns.print("Server Currently at " + cashPercent + "% of Max Cash | " + securityPercent + "% of Max Security")
    ns.print("Server " + target + " grown by " + grownum.toPrecision(3) + "%")
    ns.print("Current Cash: $" + ns.formatNumber(currentServerCash))
    ns.print("----------------------\n\n")
  }
}