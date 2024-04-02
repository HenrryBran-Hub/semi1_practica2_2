const rekognizeText = require("../database/rekognitionconfig");
const dotenv = require('dotenv');
dotenv.config();
const getTagRekognition = async (url) => {
    

    try {
        const response = await rekognizeText.detect_labels(process.env.S3_BUCKET_NAME, url)

        const confidentLabels = response.Labels.filter(label => label.Confidence > 90)
        .map(label => ({ Etiqueta: label.Name, Confidence: label.Confidence }));

        return new Promise((resolve, reject)=>{
          resolve(confidentLabels);
        })
    } catch (error) {
        console.log("error ->", error)
        return error;
    }
}


module.exports = { getTagRekognition}