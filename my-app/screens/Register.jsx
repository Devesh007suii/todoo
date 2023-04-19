import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Avatar, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'; // Import expo-image-picker
import { picGallery } from '../components/picGallery';
import { useDispatch } from 'react-redux';
import { loadUser, register } from '../redux/action';
import mime from 'mime';

const Register = ({ navigation }) => {
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const registerHandler = () => {
    const myForm = new FormData()
    myForm.append('name', name);
    myForm.append('email', email);
    myForm.append('password', password);
    myForm.append('avatar', {
      uri: avatar,
      type: mime.getType(avatar),
      name: avatar.split('/').pop(),
    });
    dispatch(register(myForm));
    dispatch(loadUser())
  };

  

  const pickDocument = async () => {
    const result = await picGallery();
    if (result) {
      setAvatar(result);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Avatar.Image
        size={100}
        source={{ uri: avatar ? avatar : null }}
        style={{ backgroundColor: '#900' }}
      />
      <Button onPress={pickDocument}>Select Avatar</Button>

      <View style={{ width: '70%' }}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Button
        disabled={!email || !password || !name}
        style={styles.btn}
        onPress={registerHandler}
      >
        <Text style={{ color: '#fff' }}>Register</Text>
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text
          style={{
            color: '#900',
            height: 30,
            margin: 20,
          }}
        >
          Have an Account, Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;

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
    backgroundColor: '#900',
    padding: 5,
    width: '70%',
  },
});
