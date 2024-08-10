import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import MealsComponent from "../components/MealsComponent";
export function GeneratedMeal({ route }) {
  const { navigate } = useNavigation();
  const mealL = route.params?.meals?.flat() || [];
  const pageTitle = route.params.title;
  const LeftArrowOnPress = () => {
    navigate("HomeScreen");
  };

  return (
    <View style={stylesFn.container}>
      <View style={stylesFn.fillspace}></View>
      <View style={stylesFn.SupContainer1}>
        <View style={stylesFn.SupSupContainer1}>
          <AntDesign
            style={stylesFn.BackArrow}
            onPress={LeftArrowOnPress}
            name="arrowleft"
            size={30}
            color="black"
          />
        </View>
        <View style={stylesFn.SupSupContainer2}>
          <Text style={{ fontSize: 20, fontWeight: "bold", right: 20 }}>
            {pageTitle}
          </Text>
        </View>
      </View>
      <View style={stylesFn.SupContainer2}>
        <SafeAreaView>
          <ScrollView
            style={{
              showsHorizontalScrollIndicator: false,
              showsHorizontalScrollIndicator: false,
            }}
          >
            {mealL.map((meal, index) => (
              
              <View key={index}>
                <MealsComponent meal={meal} />
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
}
const stylesFn = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  fillspace: {
    flex: 0.2,
  },
  SupContainer1: {
    flex: 0.5,
    alignItems: "center",
    flexDirection: "row",
  },
  SupContainer2: {
    flex: 5,
    alignItems: "center",
  },
  SupContainer3: {
    flex: 0.5,
  },
  SupSupContainer2: {
    flex: 0.9,
    alignItems: "center",
  },
  SupSupContainer1: {
    flex: 0.1,
    alignItems: "center",
  },
});
