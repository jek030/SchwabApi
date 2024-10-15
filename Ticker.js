class Position {
    // Constructor method
    constructor(symbol, 
        volume, 
        tenDayVolume, 
        oneYearVolume, 
        dividendYield, 
        earningsPerShare, 
        peRatio, 
        description, 
        yesterdayDayClosePrice, 
        openPrice,
        mark, 
        regularMarketLastPrice,
        regularMarketNetChange,
        regularMarketPercentChange, 
        dailyHigh, 
        dailyLow ) {

        this.symbol = symbol;
        this.volume = volume;
         this.tenDayVolume = tenDayVolume;
        this.oneYearVolume = oneYearVolume;
        this.dividendYield = dividendYield;
        this.earningsPerShare = earningsPerShare;
        this.peRatio = peRatio;
        this.description = description;
        this.yesterdayDayClosePrice = yesterdayDayClosePrice;
        this.openPrice = openPrice;
        this.mark = mark;
        this.regularMarketLastPrice = regularMarketLastPrice;
        this.regularMarketNetChange = regularMarketNetChange;
        this.regularMarketPercentChange = regularMarketPercentChange;
        this.dailyHigh = dailyHigh;
        this.dailyLow = dailyLow;
    }
    // Instance method
    //printData() {
    //  console.log(this.symbol 
    //    + "\n Quantity: " + this.quantity  
    //    + "\n Average Price: " + this.averagePrice
    //    + "\n Unrealized P/L: " + this.profitLoss
    //  )
    //}
  }

  module.exports = Position;