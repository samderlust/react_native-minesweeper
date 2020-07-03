import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, Platform, Dimensions } from 'react-native';
import Cell from '../components/Cell';

const sWidth = Dimensions.get('window').width;
const sHeight = Dimensions.get('window').height;

const num = 9;

const Home = () => {
  const [rows, setRows] = useState(9);
  const [cols, setCols] = useState(9);
  const [mines, setMines] = useState([]);
  const [grid, setGrid] = useState([]);
  const [clickedCells, setClickedCells] = useState([]);
  const [flaggedCells, setFlaggedCells] = useState([]);

  const minesRef = useRef(mines);
  const cellRef = useRef(null);

  useEffect(() => {
    console.log(`makemines`);
  }, []);

  useEffect(() => {
    // minesRef.current = mines;
    initGrid();
  }, [mines]);

  useEffect(() => {
    makeMines();

    console.log(`init`);
    initGrid();
  }, []);

  const renderGrid = () =>
    grid.map((e) => (
      <Cell
        {...e}
        key={e.index}
        // ref={cellRef}
        // adjacentMineCount={e.adjacentMineCount}
        // adjacentMineCount={countAdjacentMines(e.index)}
        onZeroCellTapped={onZeroCellTapped}
        onCellClick={onCellClick}
        // isClicked={clickedCells.includes(e.index)}
        // isFlagged={flaggedCells.includes(e.index)}
        onCellFlag={onCellFlag}
      />
    ));

  const initGrid = () => {
    const nums = rows * cols;
    const newGrid = [];

    for (let i = 0; i < nums; i++) {
      // const isMined = minesRef.current.includes(i);
      newGrid.push({
        width: sWidth / rows,
        index: i,
        isMined: mines.includes(i),
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
    const nums = rows * cols;

    var arr = [];
    while (arr.length < 14) {
      var r = Math.floor(Math.random() * nums);
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    setMines(arr);
  };

  const onCellClick = (index) => {
    const list = grid.map((e) => {
      if (e.index === index) e.isClicked = true;
      return e;
    });
    setGrid(list);
    // if (clickedCells.indexOf(index) === -1)
    //   setClickedCells([...clickedCells, index]);
  };

  const onCellFlag = (index) => {
    const list = grid.map((e) => {
      if (e.index === index) e.isFlagged = !e.isFlagged;
      return e;
    });
    setGrid(list);
    // if (!flaggedCells.includes(index))
    //   setFlaggedCells([...flaggedCells, index]);
    // else {
    //   setFlaggedCells(flaggedCells.filter((e) => e !== index));
    // }
  };

  const countAdjacentMines = (selfIndex, theGrid) => {
    if (theGrid[selfIndex].isMined) return -1;
    const nums = rows * cols;

    let count = 0;
    const preRowIndex = selfIndex - cols;
    const nextRowIndex = selfIndex + cols;
    const preRowFirstIndex = Math.floor(preRowIndex / cols) * cols;
    const currentRowFirstIndex = Math.floor(selfIndex / cols) * cols;
    const nextRowFirstIndex = Math.floor(nextRowIndex / cols) * cols;
    // console.log(selfIndex);

    for (let i = -1; i < 2; i++) {
      if (
        preRowIndex + i >= preRowFirstIndex &&
        preRowIndex + i < preRowFirstIndex + cols
      ) {
        if (theGrid[preRowIndex + i] && theGrid[preRowIndex + i].isMined)
          count++;
      }
      if (
        selfIndex + i >= currentRowFirstIndex &&
        selfIndex + i < currentRowFirstIndex + cols
      ) {
        if (theGrid[selfIndex + i] && theGrid[selfIndex + i].isMined) count++;
      }
      if (
        nextRowIndex + i >= nextRowFirstIndex &&
        nextRowIndex + i < nextRowFirstIndex + cols
      ) {
        if (theGrid[nextRowIndex + i] && theGrid[nextRowIndex + i].isMined)
          count++;
      }
    }
    return count;
  };

  const onZeroCellTapped = (selfIndex) => {
    // if (!grid[selfIndex]) return;
    if (grid[selfIndex].isMined) return;
    if (grid[selfIndex].adjacentMineCount !== 0) return;

    const nums = rows * cols;

    let count = 0;
    const preRowIndex = selfIndex - cols;
    const nextRowIndex = selfIndex + cols;
    const preRowFirstIndex = Math.floor(preRowIndex / cols) * cols;
    const currentRowFirstIndex = Math.floor(selfIndex / cols) * cols;
    const nextRowFirstIndex = Math.floor(nextRowIndex / cols) * cols;
    // console.log(selfIndex);

    const clickedArr = [];

    for (let i = -1; i < 2; i++) {
      if (
        preRowIndex + i >= preRowFirstIndex &&
        preRowIndex + i < preRowFirstIndex + cols
      ) {
        if (
          grid[preRowIndex + i] &&
          !grid[preRowIndex + i].isMined &&
          !grid[preRowIndex + i].isClicked
        ) {
          grid[preRowIndex + i].isClicked = true;
          // clickedArr.push(preRowIndex + i);
          if (grid[preRowIndex + i].adjacentMineCount === 0)
            onZeroCellTapped(preRowIndex + i);
        }
      }
      if (
        selfIndex + i >= currentRowFirstIndex &&
        selfIndex + i < currentRowFirstIndex + cols
      ) {
        if (
          grid[selfIndex + i] &&
          !grid[selfIndex + i].isMined &&
          !grid[selfIndex + i].isClicked
        ) {
          grid[selfIndex + i].isClicked = true;

          // clickedArr.push(selfIndex + i);
          if (grid[selfIndex + i].adjacentMineCount === 0)
            onZeroCellTapped(selfIndex + i);
        }
      }
      if (
        nextRowIndex + i >= nextRowFirstIndex &&
        nextRowIndex + i < nextRowFirstIndex + cols
      ) {
        if (
          grid[nextRowIndex + i] &&
          !grid[nextRowIndex + i].isMined &&
          !grid[nextRowIndex + i].isClicked
        ) {
          grid[nextRowIndex + i].isClicked = true;

          // clickedArr.push(nextRowIndex + i);
          if (grid[nextRowIndex + i].adjacentMineCount === 0)
            onZeroCellTapped(nextRowIndex + i);
        }
      }
    }
    console.log(clickedArr);

    setClickedCells([...clickedCells, ...clickedArr]);
  };
  return (
    <View>
      <SafeAreaView>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {renderGrid()}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Home;
