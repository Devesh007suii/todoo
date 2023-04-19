import * as ImagePicker from 'expo-image-picker';

export const picGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        return result.assets[0].uri;
      }
    } catch (err) {
      console.log('Error picking document:', err);
    }
  };