import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';

interface RowSelectionProps {
    selectedOption: number;
    setSelectedOption: (index: number) => void;
    options: string[];
    containerStyles?: string;
}

const RowSelection: React.FC<RowSelectionProps> = ({ selectedOption, setSelectedOption, options, containerStyles }) => {
    return (
        <View className={`w-[90%] min-h-[20px] flex-row justify-between ${containerStyles}`}>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={`button-${index}`}
                    onPress={() => setSelectedOption(index)}
                    className='justify-center items-center h-[35px]'
                >
                    <Text
                        key={`text-${index}`}
                        className={`${selectedOption === index ? 'text-white' : 'text-secondaryHighlight'} font-lufgaMedium text-[18px]`}
                    >
                        {option}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

export default RowSelection