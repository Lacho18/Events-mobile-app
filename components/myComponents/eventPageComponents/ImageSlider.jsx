import { Text, View, Image, Dimensions, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import themeColor2 from "../../../assets/themeColors";

export default function ImageSlider({ images }) {
  const screenWidth = Dimensions.get("window").width;
  return (
    <View>
      <Text style={styles.titleText}>Images</Text>
      <Swiper style={{ height: 300 }} showsPagination={true}>
        {images.map((image, index) => {
          return (
            <Image
              key={index}
              source={{ uri: image }}
              style={{ width: screenWidth, height: 400 }}
              resizeMode="contain"
            />
          );
        })}
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 25,
    fontWeight: "bold",
    color: themeColor2.text,
  },
});
