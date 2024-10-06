import { View, Text, Modal, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

import React, { useState } from 'react'

import PageHeader from '@/components/page_header'
import Option from '@/components/option'

import { icons } from '@/constants'
import { Href, router } from 'expo-router'
import { deleteItem, getItem, saveItem } from '@/context/SecureStorage'
import CustomInput from '@/components/custom_input'

const Settings = () => {
  const [showProfileOptions, setShowProfileOptions] = useState(false)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalErrorMessage, setModalErrorMessage] = useState('')

  const [newUsername, setNewUsername] = useState('')

  const logout = async () => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/user/logout`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getItem('accessToken')}`,
          'x-refresh-token': getItem('refreshToken') ?? ''
      },
      body: JSON.stringify({
          publicKey: getItem('publicKey') ?? '',
      })
    })

    if (response.status.toString().startsWith('2')) {
      await deleteItem('privateKey')
      await deleteItem('publicKey')
      await deleteItem('refreshToken')
      await deleteItem('accessToken')
      await deleteItem('isUserFound')

      if (router.canDismiss()) {
        router.dismissAll()
      }
      
      router.replace('/' as Href)
    }
  }

  const changeUsername = async () => {
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
            username: newUsername
        })
      })

      if (response.headers.get('x-access-token')) {
        saveItem('accessToken', response.headers.get('x-access-token'))
      }

      if (!response.status.toString().startsWith('2')) {
        setModalErrorMessage('There was an error while setting the username. Please try again.')
        console.log(response)
      } else {
        setIsModalVisible(false)
      }
    } catch (error) {
      console.log(error)
      
    }
  }

  const validateUsername = async () => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/user/exist/username?username=${newUsername}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getItem('accessToken')}`,
          'x-refresh-token': getItem('refreshToken') ?? ''
      }
    })

    if (response.headers.get('x-access-token')) {
      saveItem('accessToken', response.headers.get('x-access-token'))
    }

    const isBackendResponseValid = response.status.toString().startsWith('2')
    return newUsername !== '' && newUsername !== null && newUsername !== undefined && isBackendResponseValid;
  }
  
  return (
    <SafeAreaView className='bg-background h-full'>
      <ScrollView>
        <View className='h-[85vh]'>
          <PageHeader 
            title={`${showProfileOptions ? 'Profile settings' : 'Settings'}`}
            showExitButton={showProfileOptions}
            containerStyles={`${showProfileOptions ? '' : '-ml-2'}`}
            onExitClick={() => setShowProfileOptions(false)}
          />

          {showProfileOptions ? (
            <View className='mt-10 w-[100%] items-center'>
              <Option
                icon={icons.profile}
                text='Change avatar'
                onClick={() => router.push('/select_avatar' as Href)}
              />

              <Option
                icon={icons.passwords}
                text='Change password'
                iconStyles='w-[35px] h-[35px]'
                onClick={() => router.push({
                    pathname: '/(auth)/enter_passcode',
                    params: { changePassword: 'true' },
                  })
                }
              />

              <Option
                icon={icons.idCard}
                text='Change username'
                onClick={() => setIsModalVisible(true)}
              />
            </View>
          ) : (
            <View className='mt-10 w-[100%] items-center'>
              <Option
                icon={icons.messageBox}
                text='Support'
                onClick={() => router.push('/support' as Href)}
              />

              <Option
                icon={icons.profile}
                text='Change profile info'
                onClick={() => setShowProfileOptions(true)}
              />

              <Option
                icon={icons.trashBin}
                text='Log out'
                onClick={logout}
              />
            </View>
          )}

          <Modal
              animationType="fade"
              transparent={true}
              visible={isModalVisible}
          >
              <View className='flex-1 justify-center items-center bg-black/50'>
                  <View className='bg-secondaryUtils w-[90%] p-5 h-[30vh] justify-between rounded-3xl'>
                    <CustomInput
                      value={newUsername}
                      onChangeText={setNewUsername}
                      placeholder='New username'
                      containerStyles='bg-background'
                    />

                    {modalErrorMessage !== '' && (
                      <Text className='text-center text-[11px] text-red-500'>{modalErrorMessage}</Text>
                    )}
                    
                    <View className='flex-row w-[100%] justify-between'>
                      <TouchableOpacity
                          onPress={() => {
                            setIsModalVisible(false)
                          }}
                          className='mt-5 bg-secondaryUtils p-2 rounded-lg'
                      >
                          <Text className='text-center font-lufgaBold text-white'>Close</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                          onPress={async () => {
                            setModalErrorMessage('')

                            console.log('validating username')
                            const isValid = await validateUsername()

                            if (isValid) {
                              console.log('username is valid')
                              await changeUsername()
                            } else {
                              setModalErrorMessage('Username is already in use or empty, please try again.')
                            }
                          }}
                          className='mt-5 bg-secondaryUtils p-2 rounded-lg'
                      >
                          <Text className='text-center font-lufgaBold text-primary'>Set new username</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
              </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Settings