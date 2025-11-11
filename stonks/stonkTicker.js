/** @param {NS} ns */
export async function main(ns) {
  let stockTicker = []

  //Text colors
  const yellow = "\x1b[33m"
  const red = "\x1b[31m"
  const green = "\x1b[32m"
  const white = "\x1b[37m"
  const reset = "\x1b[0m"

  //Disable superfluous logs
  ns.disableLog("sleep")
  let priceLine = ""
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
      
      //let longProfit = findLongProfit(ns, playerPosition, stockTicker[i])
      //let shortProfit = findShortProfit(ns, playerPosition, stockTicker[i])
      let profits = findProfit(ns, playerPosition, stockTicker[i])

      if(playerPosition[0] > 0){
        longLine = "LNG: " + yellow + ns.formatNumber(playerPosition[0]) + reset + " @ " + green + "$" + ns.formatNumber(playerPosition[1]) + reset
        longLine = longLine + " | Net: " + profits.long.cash + " (" + profits.long.percent +")"
        ns.print(longLine)
      }
      if(playerPosition[2] > 0){
        shortLine = "SRT: " + yellow + ns.formatNumber(playerPosition[2]) + reset + " @ " + green + "$" + ns.formatNumber(playerPosition[3]) + reset;
        shortLine += " | Net: " + profits.short.cash + " (" + profit.short.percent + ")"
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


function findProfit(ns, position, target){
  //Text Colors
  const green = "\x1b[32m"
  const yellow = "\x1b[33m"
  const red = "\x1b[31m"
  const reset = "\x1b[0m"

  let answer= {
    long: {
      cash: "",
      percent: "",
    },
    short: {
      cash: "",
      percent: "",
    }
  }

  const longCost = position[0] * position[1]
  const shortCost = position[2] * position[3]

  const totalSell = ns.stock.getBidPrice(target) * position[0]
  const totalBuy = ns.stock.getAskPrice(target) * position[2]

  //Calculate Long Profit
  let lProfit = (totalSell - longCost) - 100000
  if (lProfit >= 0){
    answer.long.cash =  yellow + "$" + ns.formatNumber(lProfit)+ reset;
    answer.long.percent = green + ns.formatPercent((lProfit/longCost))+ reset;
  }
  else{
    answer.long.cash = red + "$" + ns.formatNumber(lProfit * -1)+ reset;
    answer.long.percent = red + ns.formatPercent((lProfit/longCost))+ reset
  }
  
  //Calculate Short Profit
  let sProfit = (totalBuy - shortCost) - 100000
  if (sProfit >= 0){
    answer.short.cash = yellow + "$" + ns.formatNumber(sProfit) + reset
    answer.short.percent = green + ns.formatPercent((sProfit/shortCost)) + reset
  }
  else{
    answer.short.cash = red + "-$" + ns.formatNumber(sProfit * -1) + reset
    answer.short.percent = red + ns.formatPercent(sProfit/shortCost) + reset
  }

  return answer
}



  /** @param {NS} ns */
  function forecastFormat(ns, forecast){
    const red = "\x1b[31m"
    const green = "\x1b[32m"
    const white = "\x1b[37m"
    const reset = "\x1b[0m"
    
    if(forecast > 0.50){
      return "Action: " + green + ns.formatPercent(forecast) + reset;
    }
    else{
      return "Action: " + red + ns.formatPercent(forecast) + reset;
    }
}

function datePrinter()
{
  const green = "\x1b[32m"
  const white = "\x1b[37m"
  const reset = "\x1b[0m"
  
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
