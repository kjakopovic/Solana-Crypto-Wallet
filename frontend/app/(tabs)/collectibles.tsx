import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useState, useEffect } from 'react'
import PageHeader from '@/components/page_header'
import CollectibleItem from '@/components/collectible_item'

const Collectibles = () => {
    const [collectibles, setCollectibles] = useState([] as any[])
    
    useEffect(() => {
        setCollectibles([
            {
                name: 'Custom NFT',
                image: 'https://cdn.pixabay.com/photo/2022/02/18/16/09/ape-7020995_1280.png',
                value: 1500
            },
            {
                name: 'Custom NFT',
                image: 'https://cdn.pixabay.com/photo/2022/02/18/16/09/ape-7020995_1280.png',
                value: 1500
            },
            {
                name: 'Custom NFT',
                image: 'https://cdn.pixabay.com/photo/2022/02/18/16/09/ape-7020995_1280.png',
                value: 1500
            },
            {
                name: 'Custom NFT',
                image: 'https://cdn.pixabay.com/photo/2022/02/18/16/09/ape-7020995_1280.png',
                value: 1500
            },
            {
                name: 'Custom NFT',
                image: 'https://cdn.pixabay.com/photo/2022/02/18/16/09/ape-7020995_1280.png',
                value: 1500
            }
        ])
    }, [])

    return (
        <SafeAreaView className='bg-background h-full'>
            <ScrollView>
                <View className='space-y-10 pb-[100px] items-center'>
                    <PageHeader
                        title='Collectibles'
                        showExitButton={false}
                        containerStyles='-mr-2 mb-10'
                    />

                    {collectibles.length === 0 || !collectibles ? (
                        <Text className='font-lufgaMedium text-white text-sm text-center mt-10'>
                            You don't have any collectibles yet.
                        </Text>
                    ) : (
                        collectibles.map((collectible, index) => (
                            <CollectibleItem
                                key={index}
                                name={collectible.name}
                                image={collectible.image}
                                value={collectible.value}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Collectibles