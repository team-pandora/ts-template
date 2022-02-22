import { mocked } from 'ts-jest/utils';
import * as math from '../src/simpleModuleToMock';
import * as math3 from '../src/simpleModuleUsingMocked';

jest.mock('../src/simpleModuleToMock');
// ts-jest "mocked" function returns math module "as is", but with mocked type
// ('cuz jest.mock's "side effects" is overriding the original module with mocks)
const mockedMath = mocked(math, true);

describe('example unit tests', () => {
    test.todo('todo test'); // you can do todos for tests!

    test('use mockedAdd', async () => {
        const mockedAdd = mockedMath.add;
        mockedAdd.mockImplementation((a: number, b: number) => {
            return a + b + 1;
        });

        expect(mockedAdd).toBeCalledTimes(0);
        expect(math3.add3(0)).toBe(4); // should have been 3 if not mocked
        expect(mockedAdd).toBeCalledTimes(1);
    });

    test('use mockedAdd as original', async () => {
        mockedMath.add.mockReset();
        const mockedAdd = mockedMath.add.mockImplementation(jest.requireActual('../src/simpleModuleToMock').add);

        expect(mockedAdd).toBeCalledTimes(0);
        expect(math3.add3(0)).toBe(3);
        expect(mockedAdd).toBeCalledTimes(1);
    });
});
