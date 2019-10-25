import Appointment from '../models/appointment';
import User from '../models/user';
import File from '../models/file';

import { startOfHour, parseISO, isBefore } from 'date-fns';
import * as Yup from 'yup';

class AppointmentController {
    async index(req, res) {
        try {
            const { page = 1, limit = 1 } = req.query;

            const appointments = await Appointment.findAndCountAll({
                offset: ((page - 1) * limit),
                limit,
                where: { user_id: res.locals.userId, canceled_at: null },
                attributes: ['id', 'date'],
                order: ['date'],
                include: [
                    {
                        model: User,
                        as: 'Provider',
                        attributes: ['id', 'name'],
                        include: [{ model: File, as: 'Avatar', attributes: ['path', 'url'] }],
                    },
                ],
            });

            const pages = Math.ceil(appointments.count / limit);
            const pagination = { pages, ...appointments };
            return res.status(200).json(pagination);
        } catch (error) {
            return res.status(500).json({
                message: error.message || 'Unable to fetch the appointments!',
            });
        }
    }

    async store(req, res) {
        try {
            const schema = Yup.object({
                provider_id: Yup.number().required(),
                date: Yup.date().required(),
            });

            const validBody = await schema.isValid(req.body);
            if (!validBody) {
                return res.status(400).json({
                    message: 'Objeto inválido para a requisição',
                });
            }

            const { provider_id, date } = req.body;

            const providerUser = await User.findOne({ where: { id: provider_id, provider: true } });
            if (!providerUser) {
                res.status(401).json({
                    message: 'You can only create appointments with providers',
                });
            }

            const hourStart = startOfHour(parseISO(date));
            if (isBefore(hourStart, new Date())) {
                res.status(400).json({
                    message: 'Past dates are not permited',
                });
            }

            const dateAvailability = await Appointment.findOne({
                where: {
                    provider_id,
                    canceled_at: null,
                    date: hourStart,
                },
            });
            if (dateAvailability) {
                res.status(400).json({
                    message: 'There\'s no appointments on the specified date',
                });
            }

            const appointment = await Appointment.create({
                user_id: res.locals.userId,
                provider_id,
                hourStart,
            });

            return res.json(appointment);
        } catch (error) {
            return res.status(500).json({
                message: error.message || 'An error ocurred while creating the appointment!',
            });
        }
    }
}

export default new AppointmentController();
