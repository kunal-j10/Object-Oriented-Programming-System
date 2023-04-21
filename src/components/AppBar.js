import { StyleSheet, Text, View,Pressable } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { AntDesign, Feather } from '@expo/vector-icons'

const AppBar = ({title,navigation}) => {
  return (
    <View style={styles.appbar}>
    <Pressable
      style={styles.btnWrapperAppBar}
      onPress={() => navigation.goBack("HomePage")}
    >
      <Feather name="chevron-left" size={24} color="black" />
    </Pressable>
    <Text style={styles.appbarTitle}>{title}</Text>
    <Pressable style={styles.btnWrapperAppBar}>
      
    </Pressable>
  </View>
  )
}

export default AppBar

const styles = StyleSheet.create({
    appbar: {
        flexDirection: "row",
        alignItems: "center",
        height: 62,
        justifyContent:"flex-start",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        backgroundColor: Colors.appbar,
        elevation: 2,
        shadowColor: "black",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
      },
      btnWrapperAppBar: {
        paddingHorizontal: 16,
        flexBasis:"20%",
        justifyContent: "center",
      },
      appbarTitle: {
       flexBasis:"60%",
        textAlign: "center",
        color: Colors.textPrimary,
        fontSize: 18,
        fontWeight: "bold",
      },
      postBtn: {
        flexBasis:"20%",
        color: Colors.textSecondary,
        fontSize: 18,
        fontWeight: "500",
      },
})