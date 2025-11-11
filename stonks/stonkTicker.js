/** @param {NS} ns */
export async function main(ns) {
  let serverProcesses = ns.ps("home")
  let stockTicker = []

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

  stockTicker = updateTicker(ns)  
  ns.print("Currently Tracked Stocks: " + stockTicker)
  ns.print("Tracking Stocks...")

  while(true){
    for(let i = 0; i < stockTicker.length; i++){
      let playerPosition = ns.stock.getPosition(stockTicker[i])
      let forecast = ns.stock.getForecast(stockTicker[i])
      let currentTicker = ""

      for(let j = 0; j < stockTicker.length; j++){
        if (j == i){
          currentTicker += white + stockTicker[j] + reset;
        }
        else{ currentTicker += stockTicker[j] }
        if (j == stockTicker.length-1){
          continue
        }
        else{ currentTicker += ", "}
      }


      ns.print("------------------------------------------------")
      ns.print(datePrinter() + " | [" + currentTicker + "]")
      ns.print("------------------------------------------------")
      priceLine = ns.stock.getOrganization(stockTicker[i]) + " " + white + "[$" + stockTicker[i] + "] "
      priceLine += yellow + "$" + ns.formatNumber(ns.stock.getPrice(stockTicker[i])) + reset + " | " + forecastFormat(ns, forecast)
      ns.print(priceLine)
      ns.print("------------------------------------------------")
      
      let longProfit = findLongProfit(ns, playerPosition, stockTicker[i])
      let shortProfit = findShortProfit(ns, playerPosition, stockTicker[i])

      if(playerPosition[0] > 0){
        longLine = "LNG: " + yellow + ns.formatNumber(playerPosition[0]) + reset + " @ " + green + "$" + ns.formatNumber(playerPosition[1]) + reset
        longLine = longLine + " | Net: " + longProfit[0] + " (" + longProfit[1]+")"
        ns.print(longLine)
      }
      if(playerPosition[2] > 0){
        shortLine = "SRT: " + yellow + ns.formatNumber(playerPosition[2]) + reset + " @ " + green + "$" + ns.formatNumber(playerPosition[3]) + reset;
        shortLine += " | Net: " + shortProfit[0] + " (" + shortProfit[1] + ")"
        ns.print(shortLine)        
      }
      if(playerPosition[0] == 0 && playerPosition[2] == 0){
        ns.print("No Position in this Stock")
      }
      await ns.sleep(1000 * 10)
    }
    stockTicker = updateTicker(ns)
  }
}

/** @param {NS} ns */
function updateTicker(ns){
  let serverProcesses = ns.ps("home")
  let currentStocks = []

  for(let i = 0; i < serverProcesses.length; i++){
    if(serverProcesses[i].filename == "stonks/rollerBowler.js"){
      currentStocks.push(serverProcesses[i].args[0])
    }
  }

  return currentStocks
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
  function forecastFormat(ns, forecast){
    var red = "\x1b[31m"
    var green = "\x1b[32m"
    var white = "\x1b[37m"
    var reset = "\x1b[0m"
    
    if(forecast > 0.50){
      return "Action: " + green + ns.formatPercent(forecast) + reset;
    }
    else{
      return "Action: " + red + ns.formatPercent(forecast) + reset;
    }
}

function datePrinter()
{
  var red = "\x1b[31m"
  var green = "\x1b[32m"
  var white = "\x1b[37m"
  var reset = "\x1b[0m"
  
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


  let date = green + months[clock.getMonth()] + "/" + clock.getDate() + "/" + clock.getFullYear() + reset
  let time = white + hours + minutes + reset
  return date + " @ " + time
}
