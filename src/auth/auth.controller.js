import User from '../user/user.model.js';
import { generateJWT } from '../helpers/generate-jwt.js';
import { verify } from 'argon2';

export const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const user = await User.findOne({$or:[{email: email}, {username: username}]})
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or username'
            });
        }

        const isPasswordValid = await verify(user.password, password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or username or password'
            });
        }

        const token = await generateJWT(user._id);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                username: user.username,
                token: token
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: err.message
        });
    }
}