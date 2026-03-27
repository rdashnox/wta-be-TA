const config = require("../config/config");
const axios = require("axios");


const verifyEmail = async (email) => {
  if (!email) throw new Error("Email required.");

  const apiKey = config.emailVerifierApiKey;
  if (!apiKey) throw new Error("API key not configured.");

  const encodedEmail = encodeURIComponent(email);
  const url = `https://emailverifierapi.com/v2/?apiKey=${apiKey}&email=${encodedEmail}`;

  const response = await axios.get(url);
  const data = response.data;

  if (data.status === "failed") {
    throw new Error("Invalid email.");
  }
  // if (data.isDisposable) {  // Commented for POC testing
  //   throw new Error("Disposable emails not allowed.");
  // }
  if (data.possibleSpamtrap || data.isComplainer || data.isOffensive) {
    throw new Error("Email flagged as risky.");
  }

  return data;  // Returns verification details 
};

module.exports = { verifyEmail };