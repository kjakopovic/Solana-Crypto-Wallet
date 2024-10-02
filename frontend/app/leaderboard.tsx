import { View, Text, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useState, useEffect } from 'react'
import PageHeader from '@/components/page_header'
import LeaderboardPlacing from '@/components/leaderboard_placing'
import Loader from '@/components/loader'
import Timer from '@/components/days_timer'

const Leaderboard = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [startDate, setStartDate] = useState(null as Date | null)
    
    const [users, setUsers] = useState([
        {
            username: 'User 1',
            public_key: 'jnhefjhuaefu',
            image: 'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417574_1280.png',
            points: 1000,
            placement: 1
        },
        {
            username: 'User 2kfjaskfdjaijda',
            public_key: 'jnhefjhsdguaefu',
            image: 'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417574_1280.png',
            points: 777,
            placement: 2
        },
        {
            username: 'User 3',
            public_key: 'jnheasfdsafdsffjhuaefu',
            image: 'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417574_1280.png',
            points: 700,
            placement: 3
        },
        {
            username: 'User 1',
            public_key: 'jnhefjhuaefdgfdgdgu',
            image: 'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417574_1280.png',
            points: 500,
            placement: 4
        },
        {
            username: 'User 2',
            public_key: 'asfadfdsajnhefjhuaefu',
            image: 'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417574_1280.png',
            points: 250,
            placement: 5
        },
        {
            username: 'User 3',
            public_key: 'jnhsdgsdefjhuadsgeadfefu',
            image: 'https://cdn.pixabay.com/photo/2022/08/28/21/51/cartoon-7417574_1280.png',
            points: 250,
            placement: 6
        }
    ] as any[])

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
        //TODO: fetch users from backend and THEN:
        //TODO: treba usporediti s public keyom iz getItem()
        setCurrentUser(users.find(user => user.public_key === 'jnhsdgsdefjhuadsgeadfefu'))

        setStartDate(getLastMomentOfMonth())

        setIsLoading(false)
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

                    {users
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
                    image={currentUser.image}
                    points={currentUser.points}
                />
            </View>
        </SafeAreaView>
    )
}

export default Leaderboard