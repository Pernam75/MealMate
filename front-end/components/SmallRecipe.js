import React from 'react'
import { Text, Box, Center, Heading, IconButton, AspectRatio, Stack, Image, Icon, HStack, Badge, useColorMode } from 'native-base';
import { Octicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function SmallRecipe(props) {
  const {
    colorMode,
    toggleColorMode
  } = useColorMode();

  return (
  <Box alignItems="center">
      <Box width='95%' maxW="80" rounded="lg" overflow="hidden" borderColor={colorMode === "dark" ? "gray.700" : "gray.300"} borderWidth="1">
        <Box>
          <AspectRatio w="100%" ratio={16 / 6}>
            <Image source={{
            uri: props.item.image}} alt="image" />
          </AspectRatio>
          <Center rounded="xl" opacity={70} position="absolute" top="3" right="3">            
            <IconButton icon={<Icon as={<Octicons name="heart-fill" />} />} borderRadius="full" _icon={{
                color: "green.500",
                size: "md"
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
              {/* <IconButton icon={<Icon as={<Octicons name="heart" />} />} borderRadius="full" _icon={{
                color: "black.500",
                size: "md"
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
              }} /> */}
          </Center>
        </Box>

        <Stack backgroundColor={colorMode === "dark" ? "gray.900" : "white"}  p='4' space={2}>
          <HStack space="3" justifyContent="space-around" alignItems="center">
            <Heading size="md" w='70%' ml="-1" numberOfLines={1} ellipsizeMode='tail'>
            {props.item.name}
            </Heading>
            <Icon as={<MaterialCommunityIcons name="timer-outline" />} />
            <Text fontWeight="400">
                  {props.item.time} 
            </Text>
          </HStack>
        </Stack>
      </Box>
    </Box>
    )
  };