import React from "react";
import { TouchableOpacity, View, Text, Button, TextInput, StyleSheet, ImageBackground, Pressable } from "react-native";
import BackgroundImage from '../assets/BackgroundImage.png'
import Icon from '../assets/icon.svg'

export default class Start extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      name: '', 
      bgColor: this.colors.none
    };
  }

  bgColorSelect = (color) => {
    this.setState({ bgColor: color })
  };

  colors = {
    black: '#090C08',
    purple: '#474056',
    blue: '#8A95A5',
    green: '#B9C6AE',
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={BackgroundImage}
          resizeMode='cover'
          style={styles.bgImg}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Hello World</Text>
          </View>

          <View style={styles.interactContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.name}
                onChangeText={(name) => this.setState({name})}
                value={ this.state.name }
                placeholder='Your name'
              />
            </View>

            <View style={styles.colorContainer}>
              <Text style={styles.chooseBg}>Choose background color:</Text>
              <View style={styles.colorOptions}>
                <TouchableOpacity 
                  style={[{
                    backgroundColor: this.colors.black}, 
                    styles.colorCircles, 
                    this.state.bgColor === this.colors.black ? styles.selectedCircle : ''
                  ]}
                  onPress={() => this.bgColorSelect(this.colors.black)}
                ></TouchableOpacity>
                <TouchableOpacity 
                  style={[{
                    backgroundColor: this.colors.purple}, 
                    styles.colorCircles,
                    this.state.bgColor === this.colors.purple ? styles.selectedCircle : ''
                  ]}
                  onPress={() => this.bgColorSelect(this.colors.purple)}
                ></TouchableOpacity>
                <TouchableOpacity 
                  style={[{
                    backgroundColor: this.colors.blue}, 
                    styles.colorCircles,
                    this.state.bgColor === this.colors.blue ? styles.selectedCircle : ''
                  ]}
                  onPress={() => this.bgColorSelect(this.colors.blue)}
                ></TouchableOpacity>
                <TouchableOpacity 
                  style={[{backgroundColor: 
                    this.colors.green}, 
                    styles.colorCircles,
                    this.state.bgColor === this.colors.green ? styles.selectedCircle : ''
                  ]}
                  onPress={() => this.bgColorSelect(this.colors.green)}
                ></TouchableOpacity>
              </View>
            </View>
    
              <Pressable
                style={styles.button}
                onPress={() => this.props.navigation.navigate('Chat', { 
                  name: this.state.name, 
                  bgColor: this.state.bgColor 
                })}
              >
                <Text style={styles.buttonText}>Start Chatting</Text>
              </Pressable>

          </View>
          
          
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  bgImg: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },

  titleContainer: {
    height: '46%',
    width: '88%',
    alignItems: 'center',
    paddingTop: 100,
  },

  title: {
    fontSize: 45,
    fontWeight: '700',
    color: '#fff',
  },

  interactContainer: {
    backgroundColor: '#fff',
    width: '88%',
    height: '44%',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 2
  },

  inputContainer: {
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 2,
    height: 65,
    borderColor: '#757083',
    width: '88%',
    paddingLeft: 20,
  },

  name: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
    width: '88%',
  },

  colorContainer: {
    margin: 'auto',
    width: '88%',
  },

  chooseBg: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
    width: '88%',
    marginRight: 'auto'
  },

  colorOptions: {
    width: '88%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },

  colorCircles: {
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 10
  },

  selectedCircle: {
    borderWidth: 4,
    borderColor: '#757083',
    padding: 4
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '88%',
    backgroundColor: '#757083',
    height: 65,
    borderRadius: 2,
    elevation: 2
  },

  buttonText: {
    alignContent: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: '700'
  }

})