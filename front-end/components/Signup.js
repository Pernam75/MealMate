import React, {useContext, useState} from 'react';
import { Text, Box, Button, Center, Heading, VStack, FormControl, Input, Link, HStack, Pressable, useToast, Radio, Avatar, useColorMode } from 'native-base';
import axios from 'axios'
const Env = require('../Env/EvnVariables')

export default function Signin({navigation}) {
  const {
    colorMode,
    toggleColorMode
  } = useColorMode();

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [MyAvatar, setAvatar] = useState("https://cdn.discordapp.com/attachments/988354598915936256/992310672597725214/avatar-personnage-dessin-anime-chef-3d-isole-dans-rendu-3d_235528-1015.png");

  const toast = useToast();

  return <Center backgroundColor={colorMode === "dark" ? "black" : "coolGray.100"} h="100%" w="100%">
      <Box safeArea p="2" py="20" w="90%" maxW="290">
        <Heading size="3xl" fontWeight="600" color="coolGray.800" _dark={{
        color: "warmGray.50"
      }}>Meal Mate
        </Heading>
        <Heading mt="1" _dark={{
        color: "warmGray.200"
      }} color="coolGray.600" fontWeight="medium" size="xs">Sign up to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>First Name</FormControl.Label>
            <Input value={FirstName} onChangeText={text => setFirstName(text)} />
          </FormControl>
          <FormControl>
            <FormControl.Label>Last Name</FormControl.Label>
            <Input value={LastName} onChangeText={text => setLastName(text)} />
          </FormControl>
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input value={Email} onChangeText={text => setEmail(text)} />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input type="password" value={Password} onChangeText={text => setPassword(text)} />
          </FormControl>
          <FormControl>
            <FormControl.Label>Avatar</FormControl.Label>
            <Radio.Group name="myRadioGroup" accessibilityLabel="favorite number" value={MyAvatar} onChange={nextValue => { setAvatar(nextValue); }}>
              <HStack alignSelf="center" space="20%">
              <Radio value="https://cdn.discordapp.com/attachments/988354598915936256/992310672597725214/avatar-personnage-dessin-anime-chef-3d-isole-dans-rendu-3d_235528-1015.png" colorScheme="green" size="sm"  my={1}>
                <Avatar bg="green.500" alignSelf="center" size="lg" source={{ uri: "https://cdn.discordapp.com/attachments/988354598915936256/992310672597725214/avatar-personnage-dessin-anime-chef-3d-isole-dans-rendu-3d_235528-1015.png" }}></Avatar>
              </Radio>
              <Radio value="https://cdn.discordapp.com/attachments/988354598915936256/992310672060858429/3d-chef-cartoon-character-avatar-isolated-3d-rendering_235528-1014_1.png" colorScheme="green" size="sm"  my={1}>
                <Avatar bg="green.500" alignSelf="center" size="lg" source={{ uri: "https://cdn.discordapp.com/attachments/988354598915936256/992310672060858429/3d-chef-cartoon-character-avatar-isolated-3d-rendering_235528-1014_1.png" }}></Avatar>
              </Radio>
              </HStack>
            </Radio.Group>
          </FormControl>
          <Button  onPress={() => { 
              axios.post(`${Env.default.ip}/register`,{ Email, Password, FirstName, LastName, MyAvatar })
              .then(res =>{
                console.log(res.data)
                toast.closeAll()
                if(res.data.status == 'duplicate email') toast.show({render: () => {
                  return (
                    <Box borderLeftWidth="3" bg={colorMode === "dark" ? "amber.800" : "amber.100"} borderColor="amber.400" px="2" py="1" rounded="sm" mb={5}>
                      <Text fontWeight="bold">Invalid email address !</Text>
                      <Text>An account already exists with this email address</Text>
                    </Box>
                    )
                }})
                if(res.data.status == 'success') {
                  toast.show({render: () => {
                    return (
                      <Box borderLeftWidth="3" bg={colorMode === "dark" ? "green.800" : "green.100"} borderColor="green.400" px="2" py="1" rounded="sm" mb={5}>
                        <Text fontWeight="bold">Success !</Text>
                        <Text>Account successfully created you can now login</Text>
                      </Box>
                      )
                  }})
                  navigation.navigate('Signin')
                }
              })
              .catch(error => {
                console.log(error.message)
              })
              }}
              mt="5" colorScheme="lime"> Sign in
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200" }}> Already have an account.{" "} </Text>
            <Pressable onPress={() => navigation.navigate('Signin')}>
              <Text underline color="green.600"> Sign In </Text>
            </Pressable>
          </HStack>
        </VStack>
      </Box>
    </Center>;
  };