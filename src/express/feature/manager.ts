import { IFeature, INewFeature } from './interface';
import FeatureModel from './model';

const getFeatures = (query: Partial<IFeature>) => {
    return FeatureModel.find(query).exec();
};

const createFeature = (feature: INewFeature) => {
    return FeatureModel.create(feature);
};

export default {
    getFeatures,
    createFeature,
};
