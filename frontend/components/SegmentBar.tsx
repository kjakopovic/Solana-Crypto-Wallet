import { View, Text } from 'react-native'
import React from 'react'

interface SegmentBarProps {
    numberOfSegments: number,
    currentSegment: number
}

const SegmentBar: React.FC<SegmentBarProps> = ({ numberOfSegments, currentSegment }) => {
    const segments = Array.from({ length: numberOfSegments }, (_, i) => i);
  
    return (
        <View className='mt-5 flex-row justify-between w-4/5 mx-auto'>
            {segments.map((segment) => (
                <View key={segment} className={`m-1 flex-1 h-[5px] ${segment === currentSegment ? 'bg-secondaryHighlight' : 'bg-secondary'} rounded-full`} />
            ))}
        </View>
    )
}

export default SegmentBar