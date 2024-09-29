import { View, TextInput } from 'react-native'
import React from 'react'

interface CustomInputProps {
    value: any;
    placeholder: string;
    onChangeText: (text: any) => void;
    digitsOnly?: boolean;
    containerStyles?: string;
    textStyles?: string;
    readonly?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ value, placeholder, onChangeText, containerStyles, digitsOnly=false, textStyles, readonly=false }) => {
    return (
        <View className={`w-[100%] h-[70px] bg-secondaryUtils rounded-[30px] justify-center items-center ${containerStyles}`}>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor='rgba(255, 255, 255, 0.5)'
                className={`text-white font-lufgaMedium text-[17px] w-[90%] h-[100%] px-5 ${textStyles}`}
                value={value}
                onChangeText={onChangeText}
                keyboardType={digitsOnly ? 'numeric' : 'default'}
                readOnly={readonly}
            />
        </View>
    )
}

export default CustomInput