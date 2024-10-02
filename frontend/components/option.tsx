import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'

interface OptionProps {
    containerStyles?: string,
    iconStyles?: string,
    iconContainerStyles?: string,
    textContainerStyles?: string,
    textStyles?: string,
    icon: any,
    text: string
    onClick?: () => void
}

const Option: React.FC<OptionProps> = ({ onClick, text, icon, textStyles, textContainerStyles, iconStyles, containerStyles, iconContainerStyles }) => {
    return (
        <TouchableOpacity
            className={`justify-center items-center flex-row w-[85%] mt-2 h-[60px] ${containerStyles}`}
            onPress={onClick}
        >
            <View
                className={`w-[60px] h-full bg-secondaryUtils items-center justify-center rounded-full ${iconContainerStyles}`}
            >
                <Image
                    source={icon}
                    className={`w-[25px] h-[25px] ${iconStyles}`}
                    tintColor={'#fff'}
                    resizeMode='contain'
                />
            </View>

            <View
                className={`h-full w-[80%] ml-1 items-start justify-center bg-secondaryUtils rounded-full ${textContainerStyles}`}
            >
                <Text className={`font-lufgaMedium ml-10 text-white text-[16px] ${textStyles}`}>
                    {text}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default Option