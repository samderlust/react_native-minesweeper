import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Dimensions,
  Animated,
  Button,
  StyleSheet,
} from 'react-native';

const sWidth = Dimensions.get('window').width;
const sHeight = Dimensions.get('window').height;

const Popup = ({ isLost, isWon, resetGame }) => {
  const moveAnim = useRef(new Animated.Value(sHeight)).current;
  const pulseAmin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLost || isWon) moveUp();
  }, [isLost, isWon]);

  const moveUp = () =>
    Animated.timing(moveAnim, {
      toValue: 9,
      duration: 1000,
      useNativeDriver: true,
    }).start(onPulse);

  const moveDown = () =>
    Animated.timing(moveAnim, {
      toValue: sHeight / 2 + 200,
      duration: 500,
      useNativeDriver: true,
    }).start((finish) => {
      resetGame();
      pulseAmin.setValue(0);
    });

  const onPulse = () =>
    Animated.timing(pulseAmin, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

  const scale = pulseAmin.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.4, 1],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: moveAnim }, { scale }] },
      ]}
    >
      <Text style={styles.text}>
        {isLost ? 'You Lose' : isWon ? 'You Win' : ''}
      </Text>
      <Button title="Retry" onPress={moveDown} style={styles.button} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    position: 'absolute',
    backgroundColor: '#d1cec7',
    width: sWidth * 0.7,
    height: 200,
    alignSelf: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  button: {
    color: '#841584',
  },
});

export default Popup;
