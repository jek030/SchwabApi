class Stock {
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

    //TODO: create some functions with this data

    isVolumeAbove10DayAvg() {
        return this.volume > this.tenDayVolume;
    }

    printData() {
      console.log(this.symbol 
        + "\n Daily volume: " + this.volume.toLocaleString('en-US')
        + "\n Opening price: $" + this.openPrice
        + "\n Last price during regular market hours: $" + this.regularMarketLastPrice
        + "\n Percent change: " + Number(this.regularMarketPercentChange).toFixed(2) + "%"
        + "\n Last price: $" + this.mark
      )
    }
  }

  module.exports = Stock;