import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, Pressable, Alert } from 'react-native';
import bg from './assets/bg.jpeg'
import React, {useEffect, useState} from 'react';
//import Cross from './src/components/cross';
import Cell from './src/components/Cell';

const emptyMap=[
  ["","",""],// row 1
  ["","",""],// row 2
  ["","",""],// row 3
]

const copyArray = (original) =>{
  const copy= original.map((arr)=>{
    return arr.slice()
  })
  return copy;
}

export default function App() {
  const [map, setMap] = useState(emptyMap);
  const [currentTurn, setCurrentTurn] = useState('x')
  const [gameMode, setGameMode] = useState('BOT_MEDIUM')

  useEffect(()=>{
    if(currentTurn === "o" && gameMode !== "LOCAL"){
      botTurn()
    }
  },[currentTurn])
  
  useEffect(()=>{
    const winner = getWinner(map);
    if (winner){
      gameWon(winner)
    }else{checkTieState();}
  },[map])

  const onPress = (rowIndex, columnIndex) =>{

    if(map[rowIndex][columnIndex]!= ""){
      Alert.alert("Position already occupied")
      return;
    }

    setMap((existingMap)=>{
      const updatedMap = [...existingMap]
      updatedMap[rowIndex][columnIndex] = currentTurn
      return updatedMap;
    })
    setCurrentTurn(currentTurn==='x'? 'o' : 'x')

  }

  const checkTieState = () =>{
      if (!map.some(row=> row.some(cell=> cell === ''))){
        Alert.alert(
          "Stalemate", 
          "its a draw",
          [{
          text: "Restart",
          onPress: resetGame
      }]);
      }
  }

  const getWinner = (winnerMap) =>{
    //Check Rows
    for(let i=0; i<3; i++){
      const isRowXWinning = winnerMap[i].every(cell=> cell === 'x')
      const isRowOWinning = winnerMap[i].every(cell=> cell === 'o')
      if(isRowXWinning) return("x");
      if(isRowOWinning) return("o")
    }

    //Check Columns
    for(let col = 0; col<3; col++){

      let isColumnXWinner = true;
      let isColumnOWinner = true;

      for(let row=0; row< 3; row++){
        if(winnerMap[row][col]!= 'x') isColumnXWinner= false;
        if(winnerMap[row][col]!= 'o') isColumnOWinner= false;
      }

      if(isColumnXWinner) return("x")
      if(isColumnOWinner) return("o")

    }

    //Check Diagonals 
    let isDiagonal1OWinning=true;
    let isDiagonal1XWinning=true;
    let isDiagonal2OWinning=true;
    let isDiagonal2XWinning=true;
    
    for(let i= 0;i<3;i++){
      if(winnerMap[i][i]!='o') isDiagonal1OWinning=false;
      if(winnerMap[i][i]!='x') isDiagonal1XWinning=false;
      if(winnerMap[i][2-i]!='o') isDiagonal2OWinning=false;
      if(winnerMap[i][2-i]!='x') isDiagonal2XWinning=false;
    }

    if (isDiagonal1OWinning==true || isDiagonal2OWinning==true) return("o")
    if (isDiagonal1XWinning==true || isDiagonal2XWinning==true) return("x")
  }

  const resetGame = () => {
    const resetMap=[
      ["","",""],// row 1
      ["","",""],// row 2
      ["","",""],// row 3
    ]
    setMap(resetMap);
    setCurrentTurn("x");
  };
  
  const gameWon = (player) => {
    Alert.alert(
      "Congrats", 
      'Player ' + player + " won",
      [{
      text: "Restart",
      onPress: resetGame
  }]);
  };


  const botTurn = () =>{
    //collect all possible options
    const possiblePositions = [];
    map.forEach((r,rowIndex) =>{
      r.forEach((cell,columnIndex)=>{
        if (cell ===""){
          possiblePositions.push({row: rowIndex, col: columnIndex})
        }
      })
    })
    let chosenOption;

    
    //Attack 
    if(gameMode==="BOT_MEDIUM"){
    possiblePositions.forEach((possiblePosition) => {
      const mapCopy = copyArray(map);

      mapCopy[possiblePosition.row][possiblePosition.col] = "o";

      const winner = getWinner(mapCopy);
      if (winner === "o") {
        // Attack that position
        chosenOption = possiblePosition;
      }
    });
    

    //Defend
    //check if the opponent will win on next move
    if(!chosenOption){
    possiblePositions.forEach((possiblePosition) => {
      const mapCopy = copyArray(map);

      mapCopy[possiblePosition.row][possiblePosition.col] = "x";

      const winner = getWinner(mapCopy);
      if (winner === "x") {
        // Defend that position
        chosenOption = possiblePosition;
      }
    });
    }

    }
    //choose random
    if(!chosenOption){
    chosenOption = possiblePositions[Math.floor(Math.random()*possiblePositions.length)]
    if(chosenOption) onPress(chosenOption.row, chosenOption.col)  
    }else{
      onPress(chosenOption.row, chosenOption.col) 
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={bg} style={styles.bg} resizeMode="contain">
        <Text style={{fontSize:24 , color: "white", position: "absolute", top: 50}}>Current Turn: {currentTurn}</Text>
        <View style={styles.map}>
          {map.map((row, rowIndex)=> (
            <View key={'row'+rowIndex} style={styles.row}>
              {row.map((cell, columnIndex)=> 
              <Cell
              key={'row'+rowIndex+'col'+columnIndex} 
              cell={cell} 
              onPress={()=>onPress(rowIndex, columnIndex)}/>
              )}
            </View>
          ))}


          {/* <View style={styles.circle}/>
          <View style={styles.cross}>
            <View style={styles.crossLine}/>
            <View style={[styles.crossLine , styles.crossLineReversed]}/>
          </View> */}
        </View>
        <View style={styles.buttons}>
          <Text
          onPress={()=>setGameMode('LOCAL')} 
          style={[styles.button, {backgroundColor: gameMode ==='LOCAL'? '#4F5686' : '#191F24'}]}>
            Local
          </Text>
          <Text
           onPress={()=>setGameMode('BOT_EASY')} 
          style={[styles.button, {backgroundColor: gameMode ==='BOT_EASY'? '#4F5686' : '#191F24'}]}>
            Easy Bot
            </Text>
          <Text 
          onPress={()=>setGameMode('BOT_MEDIUM')} 
          style={[styles.button, {backgroundColor: gameMode ==='BOT_MEDIUM'? '#4F5686' : '#191F24'}]}>
            Medium Bot
          </Text>
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#242D34"
  },
  bg:{
    width: "100%",
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
  },
  map:{
    width:"80%",
    aspectRatio: 1,
  },
  row:{
    flex: 1,
    flexDirection: "row",
  },
  buttons:{
    position:"absolute",
    bottom:50,
    flexDirection: "row"
  },
  button:{
    color: "white",
    margin:10,
    fontSize:16,
    backgroundColor: "#191F24",
    padding:10,
    paddingHorizontal: 15
  },
});
