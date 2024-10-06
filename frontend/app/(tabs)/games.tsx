import { View, Text, Image, TouchableOpacity, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { Href, router } from 'expo-router'

import React, { useEffect, useState } from 'react'

import { icons } from '@/constants'
import CustomButton from '@/components/custom_button'
import ChallengeItem from '@/components/challenge_item'
import Timer from '@/components/hours_timer'
import { getItem, saveItem } from '@/context/SecureStorage'

const Games = () => {
    //TODO: integrirati sa backendom
    const [quiz, setQuiz] = useState({
        difficulty: 'easy',
        streak: 0
    } as any)

    const [modalData, setModalData] = useState({
        isModalVisible: false,
    })

    const [startDate, setStartDate] = useState(null as Date | null)

    const [challenges, setChallenges] = useState([
        {
            id: 1,
            name: 'Challenge 1',
            description: 'Challenge 1',
            status: 1,
            currentStatus: 0,
            points: 50,
            obtained: false
        },
        {
            id: 2,
            name: 'Challenge 1',
            description: 'Challenge 1',
            status: 10,
            currentStatus: 0,
            points: 100,
            obtained: true
        },
        {
            id: 3,
            name: 'Challenge 1',
            description: 'Challenge 1',
            status: 1,
            currentStatus: 2,
            points: 1000,
            obtained: false
        }
    ] as any[])

    const getAwards = async (challenge: any) => {
        if (challenge.currentStatus >= challenge.status) {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/points/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getItem('accessToken')}`,
                    'x-refresh-token': getItem('refreshToken') ?? ''
                },
                body: JSON.stringify({
                    publicKey: getItem('publicKey') ?? '',
                    challengeId: challenge.id
                })
            })
          
            if (response.headers.get('x-access-token')) {
                saveItem('accessToken', response.headers.get('x-access-token'))
            }

            if (response.status.toString().startsWith('2')) {
                // Create a new challenges array with updated challenge
                const updatedChallenges = challenges.map((ch) => {
                    if (ch.title === challenge.title) {
                        return { ...ch, obtained: true };
                    }

                    return ch;
                });
    
                setChallenges(updatedChallenges);

                const currentPoints = parseFloat(getItem('points') ?? '0') + challenge.points

                saveItem('points', currentPoints.toString())
            }
        } else {
            console.log('Challenge not completed');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            // Challenge data
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/challenges/get-all`, {
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

                console.log(data)
                //TODO: set challenges
            } else {
                console.log(response)
            }

            // Quiz data
            const lastQuizDate = getItem('lastQuizDate')

            if (lastQuizDate) {
                setStartDate(new Date(lastQuizDate))
            }

            const currentLevel = getItem('currentQuizLevel') ?? '1'
            const currentStreak = getItem('currentQuizStreak') ?? '0'
            const quizDifficulty = parseFloat(currentLevel) === 1 ? 'easy' : parseFloat(currentLevel) === 2 ? 'medium' : 'hard'

            const quizResponse = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/quiz/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getItem('accessToken')}`,
                    'x-refresh-token': getItem('refreshToken') ?? ''
                },
                body: JSON.stringify({
                    difficulty: quizDifficulty
                })
            })

            if (quizResponse.headers.get('x-access-token')) {
                saveItem('accessToken', quizResponse.headers.get('x-access-token'))
            }

            if (quizResponse.status.toString().startsWith('2')) {
                const data = await quizResponse.json()

                setQuiz({ 
                    difficulty: quizDifficulty,
                    streak: parseFloat(currentStreak),
                    id: data.id,
                    question: data.question,
                    correctAnswer: data.correctAnswer,
                    answers: [
                        data.A,
                        data.B,
                        data.C,
                        data.D
                    ]
                })
            }
        }

        fetchData()
    }, [])
    
    return (
        <SafeAreaView className='bg-background h-full'>
            <ScrollView>
                <View className='items-center justify-center mt-10 w-full pb-[100px]'>
                    <View className='w-[80%] justify-between items-center flex-row'>
                        <Text className='font-lufgaBold text-left text-white text-[20px]'>
                            Daily quiz
                        </Text>
                        
                        <TouchableOpacity
                            onPress={() => router.push('/leaderboard' as Href)}
                            className='flex-row items-center py-3'
                        >
                            <Text className='font-lufgaMedium text-primary text-[15px]'>
                                Leaderboard
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className='w-[90%] justify-center items-center flex-row h-[100px] mt-10'>
                        <View className='w-12 h-12 mr-3 rounded-full bg-secondaryUtils items-center justify-center'>
                            <Image
                                source={icons.brain}
                                className='w-7 h-7'
                                resizeMode='contain'
                            />
                        </View>

                        <View className='h-full justify-center w-[170px]'>
                            <Text className='font-lufgaBold text-left text-white text-[15px]'>
                                Earn your reward
                            </Text>

                            <Text className='font-lufgaMedium text-left text-secondaryHighlight text-[12px]'>
                                {`Difficulty: ${quiz.difficulty}`}
                            </Text>

                            {startDate &&
                                <View className='items-center justify-start flex-row'>
                                    <Text className='font-lufgaRegular text-left text-red-500 text-[12px]'>
                                        {`Available after: `}
                                    </Text>
                                    <Timer
                                        startDate={startDate}
                                        onTimerFinished={() => setStartDate(null)}
                                    />
                                </View>
                            }
                        </View>

                        <CustomButton
                            title='Start'
                            primary
                            containerStyles='min-h-0 py-2 px-7'
                            textStyles='text-[13px]'
                            isLoading={!(startDate === null || startDate === undefined)}
                            handlePress={() => {
                                setModalData({ isModalVisible: true })
                                //TODO: otvori modal da rijesi kviz, kad se rijesi kviz zatvara se modal i resetira 
                                // se timer za +8h te se doda counter za uspjesno rijesen kviz u tom difficultiju, 
                                // ako se faila stavlja se na nula, ako se pogodi ide +1, ako je na 3 resetiraj na 0 i 
                                // digni level
                            }}
                        />
                    </View>

                    <Text className='font-lufgaBold text-left w-full ml-10 mt-5 text-white text-[20px]'>
                        Challenges
                    </Text>

                    <View className='w-full space-y-10 mt-10 justify-center items-center'>
                        {challenges.map((challenge, index) => (
                            <ChallengeItem
                                key={index}
                                title={challenge.description}
                                status={challenge.currentStatus}
                                requiredStatus={challenge.status}
                                reward={`${challenge.points} SolaSafe Points`}
                                obtained={challenge.obtained}
                                onPress={() => getAwards(challenge)}
                            />
                        ))}
                    </View>
                    
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalData.isModalVisible}
                    >
                        <View className='flex-1 justify-center items-center bg-black/50'>
                            <View className='bg-secondaryUtils w-[90%] p-5 rounded-3xl'>
                                <Text>Testing</Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        setModalData({ isModalVisible: false })
                                    }}
                                    className='mt-5 bg-secondaryUtils p-2 rounded-lg'
                                >
                                    <Text className='text-center font-lufgaBold text-white'>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Games