/** @param {NS} ns */
export async function main(ns) {
  const visited = []
  
  let serverData = {
    name:  "",
    hackLevel: 0,
    ports: 0,
  };

  let temp;
  let tempServerData;
  let result = [];

  ns.disableLog("ALL")

  ns.print("Scanning servers...")
  temp = ns.scan("home");
  //Remove p-servs
  for (let i = 0; i < temp.length; i++){
    if (temp[i].slice(0,5) == "pserv"){
      continue;
    }
    else{
      result.push(temp[i]);
    }
  }

  for (let i = 0; i < result.length; i++){
    tempServerData = {};
    tempServerData.name = result[i]
    tempServerData.hackLevel = ns.getServerRequiredHackingLevel(result[i])
    tempServerData.ports = ns.getServerNumPortsRequired(result[i])
    
    visited.push(tempServerData);
  }

  //ns.print("Result: \n" + result)

  //Print all the results
  for(let i = 0; i < visited.length; i++){
    ns.print(visited[i].name + " | Hack Level: " + visited[i].hackLevel + " | Ports: " + visited[i].ports)
  }



  ns.print("END OF PROGRAM")


}