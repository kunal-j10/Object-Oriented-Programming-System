import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AssessmentCategory, {
  AssessmentCategoryOptions,
} from "./AssessmentCategory";
import Assessments, { AssessmentsOptions } from "./Assessments";
import AssessmentDetail, { AssessmentDetailOptions } from "./AssessmentDetail";

const Stack = createStackNavigator();

export default function AssessmentsNavigator() {
  return (
    <Stack.Navigator
    // initialRouteName="AssessmentDetail"
    >
      <Stack.Screen
        name="AssessmentCategory"
        component={AssessmentCategory}
        options={AssessmentCategoryOptions}
      />
      <Stack.Screen
        name="Assessments"
        component={Assessments}
        options={AssessmentsOptions}
      />
      <Stack.Screen
        name="AssessmentDetail"
        component={AssessmentDetail}
        options={AssessmentDetailOptions}
      />
    </Stack.Navigator>
  );
}
