import React, { useCallback, useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ExpandingDot } from "react-native-animated-pagination-dots";
import { LinearGradient } from "expo-linear-gradient";
import {StatusBar} from "expo-status-bar"
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../../constants/Colors";
import OnboardingCard from "../../components/auth/OnboardingCard";
import onboarding1 from "../../../assets/images/onboarding1.png";
import onboarding2 from "../../../assets/images/onboarding2.png";
import onboarding3 from "../../../assets/images/onboarding3.png";
import DefaultButton from "../../components/DefaultButton";
const data = [
  {
    key: "1",
    image: onboarding1,
    titleFirst: "Trust Your",
    titleSecond: "Child",
    titleThird: "With Us",
    subTitle:
      "All information shared with our database is kept confidential at all times. We will not share this information to anyone but you.",
    isAuth: false,
  },
  {
    key: "2",
    image: onboarding2,
    titleFirst: "Your Child’s",
    titleSecond: "Safety",
    titleThird: "Is Our Priority",
    subTitle:
      "All the content displayed on this application is child friendly and proofread by many qualified staff.",
    isAuth: false,
  },
  {
    key: "3",
    image: onboarding3,
    titleFirst: "Join",
    titleSecond: "Adwaita Educare",
    titleThird: "",
    subTitle:
      "So what are you waiting for? Join Adwaita Educare in the journey to smart parenting!",
    isAuth: true,
  },
];

const windowWidth = Dimensions.get("window").width;

export default function Onboarding({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatlistRef = useRef(null);

  const gotoNextPage = useCallback((activeIndex) => {
    if (activeIndex + 1 < data.length) {
      flatlistRef.current.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    }
  }, []);

  const skipPage = useCallback(() => {
    flatlistRef.current.scrollToIndex({
      index: data.length - 1,
      animated: true,
    });
  }, []);

  const onLogin = useCallback(() => {
    navigation.navigate('LoginSignUpTopNavigator', {
      screen: 'Login',
      })
  }, []);

  const onSignUp = useCallback(() => {
    navigation.navigate('LoginSignUpTopNavigator', {
      screen: 'SignUp',
      })
    // navigation.replace("LoginSignUpTopNavigator");
  }, []);

  const RenderItem = useCallback(
    ({ item, index }) => (
      <OnboardingCard
        image={item.image}
        titleFirst={item.titleFirst}
        titleSecond={item.titleSecond}
        titleThird={item.titleThird}
        subTitle={item.subTitle}
        isAuth={item.isAuth}
        onSkip={skipPage}
        onNext={() => gotoNextPage(index)}
        BtnGrp={() => <BtnGrp onLogin={onLogin} onSignUp={onSignUp} />}
      />
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
             {/* <StatusBar style="auto" backgroundColor={Colors.brandPrimary.default}/> */}

      <FlatList
        ref={flatlistRef}
        data={data}
        showsHorizontalScrollIndicator={false}
        renderItem={RenderItem}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        pagingEnabled
        horizontal
        decelerationRate="normal"
        scrollEventThrottle={16}
      />
      <View style={styles.dotContainer}>
        <ExpandingDot
          data={data}
          expandingDotWidth={30}
          scrollX={scrollX}
          activeDotColor={Colors.brandPrimary.default}
          dotStyle={styles.dotStyle}
          containerStyle={{ top: 0 }}
        />
      </View>
    </SafeAreaView>
  );
}

const BtnGrp = ({ onLogin, onSignUp }) => (
  <View style={styles.btngrp}>
    <DefaultButton outline onPress={onLogin} containerStyle = {{paddingHorizontal:50}} type="small" text="Login" />
   
    <DefaultButton onPress={onSignUp} containerStyle = {{paddingHorizontal:50}} type="small" text="Sign Up" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  dotStyle: {
    width: 10,
    height: 10,
    backgroundColor: "#c4c4c4",
    borderRadius: 5,
    marginHorizontal: 8,
  },
  dotContainer: {
    height: 40,
  },
  btngrp: {
    flexDirection: "row",
    justifyContent: "center",
  },
  gradientBtn: {
    justifyContent: "center",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
    width: windowWidth * 0.4,
    minWidth: 145,
  },
  gradientTxt: {
    color: "white",
    fontSize: 16,
  },
});
