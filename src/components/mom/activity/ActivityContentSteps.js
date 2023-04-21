import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const ActivityContentSteps = React.forwardRef((props, ref) => {
  const { steps, paddingTop, onScroll } = props;

  return (
    <Animated.FlatList
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingTop }}
      ListFooterComponent={() => <View style={{ marginBottom: paddingTop }} />}
      onScroll={onScroll}
      ref={ref}
      data={steps}
      keyExtractor={(_, index) => index}
      renderItem={({ item }) => (
        <View style={styles.section}>
          <View style={styles.step}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: "rgba(24, 20, 31, 0.6)",
                lineHeight: 20,
              }}
            >
              {item.description}
            </Text>
            <View style={styles.number}>
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 14 }}
              >
                {item.step}
              </Text>
            </View>
          </View>
        </View>
      )}
    />
  );
});

export default React.memo(ActivityContentSteps);

const styles = StyleSheet.create({
  section: {
    padding: 20,
    width: "100%",
  },
  step: {
    padding: 15,
    borderWidth: 2,
    borderColor: "#34C07F",
  },
  number: {
    position: "absolute",
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#34C07F",
    justifyContent: "center",
    alignItems: "center",
    left: -16,
    bottom: "50%",
  },
});
