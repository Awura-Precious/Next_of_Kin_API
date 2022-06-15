import { Router } from 'express';
import test from './controllers/test.controller';

const router = Router();

router.route('/test').all(test);

export default router;
