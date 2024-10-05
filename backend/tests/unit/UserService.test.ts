import UserService from '../../src/services/UserService';
jest.mock('../../src/services/UserService');

const mockUser = {
    publicKey: 'publicKey',
    password: 'hashedPassword',
    imageUrl: 'imageUrl',
};

const mockUserForPoints = {
    id: 'userId',
    username: 'username',
    imageUrl: 'imageUrl',
    password: 'hashedPassword',
    publicKey: 'publicKey',
    points: 10,
};

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await new Promise<void>(resolve => setTimeout(() => resolve(), 700));
    });

    describe('registerUser', () => {
        it('should create a user and return the user data', async () => {
            (UserService.registerUser as jest.Mock).mockResolvedValue(mockUser);

            const user = await UserService.registerUser(mockUser.imageUrl, mockUser.publicKey, mockUser.password);

            expect(UserService.registerUser).toHaveBeenCalledTimes(1);
            expect(UserService.registerUser).toHaveBeenCalledWith(mockUser.imageUrl, mockUser.publicKey, mockUser.password);
            expect(user).toEqual(mockUser);
        });

        it('should throw an error if the user with the same publicKey already exists', async () => {
            (UserService.registerUser as jest.Mock).mockRejectedValue(new Error('User already exists'));

            await expect(UserService.registerUser(mockUser.imageUrl, mockUser.publicKey, mockUser.password)).rejects.toThrow('User already exists');
        });

        it('should fail to register a user with invalid data', async () => {
            const invalidUser = {
                publicKey: '',  // Invalid publicKey
                password: 'password',
                imageUrl: 'imageUrl',
            };

            (UserService.registerUser as jest.Mock).mockRejectedValue(new Error('Missing required fields'));

            await expect(UserService.registerUser(invalidUser.imageUrl, invalidUser.publicKey, invalidUser.password)).rejects.toThrow('Missing required fields');
        });
    });

    describe('getUserInfo', () => {
        it('should return user data if the user exists', async () => {
            (UserService.getUserInfo as jest.Mock).mockResolvedValue(mockUser);

            const user = await UserService.getUserInfo(mockUser.publicKey);

            expect(UserService.getUserInfo).toHaveBeenCalledTimes(1);
            expect(UserService.getUserInfo).toHaveBeenCalledWith(mockUser.publicKey);
            expect(user).toEqual(mockUser);
        });

        it('should return null if the user does not exist', async () => {
            (UserService.getUserInfo as jest.Mock).mockResolvedValue(null);

            const user = await UserService.getUserInfo('unknownPublicKey');

            expect(UserService.getUserInfo).toHaveBeenCalledTimes(1);
            expect(UserService.getUserInfo).toHaveBeenCalledWith('unknownPublicKey');
            expect(user).toBeNull();
        });
    });

    describe('updateUser', () => {
        beforeEach(async () => {
            (UserService.registerUser as jest.Mock).mockResolvedValue(mockUser);
            await UserService.registerUser(mockUser.imageUrl, mockUser.publicKey, mockUser.password);
        });

        it('should update user data successfully', async () => {
            const updates = {
                imageUrl: 'newImageUrl',
                password: 'newHashedPassword',
            };

            (UserService.updateUser as jest.Mock).mockResolvedValue({ ...mockUser, ...updates });

            const updatedUser = await UserService.updateUser(mockUser.publicKey, updates);

            expect(UserService.updateUser).toHaveBeenCalledTimes(1);
            expect(UserService.updateUser).toHaveBeenCalledWith(mockUser.publicKey, updates);
            expect(updatedUser).toEqual({ ...mockUser, ...updates });
        });

        it('should throw an error if user does not exist for update', async () => {
            const updates = {
                imageUrl: 'newImageUrl',
                password: 'newHashedPassword',
            };

            (UserService.updateUser as jest.Mock).mockRejectedValue(new Error('User not found'));

            await expect(UserService.updateUser('unknownPublicKey', updates)).rejects.toThrow('User not found');
        });

        it('should handle partial updates', async () => {
            const updates = {
                imageUrl: 'newImageUrl',
            };

            (UserService.updateUser as jest.Mock).mockResolvedValue(undefined);

            await expect(UserService.updateUser(mockUser.publicKey, updates)).resolves.toBeUndefined();

            expect(UserService.updateUser).toHaveBeenCalledWith(mockUser.publicKey, updates);
        });
    });

    describe('findUserByField', () => {
        it('should return user data if the user exists', async () => {
            (UserService.findUserByField as jest.Mock).mockResolvedValue(mockUser);

            const user = await UserService.findUserByField('publicKey', mockUser.publicKey);

            expect(UserService.findUserByField).toHaveBeenCalledTimes(1);
            expect(UserService.findUserByField).toHaveBeenCalledWith('publicKey', mockUser.publicKey);
            expect(user).toEqual(mockUser);
        });

        it('should return user data if the user exists', async () => {
            (UserService.findUserByField as jest.Mock).mockResolvedValue(mockUser);

            const user = await UserService.findUserByField('imageUrl', mockUser.imageUrl);

            expect(UserService.findUserByField).toHaveBeenCalledTimes(1);
            expect(UserService.findUserByField).toHaveBeenCalledWith('imageUrl', mockUser.imageUrl);
            expect(user).toEqual(mockUser);
        });

        it('should return null if the user does not exist', async () => {
            (UserService.findUserByField as jest.Mock).mockResolvedValue(null);

            const user = await UserService.findUserByField('publicKey', 'unknownPublicKey');

            expect(UserService.findUserByField).toHaveBeenCalledTimes(1);
            expect(UserService.findUserByField).toHaveBeenCalledWith('publicKey', 'unknownPublicKey');
            expect(user).toBeNull();
        });
    });

    describe('updateUserPoints', () => {
        it('should update user points successfully', async () => {
            (UserService.findUserByField as jest.Mock).mockResolvedValue(mockUserForPoints);
            (UserService.updateUserPoints as jest.Mock).mockImplementation(async (userId, points) => {
                if (userId === mockUserForPoints.id) {
                    mockUserForPoints.points += points;
                }
            });

            await expect(UserService.updateUserPoints(mockUserForPoints.id, 5)).resolves.toBeUndefined();

            //expect(UserService.findUserByField).toHaveBeenCalledTimes(1);
            //expect(UserService.findUserByField).toHaveBeenCalledWith('id', mockUserForPoints.id);
            expect(UserService.updateUserPoints).toHaveBeenCalledTimes(1);
            expect(UserService.updateUserPoints).toHaveBeenCalledWith(mockUserForPoints.id, 5);

            // Check if the points have been correctly added
            expect(mockUserForPoints.points).toBe(15);
        });

        it('should throw an error if user does not exist', async () => {
            (UserService.findUserByField as jest.Mock).mockResolvedValue(null);
            (UserService.updateUserPoints as jest.Mock).mockImplementation(async (userId, points) => {
                const user = await UserService.findUserByField('id', userId);
                if (!user) {
                    throw new Error('User not found');
                }
            });

            await expect(UserService.updateUserPoints('unknownUserId', 5)).rejects.toThrow('User not found');

            expect(UserService.findUserByField).toHaveBeenCalledTimes(1);
            expect(UserService.findUserByField).toHaveBeenCalledWith('id', 'unknownUserId');
            expect(UserService.updateUserPoints).toHaveBeenCalledTimes(1);
        });
    });
});
