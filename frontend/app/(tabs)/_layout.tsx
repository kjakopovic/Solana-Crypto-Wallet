import { Image, View } from 'react-native'
import { Tabs } from 'expo-router'
import React from 'react'

import { icons } from '@/constants'

interface TabIconProps {
    icon: any
    color: string
    customStyles?: string
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, customStyles }) => {
    return (
        <View className="flex items-center justify-center gap-2">
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className={`w-8 h-8 ${customStyles}`}
            />
        </View>
    );
};

const TabsLayout = () => {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#007AFF",
                    tabBarInactiveTintColor: "#cfcfcf",
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        backgroundColor: "rgba(35, 35, 36, 0.9)",
                        borderTopColor: "transparent",
                        height: 70,
                        borderRadius: 30,
                        position: "absolute",
                        bottom: 25,
                        alignItems: "center",
                        marginHorizontal: 15,
                    },
                }}
            >
                <Tabs.Screen
                    name="wallet"
                    options={{
                        title: "Wallet",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <TabIcon
                                icon={icons.wallet}
                                color={color}
                                customStyles='h-7 w-7'
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="collectibles"
                    options={{
                        title: "Collectibles",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <TabIcon
                                icon={icons.nft}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="games"
                    options={{
                        title: "Games",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <TabIcon
                                icon={icons.leaderboard}
                                color={color}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="swap"
                    options={{
                        title: "Swap",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <TabIcon
                                icon={icons.swap}
                                color={color}
                                customStyles='h-6 w-6'
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="settings"
                    options={{
                        title: "Settings",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <TabIcon
                                icon={icons.settings}
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        </>
    )
}

export default TabsLayout