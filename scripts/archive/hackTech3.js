/** @param {NS} ns */
export async function main(ns) {
    // Defines the "target server"
    // take server name from args[0] 
    const target = ns.args[0];
    ns.print("Applying hackTech3 to server " + target)

    // Defines how much money a server should have before we hack it
    // Get within 2% of the max
    const moneyMax = ns.getServerMaxMoney(target);
    const moneyThresh = moneyMax * 0.75;

    // Defines the minimum security level the target server can
    // have. If the target's security level is higher than this,
    // we'll weaken it before doing anything else
    const securityMin = ns.getServerMinSecurityLevel(target);
    const securityThresh = securityMin + (securityMin * 0.25);

    // If crack programs exist on machine, use them.
    if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(target);
    }
    if (ns.fileExists("FTPCrack.exe", "home")){
        ns.ftpcrack(target);
    }

    // Get root access to target server
    ns.nuke(target);

    // Infinite loop that continously hacks/grows/weakens the target server
    while(true) {
        let hack = false;
        let weaken = false;
        let grow = false;
        let currentSecurity = ns.getServerSecurityLevel(target); 
        let currentCash = ns.getServerMoneyAvailable(target);
        
        if(currentSecurity > securityThresh){
          weaken = true;
        }
        else if (currentSecurity > securityMin && currentSecurity < securityThresh){
          weaken = true;
          hack = true;
        }
        else if (currentCash < moneyThresh){
          grow = true;
        }
        else if (currentCash < moneyMax && currentCash > moneyThresh){
          grow = true;
          hack = true;
        }

        if (weaken){
          await ns.weaken(target);  
        }
        if (grow){
          await ns.grow(target);
        }
        if (hack){
          await ns.hack(target);
        }
        
     }
}