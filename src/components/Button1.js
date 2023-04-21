import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    Button,
    FlatList,
   TouchableOpacity,
  } from "react-native";
import { LinearGradient } from 'expo-linear-gradient'


const Button1 = (props) =>{
    return(
        <TouchableOpacity  onPress = {props.onPress}>
         
        
        <LinearGradient start={{ x: 0, y: 0}}
        end={{x: 1, y: 0}} style = {props.unfollow ? styles.UnFollow : styles.Follow}  colors= {props.unfollow ? ['white','white']:['#19C190','#F5B700']}>
        <Text style = {{color: props.unfollow ? 'black':'white',fontWeight: 'bold',fontSize:15,lineHeight:21}}>{props.title}</Text>
        </LinearGradient>
   
       
        </TouchableOpacity>
    );
}



const styles = StyleSheet.create({
    Follow:{
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
        paddingHorizontal: 38,
        paddingVertical: 8,
        borderRadius: 24
      },

      UnFollow:{
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
        paddingHorizontal: 30,
        paddingVertical: 8,
        borderRadius: 24,
        borderWidth: 2, 
        borderColor: 'black'
      }
})


export default  Button1;