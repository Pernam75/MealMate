import React, {useContext} from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Avatar, Switch, Divider, View, Text, Button, Icon, Pressable, Box, HStack, useColorMode } from "native-base";
import { Feather } from "@expo/vector-icons";
import { AuthContext } from '../Contexts/AuthContext';

export default function CustomDrawer(props) {
    const {
      colorMode,
      toggleColorMode
    } = useColorMode();

    const {logout, userInfo} = useContext(AuthContext)

    return (
        <View backgroundColor={colorMode === "dark" ? "black" : "coolGray.100"} flex="1">
            <View alignItems="center" pt="50">
                <Text pb="5" fontSize="2xl">Welcome {userInfo.first_name} </Text>
                <Avatar bg="green.500" alignSelf="center" size="xl" source={{ uri: userInfo.avatar }}>
                <Avatar.Badge bg="#59DBB7" /></Avatar>
                <Text italic color="coolGray.400" fontSize="xs" mt="2">User since November 2019</Text>
                <Divider bg="#59DBB7" mx="4" mt="7" thickness="2" width="75%" self  />
            </View>
            
            <DrawerContentScrollView {...props}>
                <View>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            
            <View alignItems="center" pb="7">
                <HStack space="6" alignItems="center">
                    <Text>Dark Mode</Text>
                    <Switch offTrackColor="#59DBB7" onTrackColor="gray.500" isChecked={colorMode == "dark" ? true : false} onToggle={toggleColorMode}/>
                </HStack>
                <Divider bg="#59DBB7" mx="4" my="7" thickness="2" width="75%" self  />
                <Pressable onPress={() => {logout()}}>
                    {({ isHovered, isPressed }) => {
                        return (
                            <Box width="40" alignItems="center" bg={isPressed ? (colorMode === "dark" ? "red.800" : "red.200") : (colorMode === "dark" ? "gray.900" : "white")} rounded="8" p="3">
                                <HStack space="6" alignItems="center">
                                    <Icon as={Feather} name="log-out" color="red.500"/>
                                    <Text>   Logout</Text>
                                    <Box>   </Box>
                                </HStack>
                            </Box>
                        )}
                    }
                </Pressable>
            </View>
        </View>
    );
}