import { View, Text, Image } from 'react-native'
import React from 'react'

interface LeaderboardPlacingProps {
    placement: number,
    image: string,
    username: string,
    points: number,
}

const LeaderboardPlacing: React.FC<LeaderboardPlacingProps> = ({ placement, image, username, points }) => {
    return (
        <View
            className={`flex-row justify-between items-center px-5 rounded-3xl w-[90%] py-5 mt-5
                    ${placement === 1 ? 'bg-[#c2a300]' : 
                        placement === 2 ? 'bg-[#C0C0C0]' :
                        placement === 3 ? 'bg-[#9c642d]' : 'bg-secondaryUtils'
                    }
                `}
        >
            <View className='justify-between items-center flex-row'>
                <Text className='text-white text-[15px]'>
                    {`${placement}.`}
                </Text>

                <View className='flex-row items-center space-x-5 ml-5'>
                    <View className='w-12 h-12 items-center justify-center bg-primary rounded-full'>
                        <Image
                            source={{ uri: image }}
                            className='w-9 h-9 rounded-full'
                            resizeMode='contain'
                        />
                    </View>

                    <Text className='text-white font-lufgaSemiBold text-[17px]'>
                        {`${username.length >= 10 ? username.slice(0, 10) + '...' : username}`}
                    </Text>
                </View>
            </View>

            <View>
                <Text className='text-white font-lufgaMedium text-[15px]'>
                    {`${points}`}
                </Text>
            </View>
        </View>
    )
}

export default LeaderboardPlacing