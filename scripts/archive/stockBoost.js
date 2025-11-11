/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0]

  while(true){
    ns.print("Boosting stock of " + target +"...");
    await ns.grow(target, {stock: true});
  }
}