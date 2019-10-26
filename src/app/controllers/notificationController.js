import User from '../models/user';
import Notification from '../schemas/notification';

class NotificationController {
    async index(req, res) {
        try {
            const { userId } = res.locals;
            const providerUser = await User.findOne({ where: { id: userId, provider: true } });

            if (!providerUser) {
                return res.status(401).json({
                    error: 'User does not have permission to see notifications!',
                });
            }

            const notifications = await Notification
                .find({ user: userId })
                .sort({ createdAt: -1 });

            return res.json(notifications);
        } catch (error) {
            return res.status(500).json({
                error: error.message || 'There was a error while listing the notifications!',
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });

            return res.json(notification);
        } catch (error) {
            return res.status(500).json({
                error: error.message || 'There was a error while updating the notification!',
            });
        }
    }
}


export default new NotificationController();
