import { View, Text, Image } from 'react-native'
import React from 'react'

interface SupportCardProps {
    index: number,
    title: string,
    description: string,
    answer: string,
    userProfilePicture: string,
    adminProfilePicture: string,
}

const SupportCard: React.FC<SupportCardProps> = ({ index, title, description, answer, userProfilePicture, adminProfilePicture }) => {
    return (
        <View className='w-full mt-5 p-3 bg-secondaryUtils rounded-2xl'>
            <Text 
                className='text-primary font-lufgaBold text-lg text-center'
            >
                {`${index}. ${title}`}
            </Text>

            <View className='w-[100%] flex-row items-center'>
                <View className='bg-primary mr-2 w-[50px] h-[50px] rounded-full items-center justify-center'>
                    <Image
                        source={{ uri: userProfilePicture }}
                        className='w-10 h-10 rounded-full'
                        resizeMode='contain'
                    />
                </View>

                <Text 
                    className='text-white text-left w-[80%] font-lufgaMedium text-sm mt-2'
                >
                    {description}
                </Text>
            </View>

            <View className='w-[100%] flex-row items-center'>
                <Text 
                    className='text-white mr-2 text-right w-[80%] font-lufgaMedium text-sm mt-2'
                >
                    {answer}
                </Text>

                <View className='bg-primary w-[50px] h-[50px] rounded-full items-center justify-center'>
                    <Image
                        source={{ uri: adminProfilePicture }}
                        className='w-[50px] h-[50px] rounded-full'
                        resizeMode='contain'
                    />
                </View>
            </View>
        </View>
    )
}

export default SupportCard