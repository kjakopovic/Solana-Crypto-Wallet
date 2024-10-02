import { View, Text } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'

interface TimerProps {
    onTimerFinished: () => void;
    startDate: Date;
}

const Timer: React.FC<TimerProps> = ({ startDate, onTimerFinished }) => {
    const targetTime = new Date(startDate).getTime();
    const [currentTime, setCurrentTime] = useState(Date.now());
    const timeBetween = useMemo(() => targetTime - currentTime, [
        currentTime,
        targetTime
    ]);

    const days = Math.floor(timeBetween / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (timeBetween % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeBetween % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeBetween % (1000 * 60)) / 1000);

    const totalHours = days * 24 + hours;

    useEffect(() => {
        const interval = setInterval(() => {
        if (timeBetween <= 1) {
            clearInterval(interval);
            onTimerFinished();
        } else {
            setCurrentTime(Date.now());
        }
        }, 1000);
        return () => clearInterval(interval);
    }, [timeBetween, onTimerFinished]);

    return (
        <View>
            {totalHours >= 0 ? (
                <Text className='font-lufgaRegular text-red-500 text-[12px]'>
                    {`${totalHours}h ${minutes}m ${seconds}s`}
                </Text>
            ) : (
                <Text className='font-lufgaRegular text-red-500 text-[12px]'>
                    {`0h 0m 0s`}
                </Text>
            )}
        </View>
    )
}

export default Timer