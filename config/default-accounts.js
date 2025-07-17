import User from '../src/user/user.model.js';
import Account from '../src/account/account.model.js';
import { generateAccountNumber } from '../src/helpers/generate-account-number.js';

export const createDefaultAccounts = async () => {
    try {
        const adminUser = await User.findOne({ username: 'ADMINB' });

        if (adminUser && adminUser.accounts.length === 0) {
            const adminAccountNumber = await generateAccountNumber();

            const newAdminAccount = new Account({
                user: adminUser._id,
                numberAccount: adminAccountNumber,
                typeAccount: 'MONETARIO',
                balance: 1000000, 
            });

            await newAdminAccount.save();

            adminUser.accounts.push(newAdminAccount._id);
            await adminUser.save();
            console.log(`Default account created for user: ${adminUser.username}`);
        } else if (adminUser) {
            console.log(`User ${adminUser.username} already has an account.`);
        }


        const regularUser = await User.findOne({ username: 'USUARIO1' });

        if (regularUser && regularUser.accounts.length === 0) {
            const userAccountNumber = await generateAccountNumber();

            const newUserAccount = new Account({
                user: regularUser._id,
                numberAccount: userAccountNumber,
                typeAccount: 'AHORRO',
                balance: 10000, 
            });

            await newUserAccount.save();

            regularUser.accounts.push(newUserAccount._id);
            await regularUser.save();
            console.log(`Default account created for user: ${regularUser.username}`);
        } else if (regularUser) {
            console.log(`User ${regularUser.username} already has an account.`);
        }

    } catch (err) {
        console.error("Error creating default accounts:", err);
    }
};