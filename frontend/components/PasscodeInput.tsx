import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

import { icons } from '@/constants';

interface PasscodeInputProps {
    handleInput: (number: string) => void;
    handleDelete: () => void;
}

const PasscodeInput: React.FC<PasscodeInputProps> = ({ handleInput, handleDelete }) => {
    return (
        <View className='flex-row flex-wrap w-5/6 justify-center'>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0'].map((num, index) => (
                (num !== '') ? (
                    <TouchableOpacity
                        className='w-[75px] h-[75px] m-1 mx-2 rounded-full bg-secondaryUtils justify-center items-center'
                        onPress={() => handleInput(num)}
                        key={`button-${index}`}
                    >
                        <Text className='text-secondaryHighlight text-xl'>{num}</Text>
                    </TouchableOpacity>
                ) : (
                    <View className='w-[75px] h-[75px] m-1 mx-2' key={`view-${index}`} />
                )
            ))}

            <TouchableOpacity 
                className='w-[75px] h-[75px] m-1 mx-2 rounded-full justify-center items-center'
                onPress={handleDelete}
            >
                <Image 
                    source={icons.clearText}
                    className="w-[25px] h-[25px]"
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </View>
    )
}

export default PasscodeInput