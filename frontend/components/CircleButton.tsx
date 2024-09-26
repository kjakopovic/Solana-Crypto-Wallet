import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

interface CircleButtonProps {
    handleClick: () => void
    icon: any
    title?: string
    additionalStyles?: string
    additionalImageStyles?: string
}

const CircleButton: React.FC<CircleButtonProps> = ({ handleClick, icon, title, additionalStyles, additionalImageStyles }) => {
    return (
        <View className='w-[55px] items-center justify-center'>
            <TouchableOpacity 
                onPress={handleClick}
                activeOpacity={0.3}
                className={`w-[50px] h-[50px] bg-secondaryUtils rounded-full justify-center items-center ${additionalStyles}`}
            >
                <Image 
                    source={icon}
                    className={`w-7 h-7 ${additionalImageStyles}`}
                    tintColor='#BBA880'
                    resizeMode="contain"
                />
            </TouchableOpacity>
            
            {title && 
                <Text className='text-secondaryHighlight items-center text-center font-pregular mt-1'>
                    {title}
                </Text>
            }
        </View>
    )
}

export default CircleButton