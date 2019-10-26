import { Router } from 'express';
import Multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/sessionController';
import UserController from './app/controllers/userController';
import ProviderController from './app/controllers/providerController';
import AppointmentController from './app/controllers/appointmentController';
import ScheduleController from './app/controllers/scheduleController';
import NotificationController from './app/controllers/notificationController';
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

// Agendamentos
router.get('/appointments', authMiddleware, AppointmentController.index);
router.post('/appointments', authMiddleware, AppointmentController.store);
router.delete('/appointments/:id', authMiddleware, AppointmentController.delete);

// Agenda (Prestador de serviços)
router.get('/schedule', authMiddleware, ScheduleController.index);

// Notificações (Prestador de serviços)
router.get('/notifications', authMiddleware, NotificationController.index);
router.put('/notifications/:id', authMiddleware, NotificationController.update);

export default router;
