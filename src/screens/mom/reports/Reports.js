import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../../components/CustomHeaderButton';
import { StatusBar } from 'expo-status-bar';

export default function Reports() {
  return (
    <View style={styles.container}>
       <StatusBar style="auto" backgroundColor="#03B44D"/>
      <Text>This is Reports</Text>
    </View>
  )
}

export const ReportsOptions = (navData) => {
  return {
    headerTitle: "Reports",
    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: "#F8F8FA",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="menu"
          color="black"
          iconName={"md-menu"}
          onPress={() => {}}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
})
