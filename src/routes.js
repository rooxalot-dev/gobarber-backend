import { Router } from 'express';
import Multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/sessionController';
import UserController from './app/controllers/userController';
import ProviderController from './app/controllers/providerController';
import fileController from './app/controllers/fileController';


import authMiddleware from './app/middlewares/authMiddleware';

const router = new Router();
const upload = new Multer(multerConfig);

// Logins/Sessões
router.post('/sessions', SessionController.store);

// Usuários
router.post('/users', authMiddleware, UserController.store);
router.put('/users', authMiddleware, UserController.update);

// Upload de arquivos
router.post('/files', authMiddleware, upload.single('file'), fileController.store);

// Provedores de serviços
router.get('/providers', authMiddleware, ProviderController.index);

export default router;
