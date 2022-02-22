import { v4 as uuid } from 'uuid';
import { IFolder } from './interface';
import FolderModel from './model';

const getFolders = (query: Partial<IFolder>) => {
    return FolderModel.find(query).exec();
};

const createFolder = (folder: Omit<IFolder, 'folderId'>) => {
    const newFolder = { ...folder, folderId: uuid() };
    return FolderModel.create(newFolder);
};

export default {
    getFolders,
    createFolder,
};
