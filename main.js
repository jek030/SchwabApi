require('dotenv').config();
const fs = require('fs');
const axios = require("axios");
const Position = require('./Position.js');
const Stock = require('./Stock.js');
schwab = require("./schwab-tokens.js")

// Load from .env file
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
let authorizationCode;
let accessToken  = process.env.ACCESS_TOKEN;
//accessToken expires every 30 min
let refreshToken = process.env.REFRESH_TOKEN;
//refresh token expires every 7 days


function main() {
    //paste this link into browser
    const url =  'URL: ' + `https://api.schwabapi.com/v1/oauth/authorize?&client_id=${clientId}&redirect_uri=${redirectUri}`

    console.log(url);

    //authenticate with brokerage account login, then paste link into this const
    //todo: automate retrieving this URL, instead of pasting it into RETURN_LINK
    const returnedLink = process.env.RETURNED_LINK;

     authorizationCode = returnedLink.substring( returnedLink.indexOf("code") + 5, returnedLink.indexOf("%40") ) + "@"
    //get the code from returnedLink
    console.log(`Code: ${authorizationCode}`);
    //use the authorizationCode to get the access and refresh token. 
  
    //schwab.getAuthToken();
    //schwab.refreshAuthToken();
    //right now you need to copy the New access token print from refreshAuthToken into .env
    //todo have script save the accessToken and refreshToken to database or ..env? so that not hardcoding 

   //getAccounts(); //get accounts from API
     //getTestAccounts(); //get static test accounts from file


    //let stocks = ["TSLA", "AAPL","SERV","NVDA", "CLOV"];
    //stocks.forEach(stock => getTicker(stock)) 
   //getTicker('TSLA');


   getYearlyPriceHistory("AUR","9-16-2024",  "10-16-2024");

   //getTestTickerTsla("TSLA");
    //post request to get refresh and access tokens

  }


function getTestAccounts () {
  fs.readFile('./test/accounts.json', 'utf-8', (err, jsonString) => {
    if (err) {
        console.log("Error reading file:", err);
        return;
    }
    try {
      const json = JSON.parse(jsonString);  

       for (let acc in json) {
        console.log(`Index: ${acc} Object: ${json[acc]}`)
    
        let accounts = json[acc]

        console.log("\nAccount Number: " + accounts.securitiesAccount['accountNumber'])

        let positions = accounts.securitiesAccount['positions']
        
        let openPnl = 0
        let stocks = {};

        for (let i = 0; i < positions.length; i++) {
          stocks[i] = new Position(positions[i].instrument.symbol,
                                 positions[i].longQuantity,
                                 Number(positions[i].averagePrice.toFixed(2)) ,
                                 Number(positions[i].longOpenProfitLoss.toFixed(2)));
          stocks[i].printData();
          openPnl  += stocks[i].profitLoss ;
        }
        console.log("Unrealized Profit/Loss for account: " + accounts.securitiesAccount['accountNumber'] + " is " + openPnl.toFixed(2))
       }
    } catch(err) {
        console.log('Error parsing JSON string:', err);
    }
});
}

function getTestTickerTsla (ticker) {
  fs.readFile('./test/tsla.json', 'utf-8', (err, jsonString) => {
    if (err) {
        console.log("Error reading file:", err);
        return;
    }
    try {
      const json = JSON.parse(jsonString);  
      
      //console.log(json[ticker].symbol);
      //console.log(json[ticker].quote);
      //console.log(json[ticker].reference);
      //console.log(json[ticker].regular);
      //console.log(json[ticker].fundamental);
      //console.log(json[ticker].quote["totalVolume"]);

      let stock = new Stock(json[ticker].symbol,  
                              json[ticker].quote["totalVolume"],
                              json[ticker].fundamental["avg10DaysVolume"],
                              json[ticker].fundamental["avg1YearVolume"], 
                              json[ticker].fundamental["divYield"],
                              json[ticker].fundamental["eps"],
                              json[ticker].fundamental["peRatio"], 
                              json[ticker].reference["description"], 
                              json[ticker].quote["closePrice"], 
                              json[ticker].quote["openPrice"], 
                              json[ticker].quote["mark"], 
                              json[ticker].regular["regularMarketLastPrice"],
                              json[ticker].regular["regularMarketNetChange"],
                              json[ticker].regular["regularMarketPercentChange"],
                              json[ticker].quote["highPrice"], 
                              json[ticker].quote["lowPrice"])

      stock.printData();
       for (let acc in json) {
        //console.log(`Index: ${acc} Object: ${json[acc]}`)
    //
        //let accounts = json[acc]
//
        //console.log("\nAccount Number: " + accounts.securitiesAccount['accountNumber'])
//
        //let positions = accounts.securitiesAccount['positions']
        //
        //let openPnl = 0
        //let stocks = {};
//
        //for (let i = 0; i < positions.length; i++) {
        //  stocks[i] = new Ticker(positions[i].instrument.symbol,
        //                         positions[i].longQuantity,
        //                         Number(positions[i].averagePrice.toFixed(2)) ,
        //                         Number(positions[i].longOpenProfitLoss.toFixed(2)));
        //  stocks[i].printData();
        //  openPnl  += stocks[i].profitLoss ;
        //}
        //console.log("Unrealized Profit/Loss for account: " + accounts.securitiesAccount['accountNumber'] + " is " + openPnl.toFixed(2))
       }
    } catch(err) {
        console.log('Error parsing JSON string:', err);
    }
});
}

