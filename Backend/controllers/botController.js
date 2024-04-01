const { botAws } = require('../s3Upload/awsFn');
const { verify } = require('jsonwebtoken');

exports.sendMessage = async (req, res) => {
    try {
        const { mensaje, token } = req.body;
        const decodedToken = verify(token, process.env.JWT_KEY_SECRET_TOKEN);
        const id = decodedToken.id;

        const txtResult = await botAws(mensaje, id);
        if (!txtResult) {
            return res.status(500).json({ message: "Error al comunicarse con el chatbot" });
        }
        return res.status(200).json(txtResult);
    } catch (error) {
        console.error("Error al ver fotos:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};