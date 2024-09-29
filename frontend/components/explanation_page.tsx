import { View, Text, Image, ImageSourcePropType } from 'react-native'
import React from 'react'

interface ExplanationPageProps {
    title: string,
    explanation?: string,
    image?: ImageSourcePropType,
    containerStyles?: string,
    titleStyles?: string,
    explanationStyles?: string
}

const ExplanationPage: React.FC<ExplanationPageProps> = ({ title, explanation, image, containerStyles, titleStyles, explanationStyles }) => {
    return (
        <View className={`${containerStyles} items-center justify-between`}>
            <Image 
                source={image} 
                className='w-[152px] h-[152px]'
                tintColor={'#007AFF'}
                resizeMode='contain'
            />

            <Text className={`${titleStyles} font-lufgaBold text-white text-xl text-center`}>
                {title}
            </Text>

            <Text className={`${explanationStyles} font-lufgaMedium text-white text-[15px] text-center`}>
                {explanation}
            </Text>
        </View>
    )
}

export default ExplanationPage