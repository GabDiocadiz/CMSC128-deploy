import Communication from '../../models/Communication.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';
import {
    uploadFilesForModel,
    getFilesForModel,
    deleteFileFromModel,
    downloadFile
} from "../fileController/fileController.js";

export const communicationController = {
    ...createCRUDController(Communication),

    async uploadProfilePicture (req, res){
        req.params.modelName = "User";
        req.params.id = req.params.event_id;
        return uploadFilesForModel(req, res);
    },
        
    
    async getProfilePicture(req, res) {
        req.params.modelName = "User";
        req.params.id = req.params.event_id; 
        return getFilesForModel(req, res);
    },

    async deleteProfilePicture(req, res) {
        req.params.modelName = "User";
        req.params.id = req.params.event_id; 
        return deleteFileFromModel(req, res);
    }

}