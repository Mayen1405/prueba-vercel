import Account from '../account/account.model.js';

export const generateAccountNumber = async () => {
    try {
        const accounts = await Account.find().sort({ numberAccount: -1 }).limit(1);
        let accountNumber = '0000000001'; 

        if (accounts.length > 0) {
            const lastAccount = accounts[0];
            const lastAccountNumber = lastAccount.numberAccount || '0000000001';
            const nextAccountNumber = parseInt(lastAccountNumber, 10) + 1;
            accountNumber = nextAccountNumber.toString().padStart(10, '0');
        }

        const existingAccount = await Account.findOne({ numberAccount: accountNumber });
        if (existingAccount) {
            const timestamp = Date.now() % 10000000000;
            accountNumber = timestamp.toString().padStart(10, '0');
        }

        console.log("Número de cuenta generado:", accountNumber);
        return accountNumber;
    } catch (error) {
        console.error("Error generando número de cuenta:", error);
        const timestamp = Date.now() % 10000000000;
        return timestamp.toString().padStart(10, '0');
    }
};