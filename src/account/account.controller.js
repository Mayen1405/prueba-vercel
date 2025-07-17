import Account from './account.model.js';
import { generateAccountNumber } from '../helpers/generate-account-number.js';
import User from '../user/user.model.js';

export const getAccounts = async (req, res) => {
    try {
        const userId = req.usuario._id; 
        
        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }
        
        const accounts = await Account.find({ 
            user: userId, 
            status: true 
        }).populate('user', 'name email');
        
        res.status(200).json(accounts);
    } catch (error) {
        console.error('Error al obtener cuentas del usuario:', error);
        res.status(500).json({ message: 'Error al obtener las cuentas', error });
    }
}

export const getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ status: true }).populate('user', 'name email');
        res.status(200).json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener todas las cuentas', error });
    }
}
export const registerAccount = async (req, res) => {
    const data = req.body;
    try {
        const user = await User.findById(data.user);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado', userId: data.user });
        }

        const validTypes = ["AHORRO", "MONETARIO", "CREDITO"];
        if (!validTypes.includes(data.typeAccount)) {
            return res.status(400).json({ message: 'Tipo de cuenta no válido' });
        }

        if (typeof data.balance !== 'number' || isNaN(data.balance)) {
            return res.status(400).json({ message: 'El balance debe ser un número' });
        }

        console.log("Generando número de cuenta...");
        try {
            const numberAccount = await generateAccountNumber();
            console.log("Número de cuenta generado:", numberAccount);
            
            if (!numberAccount) {
                return res.status(500).json({ message: 'Error al generar número de cuenta: valor nulo' });
            }
            
            data.numberAccount = numberAccount;
        } catch (genError) {
            console.error("Error generando número de cuenta:", genError);
            data.numberAccount = `E${Date.now().toString().substring(0, 10)}`;
        }
        
        console.log("Datos a guardar:", data);

        const newAccount = new Account(data);
        await newAccount.save();

        if (!user.accounts) user.accounts = [];
        
        user.accounts.push(newAccount._id);
        await user.save();
        
        res.status(201).json(newAccount);
    } catch (error) {
        console.error("Error al registrar cuenta:", error);
        res.status(500).json({ 
            message: 'Error al registrar la cuenta',
            error: error.message || error 
        });
    }
}
export const deleteAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedAccount = await Account.findByIdAndUpdate(id, { status: false }, { new: true });
        if (!deletedAccount) {
            return res.status(404).json({ message: 'No se encontro la cuenta', error: id });
        }
        res.status(200).json(deletedAccount);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la cuenta', error });
    }
}