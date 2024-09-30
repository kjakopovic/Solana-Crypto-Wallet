import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

import { icons } from '@/constants';

interface PasscodeInputProps {
    handleInput: (number: string) => void;
    handleDelete: () => void;
}

const PasscodeInput: React.FC<PasscodeInputProps> = ({ handleInput, handleDelete }) => {
    return (
        <View className='flex-row flex-wrap h-[250px] w-[90%] items-center justify-center bg-secondaryUtils rounded-3xl'>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0'].map((num, index) => (
                (num !== '') ? (
                    <TouchableOpacity
                        className='w-[75px] h-[25%] mx-4 justify-center items-center'
                        onPress={() => handleInput(num)}
                        key={`button-${index}`}
                    >
                        <Text className='text-white font-lufgaMedium text-2xl'>{num}</Text>
                    </TouchableOpacity>
                ) : (
                    <View className='w-[75px] h-[25%] mx-4' key={`view-${index}`} />
                )
            ))}

            <TouchableOpacity 
                className='w-[75px] h-[25%] mx-4 rounded-full justify-center items-center'
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