/** @param {NS} ns */
export async function main(ns) {
  let currentServers = ns.getPurchasedServers();

  ns.tprint("Servers Owned are: \n")
  let i = 0;
  let tempName = "";

  while (i < currentServers.length) {
    if (i < 10){
      tempName = "pserv-0" + i;
    }
    else{
      tempName = "pserv-" + i;
    }
    ns.tprint(currentServers[i] + ", Current num: " + i);

    if (currentServers[i] != tempName) {
      ns.tprint("Renaming " + currentServers[i] + " to " + tempName);
      let nameResult = ns.renamePurchasedServer(currentServers[i], tempName);
      ns.tprint("Confirming server renaming: " + nameResult);
    }

    i++;
  }

}