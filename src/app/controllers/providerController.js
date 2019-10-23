import User from '../models/user';
import File from '../models/file';

class ProviderController {
    async index(req, res) {
        try {
            const providers = await User.findAll({
                where: { provider: true },
                attributes: [
                    'id',
                    'name',
                    'email',
                ],
                include: [{
                    model: File,
                    as: 'Avatar',
                    attributes: ['name', 'path', 'url'],
                }],
            });

            return res.json(providers);
        } catch (error) {
            return res.status(500).json({
                message: error.message || 'An error ocurred while returning the providers!',
            });
        }
    }
}

export default new ProviderController();
