import { Router } from 'express';
import { logInController, loginStatusController, logOutController, registerController } from '../controller/controller';
import passport from 'passport'

const allRoutes = Router();

allRoutes.post('/login', passport.authenticate('local'), logInController);
allRoutes.get('/logout', logOutController);
allRoutes.post('/register', registerController);
allRoutes.get('/loginstatus', loginStatusController);

export default allRoutes
