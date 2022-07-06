import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {createContext, useState, useEffect} from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [userToken, setUserToken] = useState(null)
    const [userInfo, setUserInfo] = useState(null)
    const [userLikes, setUserLikes] = useState(null)

    function login(info, likes) {
        setIsLoading(true)

        console.log('test',likes)
        console.log('test',info)
        setUserToken(info.id_user)
        AsyncStorage.setItem('userToken', info.id_user.toString())
        setUserInfo(info)
        AsyncStorage.setItem('userInfo', JSON.stringify(info))
        setUserLikes(likes)
        AsyncStorage.setItem('userLikes', JSON.stringify(likes))

        setIsLoading(false)
    }

    function logout() {
        setIsLoading(true)
        
        setUserToken(null)
        AsyncStorage.removeItem('userToken')
        setUserInfo(null)
        AsyncStorage.removeItem('userInfo')
        setUserLikes(null)
        AsyncStorage.removeItem('userLikes')

        setIsLoading(false)
    }

    async function isLoggedIn() {
        try {
            setIsLoading(true)

            let userToken = await AsyncStorage.getItem('userToken')
            let userInfo = await AsyncStorage.getItem('userInfo')
            let userLikes = await AsyncStorage.getItem('userLikes')
            userInfo = JSON.parse(userInfo)
            if (userInfo) {
                setUserToken(userToken)
                setUserInfo(userInfo)
                setUserLikes(JSON.parse(userLikes))
            }

            setIsLoading(false)
        } catch (e) {
            console.log(e.message)
        }
    }

    function updateLikes(arr){
        setUserLikes(arr)
        AsyncStorage.setItem('userLikes', JSON.stringify(arr))
        
    }

    useEffect(() => {
        isLoggedIn()
    }, [])
    
    return(
        <AuthContext.Provider value={{login, logout, isLoading, userToken, userInfo, userLikes, updateLikes}}>
            {children}
        </AuthContext.Provider>
    )
}