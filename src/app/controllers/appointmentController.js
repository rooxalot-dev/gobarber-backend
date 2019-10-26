import Appointment from '../models/appointment';
import User from '../models/user';
import File from '../models/file';
import Notification from '../schemas/notification';

import Mail from '../../lib/mail';

import {
    startOfHour, parseISO, isBefore, format, subHours,
} from 'date-fns';
import pt from 'date-fns/locale/pt';

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

            const { userId } = res.locals;
            const { provider_id, date } = req.body;

            const providerUser = await User.findOne({ where: { id: provider_id, provider: true } });
            if (!providerUser) {
                res.status(401).json({
                    message: 'You can only create appointments with providers',
                });
            }

            if (userId === provider_id) {
                res.status(401).json({
                    message: 'You can\'t create appointments with yourself!',
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
                user_id: userId,
                provider_id,
                date: hourStart,
            });

            const user = await User.findOne({ where: { id: userId, provider: false } });
            const formattedAppointmentDate = format(hourStart, "'dia' dd 'de' MMMM, 'ás' HH:mm'h'", { locale: pt });
            const notificationMessage = `Olá, o usuário ${user.name} fez um agendamento ${formattedAppointmentDate}`;

            await Notification.create({
                content: notificationMessage,
                user: provider_id,
            });

            return res.json(appointment);
        } catch (error) {
            return res.status(500).json({
                message: error.message || 'An error ocurred while creating the appointment!',
            });
        }
    }

    async delete(req, res) {
        const { id } = req.params;
        const { userId } = res.locals;

        try {
            const appointment = await Appointment.findByPk(id, {
                include: [
                    {
                        model: User,
                        as: 'Provider',
                        attributes: ['name', 'email'],
                    },
                    {
                        model: User,
                        as: 'User',
                        attributes: ['name', 'email'],
                    },
                ],
            });
            const { Provider: provider, User: user } = appointment;

            if (!appointment) {
                return res.status(400).json({ message: 'Appointment not found!' });
            }

            if (appointment.user_id !== userId) {
                return res.status(401).json({ message: 'You don\'t have permission to cancel this appointment!' });
            }

            const subDate = subHours(Appointment.date, 2);
            if (new Date() > subDate) {
                return res.status(400).json({ message: 'You can only cancel appointments up to two hours in advance!' });
            }

            appointment.canceled_at = new Date();
            appointment.save();

            const formattedAppointmentDate = format(appointment.date, "'dia' dd 'de' MMMM, 'ás' HH:mm'h'", { locale: pt });
            await Mail.sendMail({
                to: `${provider.name} <${provider.email}>`,
                subject: 'Agendamento Cancelado =(',
                template: 'cancellation',
                context: {
                    provider: provider.name,
                    user: user.name,
                    date: formattedAppointmentDate,
                },
            });

            return res.json(appointment);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default new AppointmentController();
