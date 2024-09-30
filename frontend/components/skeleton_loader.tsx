import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useRef } from 'react'

interface SkeletonLoaderProps {
    width?: number | string // Allow width to be either number or string (e.g. 90%)
    height?: number | string
    customStyles?: object
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    width = 100,
    height = 100,
    customStyles
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [animatedValue]);

    // Interpolating animatedValue to create horizontal shimmer effect
    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
         outputRange: [
            -(typeof width === 'number' ? width : (parseFloat(width.replace('%', '')) / 100) * Dimensions.get('window').width), 
            typeof width === 'number' ? width * 1.2 : (parseFloat(width.replace('%', '')) / 100) * Dimensions.get('window').width * 1.2
        ],
    });

    return (
        <View
            style={[
                styles.skeleton,
                { width, height },
                customStyles
            ]}
        >
            <Animated.View
                style={[
                    {
                        height: '100%',
                        width: '300%',
                        transform: [{ translateX }]
                    }
                ]}
            >
                <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,0.2)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
        borderRadius: 4,
    },
    gradient: {
        height: '100%',
        width: '33%',
    },
});

export default SkeletonLoader;
