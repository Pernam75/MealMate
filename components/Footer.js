import React from 'react'
import { NativeBaseProvider, Box, Text, Heading, VStack, FormControl, Input, Link, Button, Icon, HStack, Center, Pressable } from "native-base";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

export default function Footer() {
    const [selected, setSelected] = React.useState(1);
    return <NativeBaseProvider>
        <Box flex={1} bg="white"  width="100%" maxW="3000px" alignSelf="center">
          <Center flex={1}></Center>
          <HStack bg="white" alignItems="center" safeAreaBottom shadow={6}>
            <Pressable cursor="pointer" opacity={selected === 0 ? 1 : 0.5} py="3" flex={1} onPress={() => setSelected(0)}>
              <Center>
                <Icon mb="1" as={<MaterialIcons name="search" />} color="black" size="xl" />
              </Center>
            </Pressable>
            <Pressable cursor="pointer" opacity={selected === 1 ? 1 : 0.5} py="2" flex={1} onPress={() => setSelected(1)}>
              <Center>
                <Icon mb="1" as={<MaterialCommunityIcons name={selected === 1 ? "notebook" : "notebook-outline"} />} color="black" size="xl" />
              </Center>
            </Pressable>
            <Pressable cursor="pointer" opacity={selected === 2 ? 1 : 0.6} py="2" flex={1} onPress={() => setSelected(2)}>
              <Center>
                <Icon mb="1" as={<MaterialCommunityIcons name={selected === 2 ? "paperclip" : "paperclip"} />} color="black" size="xl" />
              </Center>
            </Pressable>
          </HStack>
        </Box>
      </NativeBaseProvider>;
  }