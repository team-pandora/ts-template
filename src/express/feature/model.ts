import * as mongoose from 'mongoose';
import config from '../../config';
import { mongoDuplicateKeyError } from './errors';
import { IFeature } from './interface';

const FeatureSchema = new mongoose.Schema(
    {
        data: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

function errorHandler(error: any, _res: any, next: any) {
    if (error.code === 11000) {
        next(mongoDuplicateKeyError(error));
    } else {
        next();
    }
}

FeatureSchema.post(/save|update|findOneAndUpdate|insertMany/, errorHandler);

const FeatureModel = mongoose.model<IFeature & mongoose.Document>(config.mongo.featureCollectionName, FeatureSchema);

export default FeatureModel;
