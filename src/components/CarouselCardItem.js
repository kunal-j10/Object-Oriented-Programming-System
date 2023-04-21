import React from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from "react-native"

export const SLIDER_WIDTH = Dimensions.get('window').width + 40 
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.75)

const CarouselCardItem = ({ item, index }) => {
  return (
  
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
      />
   
  )
}
const styles = StyleSheet.create({
 
  image: {
    width: ITEM_WIDTH,
    height: 170,
    borderRadius: 20,

  },
})

export default CarouselCardItem