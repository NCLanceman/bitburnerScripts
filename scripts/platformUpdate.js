/** @param {NS} ns */
export async function main(ns) {
  const updateFile = ns.args[0]
  const ownedServers = ns.getPurchasedServers()

  let i = 0;

  while(i < ownedServers.length){
    ns.tprint("Transferring file: " + updateFile + " to " + ownedServers[i]);
    let result = ns.scp(updateFile,ownedServers[i]);
    ns.tprint("File Update: " + result)
    i++;
  }
  ns.tprint("Update complete, END OF PROGRAM."); 
}