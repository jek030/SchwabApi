require('dotenv').config();
const fs = require('fs');
const axios = require("axios");
const Position = require('./Position.js');
schwab = require("./schwab-tokens.js")
Ticker = require("./Position.js")

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

   //getTicker('TSLA');
   getTestTickerTsla();
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

function getTestTickerTsla () {
  fs.readFile('./test/tsla.json', 'utf-8', (err, jsonString) => {
    if (err) {
        console.log("Error reading file:", err);
        return;
    }
    try {
      const json = JSON.parse(jsonString);  
      
      console.log(json["TSLA"].symbol);
      console.log(json["TSLA"].quote);


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
  console.log("*** API TEST CALL: ACCOUNTS ***");
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
  console.log(JSON.stringify(res.data,null, 2));
  
  console.log("Looping through accounts...");

  for (let acc in res.data) {
    console.log(`Index: ${acc} Object: ${res.data[acc]}`)
    
    let accounts = res.data[acc]

    console.log("Account Number: " + accounts.securitiesAccount['accountNumber'])

    let positions = accounts.securitiesAccount['positions']
    positions.forEach(pos => console.log(pos))
  }
} 

async function getTicker(ticker) {
  console.log("*** TICKER API TEST CALL: " + ticker );

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
  console.log(JSON.stringify(res.data,null, 2));

} 
   main()