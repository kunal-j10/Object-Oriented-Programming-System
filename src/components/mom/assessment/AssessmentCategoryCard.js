import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

function AssessmentCategoryCard({
  name,
  category,
  imageSrc,
  backgroundColor,
  textColor,
  navigateHandler,
}) {
  return (
    <TouchableOpacity
      style={styles.contentWrapper}
      onPress={() => navigateHandler(category, name)}
    >
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.name, { color: textColor }]}>{name}</Text>
        <Image style={styles.image} source={imageSrc} />
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(AssessmentCategoryCard);

const styles = StyleSheet.create({
  contentWrapper: {
    elevation: 15,
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    margin: 16,
    borderRadius: 15,
    overflow: "hidden",
  },
  container: {
    height: 200,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 24,
    marginTop: 24,
    maxWidth: "44%",
  },
  image: {
    alignSelf: "flex-end",
    width: 160,
    height: 160,
    marginRight: 15,
  },
});
