const axios = require('axios');

exports.sendSMS = async (phone, message) => {
  console.log("To:", phone);
  console.log("Message:", message);

  return true
};