import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {createContext, useState, useEffect} from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [userToken, setUserToken] = useState(null)
    const [userInfo, setUserInfo] = useState(null)

    function login(info) {
        setIsLoading(true)

        setUserToken(info.id_user)
        AsyncStorage.setItem('userToken', info.id_user.toString())
        setUserInfo(info)
        AsyncStorage.setItem('userInfo', JSON.stringify(info))

        setIsLoading(false)
    }

    function logout() {
        setIsLoading(true)
        
        setUserToken(null)
        AsyncStorage.removeItem('userToken')
        setUserInfo(null)
        AsyncStorage.removeItem('userInfo')

        setIsLoading(false)
    }

    async function isLoggedIn() {
        try {
            setIsLoading(true)

            let userToken = await AsyncStorage.getItem('userToken')
            let userInfo = await AsyncStorage.getItem('userInfo')
            userInfo = JSON.parse(userInfo)
            if (userInfo) {
                setUserToken(userToken)
                setUserInfo(userInfo)
            }

            setIsLoading(false)
        } catch (e) {
            console.log(e.message)
        }
    }

    useEffect(() => {
        isLoggedIn()
    }, [])
    
    return(
        <AuthContext.Provider value={{login, logout, isLoading, userToken, userInfo}}>
            {children}
        </AuthContext.Provider>
    )
}