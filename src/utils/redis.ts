import { createClient } from 'redis';
import config from '../config';

const { uri: url } = config.redis;

export default createClient({ url });
