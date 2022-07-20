import * as mongoose from 'mongoose';
import config from '../../config';
import { setDefaultSettings, setErrorHandler } from '../../utils/mongoose';
import { IFeature } from './interface';

const FeatureSchema = new mongoose.Schema<IFeature & mongoose.Document>(
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

setDefaultSettings(FeatureSchema);

setErrorHandler(FeatureSchema);

const FeatureModel = mongoose.model<IFeature & mongoose.Document>(config.mongo.featuresCollectionName, FeatureSchema);

export default FeatureModel;
