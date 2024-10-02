import { View, Text, Modal, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

import React, { useState, useEffect } from 'react'

import PageHeader from '@/components/page_header'
import Option from '@/components/option'

import { icons } from '@/constants'
import { Href, router } from 'expo-router'
import { deleteItem } from '@/context/SecureStorage'
import CustomInput from '@/components/custom_input'

const Settings = () => {
  const [showProfileOptions, setShowProfileOptions] = useState(false)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalErrorMessage, setModalErrorMessage] = useState('')

  const [newUsername, setNewUsername] = useState('')

  const logout = async () => {
    //TODO: provjeri jel to i dalje tako nakon integracije s backendom
    //TODO: pozvati backend endpoint za logout prvo, ako je uspjesan provedi ovo ostalo
    await Promise.all([
      deleteItem('privateKey'),
      deleteItem('publicKey'),
      deleteItem('refreshToken'),
      deleteItem('isUserFound')
    ])

    router.replace('/' as Href)
  }

  const validateUsername = () => {
    //TODO: Zovi backend za provjeru jel username vec postoji
    const isBackendValid = true
    return newUsername !== '' && newUsername !== null && newUsername !== undefined && isBackendValid;
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
                onClick={() => router.push('/(auth)/enter_passcode' as Href)}
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
                      <Text className='text-center text-[12px] text-red-500'>{modalErrorMessage}</Text>
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
                          onPress={() => {
                            const isValid = validateUsername()

                            if (isValid) {
                              //TODO: zovi backend za update usernamea
                              setIsModalVisible(false)
                            }

                            setModalErrorMessage('Username is already in use or empty, please try again.')
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