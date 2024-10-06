USE walletDB;

-- populate users table
INSERT INTO users (id, username, imageUrl, password, publicKey, joinedAt, refreshToken, points)
VALUES
    ('user1-id', 'JohnDoe', 'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417574_1280.png', 'password123', 'publicKey1', GETDATE(), NULL, 100),
    ('user2-id', 'JaneSmith', 'https://cdn.pixabay.com/photo/2022/08/28/21/50/cartoon-7417572_1280.png', 'password456', 'publicKey2', GETDATE(), NULL, 200),
    ('user3-id', 'MikeBrown', 'https://cdn.pixabay.com/photo/2022/08/28/21/52/cartoon-7417586_1280.png', 'password789', 'publicKey3', GETDATE(), NULL, 150),
    ('user4-id', 'LucyGreen', 'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417578_1280.png', 'password000', 'publicKey4', GETDATE(), NULL, 175);


-- populate supportQuestions table
INSERT INTO supportQuestions (timestamp, userId, title, description, answered, answer)
VALUES
    (GETDATE(), 'user1-id', 'How to send crypto?',
    'I am trying to send crypto to my friend but I cant seem to find the option to do so.',
    1, 'To send crypto, you need to go to the Send Crypto page and fill in the required fields.'),

    (GETDATE(), 'user2-id', 'How should I proceed with the verification process?',
    'I have uploaded my documents but I am not sure what to do next.',
    1, 'You need to wait for the verification process to be completed. You will receive an email once the process is done.'),

    (GETDATE(), 'user3-id', 'What if I forget my password?',
    'I have forgotten my password and I cant seem to find the option to reset it.',
    1, 'You can reset your password by clicking on the Forgot Password link on the login page.'),

    (GETDATE(), 'user4-id', 'Where can I check my transaction history?',
    'I want to check my past transactions, but I dont see the option to view transaction history.',
    1, 'You can view your transaction history in the account section under "Transaction History".');
