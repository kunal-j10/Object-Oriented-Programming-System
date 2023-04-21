import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
} from "react-native";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import CustomHeaderButton from '../../components/CustomHeaderButton'

import {useDispatch} from "react-redux";
import { logout } from "../../../store/auth/operation";

const Shop = () => {


  const dispatch = useDispatch();
  const handleLogout= ()=>{
      dispatch(logout());
  }
 

  return (
    <SafeAreaView style={styles.container}>
    <View>
      <StatusBar style="auto" />
      <Text>This is Shop</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  </SafeAreaView>
  )
}

export const ShopOptions = (navData)=>{
  return {
    headerTitle: "Shop",

    headerTitleAlign: 'center',
    headerStyle: {
      backgroundColor: "#F8F8FA",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20
    },
    headerRight:()=>(
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item title="search" color = 'black' iconName={'search-outline'} onPress={()=>{
              
          }}/>
      </HeaderButtons>
  ),
  headerLeft: ()=>(
    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item title="search" color = 'black' iconName={'md-menu'}   onPress={() =>  {navData.navigation.toggleDrawer()}}/>
    </HeaderButtons>
)
  }

}


const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: '#FFFFFF'
  },
  
  
});

export default Shop;
