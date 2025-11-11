/** @param {NS} ns */
export async function main(ns) {
let neighbors = ns.scan();
const unbroken = []; 
const hackLevel = ns.getHackingLevel();
let count = 0;

//get a list of all computers accessable from where the script is running

//gain access to all of them, if possible
for (let i = 0; i < neighbors.length; i++){
  if (hackLevel >= ns.getServerRequiredHackingLevel(neighbors[i])){
    ns.nuke(neighbors[i]);
    count++;
  }
  else{
    unbroken.push(neighbors[i]);
  }
}

ns.tprint("Process Complete! " + count + " broken servers.")

if (unbroken.length = 0){
  ns.tprint("No Unbroken servers.");
}
else{
  ns.tprint("Unbroken servers: ");
  for (let i=0; i < unbroken.length; i++){
    ns.tprint(unbroken[i]);
  }
}

}