/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0];
  const maxMoney = ns.formatNumber(ns.getServerMaxMoney(target),2)

  ns.print("Server Max Money is: $" + maxMoney);
  while (ns.getServerMoneyAvailable(target) < maxMoney){
    await ns.grow(target);
    ns.print("Max level at: $" + maxMoney);
  };

  ns.print("Server Bulking Complete.");
}