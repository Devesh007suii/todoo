import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
//Platform,StatusBar to know the padding for different mobiles we use these both
//SafeAreaView is only used for ios
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Task from '../components/Task';
import Icon from 'react-native-vector-icons/Entypo';
import { Dialog, Button, TextInput } from 'react-native-paper';
import {useDispatch, useSelector} from "react-redux"
import { addTask, loadUser } from '../redux/action';

const Home = () => {

  const {user} = useSelector(state=>state.auth)

  const dispatch = useDispatch();

  const{loading, message, error} = useSelector(state=>state.message)
  
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDiscription] = useState('');

  const hideDialog = () => {
    setOpenDialog(!openDialog);
  };

  const addTaskHandler = () => {
    dispatch(addTask(title, description))
    dispatch(loadUser())
  };

  useEffect(()=>{
    if(error){
      alert(error)
      dispatch({type: "clearError"});
    }
    if(message){
      alert(message)
      dispatch({type: "clearMessage"});
    }
  },[alert, error, message, dispatch])
  return (
    <>
      <View
        style={{
          backgroundColor: '#fff',
          flex: 1,
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        }}
      >
        {/* paddingTop: Platform.OS ==="android" ? StatusBar.currentHeight : 0    this means that
      if its ios the it will do no padding otherwise it will do padding according tp the 
      status bar */}
        <ScrollView>
          <SafeAreaView>
            <Text style={styles.heading}>All Tasks</Text>
            {user && user.tasks.map((item) => (
              <Task
                key={item._id}
                title={item.title}
                description={item.description}
                status={item.completed}
                taskId={item._id}
              />
            ))}

            <TouchableOpacity style={styles.addbtn} onPress={hideDialog}>
              <Icon name="add-to-list" size={20} color="#900" />
            </TouchableOpacity>
          </SafeAreaView>
        </ScrollView>
      </View>
      <Dialog visible={openDialog} onDismiss={hideDialog}>
        {/* onDismiss={hideDialog} by clicking on out of the box or view */}
        <Dialog.Title>ADD A TASK</Dialog.Title>
        <Dialog.Content>
          <TextInput
            onChangeText={setTitle}
            style={styles.input}
            placeholder="Title"
          />
          <TextInput
            onChangeText={setDiscription}
            style={styles.input}
            placeholder="Description"
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={hideDialog}>
              <Text>CANCEL</Text>
            </TouchableOpacity>
            <Button 
              onPress={addTaskHandler} 
              color="#900" 
              disabled={!title || !description || loading}>
              ADD
            </Button>
          </View>
        </Dialog.Content>
      </Dialog>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 20,
    color: '#fff',
    backgroundColor: '#474747',
  },

  addbtn: {
    backgroundColor: '#fff',
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 20,
    elevation: 5,
  },
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
});
