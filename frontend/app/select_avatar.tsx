import { View, Text, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { router, Href } from 'expo-router'
import React, { useEffect, useState } from 'react'

import { getDefaultAvatars } from '@/utils/avatars'

import CustomDialog from '@/components/custom_dialog'
import PageHeader from '@/components/page_header'
import { deleteItem, getItem, saveItem } from '@/context/SecureStorage'
import Loader from '@/components/loader'
import { getUsersNfts } from '@/context/WalletFunctions'

const SelectAvatar = () => {
    const [collectibles, setCollectibles] = useState([] as any[])
    const [avatars, setAvatars] = useState([] as string[])

    const [selectedAvatar, setSelectedAvatar] = useState('')

    const [dialogProps, setDialogProps] = useState({
        title: '',
        description: '',
        visible: false
    })

    const changeProfilePicture = async () => {
        try {
            const publicKey = getItem('publicKey') ?? ''
        
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/user/update/${publicKey}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getItem('accessToken')}`,
                    'x-refresh-token': getItem('refreshToken') ?? ''
                },
                body: JSON.stringify({
                    imageUrl: selectedAvatar
                })
            })
        
            if (response.headers.get('x-access-token')) {
                saveItem('accessToken', response.headers.get('x-access-token'))
            }
        
            if (response.status.toString().startsWith('2')) {
                saveItem('imageUrl', selectedAvatar)
            }
        } catch (error) {
            console.log(error)
        } finally {
            router.push('/(auth)/login_with_passcode' as Href)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const listOfAvatars = getDefaultAvatars()
            setAvatars(listOfAvatars)

            const nfts = await getUsersNfts()

            setCollectibles(nfts.map(nft => ({
                name: nft.metadata.name,
                image: nft.metadata.uri,
                value: nft.metadata.symbol
            })))
        }
        
        fetchData()
    }, [])
    
    return (
        <SafeAreaView className='bg-background h-full'>
            <CustomDialog 
                title={dialogProps.title}
                description={dialogProps.description}
                visible={dialogProps.visible}
                showCancel
                onOkPress={async () => {
                    setDialogProps({ title: '', description: '', visible: false })

                    if (avatars.includes(selectedAvatar)) {
                        await deleteItem('isNFTProfile')
                    } else {
                        saveItem('isNFTProfile', 'yes')
                    }

                    if (selectedAvatar !== '') {
                        changeProfilePicture()
                    }
                }}
                onCancelPress={() => {setDialogProps({ title: '', description: '', visible: false })}}
            />
            <ScrollView>
                <View className='h-[90vh] items-center justify-center mt-[50px]'>
                    <PageHeader 
                        title='Select new avatar'
                        containerStyles='mt-1'
                    />

                    <View className='flex-wrap flex-row items-center mt-[100px] justify-between mx-3 space-y-5'>
                        {avatars.map((avatar, index) => (
                            <TouchableOpacity
                                key={`touchable-${index}`}
                                onPress={() => {
                                    setSelectedAvatar(avatar)
                                    
                                    setDialogProps({
                                        title: 'Update profile picture',
                                        description: 'Do you want to update your profile picture?',
                                        visible: true
                                    })
                                }}
                            >
                                <View
                                    className='justify-center items-center w-[100px] h-[100px] bg-secondaryUtils rounded-full'
                                    key={`container-${index}`}
                                >
                                    <Image 
                                        source={{ uri: avatar }}
                                        className='w-[70px] h-[70px] rounded-full'
                                        resizeMode="contain"
                                        key={`image-${index}`}
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}

                        {collectibles.map((collectible, index) => (
                            <TouchableOpacity
                                key={`nft-touchable-${index}`}
                                onPress={() => {
                                    setSelectedAvatar(collectible.image)
                                    
                                    setDialogProps({
                                        title: 'Update profile picture',
                                        description: 'Do you want to update your profile picture?',
                                        visible: true
                                    })
                                }}
                            >
                                <View
                                    className='justify-center items-center w-[100px] h-[100px] bg-secondaryUtils rounded-full'
                                    key={`nft-container-${index}`}
                                >
                                    <Image 
                                        source={{ uri: collectible.image }}
                                        className='w-[70px] h-[70px] rounded-full'
                                        resizeMode="contain"
                                        key={`nft-image-${index}`}
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SelectAvatar