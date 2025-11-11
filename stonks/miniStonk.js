/** @param {NS} ns */
export async function main(ns) {
  let clock = new Date()
  const target = ns.args[0]
  const volitility = ns.stock.getVolatility(target)
  let playerPosition = ns.stock.getPosition(target)

  //Text colors
  var yellow = "\x1b[33m"
  var red = "\x1b[31m"
  var green = "\x1b[32m"
  var white = "\x1b[37m"
  var reset = "\x1b[0m"

  //Disable superfluous logs
  ns.disableLog("sleep")
  let priceLine = ""
  let forecastLine = ""
  let longLine = ""
  let shortLine = ""
  

  while(true){
  //Make sure you update the Player's position! 
  playerPosition = ns.stock.getPosition(target)


  //Print report
  ns.print("--------------------------------------------")
  ns.print(ns.stock.getOrganization(target) + white + " [$" + target + "]" + reset + " | " + datePrinter())
  priceLine = yellow + "$" + ns.formatNumber(ns.stock.getPrice(target)) + reset + " | "
  let forecast = ns.stock.getForecast(target)
  ns.print(priceLine + forecastFormat(ns, forecast, volitility))
  ns.print("--------------------------------------------")

  let longProfit = findLongProfit(ns, playerPosition, target)
  let shortProfit = findShortProfit(ns, playerPosition, target)

  if (playerPosition[0] > 0){
  longLine = "LNG: " + yellow + ns.formatNumber(playerPosition[0]) + reset + " @ " + green + "$" + ns.formatNumber(playerPosition[1]) + reset
  longLine = longLine + " | Net: " + longProfit[0] + " (" + longProfit[1]+")"
  ns.print(longLine)
  }
  else if (playerPosition[2] > 0){
  shortLine = "SRT: " + yellow + ns.formatNumber(playerPosition[2]) + reset + " @ " + green + "$" + ns.formatNumber(playerPosition[3]) + reset;
  shortLine += " | Net: " + shortProfit[0] + " (" + shortProfit[1] + ")"
  ns.print(shortLine)
  }
  else if (playerPosition[0] ==  0 && playerPosition[2] == 0){
    ns.print("No Position in this Stock")
  }
  
  ns.print("END OF REPORT\n")
  //Wait fifteen seconds
  await ns.sleep(15000)
  }
}


/** @param {NS} ns */
function findLongProfit(ns,position, target){
  var yellow = "\x1b[33m"
  var red = "\x1b[31m"
  var reset = "\x1b[0m"

  const longCost = position[0] * position [1]
  const totalSell = ns.stock.getBidPrice(target) * position[0]

  let answer = (totalSell - longCost) - 100000
  if (answer >= 0){
    return ([(yellow + "$" + ns.formatNumber(answer)+ reset),(yellow + ns.formatPercent((answer / longCost)) + reset)])
  }
  else{
    return ([(red + "-$" + ns.formatNumber(answer * -1)+ reset), (red + ns.formatPercent((answer / longCost))+ reset)])
  }
}


/** @param {NS} ns */
function findShortProfit(ns,position, target){
  var yellow = "\x1b[33m"
  var red = "\x1b[31m"
  var reset = "\x1b[0m"

  const shortCost = position[2] * position[3]
  const totalBuy = ns.stock.getAskPrice(target) * position[2]
  
  let answer = (totalBuy - shortCost) - 100000
  if (answer >= 0){
    return([(yellow + "$" + ns.formatNumber(answer)+ reset), (yellow + ns.formatPercent((answer / shortCost))+ reset)])
  }
  else{
    return([((red + "-$"+ ns.formatNumber(answer * -1))+ reset), (red + ns.formatPercent((answer/shortCost))+reset)])
  }
}


  /** @param {NS} ns */
  function forecastFormat(ns, forecast, volitility){
    var red = "\x1b[31m"
    var green = "\x1b[32m"
    var white = "\x1b[37m"
    var reset = "\x1b[0m"
    
    if(forecast > 0.50){
      return "Action: " + green + ns.formatPercent(forecast) + reset + " | Volitility: " + white + ns.formatPercent(volitility) + reset;
    }
    else{
      return "Action: " + red + ns.formatPercent(forecast) + reset + " | Volitility: " + white + ns.formatPercent(volitility) + reset;
    }
}

function datePrinter(clock)
  {
  var red = "\x1b[31m"
  var green = "\x1b[32m"
  var white = "\x1b[37m"
  var reset = "\x1b[0m"
  
  const months = ["01", "02", "03", "04", "05", "06", "07",
   "08", "09", "10", "11", "12"];
  clock = new Date(Date.now())
  let hours = clock.getHours().toString()
  let minutes = clock.getMinutes().toString()

  if (hours.length < 2){
    hours = hours.padStart(2,'0')
  }
  if (minutes.length < 2){
    minutes = minutes.padStart(2,'0')
  }


  let date = green + months[clock.getMonth()] + "/" + clock.getDate() + "/" + clock.getFullYear() + reset
  let time = white + hours + minutes + reset
  return date + " @ " + time
  }
