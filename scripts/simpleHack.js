/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0];
  const cashFloor = ns.args[1];
  let currentHackTime = await ns.getHackTime(target)

  while(true){
    if (await ns.getServerMoneyAvailable(target) > cashFloor){
      await ns.hack(target);
    }
    else{
      await ns.sleep(currentHackTime);
    }
    currentHackTime = await ns.getHackTime(target)
  }

}