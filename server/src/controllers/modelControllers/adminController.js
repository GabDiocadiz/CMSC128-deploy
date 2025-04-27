import { Admin } from '../../models/User.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';

export const adminController = {
    ...createCRUDController(Admin),
}