import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

interface CustomButtonProps {
    title: string;
    handlePress?: () => void;
    containerStyles?: any;
    textStyles?: any;
    isLoading?: boolean;
    primary?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, handlePress, containerStyles, textStyles, isLoading, primary }) => {
  return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.7}
        className={`rounded-3xl 
            min-h-[62px] justify-center items-center 
            ${containerStyles}
            ${isLoading ? 'bg-secondary' : primary ? 'bg-primary' : 'bg-secondary'}`}
        disabled={isLoading}
    >
        <Text className={`text-white font-psemibold text-lg ${textStyles}`}>
            {title}
        </Text>
    </TouchableOpacity>
  )
}

export default CustomButton