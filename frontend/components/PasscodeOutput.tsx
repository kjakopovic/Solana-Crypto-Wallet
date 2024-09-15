import { View } from 'react-native'
import React from 'react'

interface PasscodeOutputProps {
    numberOfDots: number;
    passcode: string;
}

const ActiveDot = () => {
    return (
        <View className='w-8 h-8 bg-secondaryHighlight border-secondaryHighlight border-2 rounded-full' />
    )
}

const EmptyDot = () => {
    return (
        <View className='w-8 h-8 bg-background border-secondaryHighlight border-2 rounded-full' />
    )
}

const PasscodeOutput: React.FC<PasscodeOutputProps> = ({ numberOfDots, passcode }) => {
    return (
        <View className='flex-row justify-between w-3/4'>
            {
                Array(numberOfDots).fill(0).map((_, index) => {
                    return (
                        <>
                            {(index < passcode.length) ? (
                                <ActiveDot key={index} />
                            ) : (
                                <EmptyDot key={index} />
                            )}
                        </>
                    )
                })
            }
        </View>
    )
}

export default PasscodeOutput