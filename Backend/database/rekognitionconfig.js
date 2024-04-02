const { DetectLabelsCommand, RekognitionClient } = require("@aws-sdk/client-rekognition");
const dotenv = require('dotenv');

dotenv.config();

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET_NAME} = process.env;



const rekogClient = new RekognitionClient({
    region:AWS_REGION,
    credentials: {
        accessKeyId:AWS_ACCESS_KEY_ID,
        secretAccessKey:AWS_SECRET_ACCESS_KEY
    }
});



async function detect_labels(bucket, photo)  {
    try {
        const params = {
            Image:{
                S3Object:{
                    Bucket: bucket,
                    Name: photo
                }
            }
        }
        const response = await rekogClient.send(new DetectLabelsCommand(params));
        //console.log('LABELS ---------->'+response.Labels)
        return response; // For unit tests.
      } catch (err) {
        console.log("Error", err);
        throw err;
      }
};

module.exports = {detect_labels};