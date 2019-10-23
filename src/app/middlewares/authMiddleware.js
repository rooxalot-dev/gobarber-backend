// eslint-disable-next-line no-unused-vars
import { verify } from 'jsonwebtoken';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const bearerRegEx = /bearer\s*/i;

    try {
        if (authHeader && bearerRegEx.test(authHeader)) {
            const token = authHeader.replace(bearerRegEx, '');
            const tokenPayload = await verify(token, authConfig.secret);
            const userId = tokenPayload.id;

            res.locals.userId = userId;
            next();
        } else {
            return res.status(401).json({
                message: 'Unauthorized access!',
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Ocorreu um erro ao verificar a autenticação!',
        });
    }
};
