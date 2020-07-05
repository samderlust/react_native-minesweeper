import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  Dimensions,
  Button,
  StyleSheet,
  FlatList,
} from 'react-native';
import Cell from '../components/Cell';
import Popup from '../components/Popup';

const sWidth = Dimensions.get('window').width;
const sHeight = Dimensions.get('window').height;

const num = 9;

let clickedMap = {};
let mineMaps = {};
const Home = () => {
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(20);
  const [mines, setMines] = useState([]);
  const [grid, setGrid] = useState([]);
  const [flaggedCells, setFlaggedCells] = useState([]);
  const [isLost, setIsLost] = useState(false);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    makeMines();
  }, []);

  useEffect(() => {
    initGrid();
  }, [mines]);

  useEffect(() => {
    if (!!grid.length) checkIsWin();
  }, [grid]);

  const resetGame = () => {
    makeMines();
    setIsLost(false);
    setIsWon(false);
  };

  useEffect(() => {
    console.log(`grid updated`, new Date().getTime().toLocaleString());
  }, [grid]);

  const renderGrid = () => (
    <FlatList
      scrollEnabled={false}
      data={grid}
      // extraData={grid}
      numColumns={cols}
      keyExtractor={(item) => item.index}
      renderItem={({ item }) => (
        <Cell
          {...item}
          onZeroCellTapped={onZeroCellTapped}
          onCellClick={onCellClick}
          onCellFlag={onCellFlag}
          isFinish={isWon || isLost}
        />
      )}
    />
  );
  const renderGrid1 = () =>
    grid.map((e) => (
      <Cell
        {...e}
        key={e.index}
        onZeroCellTapped={onZeroCellTapped}
        onCellClick={onCellClick}
        onCellFlag={onCellFlag}
        isFinish={isWon || isLost}
      />
    ));

  const initGrid = () => {
    const nums = rows * cols;
    const newGrid = [];

    console.log(`min`, mineMaps);
    for (let i = 0; i < nums; i++) {
      newGrid.push({
        width: (sWidth - 40) / cols,
        index: i,
        isMined: mineMaps[i],
        isClicked: false,
        isFlagged: false,
      });
    }

    for (let e of newGrid) {
      e.adjacentMineCount = countAdjacentMines(e.index, newGrid);
    }

    setGrid(newGrid);
  };

  const makeMines = () => {
    clickedMap = {};
    mineMaps = {};
    const nums = rows * cols;
    let arr = [];
    while (arr.length < nums * 0.1) {
      let r = Math.floor(Math.random() * nums);
      mineMaps[r] = 1;
      if (arr.indexOf(r) === -1) arr.push(r);
    }

    setMines(arr);
  };

  const checkIsWin = () => {
    const clickedCells = grid.filter((e) => e.isClicked);
    if (clickedCells.length === grid.length - mines.length) {
      let isWin = !clickedCells.some((e) => e.isMined);
      if (isWin) {
        setIsWon(true);
      }
    }
  };

  const onCellClick = (index) => {
    console.log(`cell clicked`, new Date().getTime().toLocaleString());
    if (grid[index].isMined) {
      const list = grid.map((e) => {
        if (e.isMined) e.isClicked = true;
        return e;
      });
      setGrid(list);
      setIsLost(true);
    } else {
      // const list = grid.map((e) => {
      //   if (e.index === index) e.isClicked = true;
      //   return e;
      // });
      const list = [...grid];
      list[index].isClicked = true;
      setGrid(list);
    }
  };

  const onCellFlag = (index) => {
    const list = [...grid];
    list[index].isFlagged = !list[index].isFlagged;
    setGrid(list);
  };

  const countAdjacentMines = (selfIndex, theGrid) => {
    if (theGrid[selfIndex].isMined) return -1;

    let count = 0;
    floodFill(selfIndex, theGrid, (curCell) => {
      if (curCell.isMined) count++;
    });
    return count;
  };

  const onZeroCellTapped = (selfIndex) => {
    console.log(`cell clicked`, new Date().getTime().toLocaleString());

    const newGrid = [...grid];
    zeroExpand(selfIndex, newGrid);
    setGrid(newGrid);
  };

  const zeroExpand = (selfIndex, theGrid) => {
    if (clickedMap[selfIndex]) return;
    if (theGrid[selfIndex].isMined) return;
    clickedMap[selfIndex] = 1;
    floodFill(selfIndex, theGrid, (curCell) => {
      if (!curCell.isClicked) {
        curCell.isClicked = true;
        if (curCell.adjacentMineCount === 0) {
          zeroExpand(curCell.index, theGrid);
        }
      }
    });
  };

  const floodFill = (selfIndex, theGrid, callback) => {
    const preRowIndex = selfIndex - cols;
    const nextRowIndex = selfIndex + cols;
    const preRowFirstIndex = Math.floor(preRowIndex / cols) * cols;
    const currentRowFirstIndex = Math.floor(selfIndex / cols) * cols;
    const nextRowFirstIndex = Math.floor(nextRowIndex / cols) * cols;
    for (let i = -1; i < 2; i++) {
      const curPreRowIndex = preRowIndex + i;
      const curSelfIndex = selfIndex + i;
      const curNextRowIndex = nextRowIndex + i;
      if (
        curPreRowIndex >= preRowFirstIndex &&
        curPreRowIndex < preRowFirstIndex + cols &&
        theGrid[curPreRowIndex]
      ) {
        callback(theGrid[curPreRowIndex]);
      }
      if (
        curSelfIndex >= currentRowFirstIndex &&
        curSelfIndex < currentRowFirstIndex + cols &&
        theGrid[curSelfIndex]
      ) {
        callback(theGrid[curSelfIndex]);
      }
      if (
        curNextRowIndex >= nextRowFirstIndex &&
        curNextRowIndex < nextRowFirstIndex + cols &&
        theGrid[curNextRowIndex]
      ) {
        callback(theGrid[curNextRowIndex]);
      }
    }
  };

  return (
    <View style={styles.container(isWon, isLost)}>
      <SafeAreaView>
        <View style={styles.grid}>{renderGrid()}</View>
      </SafeAreaView>
      <Popup isLost={isLost} isWon={isWon} resetGame={resetGame} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: (isWon, isLost) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isWon ? '#9effdf' : isLost ? '#ffa6ac' : '#f5f2f3',
  }),
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    // flex: 1,
    backgroundColor: '#162b2b2b',
  },
});

export default Home;
