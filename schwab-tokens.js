const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
let refreshToken = process.env.REFRESH_TOKEN;
let accessToken = process.env.ACCESS_TOKEN;
const axios = require("axios");
const returnedLink = process.env.RETURNED_LINK;
const redirectUri = process.env.REDIRECT_URI;



 async function refreshAuthToken() {
    console.log("*** REFRESHING ACCESS TOKEN ***");
  
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
        data: `grant_type=refresh_token&refresh_token=${refreshToken}`,
      });
  
      // Log the new refresh_token and access_token
      accessToken = response.data.access_token;
      refreshToken = response.data.refresh_token;
      console.log("New Refresh Token:", response.data.refresh_token);
      console.log("New Access Token:", response.data.access_token);
  
      return response.data;
    } catch (error) {
      console.error("Error refreshing auth token:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

  
async function getAuthToken() {
    // Base64 encode the client_id:client_secret
    const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    let authorizationCode = returnedLink.substring( returnedLink.indexOf("code") + 5, returnedLink.indexOf("%40") ) + "@"
    console.log(`Code: ${authorizationCode}`);
    
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
 module.exports = {refreshAuthToken, getAuthToken};