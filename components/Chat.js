import React from "react";
import { View, Text, Platform, KeyboardAvoidingView, Button } from "react-native";
import { Bubble, GiftedChat, InputToolbar, SystemMessage } from "react-native-gifted-chat";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";


export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
      },
      isConnected: false,
      image: null,
      location: null,
    };

    const firebaseConfig = {
      apiKey: "AIzaSyDnBNRcRCy5R5-SF4i4Mipt95xHTQYW-Nk",
      authDomain: "hello-world-cd9d5.firebaseapp.com",
      projectId: "hello-world-cd9d5",
      storageBucket: "hello-world-cd9d5.appspot.com",
      messagingSenderId: "1049068827554",
    };

    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    };

    this.referenceChatMessages = firebase
    .firestore()
    .collection('messages');

    this.referenceUser = null;
  };

  //get messages from storage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  //saves messages in storage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  };

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    //go through each doc
    querySnapshot.forEach((doc) => {
      //get query's data 
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });

    this.setState({
      messages: messages,
    });

    this.saveMessages();
  };

  addMessage() {
    const messages = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: messages._id,
      text: messages.text,
      createdAt: messages.createdAt,
      user: this.state.user,
      image: messages.image,
      location: messages.location,
    });
  };

  //Function to dictate the functionality of sending messages
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
      this.addMessage();
      this.saveMessages();
    }
    );
  };

  //Creates a preloaded message to be displayed. 
  //Then it adds a system message telling the username you entered has entered the chat
  componentDidMount() {
    let name = this.props.route.params.name;

    //check users connection
    NetInfo.fetch().then(connection => {
      //if online
      if (connection.isConnected) {

        this.setState({ isConnected: true });

        console.log('online');
        
        //listening to authentication
        this.authUnsubscribe = firebase
        .auth()
        .onAuthStateChanged(async (user) => {
          if (!user) {
            return await firebase.auth().signInAnonymously();
          }

          this.setState({
            uid: user.uid,
            messages: [],
            user: {
              _id: user.uid,
              name: name,
            },
          });

          //listens for updates
          this.unsubscribe = this.referenceChatMessages
          .orderBy('createdAt', 'desc')
          .onSnapshot(this.onCollectionUpdate);

          this.referenceUser = firebase
          .firestore()
          .collection('messages')
          .where('uid', '==', this.state.uid);

        })

        this.saveMessages();
        
        
      } else {
        console.log('offline');
        this.setState({ isConnected: false });
        this.getMessages();
        
      }
    });
  };

  componentWillUnmount() {
    NetInfo.fetch().then((connection) => {
      if(connection.isConnected) {
        //stop authentication
        this.authUnsubscribe();
        //stop changes
        this.unsubscribe();
      }
    })
  };

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }
  
  //Picks up the color you chose at the starting screen and applies it to your bubble
  //Changes left side bubble to be more readable in a light grey background
  renderBubble(props) {
    let bgColor = this.props.route.params.bgColor;

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: `${bgColor}`
          },
          left: {
            backgroundColor: 'white'
          }
        }}
      />
    )
  };

  renderCustomActions(props) {
    return <CustomActions {...props} />;
  }

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <View style={{ borderRadius: 13, overflow: 'hidden', margin: 3 }}>
          <MapView
            style={{ width: 150, height: 100 }}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          />
        </View>
      );
    }
    return null;
  }


  render() {

    let name = this.props.route.params.name;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{flex:1}}>
        <GiftedChat
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          renderUsernameOnMessage={true}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          user={{
            _id: this.state.user._id,
            name: this.state.name,
          }}
          onSend={(messages) => this.onSend(messages)}
          placeholder='Type a message'
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    )
  }
}