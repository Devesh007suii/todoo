import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/action';

const Login = ({ navigation }) => {

  const {error} = useSelector(state=>state.auth)

  const dispatch = useDispatch();

  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const loginHandler = async () => {
    await dispatch(login(email,password))
  }
  useEffect(()=>{
    if(error){
      alert(error)
      dispatch({type: "clearError"})
    }
  },[error, dispatch, alert])
  
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 20, margin: 20 }}>WELCOME</Text>
      <View style={{ width: "70%" }}>
        <TextInput
          style={styles.input}
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder='Password'
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Button
        disabled={!email || !password}
        style={styles.btn}
        onPress={loginHandler}
      >
        <Text style={{ color: "#fff" }}>Login</Text>
      </Button>
      <Text
        style={{
          marginTop: 20,
        }}
      >
        or
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={{ color: "#900", height: 30, margin: 20 }}>
          Sign Up
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ForgetPassword")}>
        <Text>
          Forget Password
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Login

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
