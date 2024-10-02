import { View, Image, TouchableOpacity } from 'react-native'
import { router } from "expo-router";

import { icons } from '@/constants'

import React from 'react'

interface TopLeftExitButtonProps {
    containerStyles?: string,
    onExitClick?: () => void
}

const TopLeftExitButton: React.FC<TopLeftExitButtonProps> = ({ containerStyles, onExitClick }) => {
    return (
        <View className={`items-start ml-1 absolute left-1 bg-secondaryUtils p-2 rounded-full ${containerStyles}`}>
            <TouchableOpacity onPress={onExitClick ? onExitClick : () => router.back()}>
                <Image 
                    source={icons.exit} 
                    className='w-8 h-8 mb-0.5'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        </View>
    )
}

export default TopLeftExitButton