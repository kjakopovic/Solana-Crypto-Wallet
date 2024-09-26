import { View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler';

import { icons } from '@/constants'

interface FormFieldProps {
    value: any;
    handleChangeText: (x: any) => void;
    placeholder?: string;
    otherStyles?: string;
    isTextVisible?: boolean;
    isReadOnly?: boolean;
    textStyles?: string;
    digitsOnly?: boolean;
    hasPressableIcon?: boolean;
    handleIconPress?: () => void;
    icon?: any;
}

const FormField: React.FC<FormFieldProps> = ({ icon, handleIconPress, hasPressableIcon, value, placeholder, handleChangeText, otherStyles, isTextVisible, isReadOnly, textStyles, digitsOnly }) => {
    return (
        <View 
            className={`flex w-5/6 h-[200px] px-4 bg-background border-2 border-secondary 
            rounded-2xl focus:border-secondary-100 ${otherStyles}`}
        >
            <TextInput
                className={`text-secondaryHighlight font-psemibold mt-3 ${textStyles}`}
                value={(isTextVisible ?? true) ? value : ''}
                placeholder={placeholder}
                placeholderTextColor={'#7B7B8B'}
                onChangeText={handleChangeText}
                textAlignVertical='top'
                multiline={true}
                editable={!(isReadOnly ?? false)}
                keyboardType={digitsOnly ? 'numeric' : 'default'}
            />
            {hasPressableIcon ? 
                <View className='w-[100%] items-end justify-center h-[100%] absolute left-4'>
                    <TouchableOpacity
                        onPress={handleIconPress}
                        className='h-10 w-10 bg-secondaryUtils rounded-full justify-center items-center'
                    >
                        <Image 
                            source={icon} 
                            className='h-5 w-5' 
                            resizeMode='contain'
                            tintColor='#BBA880'
                        />
                    </TouchableOpacity>
                </View>
            : <></>}
        </View>
    )
}

export default FormField