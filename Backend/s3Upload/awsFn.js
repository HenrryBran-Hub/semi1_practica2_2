const translate = require("../database/translate");
const lexClient = require("../database/awsBot")

const toUsTranslate = async (id, input) => {
    try {

        let target = 'en';
        if (id == 2) target = 'fr'
        if (id == 3) target = 'pt'

        const params = {
            SourceLanguageCode: 'es', // Código del idioma de origen (en este caso, inglés)
            TargetLanguageCode: target, // Código del idioma de destino (en este caso, español)
            Text: input
        };

        return new Promise((resolve, reject) => {
            translate.translateText(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.TranslatedText); // Retorna el texto traducido
                }
            });
        });
    } catch (error) {
        throw error;
    }
};


const botAws = async (mensajeUsuario, token) => {
    const id = token.toString();
    try {
        const params = {
            botAliasId: 'ZOVG3TC6ST', // Reemplaza 'ID_DEL_ALIAS' con el ID del alias
            botId: 'ZGMY9G2V5M', // Reemplaza 'ID_DEL_BOT' con el ID del bot
            localeId: 'es_419', // Reemplaza 'es_US' con el código de idioma correspondiente
            sessionId: id + "semi1p2", // Proporciona un ID de sesión único
            text: mensajeUsuario
        };

        console.log(params);
        
        return new Promise((resolve, reject) => {
            lexClient.recognizeText(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    let mensajes = [];
                    data.messages.forEach(element => {
                        mensajes.push(element.content)
                    });
                    resolve(mensajes);
                }
            });
        });
    } catch (error) {
        throw error;
    }
}


module.exports = { toUsTranslate, botAws };