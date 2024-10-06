import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

import React, { useState, useEffect } from 'react'

import CustomInput from '@/components/custom_input'
import CustomButton from '@/components/custom_button'
import CustomDialog from '@/components/custom_dialog'
import SupportCard from '@/components/support_card'
import PageHeader from '@/components/page_header'
import { getItem, saveItem } from '@/context/SecureStorage'
import Loader from '@/components/loader'

const Support = () => {
    const adminProfilePicture = 'https://cdn.pixabay.com/photo/2022/02/18/16/09/ape-7020995_1280.png'

    const [isLoading, setIsLoading] = useState(true)

    const [question, setQuestion] = useState({
        title: '',
        description: ''
    })

    const [dialogProps, setDialogProps] = useState({
        title: '',
        description: '',
        visible: false
    })

    const [pastQuestions, setPastQuestions] = useState([] as any[])

    const sendQuestionToSupport = async () => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/support-question/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getItem('accessToken')}`,
                'x-refresh-token': getItem('refreshToken') ?? ''
            },
            body: JSON.stringify({
                title: question.title,
                description: question.description,
                publicKey: getItem('publicKey')
            })
        })
      
        if (response.headers.get('x-access-token')) {
            saveItem('accessToken', response.headers.get('x-access-token'))
        }

        if (response.status.toString().startsWith('2')) {
            setDialogProps({ title: 'Success', description: 'Your question has been sent to support.', visible: true })
        } else {
            console.log(response)
            
            setDialogProps({ title: 'Failure', description: 'There was an error please try again.', visible: true })
        }

        setQuestion({ title: '', description: '' })
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/support-question/fetch-answered-sq`, {
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

            if (response.status.toString().startsWith('2')) {
                const data = await response.json()

                setPastQuestions(data.supportQuestions.map((question: any, index: number) => {
                    return {
                        index: index + 1,
                        title: question.title,
                        description: question.description,
                        answer: question.answer,
                        userProfilePicture: question.user.imageUrl,
                        adminProfilePicture: adminProfilePicture
                    }
                }))
            } else {
                console.log(response)
            }
        }

        fetchData()

        setIsLoading(false)
    }, [])

    if (isLoading) return <Loader isLoading={isLoading} />
    
    return (
        <SafeAreaView className='bg-background h-full'>
            <CustomDialog 
                title={dialogProps.title}
                description={dialogProps.description}
                visible={dialogProps.visible}
                showCancel={false}
                onOkPress={() => {setDialogProps({ title: '', description: '', visible: false })}}
            />
            
            <ScrollView>
                <View className='w-[100%] items-center pb-10'>
                    <PageHeader
                        title='Support'
                        containerStyles='mt-10'
                    />

                    <View className='h-full w-[80%] mt-10'>
                        <CustomInput
                            value={question.title}
                            onChangeText={(text) => setQuestion({ ...question, title: text })}
                            placeholder='Title'
                            containerStyles='mb-5'
                        />

                        <CustomInput
                            value={question.description}
                            onChangeText={(text) => setQuestion({ ...question, description: text })}
                            placeholder='Description'
                            multiline
                            containerStyles='h-[200px]'
                        />

                        <CustomButton
                            title='Send'
                            containerStyles='mt-5 mb-10'
                            handlePress={sendQuestionToSupport}
                            primary
                        />

                        <Text
                            className='font-lufgaBold text-white text-xl text-center mb-5 mt-10'
                        >
                            Maybe we already have an answer here?
                        </Text>

                        {pastQuestions.map((question, index) => (
                            <SupportCard
                                key={index}
                                index={question.index}
                                title={question.title}
                                description={question.description}
                                answer={question.answer}
                                userProfilePicture={question.userProfilePicture}
                                adminProfilePicture={question.adminProfilePicture}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Support