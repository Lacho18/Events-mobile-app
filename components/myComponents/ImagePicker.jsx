import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import axios from "axios";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function MyImagePicker({ getImages }) {
  const [imageUri, setImageUri] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState([]);
  const [error, setError] = useState("");
  const [uploadedImages, setUploadedImages] = useState(false);
  const [uploading, setUploading] = useState(false);

  //Function that uploads image to Cloudinary by provided image file uri
  async function uploadToCloundinary(uriOfImage) {
    const CLOUDINARY_URL = process.env.EXPO_PUBLIC_CLOUDINARY_URL;
    const UPLOAD_PRESET = process.env.EXPO_PUBLIC_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", {
      uri: uriOfImage,
      type: "image/jpeg",
      name: "upload.jpg",
    });
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload successful:", response.data);

      // Access the uploaded image URL from Cloudinary
      const imageUrl = response.data.secure_url;
      console.log("Uploaded Image URL:", imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      setError("Upload error:", error);
      return null;
    }
  }

  //Called when selecting image from the gallery of the phone device. Allows the user to pick image using expo image picker
  async function pickImage() {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!result.granted) {
      alert("Permission to access the gallery is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImageUri(pickerResult.assets[0].uri);
      setUploadedImageUrl((oldValue) => {
        let newValue = [...oldValue];
        newValue.push(pickerResult.assets[0].uri);
        return newValue;
      });
    }
  }

  //Removes the selected image from all of the selected images
  function removeImage(index) {
    if (uploadedImageUrl[index] === imageUri) {
      setImageUri(null);
    }
    setUploadedImageUrl((oldValue) => {
      let newValue = oldValue.filter((_, i) => i !== index);

      return [...newValue];
    });
  }

  //Function that uploads all the selected images to the Cloudinary and also gets the urls and stores them in images field of the new event object
  async function uploadImagesHandler() {
    setUploading(true);
    const urls = await Promise.all(
      uploadedImageUrl.map(async (uri) => {
        return uploadToCloundinary(uri);
      })
    );

    if (urls.length > 0 && urls.length <= 12) {
      getImages(urls);
      setUploading(false);
      setUploadedImages(true);
    } else if (urls.length > 0) {
      setUploading(false);
      setError(
        "The maximum amount of images are 12. Please remove some of the images!"
      );
    } else {
      setUploading(false);
      setError("Images are mandatory! Please provide at least 1 image!");
    }
  }

  console.log(imageUri);

  if (uploading) {
    <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (uploadedImages) {
    return (
      <View style={styles.imagePickerDiv}>
        <Text style={[styles.textTitle, { color: "green" }]}>
          Images have been uploaded!
        </Text>
        <Text style={styles.descriptionText}>
          If you would like to delete or change the images for the event, you
          will be able to from the event page after creating it!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.imagePickerDiv}>
      <Text style={styles.textTitle}>Select images and upload them</Text>
      <Text style={styles.descriptionText}>
        Images for the events are mandatory! You can select them from your phone
        gallery. A permission is required!
      </Text>
      {error !== "" && <Text style={styles.errorMessage}>{error}</Text>}
      <TouchableOpacity onPress={pickImage} style={styles.uploadImageButton}>
        <Text style={styles.buttonText}>Upload image</Text>
      </TouchableOpacity>
      {imageUri !== null && (
        <View style={{ margin: 10 }}>
          <Text style={{ fontStyle: "italic" }}>Current image</Text>
          <Image
            source={{ uri: imageUri }}
            style={{ width: 350, height: 200, marginTop: 10 }}
          />
        </View>
      )}
      {uploadedImageUrl.length > 0 && (
        <View style={styles.selectedImagesDiv}>
          <Text style={styles.textTitle}>Selected images</Text>
          <View style={styles.imagesDiv}>
            {uploadedImageUrl.map((image, index) => (
              <View key={index} style={{ position: "relative" }}>
                <TouchableOpacity
                  style={styles.removeButtonPosition}
                  onPress={() => {
                    removeImage(index);
                  }}
                >
                  <FontAwesome name="remove" size={28} color="red" />
                </TouchableOpacity>
                <Image
                  source={{ uri: image }}
                  style={{ width: 100, height: 100 }}
                />
              </View>
            ))}
          </View>
        </View>
      )}
      <TouchableOpacity
        style={[
          styles.uploadImageButton,
          { backgroundColor: "#80ed32", width: 200 },
        ]}
      >
        <Text style={styles.buttonText} onPress={uploadImagesHandler}>
          Upload to the cloud
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  imagePickerDiv: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    borderTopWidth: 3,
    position: "relative",
  },
  uploadImageButton: {
    backgroundColor: "#e02214",
    width: 100,
    height: 75,
    borderRadius: 18,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  textTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  selectedImagesDiv: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "black",
    borderRadius: 10,
  },
  imagesDiv: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  descriptionText: {
    textAlign: "center",
    fontSize: 10,
    fontStyle: "italic",
  },
  errorMessage: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    textTransform: "uppercase",
    position: "fixed",
    zIndex: 10,
    justifyContent: "center",
  },
  removeButtonPosition: {
    position: "absolute",
    right: 0,
    zIndex: 10,
  },
});
