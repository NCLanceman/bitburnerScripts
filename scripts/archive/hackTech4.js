/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0];
  const hThreads = ns.args[1];
  const wThreads = ns.args[2];
  const gThreads = ns.args[3];

  //Initial hack preparations
  ns.print("Assigning hackTech4 to " + target);

  ns.print("Opening Ports on " + target + "...");
  if (ns.fileExists("BruteSSH.exe", "home")){
    ns.brutessh(target);
  }
  if (ns.fileExists("FTPCrack.exe","home")){
    ns.ftpcrack(target);
  }

  ns.print("Nuking " + target + "...")
  ns.nuke(target);


  //Assign subscripts as needed
  ns.run("/scripts/simpleHack.js", hThreads, target)
  ns.run("/scripts/simpleGrow.js", gThreads, target)
  ns.run("/scripts/simpleWeaken.js", wThreads, target)  

}