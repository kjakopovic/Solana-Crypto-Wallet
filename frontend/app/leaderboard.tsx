import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useState, useEffect } from 'react'

import PageHeader from '@/components/page_header'
import LeaderboardPlacing from '@/components/leaderboard_placing'
import Loader from '@/components/loader'
import Timer from '@/components/days_timer'

import { getItem, saveItem } from '@/context/SecureStorage'

const Leaderboard = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [startDate, setStartDate] = useState(null as Date | null)
    
    const [users, setUsers] = useState([] as any[])

    const [currentUser, setCurrentUser] = useState({
        username: '',
        public_key: '',
        image: '',
        points: 0,
        placement: 'N/A'
    } as any)

    const getLastMomentOfMonth = (): Date | null => {
        const now = new Date();

        if (now.getDate() <= 1) {
            return null;
        }
    
        // Get the current year and month
        const year = now.getFullYear();
        const month = now.getMonth();
    
        const lastDayOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
    
        return lastDayOfMonth;
    }

    useEffect(() => {
        const loadData = async () => {
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/user/leaderboard`, {
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
                const responseData = await response.json()

                if (responseData !== undefined && responseData.length !== 0) {
                    setUsers(responseData.map((user: any, index: number) => {
                        return {
                            username: user.username,
                            publickey: user.publickey,
                            image: user.imageurl,
                            points: user.points ?? 0,
                            placement: user.placement
                        }
                    }))
                }

                const currentUserData = responseData.find((user: any) => user.publickey === getItem('publicKey'));

                if (currentUserData) {
                    setCurrentUser(currentUserData)
                }
            }

            setStartDate(getLastMomentOfMonth())

            setIsLoading(false)
        }

        loadData()
    }, [])

    if (isLoading) {
        return (
            <Loader isLoading />
        )
    }
    
    return (
        <SafeAreaView className='bg-background h-full'>
            <ScrollView>
                <View className='items-center pb-[100px]'>
                    <PageHeader 
                        title='Leaderboard'
                    />

                    {startDate ? (
                        <View className='items-center justify-center flex-row'>
                            <Timer
                                startDate={startDate}
                                onTimerFinished={() => setStartDate(null)}
                            />

                            <Text className='text-white text-[12px] mt-5 mb-5 ml-2'>
                                until closing of this months run
                            </Text>
                        </View>
                    ) : (
                        <Text className='text-white text-[12px] mt-5 mb-5'>
                            This run is closed, next run starts soon!
                        </Text>
                    )}

                    {users !== undefined && users !== null && users.length !== 0 && users
                        .sort((a, b) => b.points - a.points)
                        .map((user, index) => (
                        <LeaderboardPlacing
                            key={index}
                            placement={user.placement}
                            username={user.username}
                            image={user.image}
                            points={user.points}
                        />
                    ))}
                </View>
            </ScrollView>

            <View className='absolute bottom-0 w-full items-center'>
                <LeaderboardPlacing
                    placement={currentUser.placement}
                    username={currentUser.username}
                    image={currentUser.imageurl}
                    points={currentUser.points}
                />
            </View>
        </SafeAreaView>
    )
}

export default Leaderboard