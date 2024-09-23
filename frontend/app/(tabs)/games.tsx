import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import React from 'react'

const Games = () => {
  return (
    <SafeAreaView className='bg-background h-full'>
      <ScrollView>
        <View className='h-full'>
          <Text className='text-white'>Games</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Games