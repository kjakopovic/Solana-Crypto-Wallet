import { View, Text, Image } from 'react-native'
import React from 'react'

interface CardItemProps {
    iconUri: string;
    topLeftText?: string;
    bottomLeftText?: string;
    topRightText?: string;
    bottomRightText?: string;
}

const CardItem: React.FC<CardItemProps> = ({ iconUri, topLeftText, bottomLeftText, topRightText, bottomRightText }) => {
    return (
        <View className='w-[100%] min-h-[60px] my-2 justify-between flex-row items-center'>
            <View className='flex-row justify-center items-center space-x-3'>
                <Image
                    source={{ uri: iconUri }}
                    className='w-[60px] h-[60px] rounded-full'
                    resizeMode='contain'
                />

                <View className='space-y-2'>
                    <Text 
                        className='text-white font-lufgaMedium text-[18px] text-left'
                    >
                        {topLeftText}
                    </Text>

                    <Text 
                        className='text-secondaryHighlight text-[15px] font-lufgaRegular text-left'
                    >
                        {bottomLeftText}
                    </Text>
                </View>
            </View>

            <View className='space-y-2'>
                <Text 
                    className='text-white font-lufgaMedium text-[18px] text-right'
                >
                    {topRightText}
                </Text>

                <Text 
                    className='text-secondaryHighlight text-[15px] font-lufgaRegular text-right'
                >
                    {bottomRightText}
                </Text>
            </View>
        </View>
    )
}

export default CardItem