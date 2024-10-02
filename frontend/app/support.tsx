import { View, Text, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

import React, { useState, useEffect } from 'react'

import CustomInput from '@/components/custom_input'
import CustomButton from '@/components/custom_button'
import CustomDialog from '@/components/custom_dialog'
import SupportCard from '@/components/support_card'
import PageHeader from '@/components/page_header'

const Support = () => {
    const adminProfilePicture = 'https://cdn.pixabay.com/photo/2022/02/18/16/09/ape-7020995_1280.png'

    const [question, setQuestion] = useState({
        title: '',
        description: '',
        publicKey: ''
    })

    const [dialogProps, setDialogProps] = useState({
        title: '',
        description: '',
        visible: false
    })

    const [pastQuestions, setPastQuestions] = useState([] as any[])

    const sendQuestionToSupport = () => {
        //TODO: implementirati backend za sendanje u bazu
        setDialogProps({ title: 'Success', description: 'Your question has been sent to support.', visible: true })
    }

    useEffect(() => {
        //TODO: fetch data from backend

        setPastQuestions([
            {
                index: 1,
                title: 'How to send crypto?',
                description: 'I am trying to send crypto to my friend but I can\'t seem to find the option to do so.',
                answer: 'To send crypto, you need to go to the Send Crypto page and fill in the required fields.',
                userProfilePicture: 'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417574_1280.png',
                adminProfilePicture: adminProfilePicture
            },
            {
                index: 33,
                title: 'How should I proceed with the verification process?',
                description: 'I have uploaded my documents but I am not sure what to do next.',
                answer: 'You need to wait for the verification process to be completed. You will receive an email once the process is done.',
                userProfilePicture: 'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417574_1280.png',
                adminProfilePicture: adminProfilePicture
            },
            {
                index: 77,
                title: 'What if I forget my password?',
                description: 'I have forgotten my password and I can\'t seem to find the option to reset it.',
                answer: 'You can reset your password by clicking on the Forgot Password link on the login page.',
                userProfilePicture: 'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417574_1280.png',
                adminProfilePicture: adminProfilePicture
            }
        ])
    }, [])
    
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