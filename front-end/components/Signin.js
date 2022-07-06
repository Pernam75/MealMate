import React, {useContext, useState} from 'react';
import { Text, Box, Button, Center, Heading, VStack, FormControl, Input, Link, HStack, Pressable, useToast, useColorMode } from 'native-base';
import { AuthContext } from '../Contexts/AuthContext';
import axios from 'axios'
const Env = require('../Env/EvnVariables')

export default function Signin({navigation}) {
  const {
    colorMode,
    toggleColorMode
  } = useColorMode();

  const {login} = useContext(AuthContext)
  
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const toast = useToast();

  return (
    <Center backgroundColor={colorMode === "dark" ? "black" : "coolGray.100"} h="100%" w="100%">
        <Box safeArea p="2" py="20" w="90%" maxW="290">
          <Heading size="3xl" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50" }}>Meal Mate </Heading>
          <Heading mt="1" _dark={{ color: "warmGray.200" }} color="coolGray.600" fontWeight="medium" size="xs">Sign in to continue! </Heading>

          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>Email ID</FormControl.Label>
              <Input value={Email} onChangeText={text => setEmail(text)} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              <Input type="password" value={Password} onChangeText={text => setPassword(text)} />
              <Link _text={{ fontSize: "xs", fontWeight: "500", color: "#59DBB7" }} alignSelf="flex-end" mt="1"> Forget Password? </Link>
            </FormControl>
            <Button onPress={() => { 
              axios.post(`${Env.default.ip}/login`,{ Email, Password })
              .then(res =>{
                console.log(res.data)
                toast.closeAll()
                if(res.data.status == 'invalid email') toast.show({render: () => {
                  return (
                    <Box borderLeftWidth="3" bg={colorMode === "dark" ? "amber.800" : "amber.100"} borderColor="amber.400" px="2" py="1" rounded="sm" mb={5}>
                      <Text fontWeight="bold">Error occured</Text>
                      <Text>Invalid email address</Text>
                    </Box>
                    )
                }})
                if(res.data.status == 'wrong password') toast.show({render: () => {
                  return (
                    <Box borderLeftWidth="3" bg={colorMode === "dark" ? "red.800" : "red.100"} borderColor="red.400" px="2" py="1" rounded="sm" mb={5}>
                      <Text fontWeight="bold">Error occured</Text>
                      <Text>Wrong password</Text>
                    </Box>
                    )
                }})
                if(res.data.status == 'success') {
                  toast.show({render: () => {
                    return (
                      <Box borderLeftWidth="3" bg={colorMode === "dark" ? "green.800" : "green.100"} borderColor="green.400" px="2" py="1" rounded="sm" mb={5}>
                        <Text fontWeight="bold">Success</Text>
                        <Text>Successfuly Logged In</Text>
                      </Box>
                      )
                  }})
                  login(res.data.info[0],res.data.likes)
                }
              })
              .catch(error => {
                console.log(error.message)
              })
              }}
              mt="2" backgroundColor="#59DBB7"> Sign in </Button>
            <HStack mt="6" justifyContent="center">
              <Text fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200" }}> I'm a new user.{" "}
              </Text>
              <Pressable onPress={() => navigation.navigate('Signup')}>
                <Text underline color="#59DBB7"> Sign Up </Text>
              </Pressable>
            </HStack>
          </VStack>
        </Box>
      </Center>
    )
  }