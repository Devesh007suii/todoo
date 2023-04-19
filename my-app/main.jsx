import React, { useEffect } from 'react'
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Home from './screens/Home'
import Login from './screens/Login'
import Footer from './components/Footer'
import Profile from "./screens/Profile"
import Register from "./screens/Register"
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from './redux/action'
import Loader from './components/Loader';
import ChangePassword from './screens/ChangePassword'
import Verify from './screens/Verify'

import ResetPassword from './components/ResetPassword'
import ForgetPassword from './screens/ForgetPassword'




const Stack = createNativeStackNavigator();




const main = () => {

  const dispatch = useDispatch()


  useEffect(()=>{

    dispatch(loadUser())
  
  },[dispatch])
  const { isAuthenticated, loading } = useSelector(state => state.auth)
  return (
    loading ? <Loader/> : <NavigationContainer>
        <Stack.Navigator initialRouteName = {isAuthenticated? "Home" : "Login"}>

          <Stack.Screen name = "Home" component={Home} options={{headerShown: false}}/>
          {/* headerShown: false we dont want header */}
          <Stack.Screen name = "Login" component={Login} options={{headerShown: false}}/>
          <Stack.Screen name = "Profile" component={Profile} options={{headerShown: false}}/>
          
          <Stack.Screen name = "Register" component={Register} options={{headerShown: false}}/>
          <Stack.Screen name = "changepassword" component={ChangePassword} options={{headerShown: false}}/>
          <Stack.Screen name = "verify" component={Verify} options={{headerShown: false}}/>
          <Stack.Screen name = "ForgetPassword" component={ForgetPassword} options={{headerShown: false}}/>
          <Stack.Screen name = "resetpassword" component={ResetPassword} options={{headerShown: false}}/>
        </Stack.Navigator>
        {isAuthenticated && <Footer/>}
    </NavigationContainer>
  )
}

export default main