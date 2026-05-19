const axios = require('axios');

exports.sendSMS = async (phone, message) => {
  try {
    await axios.get(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        params: {
          authorization: process.env.FAST2SMS_KEY,
          message,
          language: 'english',
          route: 'q',
          numbers: phone
        }
      }
    );

    console.log('SMS sent');

  } catch (err) {
    console.log('SMS failed');
  }
};