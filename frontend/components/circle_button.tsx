import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

interface CircleButtonProps {
    handleClick: () => void
    icon: any
    title?: string
    additionalStyles?: string
    additionalImageStyles?: string
    containerStyles?: string
}

const CircleButton: React.FC<CircleButtonProps> = ({ handleClick, icon, title, additionalStyles, additionalImageStyles, containerStyles }) => {
    return (
        <View className={`w-[55px] items-center justify-center ${containerStyles}`}>
            <TouchableOpacity 
                onPress={handleClick}
                activeOpacity={0.3}
                className={`w-[50px] h-[50px] rounded-full justify-center items-center bg-[#dedede]/30 ${additionalStyles}`}
            >
                <Image 
                    source={icon}
                    className={`w-5 h-5 ${additionalImageStyles}`}
                    tintColor='#ffffff'
                    resizeMode="contain"
                />
            </TouchableOpacity>
            
            {title && 
                <Text className='text-white items-center text-center font-lufgaRegular mt-1 text-[12px]'>
                    {title}
                </Text>
            }
        </View>
    )
}

export default CircleButton