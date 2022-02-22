import { mocked } from 'ts-jest/utils';
import FeatureManager from '../src/express/feature/manager';
import FolderModel from '../src/express/feature/model';

jest.mock('../src/express/feature/model');
// "mocked" function returns FolderModel "as is", but with mocked type ('cuz jest.mock's "side effects" is overriding the original module with mocks)
const mockedFolderModel = mocked(FolderModel, true);

describe('example unit tests', () => {
    beforeEach(() => {
        mockedFolderModel.mockReset();
        // be careful of jest.resetModules() - causes problem with stream-related packages
        // see: https://github.com/Keyang/node-csvtojson/issues/271
    });

    test.todo('todo test'); // you can do todos for tests!

    test('test #1', async () => {
        mockedFolderModel.create.mockImplementationOnce((folder: any) => Promise.resolve(folder));
        const folderWithoutId = {
            name: 'myyyFolderrrr',
        };
        const resPromise = FeatureManager.createFolder(folderWithoutId);
        await expect(resPromise).resolves.toBeDefined();
        const resFolder = await resPromise;
        expect(resFolder).toHaveProperty('folderId', expect.any(String));
        expect(resFolder).toEqual(expect.objectContaining(folderWithoutId));
    });
});
