import { TouchableOpacity, Text, View, Image } from 'react-native'
import React from 'react'

interface CustomButtonProps {
    title: string;
    handlePress?: () => void;
    containerStyles?: any;
    textStyles?: any;
    isLoading?: boolean;
    primary?: boolean;
    icon?: any;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, handlePress, containerStyles, textStyles, isLoading, primary, icon }) => {
    return (
        <TouchableOpacity 
            onPress={handlePress}
            activeOpacity={0.7}
            className={`rounded-full 
                min-h-[62px] justify-center items-center 
                ${containerStyles}
                ${isLoading ? 'bg-secondaryUtils' : primary ? 'bg-primary' : 'bg-secondaryUtils'}`}
            disabled={isLoading}
        >
            {icon ? (
                <View className='w-[90%] flex-row justify-start items-center'>
                    <View
                        className={`${primary ? 'bg-white/30' : 'bg-black/20'} rounded-full w-[50px] h-[50px] justify-center items-center`}
                    >
                        <Image
                            source={icon}
                            className='w-[20px] h-[20px]'
                            resizeMode='contain'
                        />
                    </View>
                    
                    <Text className={`${isLoading ? 'text-stone-400' : 'text-white'} ml-5 font-lufgaSemiBold text-lg ${textStyles}`}>
                        {title}
                    </Text>
                </View>
            ) : (
                <Text className={`${isLoading ? 'text-stone-400' : 'text-white'} font-lufgaSemiBold text-lg ${textStyles}`}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    )
}

export default CustomButton