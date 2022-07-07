import React, {useContext} from 'react'
import { Text, Box, Center, Heading, IconButton, AspectRatio, Stack, Image, Icon, HStack, Badge, useColorMode, Pressable } from 'native-base';
import { Octicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from 'axios';
const Env = require('../Env/EvnVariables')
import { AuthContext } from '../Contexts/AuthContext';

export default function Recipe(props) {
  const {
    colorMode,
    toggleColorMode
  } = useColorMode();

  const {userLikes, userInfo, updateLikes} = useContext(AuthContext)

  function sendLike(id_user, id_recipe) {
    axios.post(`${Env.default.ip}/like`,{ id_user, id_recipe })
    .then(res =>{
      console.log(res.data)})
  }

  return (
  <Box  alignItems="center" py='2'>
      <Box width='95%' maxW="80" rounded="lg" overflow="hidden" borderColor={colorMode === "dark" ? "gray.700" : "gray.300"} borderWidth="1">
        <Box>
          <AspectRatio w="100%" ratio={16 / 6}>
            <Image source={{
            uri: props.item.image}} alt="image" />
          </AspectRatio>
          <Center rounded="xl" opacity={70} position="absolute" top="3" right="3" bg={colorMode === "dark" ? "black:alpha.80" : "white:alpha.80"}>      
              <IconButton onPress={() => {
                sendLike(userInfo.id_user, props.item.recipe_id)
                userLikes.push(props.item.recipe_id)
                updateLikes(userLikes)
                props.updater(props.item.recipe_id)

              }} icon={<Icon as={<Octicons name="heart-fill" />} />} borderRadius="full" _icon={{
                  color: userLikes.includes(props.item.recipe_id) === true ? "#59DBB7" : colorMode === "dark" ? "white" : "black",
                  size: "md",
                }} _hover={{
                  bg: "green.600:alpha.20"
                }} _pressed={{
                  bg: "green.600:alpha.20",
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
                }} />
          </Center>
        </Box>

        <Stack backgroundColor={colorMode === "dark" ? "gray.900" : "white"}  p='4' space={2}>
          <HStack space="3" justifyContent="space-around" alignItems="center">
            <Heading size="md" w='70%' ml="-1">
            {props.item.name}
            </Heading>
            <Icon as={<MaterialCommunityIcons name="timer-outline" />} />
            <Text fontWeight="400">
                  {props.item.time} 
            </Text>
          </HStack>
                    
          <HStack space={3} justifyContent="space-around">
            <Badge width="30%" color="black" variant="outline" rounded="xl" >{props.item.nutrition.calories + ' Kcal'}</Badge>
            <Badge width="30%" color="black" variant="outline" rounded="xl" >{props.item.nutrition.sugar + 'g sugar'}</Badge>
            <Badge width="30%" color="black" variant="outline" rounded="xl" >{props.item.tags[5]}</Badge>
          </HStack>
        </Stack>
      </Box>
    </Box>
    )
  };