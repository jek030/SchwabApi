const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;

const axios = require("axios");
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
 module.exports = {refreshAuthToken};