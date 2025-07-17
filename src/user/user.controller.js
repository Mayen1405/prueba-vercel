import User from './user.model.js';
import { hash, verify } from 'argon2';
import Account from '../account/account.model.js';

export const createUser = async (req, res) => {
    try {
        const data = req.body;

        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const existingUsername = await User.findOne({ username: data.username });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken'
            });
        }

        const existingDPI = await User.findOne({ dpi: data.dpi });
        if (existingDPI) {
            return res.status(400).json({
                success: false,
                message: 'DPI already registered'
            });
        }

        data.password = await hash(data.password);

        const newUser = new User(data);
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: err.message
        });
    }
}

export const getUsers = async (req, res) => {
    try {
        const { limit = 10, from = 0 } = req.query;

        const query = { status: true };

        const [users, total] = await Promise.all([
            User.find(query)
                .skip(Number(from))
                .limit(Number(limit))
                .select('-password -__v'),
            User.countDocuments(query)
        ]);

        return res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: err.message
        });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { uid } = req.params;

        const user = await User.findById(uid).select('-password -__v');
        if (!user || !user.status) {
            return res.status(404).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: err.message
        });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const { password, dpi, ...dataN } = req.body;

        let user = await User.findById(uid);
        if (!user || !user.status) {
            return res.status(404).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        if (dataN.username && dataN.username !== user.username) {
            const existingUsername = await User.findOne({ username: dataN.username });
            if (existingUsername) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already taken'
                });
            }
        }

        user = await User.findByIdAndUpdate(uid, dataN, { new: true }).select('-password -__v');
        
        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: err.message
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const userFound = await User.findById(uid);
        if (!userFound) {
            return res.status(404).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        const user = await User.findByIdAndUpdate(uid, { status: false }, { new: true }).select('-password -__v');

        return res.status(200).json({
            success: true,
            message: 'User deactivated successfully',
            user
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error deactivating user',
            error: err.message
        });
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { usuario } = req;
        const { currentPassword, newPassword } = req.body;

        const isPasswordValid = await verify(usuario.password, currentPassword);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        const isSamePassword = await verify(usuario.password, newPassword);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: 'New password cannot be the same as the current password'
            });
        }

        const encryptedPassword = await hash(newPassword);
        await User.findByIdAndUpdate(usuario._id, { password: encryptedPassword }, { new: true });

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error updating password',
            error: err.message
        });
    }
}

export const updateMe = async (req, res) => {
    try {
        const { usuario } = req;
        const { password, dpi, email, ...dataN } = req.body;

        const userFound = await User.findById(usuario._id);
        if (!userFound || !userFound.status) {
            return res.status(404).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        if (dataN.username && dataN.username !== userFound.username) {
            const existingUsername = await User.findOne({ username: dataN.username });
            if (existingUsername) {
                return res.status(400).json({
                    success: false,
                    message: 'Username already taken'
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(usuario._id, dataN, { new: true }).select('-password -__v');

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: updatedUser
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: err.message
        });
    }
};

export const getUserLogged = async (req, res) => {
    try {
        const { usuario } = req;

        const user = await User.findById(usuario._id).select('-password -__v');

        if (!user || !user.status) {
            return res.status(404).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Error fetching logged user:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching user data',
            error: error.message
        });
    }
};

export const addFavorite = async (req, res) => {
    try {
        const { accountNumber, alias } = req.body;
        const user = req.usuario;

        const accountExists = await Account.findOne({ numberAccount: accountNumber });
        if (!accountExists) {
            return res.status(404).json({ success: false, message: "La cuenta que intentas agregar no existe." });
        }

        if (accountExists.user.toString() === user._id.toString()) {
            return res.status(400).json({ success: false, message: "No puedes agregarte a ti mismo como favorito." });
        }

        const isAlreadyFavorite = user.favorites.some(fav => fav.account.toString() === accountExists._id.toString());
        if (isAlreadyFavorite) {
            return res.status(400).json({ success: false, message: "Esta cuenta ya está en tus favoritos." });
        }

        user.favorites.push({ account: accountExists._id, alias: alias || accountExists.typeAccount });
        await user.save();

        res.status(200).json({ success: true, message: "Cuenta agregada a favoritos con éxito." });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error al agregar favorito.", error: err.message });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.usuario._id)
            .populate({
                path: 'favorites.account',
                populate: {
                    path: 'user',
                    select: 'name username'
                }
            })
            .select('favorites');

        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const favoritesWithUid = user.favorites.map(fav => {
            return {
                alias: fav.alias,
                account: fav.account.toJSON(), 
                _id: fav._id 
            };
        });

        res.status(200).json({ success: true, favorites: favoritesWithUid });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error al obtener favoritos.", error: err.message });
    }
};

export const removeFavorite = async (req, res) => {
    try {
        const { accountId } = req.params;
        const user = req.usuario;

        const initialCount = user.favorites.length;
        
        user.favorites = user.favorites.filter(fav => fav.account.toString() !== accountId);

        if (user.favorites.length === initialCount) {
             return res.status(404).json({ success: false, message: "El favorito no fue encontrado en tu lista." });
        }

        await user.save();

        res.status(200).json({ success: true, message: "Favorito eliminado con éxito." });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error al eliminar favorito.", error: err.message });
    }
};
