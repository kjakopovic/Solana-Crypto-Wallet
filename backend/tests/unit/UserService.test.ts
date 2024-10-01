// tests/unit/UserService.test.ts

import UserService from '../../src/services/UserService';

jest.mock('../../src/services/UserService');

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    afterAll(async () => {
        await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
    });

    describe('registerUser', () => {
        it('should create a user and return the user data', async () => {
            const mockUser = {
                publicKey: 'publicKey',
                password: 'password',
                imageUrl: 'imageUrl',
            };

            (UserService.registerUser as jest.Mock).mockResolvedValue(mockUser);

            const user = await UserService.registerUser(mockUser.imageUrl, mockUser.publicKey, mockUser.password);

            expect(UserService.registerUser).toHaveBeenCalledTimes(1);
            expect(UserService.registerUser).toHaveBeenCalledWith(mockUser.imageUrl, mockUser.publicKey, mockUser.password);
            expect(user).toEqual(mockUser);
        });

        it('should throw an error if the user with the same publicKey already exists', async () => {
            const mockUser = {
                publicKey: 'publicKey',
                password: 'password',
                imageUrl: 'imageUrl',
            };

            (UserService.registerUser as jest.Mock).mockRejectedValue(new Error('User already exists'));

            await expect(UserService.registerUser(mockUser.imageUrl, mockUser.publicKey, mockUser.password)).rejects.toThrow();
        });

        it('should fail to register a user with invalid data', async () => {
            const mockUser = {
                publicKey: '',
                password: 'password',
                imageUrl: 'imageUrl',
            };

            await expect(UserService.registerUser(mockUser.imageUrl, mockUser.publicKey, mockUser.password)).rejects.toThrow();
        });
    });

    describe('getUserInfo', () => {
        it('should get user data', async () => {
            const mockUser = {
                publicKey: 'publicKey',
                password: 'password',
                imageUrl: 'imageUrl',
            };

            (UserService.getUserInfo as jest.Mock).mockResolvedValue(mockUser);

            const user = await UserService.getUserInfo(mockUser.publicKey);

            expect(UserService.getUserInfo).toHaveBeenCalledTimes(1);
            expect(UserService.getUserInfo).toHaveBeenCalledWith(mockUser.publicKey);
            expect(user).toEqual(mockUser);
        });

        it('should return null if the user does not exist', async () => {
            (UserService.getUserInfo as jest.Mock).mockResolvedValue(null);

            const user = await UserService.getUserInfo('NOTpublicKey');

            expect(UserService.getUserInfo).toHaveBeenCalledTimes(1);
            expect(UserService.getUserInfo).toHaveBeenCalledWith('NOTpublicKey');
            expect(user).toBeNull();

        });
    })

});
