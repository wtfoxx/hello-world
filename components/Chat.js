import React from "react";
import { View, Text, Platform, KeyboardAvoidingView } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth'


export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
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
          avatar: data.user.avatar,
        },
      });
    });

    this.setState({
      messages: messages,
    });
  };

  addMessage() {
    const messages = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: messages._id,
      text: messages.text,
      createdAt: messages.createdAt,
      user: this.state.user,
    });
  }

  //Function to dictate the functionality of sending messages
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
      this.addMessage();
    }
    );
  }

  //Creates a preloaded message to be displayed. 
  //Then it adds a system message telling the username you entered has entered the chat
  componentDidMount() {
    let name = this.props.route.params.name;

    this.referenceChatMessages = firebase
    .firestore()
    .collection('messages');

    this.authUnsubscribe = firebase
    .auth()
    .onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }

      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: 'https://placeimg.com/140/140/any',
        },
      });

      
    this.unsubscribe = this.referenceChatMessages
    .orderBy('createdAt', 'desc')
    .onSnapshot(this.onCollectionUpdate);

    })
  };

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  };
  
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
  }

  render() {

    let name = this.props.route.params.name;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{flex:1}}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          user={{
            _id: this.state.user._id,
            name: this.state.name,
            avatar: this.state.avatar
          }}
          onSend={(messages) => this.onSend(messages)}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    )
  }
}