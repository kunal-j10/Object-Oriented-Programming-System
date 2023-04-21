import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { SliderBox } from "react-native-image-slider-box";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-root-toast";
import { StatusBar } from "expo-status-bar";
import CustomHeader from "../../components/CustomHeader";
import LoaderPost from "../../components/loader/LoaderPost";
import CustomHeaderButton from "../../components/CustomHeaderButton";
import KidLoader from "../../../assets/images/bird-dance.gif";
import {
  sliderImageFetch,
  categoryFetch,
  removeKidError,
} from "../../../store/kid/operation";
import {
  sliderImageSelector,
  AllcategorySelector,
  Kidscreen1LoadingSelector,
  kidErrorSelector,
} from "../../../store/kid/selector";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

const Kid = ({ navigation }) => {
  let images = [];

  const isLoading = useSelector(Kidscreen1LoadingSelector);
  const categories = useSelector(AllcategorySelector);
  const recommendedVideos = useSelector(sliderImageSelector);
  const error = useSelector(kidErrorSelector);

  const dispatch = useDispatch();

  for (let i = 0; i < recommendedVideos.length; i++) {
    images[i] = recommendedVideos[i].thumbnail;
  }

  useEffect(() => {
    dispatch(categoryFetch());
    dispatch(sliderImageFetch());
  }, [dispatch]);

  // displaying error generated when fetching video VideoDetail, toggleLike
  // useEffect(() => {
  //   if (error !== "") {
  //     Toast.show(error, {
  //       duration: Toast.durations.SHORT,
  //       shadow: true,
  //       animation: true,
  //       onHide: () => {
  //         // calls on toast's hide animation start.
  //         dispatch(removeKidError());
  //       },
  //     });
  //   }
  // }, [error]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image style = {{marginTop: DEVICE_HEIGHT*0.23}} source={KidLoader} />
        </View>
      ) : (
        <>
          <SliderBox
            images={images}
            sliderBoxHeight={
              DEVICE_HEIGHT >= 600 ? DEVICE_HEIGHT * 0.26 : DEVICE_HEIGHT * 0.3
            }
            onCurrentImagePressed={(index) => {
              navigation.navigate("VideoDetail", {
                videoId: recommendedVideos[index]._id,
              });
            }}
            dotColor="white"
            inactiveDotColor="transparent"
            paginationBoxVerticalPadding={20}
            autoplay
            circleLoop
            resizeMethod={"resize"}
            resizeMode={"cover"}
            paginationBoxStyle={{
              position: "absolute",
              bottom: 0,
              padding: 0,
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center",
              paddingVertical: 10,
            }}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 0,
              padding: 0,
              margin: 0,
              borderWidth: 2,
              backgroundColor: "transparent",
              borderColor: "white",
            }}
            ImageComponentStyle={{
              borderRadius: 15,
              width: "97%",
              marginTop: 10,
            }}
          />

          <View style={styles.categoryContainer}>
            {categories.map((item, index) => {
              return (
                <View
                  style={{
                    height: 130,
                    flexBasis: "30%",
                    marginBottom:
                      DEVICE_HEIGHT >= 600
                        ? DEVICE_HEIGHT * 0.07
                        : DEVICE_HEIGHT * 0.12,
                    marginHorizontal: 5,
                  }}
                  key={item._id}
                >
                  <TouchableOpacity
                    style={[
                      styles.category,
                      {
                        backgroundColor: item.bgColor,
                      },
                    ]}
                    onPress={() => {
                      navigation.navigate("KidCategory", {
                        category: item.category,
                        categoryTitle: item.categoryTitle,
                      });
                    }}
                  >
                    <View
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: 15,
                        overflow: "hidden",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={{ uri: item.thumbnail }}
                        style={{
                          height: "100%",
                          width: "100%",
                          resizeMode: "stretch",
                        }}
                      />
                    </View>

                    <View style={styles.number}>
                      <Text
                        style={{
                          color: "#733073",
                          fontSize: 15,
                          fontWeight: "bold",
                        }}
                      >
                        {item.totalCount}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <Text
                    style={{
                      textAlign: "center",
                      width: DEVICE_HEIGHT >= 600 ? 110 : 88,
                      fontSize: 13,
                      fontWeight: "bold",
                    }}
                  >
                    {item.categoryTitle}
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export const KidOptions = (navData) => {
  return {
    headerTitle: "Kid",

    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: "#F8F8FA",
      elevation: 1, // remove shadow on Android
      shadowOpacity: 0.2, // remove shadow on iOS
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      borderWidth: 0.5,
    },
    // headerRight: () => (
    //   <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
    //     <Item
    //       title="search"
    //       color="black"
    //       iconName={"search-outline"}
    //       onPress={() => {}}
    //     />
    //   </HeaderButtons>
    // ),
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="search"
          color="black"
          iconName={"md-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  category: {
    padding: 10,
    justifyContent: "space-between",
    marginVertical: 10,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 10,
  },
  categoryContainer: {
    marginHorizontal: 5,
    marginVertical: 10,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  number: {
    position: "absolute",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 9,
    borderBottomLeftRadius: 9,
    backgroundColor: "rgba(255,255,255,.7)",
    bottom: 0,
    left: 0,
  },
});

export default Kid;
