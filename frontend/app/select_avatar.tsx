import { View, Text, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { router, Href } from 'expo-router'
import React, { useEffect, useState } from 'react'

import { getDefaultAvatars } from '@/utils/avatars'

import CustomDialog from '@/components/custom_dialog'
import PageHeader from '@/components/page_header'
import { deleteItem, getItem, saveItem } from '@/context/SecureStorage'

const SelectAvatar = () => {
    const [avatars, setAvatars] = useState([] as string[])
    const [selectedAvatar, setSelectedAvatar] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [dialogProps, setDialogProps] = useState({
        title: '',
        description: '',
        visible: false
    })

    const changeProfilePicture = async () => {
        try {
            setIsLoading(true)

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
            setIsLoading(false)

            router.push('/(auth)/login_with_passcode' as Href)
        }
    }

    useEffect(() => {
        const listOfAvatars = getDefaultAvatars()
        setAvatars(listOfAvatars)
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
                    await deleteItem('isNFTProfile')

                    if (selectedAvatar !== '') {
                        changeProfilePicture()
                    }
                }}
                onCancelPress={() => {setDialogProps({ title: '', description: '', visible: false })}}
            />
            <ScrollView>
                <View className='h-[70vh] items-center justify-center mt-[50px]'>
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
                    </View>
                    {/* TODO: dodati button da odabere NFT, ako odabere NFT onda setItem('isNFTProfile', 'yes') */}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SelectAvatar