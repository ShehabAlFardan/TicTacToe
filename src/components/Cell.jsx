import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native';
import { Pressable } from 'react-native';
import Cross from './Cross';


const Cell = (props) => {
    const {cell, onPress} = props;
  return (
    <Pressable
        //key={'row'+rowIndex+'col'+columnIndex}
        onPress={()=>onPress()} 
        style={styles.cell}
        >
        {cell=== "o" && <View style={styles.circle}/>}
        {cell==="x" && (
            <Cross/>
        )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
    circle:{
        flex: 0.7,
        width: "80%",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        left: 10,
        top: 10,
        borderWidth: 10,
        borderColor: "white"
      },
      cell:{
        width: 100,
        height: 100,
        flex: 1,
      },
})
export default Cell