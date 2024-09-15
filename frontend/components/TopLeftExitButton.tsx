import { View, Image, TouchableOpacity } from 'react-native'
import { router } from "expo-router";

import { icons } from '@/constants'

import React from 'react'

interface TopLeftExitButtonProps {
    containerStyles?: string,
}

const TopLeftExitButton: React.FC<TopLeftExitButtonProps> = ({ containerStyles }) => {
    return (
        <View className={`items-start ml-5 ${containerStyles}`}>
            <TouchableOpacity onPress={() => router.back()}>
                <Image 
                    source={icons.exit} 
                    className='w-7 h-7'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        </View>
    )
}

export default TopLeftExitButton