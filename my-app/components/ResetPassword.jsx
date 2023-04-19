import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, TextInput } from 'react-native-paper'
import { resetPassword } from '../redux/action';
import { useDispatch, useSelector } from 'react-redux';

const ResetPassword =  ({navigation}) => {

  const {message, error} = useSelector(state => state.message)
    const [otp,setOtp] = useState();
    const [newPassword,setNewPAssword] = useState();
    const dispatch = useDispatch();
    const changePasswordHandler = async ()=>{
      await dispatch(resetPassword(otp,newPassword))
      navigation.navigate("login")
    }
    useEffect(()=>{
      if(message){
        alert(message);
        dispatch({type: "clearMessage"})
      }
      if(error){
        alert(error);
        dispatch({type: "clearError"})
      }},[alert, message, dispatch, error]
    )
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 20, margin: 20 }}>CHANGE PASSWORD</Text>
      <View style={{ width: "70%" }}>

        <TextInput
          style={styles.input}
          placeholder='OTP'
          value={otp}
          onChangeText={setOtp}
          keyboardType='number-pad'
        />

        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder='Password'
          value={newPassword}
          onChangeText={setNewPAssword}
        />
       
      </View>
      <Button
        style={styles.btn}
        onPress={changePasswordHandler}
        textColor='#fff'
      >
        Reset Password
      </Button>
    </View>
  )
}

export default ResetPassword

const styles = StyleSheet.create({
    input: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#b5b5b5',
      padding: 10,
      paddingLeft: 15,
      borderRadius: 5,
      marginVertical: 15,
      fontSize: 15,
    },
    btn: {
      backgroundColor: "#900",
      padding: 5,
      width: "70%"
    }
  });