import { Box, HStack, VStack, ZStack, AspectRatio, IconButton, Image, Badge, Text, View, Icon, useColorMode} from 'native-base';
import React, {useContext, useState, useEffect} from 'react';
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from '../Contexts/AuthContext';

export default function Profile({navigation}) {
  const {
      colorMode,
      toggleColorMode
  } = useColorMode();

  const {userInfo, userLikes} = useContext(AuthContext)
  const [Likes, setLikes] = useState(userLikes);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
    console.log('Refreshed profile!');
    setLikes(userLikes)
    });
    return unsubscribe;
  },[navigation])

  return (
    <View backgroundColor={colorMode === "dark" ? "black" : "coolGray.100"} flex="1" >
      <View>
        <ZStack>
          <AspectRatio w="100%" ratio={1 / 1}>
          <Image blurRadius={25} borderRadius="25" source={{
          uri: userInfo.avatar }} alt="image" />
          </AspectRatio>
          <IconButton mt="7" ml="3" bg="Gray:alpha.20" icon={<Icon as={<Ionicons name="close-outline" />} />} borderRadius="15" _icon={{
                  color: "black",
                  size: "xl"
                }} _hover={{
                  bg: "black:alpha.20"
                }} _pressed={{
                  bg: "black:alpha.20",
                  _icon: {
                    name: "emoji-flirt"
                  },
                  _ios: {
                    _icon: {
                      size: "2xl"
                    }
                  }
                }} _ios={{
                  _icon: {
                    size: "2xl"
                  }
                }} 
                onPress={() => { navigation.navigate('Home Page') }}/>

          <Box mt="72" ml="34" backgroundColor={colorMode === "dark" ? "gray.800" : "white"} borderRadius="15" w="84%" >
            <VStack space="4" pl="32" pr="5" py="5">
              <Text fontWeight="extrabold" fontSize="2xl" >{userInfo.first_name + '\n' + userInfo.last_name}</Text>
              <Text fontSize="xs">{userInfo.email}</Text>
              <HStack space="4">
                <Badge color="black" variant="outline" rounded="xl" >Fitness</Badge>
                <Badge color="black" variant="outline" rounded="xl" >Vegan</Badge>
              </HStack>
            </VStack>
          </Box>

          <AspectRatio mt="64" ml="30" w="30%" ratio={1 / 1.8}>
          <Image borderRadius="15" borderWidth="2" borderColor={colorMode === "dark" ? "gray.800" : "white"} source={{
          uri: userInfo.avatar}} alt="image" />
          </AspectRatio>
        </ZStack>
      </View>

      <View mt="96">
        <VStack space="5" mt="32" mx="8">
          <HStack space="8" alignItems="center" backgroundColor={colorMode === "dark" ? "gray.800" : "white"}  w="100%" borderRadius="15" p="5">
            <Icon mb="1" as={<Ionicons name={"heart"} />} color="#59DBB7" size="2xl" />
            <Text fontWeight="bold" fontSize="lg">{Likes.length} Recipes liked</Text>
          </HStack>
          
          <HStack space="8" alignItems="center" backgroundColor={colorMode === "dark" ? "gray.800" : "white"}  w="100%" borderRadius="15" p="5">
            <Icon mb="1" as={<Ionicons name={"fitness"} />} color="#eb4034" size="2xl" />
            <Text fontWeight="bold" fontSize="lg">14% Calorie Deficit</Text>
          </HStack>
          
          <HStack space="8" alignItems="center" backgroundColor={colorMode === "dark" ? "gray.800" : "white"}  w="100%" borderRadius="15" p="5">
            <Icon mb="1" as={<Ionicons name={"time"} />} color="#348ceb" size="2xl" />
            <Text fontWeight="bold" fontSize="lg">User Since Nov 2019</Text>
          </HStack>
        </VStack>
      </View>
    </View>
  );
}