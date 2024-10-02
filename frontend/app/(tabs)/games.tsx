import { View, Text, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { Href, router } from 'expo-router'

import React, { useEffect, useState } from 'react'

import { icons } from '@/constants'
import CustomButton from '@/components/custom_button'
import ChallengeItem from '@/components/challenge_item'
import Timer from '@/components/hours_timer'
import { getItem } from '@/context/SecureStorage'

const Games = () => {
    //TODO: smisliti kako countdown napraviti za ovaj timer za available after
    //TODO: integrirati sa backendom
    const [quiz, setQuiz] = useState({
        difficulty: 'easy',
        streak: 0
    } as any)

    const [startDate, setStartDate] = useState(null as Date | null)

    const [challenges, setChallenges] = useState([
        {
            title: 'Challenge 1',
            status: 0,
            requiredStatus: 100,
            reward: '1000 SolaSafe Points',
            obtained: false
        },
        {
            title: 'Challenge 2',
            status: 150,
            requiredStatus: 1000,
            reward: '500 SolaSafe Points',
            obtained: true
        },
        {
            title: 'Challenge 3',
            status: 10,
            requiredStatus: 10,
            reward: '2000 SolaSafe Points',
            obtained: false
        }
    ] as any[])

    const getAwards = (challenge: any) => {
        // TODO: integracija s backendom
        if (challenge.status >= challenge.requiredStatus) {
            console.log('Obtained reward');
    
            // Create a new challenges array with updated challenge
            const updatedChallenges = challenges.map((ch) => {
                if (ch.title === challenge.title) {
                    return { ...ch, obtained: true };
                }
                return ch;
            });
    
            setChallenges(updatedChallenges);
        } else {
            console.log('Challenge not completed');
        }
    };

    useEffect(() => {
        const lastQuizDate = getItem('lastQuizDate')

        if (lastQuizDate) {
            setStartDate(new Date(lastQuizDate))
        }

        const currentLevel = getItem('currentQuizLevel') ?? '1'
        const currentStreak = getItem('currentQuizStreak') ?? '0'

        if (currentLevel) {
            setQuiz({ 
                difficulty: parseFloat(currentLevel) === 1 ? 'easy' : parseFloat(currentLevel) === 2 ? 'medium' : 'hard',
                streak: parseFloat(currentStreak)
            })
        }
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
                                title={challenge.title}
                                status={challenge.status}
                                requiredStatus={challenge.requiredStatus}
                                reward={challenge.reward}
                                obtained={challenge.obtained}
                                onPress={() => getAwards(challenge)}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Games