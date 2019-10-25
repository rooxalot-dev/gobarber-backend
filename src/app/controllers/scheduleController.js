import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/appointment';
import User from '../models/user';
import File from '../models/file';

class ScheduleController {
    async index(req, res) {
        try {
            const { date = new Date().toISOString() } = req.query;
            const { userId } = res.locals;

            const providerUser = await User.findOne({ where: { id: userId, provider: true } });
            if (!providerUser) {
                res.status(401).json({
                    message: 'Only providers can check the schedule!',
                });
            }

            const parsedDate = parseISO(date);
            const appointments = await Appointment.findAll({
                where: {
                    provider_id: userId,
                    canceled_at: null,
                    date: {
                        [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
                    },
                },
                attributes: ['id', 'date'],
                order: ['date'],
                include: [
                    {
                        model: User,
                        as: 'User',
                        attributes: ['id', 'name'],
                        include: [{ model: File, as: 'Avatar', attributes: ['path', 'url'] }],
                    },
                ],
            });

            return res.status(200).json(appointments);
        } catch (error) {
            return res.status(500).json({
                message: error.message || 'Unable to fetch the user\'s schedule!',
            });
        }
    }
}

export default new ScheduleController();
