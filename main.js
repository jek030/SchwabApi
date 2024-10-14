require('dotenv').config();
const fs = require('fs');

const axios = require("axios");

//import axios from 'axios';
refreshAuthToken = require("./refreshAuthToken.js")
Ticker = require("./Ticker.js")

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
  
    
    //getAuthToken();
    //refreshAuthToken.refreshAuthToken();
    //right now you need to copy the New access token print from refreshAuthToken into .env
    //todo have script save the accessToken and refreshToken to database or ..env? so that not hardcoding 

   //getAccounts(); //get accounts from API
   getTestAccounts(); //get static test accounts from file

   //getTicker('TSLA')
    //post request to get refresh and access tokens

  }

  async function getAuthToken() {
  // Base64 encode the client_id:client_secret
  const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await axios({
      method: "POST",
      url: "https://api.schwabapi.com/v1/oauth/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${base64Credentials}`,
      },
      data: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${redirectUri}`,
    });

    console.log("*** GOT NEW AUTH TOKEN ***");

    // Log the refresh_token and access_token before exiting
    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    return response.data;
  } catch (error) {
    console.error("Error fetching auth token:", error);
    throw error;
  }
}


function getTestAccounts () {
  fs.readFile('./test/accounts.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("Error reading file:", err);
        return;
    }
    try {
      console.log(jsonString);
      const json = JSON.parse(jsonString);  

       for (let acc in json) {
        console.log(`Index: ${acc} Object: ${json[acc]}`)
    
        let accounts = json[acc]

        console.log("\nAccount Number: " + accounts.securitiesAccount['accountNumber'])

        let positions = accounts.securitiesAccount['positions']
        
        let openPnl = 0
        let stocks = {};

        for (let i = 0; i < positions.length; i++) {
          stocks[i] = new Ticker(positions[i].instrument.symbol,
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
  console.log("*** API TEST CALL: ACCOUNTS ***");

  const res = await axios({
    method: "GET",
    url: "https://api.schwabapi.com/marketdata/v1/quotes",
    params:{ticker},
    contentType: "application/json",
    headers: {
      "Accept-Encoding": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });



} 
   main()