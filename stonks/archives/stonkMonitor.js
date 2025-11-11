/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0]
  let playerPosition = ns.stock.getPosition(target)

  //Text colors
  var yellow = "\x1b[33m"
  var red = "\x1b[31m"
  var white = "\x1b[37m"
  var reset = "\x1b[0m"

  //Disable superfluous logs
  ns.disableLog("sleep")

  while(true){
  //Make sure you update the Player's position! 
  playerPosition = ns.stock.getPosition(target)

  //Print report
  ns.print("Stock Report for " + target + " on " + Date(Date.now()).toString())
  ns.print("--------------------------------------------")
  ns.print("Name: " + ns.stock.getOrganization(target) + white + " [$" + target + "]" + reset)
  ns.print("Ticket Price: " + yellow + "$" + ns.formatNumber(ns.stock.getPrice(target)) + reset)
  ns.print("Current Bid Price: " + yellow + "$" + ns.formatNumber(ns.stock.getBidPrice(target)) + reset)
  ns.print("Current Ask Price: " + yellow + "$" + ns.formatNumber(ns.stock.getAskPrice(target))+ reset)
  ns.print("Volitility: " + yellow + ns.formatNumber(ns.stock.getVolatility(target) * 100 ) + "%" + reset)
  let forecast = ns.stock.getForecast(target)
  ns.print("Forecast: "+ yellow + ns.formatPercent(forecast)+ " gain" +reset+ ", " + red + (ns.formatPercent(1-forecast)) + " loss." + reset)
  ns.print("--------------------------------------------")
  ns.print("Player Position: ")
  ns.print("Shares Owned (Long): " + yellow + ns.formatNumber(playerPosition[0]) + reset)
  ns.print("Average Long Price: " + yellow + "$" + ns.formatNumber(playerPosition[1]) + reset)
  let longProfit = findLongProfit(ns, playerPosition, target)
  ns.print("Potential Long Profit: " + longProfit[0] + " (" + longProfit[1] + ")\n\n") 

  ns.print("Shares to Sell (Short): " + yellow + ns.formatNumber(playerPosition[2]))
  ns.print("Average Short Price: "+ yellow + "$" + ns.formatNumber(playerPosition[3]))
  let shortProfit = findShortProfit(ns, playerPosition, target)
  ns.print("Potential Short Profit: " + shortProfit[0] +", (" + shortProfit[1] +")")
  ns.print("END OF REPORT \n \n")
  
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