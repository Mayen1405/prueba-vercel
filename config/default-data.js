import { hash } from "argon2";
import User from "../src/user/user.model.js";

const defaultData = async () => {
    try {
        const admin = await User.findOne({ role: "ADMIN_ROLE" });

        if(!admin) {
            const email = "admin@gmail.com";
            const password = "ADMINB";
            const username = "ADMINB";

            const hashedPassword = await hash(password)

            const newAdmin = new User({
                username,
                password: hashedPassword,
                role: "ADMIN_ROLE",
                name: "Admin",
                dpi: "1234567890123",
                address: "123 Admin St",
                phone: "1234567890",
                email,
                workName: "Admin Work",
                monthlyIncome: 0 
            });

            await newAdmin.save();

            console.log("Default admin user created successfully.");
        } else {
            console.log("Admin user already exists.");
        }
        
        const regularUser = await User.findOne({ 
            role: "USER_ROLE",
            username: "USUARIO1" 
        });

        if(!regularUser) {
            const email = "usuario@gmail.com";
            const password = "USUARIO1";
            const username = "USUARIO1";

            const hashedPassword = await hash(password)

            const newUser = new User({
                username,
                password: hashedPassword,
                role: "USER_ROLE",
                name: "Usuario Normal",
                dpi: "9876543210123",
                address: "456 User St",
                phone: "9876543210",
                email,
                workName: "Empresa XYZ",
                monthlyIncome: 5000 
            });

            await newUser.save();

            console.log("Default regular user created successfully.");
        } else {
            console.log("Regular user already exists.");
        }
    } catch (err) {
        return console.error("Error creating default users:", err);
    }
}

export default defaultData;