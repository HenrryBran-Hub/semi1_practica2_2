const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION,AWS_SESSION_TOKEN} = process.env;

AWS.config.update({
  region: AWS_REGION
});

const rekognition = new AWS.Rekognition({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    sessionToken:AWS_SESSION_TOKEN,
  }
});

module.exports =  rekognition ;
