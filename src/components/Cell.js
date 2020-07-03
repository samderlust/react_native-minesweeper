import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

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
}) => {
  // const [isClicked, setIsClicked] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => {
        !isFlagged && onCellClick(index);
        adjacentMineCount === 0 && onZeroCellTapped(index);
      }}
      onLongPress={() => onCellFlag(index)}
      // activeOpacity={isFlagged ? 1 : 0.2}
      delayLongPress={200}
      style={{
        width,
        height: width,
        backgroundColor: isClicked
          ? 'white'
          : isFlagged
          ? 'green'
          : isMined
          ? 'red'
          : 'grey',
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: isClicked ? 'black' : 'white',
          fontSize: 20,
          alignSelf: 'center',
          fontWeight: 'bold',
        }}
      >
        {adjacentMineCount}
      </Text>
      {/* <Text>{index}</Text> */}
    </TouchableOpacity>
  );
};

export default Cell;
