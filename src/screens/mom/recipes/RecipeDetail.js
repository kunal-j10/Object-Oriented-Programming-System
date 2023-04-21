import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Platform,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useCallback, useState, useRef, useEffect } from "react";
import YoutubePlayer from "react-native-youtube-iframe";
import * as ScreenOrientation from "expo-screen-orientation";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { useDispatch, useSelector } from "react-redux";

import { videoIdRegex } from "../../../utils/helper";
import Colors from "../../../../constants/Colors";
import {
  recipeErrorSelector,
  recipesDetailSelector,
} from "../../../../store/recipe/selector";
import {
  recipeDetailFetch,
  recipeRemoveError,
} from "../../../../store/recipe/operation";
import { removeNoInternetAction } from "../../../../store/auth/operation";

const methodViewabilityConfig = {
  itemVisiblePercentThreshold: 60,
};

const tabCategories = [
  { key: "0", tabName: "ingredient", display: "Ingredient" },
  { key: "1", tabName: "method", display: "Method" },
  { key: "2", tabName: "nutritional", display: "Nutritional Value" },
];

export default function RecipeDetail(props) {
  const { recipeId } = props.route?.params;

  const { width } = useWindowDimensions();

  const [playing, setPlaying] = useState(false);

  const [tabName, setTabName] = useState("ingredient");

  const [activeStepState, setActiveStepState] = useState(0);
  const methodScrollRef = useRef(null);
  const methodFlatlistRef = useRef(null);

  const recipeDetail = useSelector(recipesDetailSelector);
  const error = useSelector(recipeErrorSelector);

  const dispatch = useDispatch();

  // fetching recipeDetail
  useEffect(() => {
    dispatch(recipeDetailFetch(recipeId));

    () => {
      dispatch(removeNoInternetAction(recipeDetailFetch.type));
    };
  }, [recipeId]);

  // displaying errors if occured
  useEffect(() => {
    if (error !== "") {
      Toast.show(error, {
        duration: Toast.durations.SHORT,
        shadow: true,
        animation: true,
        onHide: () => {
          // calls on toast's hide animation start.
          dispatch(recipeRemoveError());
        },
      });
    }
  }, [error]);

  const onVideoStateChange = useCallback((state) => {
    if (state === "playing" || state === "buffering") {
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, []);

  const onFullScreenChange = useCallback(async (status) => {
    if (status) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    } else {
      await ScreenOrientation.unlockAsync();
    }
  }, []);

  const ingredientItem = useCallback(
    ({ item }) => (
      <View style={styles.ingredRow}>
        <FontAwesome name="circle" color={Colors.textPrimary} />
        <Text style={styles.ingredName}>{`${item.amount} - ${item.name}`}</Text>
      </View>
    ),
    []
  );

  const Ingredients = useCallback(
    () => (
      <FlatList
        data={recipeDetail?.ingredients}
        keyExtractor={({ name }, idx) => name + idx}
        renderItem={ingredientItem}
        contentContainerStyle={styles.ingredContainer}
        ListFooterComponent={<View style={{ height: 60 }} />}
      />
    ),
    [recipeDetail?.ingredients]
  );

  const gotoPrevStep = useCallback(() => {
    if (activeStepState - 1 >= 0) {
      methodScrollRef.current.scrollTo({ y: 0, animated: false });
      setActiveStepState((prev) => prev - 1);

      methodFlatlistRef.current.scrollToIndex({
        index: activeStepState - 1,
        animated: true,
      });
    }
  }, [activeStepState]);

  const gotoNextStep = useCallback(() => {
    if (activeStepState + 1 < recipeDetail?.cookingSteps?.length) {
      methodScrollRef.current.scrollTo({ y: 0, animated: false });
      setActiveStepState((prev) => prev + 1);

      methodFlatlistRef.current.scrollToIndex({
        index: activeStepState + 1,
        animated: true,
      });
    }
  }, [recipeDetail, activeStepState]);

  const methodItem = useCallback(
    ({ item }) => (
      <View style={{ width }}>
        <Text style={styles.stepDesc}>{item.description}</Text>
      </View>
    ),
    []
  );

  const handleMethodItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveStepState(viewableItems[0].index);
    }
  };

  const StepHeader = useCallback(
    () => (
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Step {activeStepState + 1}</Text>
        <View style={styles.methodBtn}>
          <TouchableOpacity
            style={[
              styles.iconBtn,
              activeStepState == 0 && {
                opacity: 0.5,
              },
            ]}
            onPress={gotoPrevStep}
          >
            <FontAwesome
              name="long-arrow-left"
              size={28}
              color={Colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconBtn,
              activeStepState + 1 == recipeDetail?.cookingSteps?.length && {
                opacity: 0.5,
              },
            ]}
            onPress={gotoNextStep}
          >
            <FontAwesome
              name="long-arrow-right"
              size={28}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [activeStepState, recipeDetail]
  );

  const Method = useCallback(
    () => (
      <FlatList
        ref={methodFlatlistRef}
        data={recipeDetail?.cookingSteps}
        keyExtractor={({ step }) => step}
        renderItem={methodItem}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        decelerationRate="normal"
        scrollEventThrottle={16}
        onViewableItemsChanged={handleMethodItemsChanged}
        viewabilityConfig={methodViewabilityConfig}
      />
    ),
    [recipeDetail]
  );

  const nutritionalItem = useCallback(
    ({ item }) => (
      <View style={styles.ingredRow}>
        <FontAwesome name="circle" color={Colors.textPrimary} />
        <Text style={styles.ingredName}>{`${item.name} - ${item.amount}`}</Text>
      </View>
    ),
    []
  );

  const Nutritional = useCallback(
    () => (
      <FlatList
        data={recipeDetail?.nutritionalValue}
        keyExtractor={({ name }, idx) => name + idx}
        renderItem={nutritionalItem}
        contentContainerStyle={styles.ingredContainer}
        ListFooterComponent={<View style={{ height: 60 }} />}
      />
    ),
    [recipeDetail]
  );

  const tabRenderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={{
          minWidth: width * 0.33,
          borderBottomWidth: 2,
          borderBottomColor:
            tabName == item.tabName
              ? Colors.textPrimary
              : "rgba(196,196,196,0.4)",
        }}
        onPress={() => setTabName(item.tabName)}
      >
        <Text
          style={[
            styles.tabSelected,
            tabName !== item.tabName && { color: Colors.textSecondary },
          ]}
        >
          {item.display}
        </Text>
      </TouchableOpacity>
    ),
    [tabName, width]
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {recipeDetail?.videoUrl ? (
        <YoutubePlayer
          webViewStyle={{ opacity: 0.99 }}
          webViewProps={{
            renderToHardwareTextureAndroid: true,
            androidLayerType:
              Platform.OS === "android" && Platform.Version <= 22
                ? "hardware"
                : "none",
          }}
          height={width * 0.56}
          play={playing}
          videoId={videoIdRegex(recipeDetail.videoUrl)}
          onChangeState={onVideoStateChange}
          onFullScreenChange={onFullScreenChange}
        />
      ) : null}
      <Text style={styles.title}>{recipeDetail?.title}</Text>

      <View>
        <FlatList
          data={tabCategories}
          renderItem={tabRenderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* tab contents */}
      <View style={styles.flex}>
        {tabName === "ingredient" ? (
          <Ingredients />
        ) : tabName === "method" ? (
          <ScrollView
            ref={methodScrollRef}
            contentContainerStyle={styles.methodContainer}
          >
            <StepHeader />
            <Method />
          </ScrollView>
        ) : (
          <Nutritional />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#fff",
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
  },
  tabSelected: {
    textAlign: "center",
    paddingHorizontal: 15,
    paddingBottom: 8,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  flex: {
    flex: 1,
  },
  ingredContainer: {
    marginTop: 20,
  },
  ingredRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ingredName: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginLeft: 12,
  },
  methodContainer: {
    flexGrow: 1,
    marginTop: 20,
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
  },
  stepTitle: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  stepDesc: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: "justify",
    marginBottom: 50,
    paddingHorizontal: 16,
  },
  methodBtn: {
    flexDirection: "row",
  },
  iconBtn: {
    padding: 10,
  },
});

export const RecipeDetailOptions = () => {
  return {
    presentation: "modal",
    gestureEnabled: true,
    headerShown: false,
    gestureResponseDistance: 300,
  };
};
