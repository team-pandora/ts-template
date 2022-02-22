import * as mongoose from 'mongoose';
import config from '../../config';
import { IFolder } from './interface';

const FolderSchema = new mongoose.Schema({
    folderId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
});

const FolderModel = mongoose.model<IFolder & mongoose.Document>(config.mongo.featureCollectionName, FolderSchema);

export default FolderModel;
