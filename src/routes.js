import { Router } from 'express';

import UserController from './app/controllers/userController';
import SessionController from './app/controllers/sessionController';

const router = new Router();

// Usuários
router.post('/users', UserController.store);

// Logins/Sessões
router.post('/sessions', SessionController.store);

export default router;
