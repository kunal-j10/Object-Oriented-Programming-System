import { Feather } from '@expo/vector-icons';
import React from 'react';

import { View, Text , StyleSheet,Image,TouchableNativeFeedback } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import logo from "../assets/images/more-horizontal.png";



const Card1 = (props) =>{
    return (
        
        
        <View style = {styles.card}>
           

        <View style = {styles.cardheader}>
        <TouchableOpacity onPress = {props.onProfilePress}>
            <View style = {{flexDirection: 'row',}}>
        <Image source = {props.profileImg} style = {{height: 48,width: 48,borderRadius:24,marginRight: 10}}  />
        <View style = {{justifyContent: 'space-around'}} >
            <Text style = {{fontSize: 14,fontWeight:'bold',textAlign: 'left'}}>{props.HeaderTitle}</Text>
            <Text style = {{fontSize: 12}}>{props.proffesion}</Text>
        </View>
        </View>
        </TouchableOpacity>
        <TouchableOpacity >
        <Image source = {logo} />
        </TouchableOpacity>
        </View>
        <TouchableNativeFeedback onPress = {props.onContentPress} >
            <View>
        <Text style = {{fontSize: 20,fontWeight: '500',marginVertical:20 }}>{props.title}</Text>
        <Image style = {{width: '100%'}} source = {props.imageurl} />
        </View>
        </TouchableNativeFeedback>
        </View>
        
        
                
               
                
                 
    );
}


const styles = StyleSheet.create({

    card:{
        elevation: 3,
        marginTop: 25,
        width: '100%',
        height: 355,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        
    },
    cardheader:{
        
        justifyContent: 'space-between',
        flexDirection: 'row'
    }

})


export default Card1;