import * as mongoose from 'mongoose';

export interface IFeature {
    _id: mongoose.Types.ObjectId;
    data: string;
    createdAt: Date;
    updatedAt: Date;
}

export type INewFeature = Pick<IFeature, 'data'>;
