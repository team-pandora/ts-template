import { Request } from 'express';

class FeatureValidator {
    static async somethingThatIsImpossibleToValidateWithSchema(_req: Request) {
        // Some validations
    }
}

export default FeatureValidator;
