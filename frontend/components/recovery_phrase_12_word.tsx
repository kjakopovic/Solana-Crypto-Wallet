import { View, Text } from 'react-native'
import React from 'react'

import CustomInput from './custom_input';

interface RecoveryPhrase12WordProps {
    recoveryPhrase: string[],
    setRecoveryPhrase: (x: string[]) => void
    readonly?: boolean
}

const RecoveryPhrase12Word: React.FC<RecoveryPhrase12WordProps> = ({ recoveryPhrase, setRecoveryPhrase, readonly=false }) => {
    return (
        <View className='flex-row flex-wrap w-[90%] items-center justify-between'>
            {Array.from({ length: 12 }).map((_, index) => (
                <View 
                    key={`container-${index}`}
                    className='w-[45%] mt-1.5 h-[50px] flex-row items-center justify-center'
                >
                    <View
                        key={`text-container-${index}`}
                        className='w-8 h-[50px] bg-secondaryUtils rounded-full items-center justify-center'
                    >
                        <Text 
                            key={`text-${index}`}
                            className='text-white font-lufgaMedium text-center'
                        >
                            {index + 1}
                        </Text>
                    </View>

                    <CustomInput
                        key={index}
                        value={recoveryPhrase[index]}
                        onChangeText={(x) => {
                            let newRecoveryPhraseCopy = [...recoveryPhrase];
                            newRecoveryPhraseCopy[index] = x;
                            setRecoveryPhrase(newRecoveryPhraseCopy);
                        }}
                        containerStyles='h-[50px] w-[90%]'
                        placeholder=''
                        readonly={readonly}
                    />
                </View>
            ))}
        </View>
    )
}

export default RecoveryPhrase12Word