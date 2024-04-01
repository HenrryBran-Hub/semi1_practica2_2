const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION1 } = process.env;


AWS.config.update({
    region: AWS_REGION1,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
});

const lexClient = new AWS.LexRuntimeV2(); // Reemplaza "tu-region-aws" por la región donde creaste tu bot

module.exports = lexClient;