import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/mail';

class CancellationMail {
    get key() {
        return 'CancellationMail';
    }

    async handle({ data }) {
        const { appointment } = data;
        const { Provider: provider, User: user } = appointment;
        const formattedAppointmentDate = format(parseISO(appointment.date), "'dia' dd 'de' MMMM, 'ás' HH:mm'h'", { locale: pt });

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
    }
}

export default new CancellationMail();
