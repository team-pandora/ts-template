import * as mongoose from 'mongoose';
import config from '../../config';
import { errorHandler } from '../../utils/mongoose';
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

FeatureSchema.index({ data: 1 });

FeatureSchema.post(/save|update|findOneAndUpdate|insertMany/, errorHandler);

const FeatureModel = mongoose.model<IFeature & mongoose.Document>(config.mongo.featureCollectionName, FeatureSchema);

export default FeatureModel;
