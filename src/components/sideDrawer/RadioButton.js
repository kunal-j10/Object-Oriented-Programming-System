import React from "react";
import { View } from "react-native";

function RadioButton(props) {
  return (
    <View
      style={[
        {
          height: 18,
          width: 18,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: !props.active ? "#03B44D" : "grey",
          alignItems: "center",
          justifyContent: "center",
        },
        props.style,
      ]}
    >
      {props.selected ? (
        <View
          style={{
            height: 8,
            width: 8,
            borderRadius: 6,
            backgroundColor: !props.active ? "#03B44D" : "grey",
          }}
        />
      ) : null}
    </View>
  );
}

export default RadioButton;
