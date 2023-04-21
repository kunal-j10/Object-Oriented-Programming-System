import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { StatusBar } from "expo-status-bar";
import CustomHeaderButton from "../../components/CustomHeaderButton";
import VideoCard from "../../components/VideoCard";
import Color from "../../../constants/Colors";
import Skelleton from "../../components/loader/SkeletonLoader";
import KidLoader from "../../../assets/images/bird-dance.gif";

import {
  CategoriesvideoSelector,
  CategoryVideoLoading,
  PostReachedTillend,
} from "../../../store/kid/selector";
import {
  specificCategoryFetch,
  extraVideosFetch,
} from "../../../store/kid/operation";
import { removeNoInternetAction } from "../../../store/auth/operation";
const DEVICE_HEIGHT = Dimensions.get("window").height;

const KidCategory = (props) => {
  const category = props.route.params?.category;
  const postReachedTillEnd = useSelector(PostReachedTillend);
  const categoriesVideo = useSelector(CategoriesvideoSelector);
  const IsLoading = useSelector(CategoryVideoLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(specificCategoryFetch(category));

    return () => {
      dispatch(removeNoInternetAction(specificCategoryFetch.type));
    };
  }, [dispatch]);

  const loadExtraVideos = useCallback(() => {
    dispatch(extraVideosFetch(category));
  }, [dispatch, category]);

  const loadingFooter = () =>
    postReachedTillEnd ? (
      <Text style={styles.flatListFooterStyle}>That's all for now 🔥🔥 </Text>
    ) : (
      <ActivityIndicator size="large" color={Color.primary} />
    );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#03B44D" />
      {IsLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            style={{ marginTop: DEVICE_HEIGHT * 0.08 }}
            source={KidLoader}
          />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={categoriesVideo}
          keyExtractor={(item) => item._id}
          onEndReached={loadExtraVideos}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingFooter}
          renderItem={(itemData) => {
            return (
              <VideoCard
                videoImage={itemData.item.thumbnail}
                title={itemData.item.title}
                language={itemData.item.language}
                duration={itemData.item.duration}
                onPress={() => {
                  props.navigation.navigate("VideoDetail", {
                    videoId: itemData.item._id,
                  });
                }}
              />
            );
          }}
        />
      )}
    </View>
  );
};

export const KidCategoryOptions = ({ route, navigation }) => {
  const categoryTitle = route.params?.categoryTitle;
  return {
    headerTitle: categoryTitle,

    headerTitleAlign: "center",
    headerStyle: {
      backgroundColor: "#F8F8FA",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="back"
          color="black"
          iconName="chevron-back"
          onPress={() => navigation.goBack()}
        />
      </HeaderButtons>
    ),
  };
};

export default KidCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  flatListFooterStyle: {
    fontSize: 15,
    color: "gray",
    alignSelf: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
});
