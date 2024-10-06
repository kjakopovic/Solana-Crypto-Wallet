import { View, Text, Image, TouchableOpacity, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { Href, router } from 'expo-router'

import React, { useEffect, useState } from 'react'

import { icons } from '@/constants'
import CustomButton from '@/components/custom_button'
import ChallengeItem from '@/components/challenge_item'
import Timer from '@/components/hours_timer'
import { deleteItem, getItem, saveItem } from '@/context/SecureStorage'
import CustomDialog from '@/components/custom_dialog'
import Loader from '@/components/loader'

interface QuizStructure {
    difficulty: string,
    streak: number,
    id: number,
    question: string,
    correctAnswer: string,
    answers: string[]
}

const Games = () => {
    const [quiz, setQuiz] = useState({
        difficulty: 'easy',
        streak: 0
    } as QuizStructure)

    const [dialogProps, setDialogProps] = useState({
        title: '',
        description: '',
        visible: false,
        quizFailed: true
    })

    const [modalData, setModalData] = useState({
        isModalVisible: false,
    })

    const [isLoading, setIsLoading] = useState(true)

    const [startDate, setStartDate] = useState(null as Date | null)

    const [challenges, setChallenges] = useState([] as any[])

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
                    if (ch.id === challenge.id) {
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

    const handleSubmitQuiz = async (answer: string) => {
        if (answer === quiz.correctAnswer) {
            setDialogProps({
                title: 'Correct!',
                description: 'You have successfully answered the question.',
                visible: true,
                quizFailed: false
            })
        } else {
            setDialogProps({
                title: 'Incorrect!',
                description: 'You have failed to answer the question.',
                visible: true,
                quizFailed: true
            })
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            // Challenge data
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/challenges/get-all`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getItem('accessToken')}`,
                    'x-refresh-token': getItem('refreshToken') ?? ''
                },
                body: JSON.stringify({
                    publicKey: getItem('publicKey') ?? ''
                })
            })

            if (response.headers.get('x-access-token')) {
                saveItem('accessToken', response.headers.get('x-access-token'))
            }

            if (response.status.toString().startsWith('2')) {
                const data = await response.json()

                // Fetching current challenges status
                const threeEasy = parseFloat(getItem('currentQuizLevel') ?? '1') === 1 ? 
                    parseFloat(getItem('currentQuizStreak') ?? '0') : parseFloat(getItem('currentQuizLevel') ?? '1') > 1 ? 3 : 0

                const threeMedium = parseFloat(getItem('currentQuizLevel') ?? '1') === 2 ? 
                    parseFloat(getItem('currentQuizStreak') ?? '0') : parseFloat(getItem('currentQuizLevel') ?? '1') > 2 ? 3 : 0

                const threeHardAndTen = parseFloat(getItem('currentQuizLevel') ?? '1') === 3 ? 
                    parseFloat(getItem('currentQuizStreak') ?? '0') : 0

                const currentAccountBalance = parseFloat(getItem('accountBalance') ?? '0')
                
                setChallenges(data.map((challenge: any) => {
                    var answer = {} as any

                    if (challenge.description === 'Get 3 correct easy questions') {
                        answer.currentStatus = threeEasy
                    } else if (challenge.description === 'Get 3 correct medium questions') {
                        answer.currentStatus = threeMedium
                    } else if (challenge.description === 'Get 3 correct hard questions') {
                        answer.currentStatus = threeHardAndTen
                    } else if (challenge.description === 'Get 10 correct hard questions') {
                        answer.currentStatus = threeHardAndTen
                    } else if (challenge.description === 'Have 1000$ worth of crypto in the wallet') {
                        answer.currentStatus = currentAccountBalance
                    } else {
                        answer.currentStatus = 0
                    }

                    answer.id = challenge.id
                    answer.name = challenge.name
                    answer.description = challenge.description
                    answer.status = challenge.status
                    answer.points = challenge.points
                    answer.obtained = challenge.obtained
                    
                    return answer
                }))
            } else {
                console.log(response)
            }

            // Quiz data
            const nextQuizDate = getItem('nextQuizDate')

            if (nextQuizDate) {
                setStartDate(new Date(nextQuizDate))
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

        setIsLoading(false)
    }, [])

    if (isLoading) return <Loader isLoading={isLoading} />;
    
    return (
        <SafeAreaView className='bg-background h-full'>
            <ScrollView>
                <CustomDialog 
                    title={dialogProps.title}
                    description={dialogProps.description}
                    visible={dialogProps.visible}
                    showCancel={false}
                    onOkPress={async () => {
                        if (dialogProps.quizFailed) {
                            await deleteItem('currentQuizLevel')
                            await deleteItem('currentQuizStreak')
                        } else {
                            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/points/save`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${getItem('accessToken')}`,
                                    'x-refresh-token': getItem('refreshToken') ?? ''
                                },
                                body: JSON.stringify({
                                    publicKey: getItem('publicKey') ?? '',
                                    quizDifficulty: quiz.difficulty,
                                })
                            })
                          
                            if (response.headers.get('x-access-token')) {
                                saveItem('accessToken', response.headers.get('x-access-token'))
                            }
    
                            if (response.status.toString().startsWith('2')) {
                                const currentPoints = parseFloat(getItem('points') ?? '0') + (
                                    quiz.difficulty === 'easy' ? 1 : quiz.difficulty === 'medium' ? 2 : 3
                                )
                                saveItem('points', currentPoints.toString())
    
                                const currentLevel = parseFloat(getItem('currentQuizLevel') ?? '1')
                                const currentStreak = parseFloat(getItem('currentQuizStreak') ?? '0')
    
                                if (currentStreak + 1 === 3 && currentLevel < 3) {
                                    saveItem('currentQuizLevel', (currentLevel + 1).toString())
                                    saveItem('currentQuizStreak', '0')
                                } else {
                                    saveItem('currentQuizStreak', (currentStreak + 1).toString())
                                }
    
                                saveItem('nextQuizDate', new Date(new Date().setHours(new Date().getHours() + 8)).toString())
                                setStartDate(new Date(new Date().setHours(new Date().getHours() + 8)))
                            }
    
                            setDialogProps({ title: '', description: '', visible: false, quizFailed: true })
                            setModalData({ isModalVisible: false })
                        }
                    }}
                />
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
                            }}
                        />
                    </View>

                    <Text className='font-lufgaBold text-left w-full ml-10 mt-5 text-white text-[20px]'>
                        Challenges
                    </Text>

                    <View className='w-full space-y-10 mt-10 justify-center items-center'>
                        {challenges.map((challenge, index) => (
                            <ChallengeItem
                                key={challenge.id}
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
                                <Text
                                    className='text-white font-lufgaBold justify-center items-center text-center text-[17px] mb-3'
                                >
                                    {quiz.question}
                                </Text>

                                <View className='w-full justify-center items-center'>
                                    {quiz.answers !== undefined && quiz.answers.length > 0 && quiz.answers.map((answer: any, index: number) => (
                                        <TouchableOpacity
                                            key={`button-${index}`}
                                            className='mt-5 h-[40px] w-[80%] items-center justify-center bg-primary rounded-lg'
                                            onPress={() => handleSubmitQuiz(answer)}
                                        >
                                            <Text 
                                                key={`button-${index}`}
                                                className='text-white text-left font-lufgaBold text-[15px]'
                                            >
                                                {`${String.fromCharCode(65 + index)}: ${answer}`}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Games