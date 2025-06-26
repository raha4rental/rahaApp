import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  StatusBar
} from 'react-native';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');

const WelcomeVideoScreen = ({ navigation }) => {
  const video = useRef(null);
  const [status, setStatus] = useState({});

  const handleVideoEnd = () => {
    // Auto navigate to main screen after video ends
    setTimeout(() => {
      if (navigation) {
        navigation.navigate('home');
      }
    }, 500);
  };

  const skipVideo = () => {
    if (navigation) {
      navigation.navigate('home');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Video Player */}
      <Video
        ref={video}
        style={styles.video}
        source={require('../../assets/welcome.mp4')}
        useNativeControls={false}
        resizeMode="cover"
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={(status) => {
          setStatus(() => status);
          if (status.didJustFinish) {
            handleVideoEnd();
          }
        }}
      />

      {/* Skip Button Overlay */}
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.skipButton} onPress={skipVideo}>
          <Text style={styles.skipButtonText}>تخطي | Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: width,
    height: height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  skipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default WelcomeVideoScreen;
