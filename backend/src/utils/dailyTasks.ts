// src/utils/dailyTasks.ts

import logger from '../config/Logger';

const className = 'DailyTasks';

const onNewDay = () => {
    logger.info('New day has started', { className });
};

export const checkForNewDay = () => {
    let lastDay = new Date().toDateString();

    setInterval(() => {
        const currentDate = new Date().toDateString();
        if(currentDate !== lastDay){
            lastDay = currentDate;
            onNewDay();
        }
    }, 3600000); // Check every hour (3600000 ms)
};
