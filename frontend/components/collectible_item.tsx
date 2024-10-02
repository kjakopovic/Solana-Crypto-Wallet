import { View, Text, Image } from 'react-native'
import React from 'react'

interface CollectibleItemProps {
    name: string,
    image: string,
    value: number
}

const CollectibleItem: React.FC<CollectibleItemProps> = ({ name, image, value }) => {
    return (
        <View className='w-[85%] h-[250px] relative mt-7'>
            <View className='bg-secondaryUtils/90 flex-row items-center justify-between h-[60px] absolute w-[100%] z-50 bottom-0 rounded-b-3xl'>
                <Text className='font-lufgaBold text-white text-lg ml-7'>
                    {name}
                </Text>
                <Text className='font-lufgaBold text-white text-lg mr-7'>
                    {`${value} SOL`}
                </Text>
            </View>
            <Image
                source={{ uri: image }}
                className='w-[100%] h-[250px] rounded-3xl'
            />
        </View>
    )
}

export default CollectibleItem