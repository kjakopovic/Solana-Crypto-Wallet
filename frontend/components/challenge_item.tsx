import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface ChallengeItemProps {
    status: number,
    requiredStatus: number,
    title: string,
    obtained: boolean,
    reward: string,
    onPress?: () => void
}

const ChallengeItem: React.FC<ChallengeItemProps> = ({ status, requiredStatus, title, obtained, reward, onPress }) => {
    return (
        <TouchableOpacity
            className={`w-[90%] h-[70px] rounded-xl p-2 px-3 mt-7 justify-between items-center flex-row ${obtained ? 'bg-green-600' : status >= requiredStatus ? 'bg-primary' : 'bg-secondaryUtils'}`}
            onPress={onPress}
            disabled={obtained || status < requiredStatus}
        >
            <View className='justify-center space-y-2'>
                <Text className='font-lufgaBold text-left text-white text-[15px]'>
                    {title}
                </Text>

                <Text className='font-lufgaMedium text-left text-white text-[12px]'>
                    {`Status: ${status} / ${requiredStatus}`}
                </Text>
            </View>

            <View className='justify-center space-y-2'>
                <Text className='font-lufgaBold text-left text-white text-[13px]'>
                    Reward:
                </Text>

                <Text className='font-lufgaMedium text-left text-white text-[12px]'>
                    {`${reward}`}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default ChallengeItem