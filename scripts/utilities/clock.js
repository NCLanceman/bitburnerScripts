/** @param {NS} ns */
export async function main(ns) {
  //const doc = document; //25GB Lawl

  //const hook0 = doc.getElementById('overview-extra-hook-0');
  //const hook1 = doc.getElementById('overview-extra-hook-1');

  const hook0 = eval("document.getElementById('overview-extra-hook-0')")
  const hook1 = eval("document.getElementById('overview-extra-hook-1')")

  while (true){
    try{
    const headers = [];
    const values = [];

    headers.push("Clock\n");
    values.push(datePrinter());

    hook0.innerText = headers.join(" \n")
    hook1.innerText = values.join("\n")
    }
    catch (err){
      ns.print("ERROR: Update Skipped: " + String(err))
    }
    await ns.sleep(1000);
  }

}

function datePrinter()
{
  const months = ["01", "02", "03", "04", "05", "06", "07",
   "08", "09", "10", "11", "12"];
  let clock = new Date(Date.now())
  let hours = clock.getHours().toString()
  let minutes = clock.getMinutes().toString()

  if (hours.length < 2){
    hours = hours.padStart(2,'0')
  }
  if (minutes.length < 2){
    minutes = minutes.padStart(2,'0')
  }


  let date = months[clock.getMonth()] + "/" + clock.getDate() + "/" + clock.getFullYear() 
  let time = hours + minutes
  return date + " @ " + time 
}