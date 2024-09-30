import { View, Text } from 'react-native'
import React, { useEffect } from 'react'

interface PasscodeOutputProps {
    numberOfDots: number;
    passcode: string[];
}

const PasscodeOutput: React.FC<PasscodeOutputProps> = ({ numberOfDots, passcode }) => {
    return (
        <View className='flex-row justify-between w-[90%]'>
            {
                Array(numberOfDots).fill(0).map((_, index) => (
                    <View key={`dot-${index}`} className='w-[45px] h-[60px] bg-secondaryUtils rounded-2xl justify-center items-center'>
                        <Text
                            className='text-white font-lufgaMedium text-2xl'
                        >
                            {passcode[index] ? passcode[index] : ''}
                        </Text>
                    </View>
                ))
            }
        </View>
    )
}

export default PasscodeOutput