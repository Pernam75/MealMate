import { Button, HStack, Icon, Text, View, AspectRatio, Image } from 'native-base'
import React from 'react'
import {Entypo} from "@expo/vector-icons";

export default function Borading1({navigation}) {
    return(
        <View backgroundColor="white" w="100%" h="100%" alignItems="center">
            <Button borderRadius="10" background="#59DBB7" ml="4" alignSelf="flex-start" mt="10%" onPress={() => navigation.navigate('Boarding1')}><Icon as={Entypo} size="lg" name="chevron-left" color="white" /></Button>
            <AspectRatio w="90%" ratio={1/1} mb="10%" mt="30%">
            <Image size="100%" borderRadius="10" source={require('../src/images/undraw_searching_re_3ra9.png')} alt="image" />
            
            </AspectRatio>
            <Text fontSize="3xl" fontWeight="bold" mb="40%" color="#59DBB7">Choose a Recipe</Text>
            <HStack space="65%">
                <Button borderRadius="10" background="#59DBB7" onPress={() => navigation.navigate('Signin')}><Text color="white" fontWeight="bold" >Skip</Text></Button>
                <Button borderRadius="10" background="#59DBB7" onPress={() => navigation.navigate('Boarding3')}><Icon as={Entypo} size="lg" name="chevron-right" color="white"/></Button>
            </HStack>
        </View>
    )
}