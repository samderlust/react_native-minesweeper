import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const Cell = ({
  width,
  index,
  isMined,
  adjacentMineCount,
  isClicked,
  onCellClick,
  isFlagged,
  onCellFlag,
  onZeroCellTapped,
  isFinish,
}) => {
  // const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    // console.log(`rerender cell ${index}`);
  }, []);
  const renderMines = () =>
    isMined && (
      <FontAwesome5
        color={isFlagged ? 'black' : 'red'}
        name="bomb"
        size={width * 0.6}
        style={{
          alignSelf: 'center',
        }}
      />
    );

  const renderNumber = () =>
    !isMined && (
      <Text style={styles.text(isClicked, width)}>{adjacentMineCount}</Text>
    );

  return (
    <TouchableOpacity
      onPress={() => {
        if (!isFlagged) {
          if (adjacentMineCount === 0) {
            onZeroCellTapped(index);
          } else {
            onCellClick(index);
          }
        }
      }}
      onLongPress={() => onCellFlag(index)}
      // activeOpacity={isFlagged ? 1 : 0.1}
      delayLongPress={200}
      disabled={isFinish}
      style={styles.cell(width, isClicked, isFlagged)}
    >
      {/* {(isClicked || isFinish) && renderMines()}
      {isClicked && renderNumber()} */}
      {renderMines()}
      {renderNumber()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: (width, isClicked, isFlagged) => ({
    width,
    height: width,
    backgroundColor: isClicked ? 'white' : isFlagged ? '#4ef284' : '#6d706e',
    borderWidth: 1,
    borderColor: '#858585',
    justifyContent: 'center',
    margin: 1,
  }),
  text: (isClicked, width) => ({
    color: isClicked ? 'black' : 'white',
    fontSize: width * 0.6,
    alignSelf: 'center',
    fontWeight: 'bold',
  }),
});

export default Cell;
