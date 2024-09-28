const listOfAvatars = [
    'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417574_1280.png',
    'https://cdn.pixabay.com/photo/2022/08/28/21/50/cartoon-7417572_1280.png',
    'https://cdn.pixabay.com/photo/2022/08/28/21/52/cartoon-7417586_1280.png',
    'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417580_1280.png',
    'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417578_1280.png',
    'https://cdn.pixabay.com/photo/2022/08/28/21/50/cartoon-7417571_1280.png',
    'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417581_1280.png',
    'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417577_1280.png',
    'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417579_1280.png'
]

export const getDefaultAvatars = () => {
    return listOfAvatars;
};

export const getRandomAvatar = () => {
    return listOfAvatars[Math.floor(Math.random() * listOfAvatars.length)];
};