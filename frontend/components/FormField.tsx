import { View } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler';

interface FormFieldProps {
    value: any;
    handleChangeText: (x: any) => void;
    placeholder?: string;
    otherStyles?: string;
    isTextVisible?: boolean;
    isReadOnly?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ value, placeholder, handleChangeText, otherStyles, isTextVisible, isReadOnly }) => {
    return (
        <View 
            className={`w-5/6 h-[200px] px-4 bg-background border-2 border-secondary 
            rounded-2xl focus:border-secondary-100 ${otherStyles}`}
        >
            <TextInput
                className='flex-1 text-secondaryHighlight font-psemibold mt-5'
                value={(isTextVisible ?? true) ? value : ''}
                placeholder={placeholder}
                placeholderTextColor={'#7B7B8B'}
                onChangeText={handleChangeText}
                textAlignVertical='top'
                multiline={true}
                editable={!(isReadOnly ?? false)}
            />
        </View>
    )
}

export default FormField