async function getAccounts() {
  console.log("*** API CALL: ACCOUNTS ***");
  //get accounts from API. For now we'll use accounts.json...

  const res = await axios({
    method: "GET",
    url: "https://api.schwabapi.com/trader/v1/accounts?fields=positions",
    contentType: "application/json",
    headers: {
      "Accept-Encoding": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  })
  //console.log(JSON.stringify(res.data,null, 2));
  
  console.log("Looping through accounts...");

  let json = res.data;
  for (let acc in json) {

    let accounts = json[acc]
    console.log("\nAccount Number: " + accounts.securitiesAccount['accountNumber'])

    let positions = accounts.securitiesAccount['positions']
    let openPnl = 0
    let stocks = {};

    for (let i = 0; i < positions.length; i++) {
      stocks[i] = new Position(positions[i].instrument.symbol,
                             positions[i].longQuantity,
                             Number(positions[i].averagePrice.toFixed(2)) ,
                             Number(positions[i].longOpenProfitLoss.toFixed(2)));
      stocks[i].printData();
      openPnl  += stocks[i].profitLoss ;

      await getTicker(positions[i].instrument.symbol);
    }
    console.log("\nUnrealized Profit/Loss for account: " + accounts.securitiesAccount['accountNumber'] + " is " + openPnl.toFixed(2))

  } 
}

async function getYearlyPriceHistory(ticker, startDate, endDate) {
  console.log(`*** API CALL: PRICE HISTORY: ${ticker} from ${startDate} until ${endDate}***`);
  //get accounts from API. For now we'll use accounts.json...

  const startDateMilliseconds = new Date(startDate).getTime();
  const endDateMilliseconds = new Date(endDate).getTime();


  const res = await axios({
    method: "GET",
    url: `https://api.schwabapi.com/marketdata/v1/pricehistory?symbol=${ticker}&periodType=year&frequencyType=daily&startDate=${startDateMilliseconds}&endDate=${endDateMilliseconds}&needPreviousClose=false`,
    contentType: "application/json",
    headers: {
      "Accept-Encoding": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  })
  const json = res.data;

  console.log(JSON.stringify(json,null,2));

  getAverageVolume(json);
}


/**
 * gets the average volume of the close price based on the price history in the json
 * @param {*data returned by getYearlyPri} json 
 */
function getAverageVolume(json) {
  let vol = 0
  let days = json.candles.length;
  console.log(json);
  for (let day in json.candles) {
    vol += json.candles[day].volume;
    console.log(`DATE: ${new Date(json.candles[day].datetime).toLocaleDateString()} Volume: ${json.candles[day].volume} Close: ${json.candles[day].close}`)
  }
  console.log(`Average volume over ${days} days: ${vol/days}`)
}


async function getTicker(ticker) {
  console.log("*** TICKER API CALL: " + ticker );

  const res = await axios({
    method: "GET",
    url: "https://api.schwabapi.com/marketdata/v1/"+ticker+"/quotes",
    params:{ticker},
    contentType: "application/json",
    headers: {
      "Accept-Encoding": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
  //console.log(JSON.stringify(res.data,null, 2));
  const json = res.data;
      
  let stock = new Stock(json[ticker].symbol,  
                         json[ticker].quote["totalVolume"],
                         json[ticker].fundamental["avg10DaysVolume"],
                         json[ticker].fundamental["avg1YearVolume"], 
                         json[ticker].fundamental["divYield"],
                         json[ticker].fundamental["eps"],
                         json[ticker].fundamental["peRatio"], 
                         json[ticker].reference["description"], 
                         json[ticker].quote["closePrice"], 
                         json[ticker].quote["openPrice"], 
                         json[ticker].quote["mark"], 
                         json[ticker].regular["regularMarketLastPrice"],
                         json[ticker].regular["regularMarketNetChange"],
                         json[ticker].regular["regularMarketPercentChange"],
                         json[ticker].quote["highPrice"], 
                         json[ticker].quote["lowPrice"])

      stock.printData();

      if (stock.isVolumeAbove10DayAvg) {
        console.log(" "+stock.symbol +" daily volume: " + stock.volume.toLocaleString('en-US') + " is above 10 day average volume: " + stock.tenDayVolume.toLocaleString('en-US'))
      } else {
        console.log(" "+stock.symbol +" daily volume: " + stock.volume.toLocaleString('en-US') + " is below 10 day average volume: " + stock.tenDayVolume.toLocaleString('en-US'))
      }
} 
   main()