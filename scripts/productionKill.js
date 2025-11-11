/** @param {NS} ns */
export async function main(ns) {
  const begin = ns.args[0]
  const end = ns.args [1]
  const serverCollection = ns.getPurchasedServers()

  if(begin && end){
    for(let i = begin; i < end; i++){
      ns.run("/scripts/scriptKill.js",1, serverCollection[i])
    }
  }
  else{
    for (let i = 0; i < serverCollection.length; i++){
      ns.run("/scripts/scriptKill.js",1, serverCollection[i])
   }
  }
}