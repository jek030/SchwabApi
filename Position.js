class Position {
    // Constructor method
    constructor(symbol, quantity, averagePrice, profitLoss) {
      this.symbol = symbol;
      this.quantity = quantity;
      this.averagePrice = averagePrice;
      this.profitLoss = profitLoss;
  
    }
    // Instance method
    printData() {
      console.log(this.symbol 
        + "\n Quantity: " + this.quantity  
        + "\n Average Price: " + this.averagePrice
        + "\n Unrealized P/L: " + this.profitLoss
      )
    }
  }

  module.exports = Position;