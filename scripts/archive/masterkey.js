/** @param {NS} ns */
export async function main(ns) {
const target = ns.args[0];

//go through the list of available hacking tools
//BruteSSH
if(ns.fileExists("BruteSSH.exe", "home")){
  ns.brutessh(target);
}
//TODO: Add as necessary


//then Nuke it
ns.nuke(target);

ns.tprint("Target " + target + " cracked.");
}