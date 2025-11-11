/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0]
  const initialBudget = ns.args[1]
  let buyRange = false
  let sellRange = false

  //Disable superfluous logs
  ns.disableLog("sleep")

  //For fifteen minutes, track the price of the stock, setting the max and min
  let startTime = Date.now()
  const trackingInterval = (1000 * 60 * 3)
  //let it ride
  //const runningInterval = (1000 * 60 * 60 * 2)
  const timeoutInterval = (1000 * 60 * 10)
  let endTime = startTime + trackingInterval
  const prices = {
    current: ns.stock.getPrice(target),
    max:{
      price: Number.NEGATIVE_INFINITY,
      timestamp: Date.now()
    },
    min:{
      price: Number.POSITIVE_INFINITY,
      timestamp: Date.now()
    }
  }

  let stockAction = "Unknown" 

  while(endTime > Date.now()){
    prices.current = ns.stock.getPrice(target)
    if (prices.current > prices.max.price){
       prices.max.price = prices.current
       prices.max.timestamp = Date.now()
       }
    if (prices.current < prices.min.price){ 
      prices.min.price = prices.current
      prices.min.timestamp = Date.now() 
      }

    ns.print("Current Price: $" + ns.formatNumber(prices.current) + " | Max: $" + ns.formatNumber(prices.max.price) + " | Min: $" + ns.formatNumber(prices.min.price))
    await ns.sleep(5000)
  }

  ns.print("-----------------------------")
  ns.print("Final Results: Price $" + ns.formatNumber(prices.current) + " | Max: $" + ns.formatNumber(prices.max.price) + " | Min: $" + ns.formatNumber(prices.min.price))
  ns.print("\nRoller Bowler Stock Platform Active")

  //startTime = Date.now()
  //endTime = startTime + runningInterval 
  
  //After that, use the budget to buy low and sell high, within ten percent.
  //Run for fifteen minutes 
  while (true){
    prices.current = ns.stock.getPrice(target)

    //Check if prices are outdated. Adjust for time.
    if(prices.min.timestamp + timeoutInterval < Date.now()){
      prices.min.price = prices.min.price * 1.1
      prices.min.timestamp = Date.now()
      ns.print("Price Floor expired, adjusting upward...") 
    }
    if(prices.max.timestamp + timeoutInterval < Date.now()){
      prices.max.price = prices.max.price * 0.9
      prices.max.timestamp = Date.now()
      ns.print("Price Ceiling expired, adjusting downward...")
    }

    //Check Statuses
    if (prices.current < (prices.min.price * 1.1)){ buyRange = true }
    else{ buyRange = false}

    if (prices.current > (prices.max.price * 0.9)){ sellRange = true }
    else { sellRange = false }

    if(ns.stock.getForecast(target) > 0.5) { stockAction = "Rising" }
    else if(ns.stock.getForecast(target) < 0.49) {stockAction = "Falling"}

    if (prices.current > prices.max.price){
       prices.max.price = prices.current 
       prices.max.timestamp = Date.now()
    }
    if (prices.current < prices.min.price){ 
      prices.min.price = prices.current
      prices.min.timestamp = Date.now() 
    }

    ns.print("--------------------------------------")

    //Buy Low
    if (buyRange == true && (ns.stock.getPosition(target))[0] < 1 && stockAction == "Rising"){
      ns.stock.buyStock(target, ns.stock.getMaxShares(target))
      ns.print("Buying Max in Stock: " + target)
    }

    //Sell High
    if (sellRange == true && (ns.stock.getPosition(target))[0] > 0 && stockAction == "Falling"){
      ns.stock.sellStock(target, ns.stock.getMaxShares(target))
      ns.print("Selling Max in Stock: " + target)
    }

    ns.print("Current: $" + ns.formatNumber(prices.current) + " | Max: $" + ns.formatNumber(prices.max.price) + " | Min: $" + ns.formatNumber(prices.min.price))
    ns.print("Sell?: " + sellRange + ", Buy?: " + buyRange + ", Action: " + stockAction + ", Position: " + ns.formatNumber(ns.stock.getPosition(target)[0]))
    ns.print("--------------------------------------\n")
    await ns.sleep(5000)
  }
}