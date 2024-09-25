import { View } from 'react-native'
import React from 'react'

interface PasscodeOutputProps {
    numberOfDots: number;
    passcode: string;
}

const ActiveDot: React.FC = () => {
    return (
        <View className='w-7 h-7 bg-secondaryHighlight border-secondaryHighlight border-2 rounded-full' />
    )
}

const EmptyDot: React.FC = () => {
    return (
        <View className='w-7 h-7 bg-background border-secondaryHighlight border-2 rounded-full' />
    )
}

const PasscodeOutput: React.FC<PasscodeOutputProps> = ({ numberOfDots, passcode }) => {
    return (
        <View className='flex-row justify-between w-3/4'>
            {
                Array(numberOfDots).fill(0).map((_, index) => (
                    (passcode.length > index) ?
                        <ActiveDot key={`active-${index}`} /> :
                        <EmptyDot key={`empty-${index}`} />
                ))
            }
        </View>
    )
}

export default PasscodeOutput