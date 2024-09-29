import { View, Text, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

import React, { useEffect, useState } from 'react'

import { getDefaultAvatars } from '@/utils/avatars'

import CustomDialog from '@/components/custom_dialog'
import PageHeader from '@/components/page_header'

const SelectAvatar = () => {
    const [avatars, setAvatars] = useState([] as string[])
    const [selectedAvatar, setSelectedAvatar] = useState('')

    const [dialogProps, setDialogProps] = useState({
        title: '',
        description: '',
        visible: false
    })

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
                onOkPress={() => {
                    setDialogProps({ title: '', description: '', visible: false })
                    console.log(selectedAvatar)
                    //TODO: Update user's profile picture on backend
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
                    {/* TODO: dodati button da odabere NFT */}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SelectAvatar