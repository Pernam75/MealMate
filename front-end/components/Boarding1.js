import { Button, View, AspectRatio, Image, HStack, Text, Icon } from 'native-base'
import React from 'react'
import {Entypo} from "@expo/vector-icons";

export default function Borading1({navigation}) {
    return(
        <View backgroundColor="#59DBB7" w="100%" h="100%" alignItems="center">
            <AspectRatio w="90%" ratio={2/1} mb="80%" mt="70%">
            <Image size="100%" borderRadius="10" source={require('../src/images/logo_h.png')} alt="image" />
            </AspectRatio>
            <Button backgroundColor="white" onPress={() => navigation.navigate('Boarding2')} w="90%" h="16">
                <HStack alignItems="center">
                    <Text color="#59DBB7" w="92%" fontSize="2xl" fontWeight="bold">   Get Started</Text>
                    <Icon as={Entypo} size="lg" name="chevron-right" color="#59DBB7" />
                </HStack>
            </Button>
        </View>
    )
}