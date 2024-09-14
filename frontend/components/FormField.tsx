import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler';

import { icons } from '@/constants';

interface FormFieldProps {
    title?: string;
    value: any;
    handleChangeText: (x: any) => void;
    placeholder?: string;
    otherStyles?: string;
    keyboardType?: string;
}

const FormField: React.FC<FormFieldProps> = ({ title, value, placeholder, handleChangeText, otherStyles, keyboardType }) => {
    const [secureInput, setSecureInput] = useState(true)

    return (
        <View className={`space-y-2 ${otherStyles}`}>
        <Text className='text-base text-gray-100 font-pmedium'>{title}</Text>

            <View 
                className='w-full h-16 px-4 bg-black-100 border-2 border-black-200 
                rounded-2xl focus:border-secondary-100'
            >
                <TextInput
                    className='flex-1 text-white font-psemibold text-base'
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor={'#7B7B8B'}
                    onChangeText={handleChangeText}
                    secureTextEntry={title === 'Password' && secureInput}
                />

                {title === 'Password' && (
                    <TouchableOpacity
                        onPress={() => setSecureInput(!secureInput)}
                        className='absolute right-4 top-4'
                    >
                        <Image 
                            source={secureInput ? icons.eyeHide : icons.eye}
                            resizeMode='contain'
                            className='w-6 h-6'
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default FormField