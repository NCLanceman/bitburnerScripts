/** @param {NS} ns */
export async function main(ns) {
let servers = ns.getPurchasedServers();

//Check each server
for (let i = 0; i < servers.length; i++)
{
  let serverProcesses = ns.ps(servers[i]) //lawl Object Object
  let firstArguement = serverProcesses[0].args[0]
  ns.print("First Script on " + servers[i] + " running against: " + firstArguement)

  //Kill Production on this server and restart it on same target
  ns.print("Killing Production on " + servers[i])
  ns.exec("/scripts/scriptKill.js","home", 1, servers[i])
  await ns.sleep(1000);

  ns.print("Restarting production on " + servers[i] + " against target " + firstArguement)
  ns.exec("/scripts/hackTech8.js", "home", 1, firstArguement, servers[i]);

}

ns.print("Production Upgrade Complete.")


}