import React from 'react';
import { NativeBaseProvider,View, Box, Icon, HStack, Center, Pressable, useColorMode } from "native-base";
import { MaterialCommunityIcons, Ionicons, Octicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Recipes from '../components/Recipes';
import RecipeScreen from './RecipeScreen';


const Stack = createNativeStackNavigator();

export default function Home({navigation}) {
    const {
        colorMode,
        toggleColorMode
    } = useColorMode();

    return (
        <View flex={1}>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                    <Stack.Screen name="List" component={Recipes} />
                    <Stack.Screen name="recipe" component={RecipeScreen} />
                </Stack.Navigator>
            <Box width="100%" maxW="3000px" alignSelf="center">
                <HStack backgroundColor={colorMode === "dark" ? "gray.900" : "white"} alignItems="center" safeAreaBottom shadow={6}>
                    <Pressable cursor="pointer" opacity={0.5} py="3" flex={1} onPress={() => {
                        navigation.getParent('LeftDrawer').openDrawer()}}>
                    <Center>
                        <Icon mb="1" as={<Ionicons name={"md-reorder-three-outline"} />} color={colorMode === "dark" ? "white" : "black"} size="2xl" />
                    </Center>
                    </Pressable>
                    <Pressable cursor="pointer" opacity={0.5} py="2" flex={1} onPress={() => {
                        navigation.navigate('Saved Recipes')
                        }}>
                    <Center>
                        <Icon mb="1" as={<MaterialCommunityIcons name={"notebook-outline"} />} color={colorMode === "dark" ? "white" : "black"} size="xl" />
                    </Center>
                    </Pressable>
                    <Pressable cursor="pointer" opacity={0.6} py="2" flex={1} onPress={() => {
                        navigation.getParent('RightDrawer').openDrawer()
                        }}>
                    <Center>
                        <Icon mb="1" as={<Octicons name={"checklist"} />} color={colorMode === "dark" ? "white" : "black"} size="lg" />
                    </Center>
                    </Pressable>
                </HStack>
            </Box>
        </View>
  );
}