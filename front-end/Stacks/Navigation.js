import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { AuthContext } from '../Contexts/AuthContext';
import { View, Spinner } from 'native-base';

export default function AppNav() {
    const {isLoading, userToken} = useContext(AuthContext)

    if(isLoading) {
        return(
            <View flex="1" justifyContent="center">
                <Spinner color="emerald.500" size="lg" />
            </View>
        )
    }

    return(
        <NavigationContainer>
            {userToken !== null ? <AppStack/> : <AuthStack/> }
        </NavigationContainer>
    )
}