import { menash } from 'menashmq';
import config from '../../config';
import { IFeature, INewFeature } from './interface';
import FeatureModel from './model';

/**
 * Get filtered features.
 * @param {Partial<IFeature>} query - The query to filter the features.
 * @returns {Promise<IFeature[]>} - Promise object containing the filtered features.
 */
export const getFeatures = (query: Partial<IFeature>): Promise<IFeature[]> => {
    return FeatureModel.find(query).exec();
};

/**
 * Create a new feature.
 * @param {INewFeature} feature - The feature to create.
 * @returns {Promise<IFeature>} - Promise object containing the created feature.
 */
export const createFeature = (feature: INewFeature): Promise<IFeature> => {
    return FeatureModel.create(feature);
};

/**
 * Send a message to the rabbit queue.
 * @param {string} message - The message to send.
 */
export const sendRabbitMessage = (message: string): Promise<void> => {
    return menash.send(config.rabbit.featuresQueue.name, message);
};
