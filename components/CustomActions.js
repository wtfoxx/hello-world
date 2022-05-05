import React from "react";
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity, Text } from "react-native-web";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

export default class CustomActions extends React.Component {
  //access device's gallery
  pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    try {
      if (status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => {
          console.error(error);
        });
      if (!result.cancelled) {
        const imageUrl = await this.uploadImage(result.uri);
        this.props.onSend({ image: imageUrl });
      }
      }
    } catch (error) {
      console.error(error);
    }
  };

  //use device's camera to take a photo
  takePhoto = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
    try {
      if (status === 'granted') {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
        }).catch((error) => {
          console.error(error);
        });
      if (!result.cancelled) {
        const imageUrl = await this.uploadImage(result.uri);
        this.props.onSend({ image: imageUrl });
      }
      }
    } catch (error) {
      console.error(error);
    }
  };

  //access device's location
  getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    try {
      if (status === 'granted') {
        let result = await Location.getCurrentPositionAsync({})
          .catch((error) => {
            console.error(error);
          });
      if (result) {
        console.log(result);
        this.props.onSend({
          location: {
            longitude: result.coords.longitude,
            latitude: result.coords.latitude,
          },
        });
      }
      }
    } catch (error) {
      console.error(error);
    }
  };

  //upload image to firebase firestore
  uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    const ref = firebase.storage().ref().child(`images/${imageName}`);

    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  onActionpress = () => {
    const options = [
      'Choose from library',
      'Take picture',
      'Send location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return this.pickImage();
          case 1:
            console.log('user wants to take a photo');
            return this.takePhoto();
          case 2:
            console.log('user wants to get their location');
            return this.getLocation();
        }
      }
    );
  };

  render() {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel='Share options'
        accessibilityHint='Choose to send an image, take a picture or share location'
        style={styles.container}
        onPress={this.onActionpress}
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },

  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },

  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};