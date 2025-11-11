/** @param {NS} ns */
export async function main(ns) {
    //amount of ram to upgrade to or buy servers at
    const ram = ns.args[0];    
    
    
    //Get a list of all purchased servers (if any). Rename them to the correct naming
    //scheme if necessary. 
    let i = 0;
    let currentServers = ns.getPurchasedServers();
    let tempName = ""

    while (i < currentServers.length){
      if (i < 10){
        tempName = "pserv-0" + i;
      }
      else{
        tempName = "pserv-" + i;
      }
      ns.print(currentServers[i] + ", Current Num: " + i);

      if (currentServers[i] != tempName){
        ns.print("Renaming " + currentServers[i] + " to " + tempName);
        let nameResult = ns.renamePurchasedServer(currentServers[i], tempName);
        ns.print("Confirming server renamed: " + nameResult);
      }
      i++;
    }

    //upgrade currently existing servers to standards
    let j = 0;
    //update currentServers for current names
    currentServers = ns.getPurchasedServers();


    while (j < currentServers.length){
      let newPurchase = false;
      ns.print("Examining " + currentServers[j] + " against upgrade to " + ram + "GB of RAM.");
      ns.print("Actual RAM: " + ns.getServer(currentServers[j]).maxRam + ", Target RAM: " + ram);

      if (ns.getServer(currentServers[j]).maxRam < ram){
        let serverUpgradeCost = ns.getPurchasedServerUpgradeCost(currentServers[j], ram);
        ns.print("Server Upgrade Cost: $" + ns.formatNumber(serverUpgradeCost,2) + ", Current Cash: $" + ns.formatNumber(ns.getServerMoneyAvailable("home"),2));
        if (serverUpgradeCost <= ns.getServerMoneyAvailable("home")){
          newPurchase = ns.upgradePurchasedServer(currentServers[j], ram);
        }
       if (newPurchase){
          ns.print("Upgrading server " + currentServers[j] + " to " + ram + "GB of RAM.");
       }
       else{
          ns.print("Awaiting cash for upgrade.");
       } 
      }

      if(ns.getServer(currentServers[j]).maxRam >= ram){
        ns.print("Current Server satisfies requirement.");
        j++;
      }

      await ns.sleep(5000);
    }

    // Continuously try to purchase servers until we've reached the maximum
    // amount of servers
    while (currentServers.length < ns.getPurchasedServerLimit()) {
        ns.print("Attempting to purchase Server " + i)
        ns.print("Current Money: $" + ns.formatNumber(ns.getServerMoneyAvailable("home")))
        ns.print("Server Cost: $" + ns.formatNumber(ns.getPurchasedServerCost(ram)))
        // Check if we have enough money to purchase a server
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            // If we have enough money, then:
            //  1. Purchase the server
            //  2. Copy our hacking script onto the newly-purchased server
            //  3. Run our hacking script on the newly-purchased server with 3 threads
            //  4. Increment our iterator to indicate that we've bought a new server
            if(i < 10){
              tempName = "pserv-0"+i;
            }
            else{
              tempName = "pserv-"+i;
            }

            let hostname = ns.purchaseServer(tempName, ram);
            ns.scp("/scripts/hackTech5.js", hostname);
            ns.scp("/scripts/simpleHack.js", hostname);
            ns.scp("/scripts/simpleGrow.js", hostname);
            ns.scp("/scripts/simpleWeaken.js", hostname);
            //ns.exec("early-hack-template.js", hostname, 3);
            i++;
        }
        //Make the script wait for a second before looping again.
        //Removing this line will cause an infinite loop and crash the game.
        await ns.sleep(120000);
    }
}