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

    useEffect(() => {
        const interval = setInterval(() => {
        if (timeBetween <= 0) {
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
            <Text className='font-lufgaRegular text-red-500 text-[12px]'>
                {`${days}d ${hours}h ${minutes}m ${seconds}s`}
            </Text>
        </View>
    )
}

export default Timer