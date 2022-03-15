import * as dotenv from 'dotenv';
import * as env from 'env-var';

if (env.get('LOAD_DOTENV').default('true').asBool()) {
    const dotenvPath = env.get('DOTENV_PATH').default('.env').asString();
    dotenv.config({ path: dotenvPath });
}
