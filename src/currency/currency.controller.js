import axios from 'axios';

export const convertCurrency = async (req, res) => {
    try {
        const { from, to, amount } = req.query;
        const apiKey = process.env.EXCHANGERATE_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ success: false, message: "La API Key para la conversión de divisas no está configurada en el servidor." });
        }

        const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`;

        const response = await axios.get(apiUrl);

        if (response.data.result === 'success') {
            res.status(200).json({
                success: true,
                from: from,
                to: to,
                originalAmount: parseFloat(amount),
                convertedAmount: response.data.conversion_result
            });
        } else {
            res.status(400).json({ success: false, message: "Error al convertir la moneda. Verifique los códigos de moneda.", error: response.data['error-type'] });
        }

    } catch (err) {
        console.error("Error en el controlador de conversión:", err.response ? err.response.data : err.message);
        res.status(500).json({ success: false, message: "Error interno del servidor al realizar la conversión." });
    }
};