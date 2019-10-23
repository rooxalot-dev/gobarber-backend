import User from '../models/user';

import * as Yup from 'yup';

class UserController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email(),
            password: Yup.string().min(6).required(),
        });

        if (!(await schema.isValid(req.body))) {
            res.status(400).json({
                message: 'Objeto inválido para a requisição',
            });
        }

        const { email } = req.body;

        if (email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                res.status(400).json({
                    message: 'Email alredy exists!',
                });
            }
        } else {
            res.status(400).json({
                message: 'Email must be informed!',
            });
        }

        const createdUser = await User.create(req.body);
        const { id, name, provider } = createdUser;

        res.json({
            id,
            name,
            email,
            provider,
        });
    }

    async update(req, res) {
        const schema = Yup.object({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                .when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
            confirmPassword: Yup.string()
                .when('password', (password, field) => (password ? field.oneOf([Yup.ref('password')]) : field)),
            avatar_id: Yup.number().integer(),
        });

        const validBody = schema.isValidSync(req.body);
        if (!validBody) {
            return res.status(400).json({
                message: 'Objeto inválido para a requisição',
            });
        }


        const { userId } = res.locals;
        const {
            name, email, oldPassword, password, avatar_id,
        } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(400).json({
                message: 'User was not found!',
            });
        }
        if (email && email !== user.email) {
            const existingUser = User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({
                    message: 'Email is alredy in use!',
                });
            }
        }
        if (password && !oldPassword) {
            return res.status(400).json({
                message: 'Old password was not provided!',
            });
        }
        if (!password && oldPassword) {
            return res.status(400).json({
                message: 'New password was not provided!',
            });
        }
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(400).json({
                message: 'Password does not match!',
            });
        }

        const [, [updatedUser]] = await User.update({
            name,
            email,
            password,
            avatar_id,
        },
        {
            where: { id: userId },
            returning: true,
            individualHooks: true,
        });

        return res.json({
            id: userId,
            name,
            email,
            provider: updatedUser.provider,
        });
    }
}

export default new UserController();
