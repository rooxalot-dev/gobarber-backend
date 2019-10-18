import User from '../models/user';

class UserController {
    async store(req, res) {
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
}

export default new UserController();
