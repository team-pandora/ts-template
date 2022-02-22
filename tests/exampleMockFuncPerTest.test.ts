import * as math from '../src/simpleModuleToMock';
import * as math3 from '../src/simpleModuleUsingMocked';

describe('Mock specific functions per test', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    test.todo('todo test'); // you can do todos for tests!

    test('> use only math.add as mocked <', async () => {
        const mockedAdd = jest.spyOn(math, 'add');
        mockedAdd.mockImplementation((a: number, b: number) => {
            return a + b + 1;
        });

        expect(mockedAdd).toBeCalledTimes(0);
        expect(math3.add3(0)).toBe(4); // mocked
        expect(mockedAdd).toBeCalledTimes(1);

        expect(math3.multiply3(2)).toBe(6); // other funcs are not mocked
    });

    test('> use math as original <', async () => {
        expect(math3.add3(0)).toBe(3); // not mocked
    });

    test('> use math as original with spy <', async () => {
        const mockedAdd = jest.spyOn(math, 'add');

        expect(mockedAdd).toBeCalledTimes(0);
        expect(math3.add3(0)).toBe(3); // not mocked
        expect(mockedAdd).toBeCalledTimes(1);
    });
});
