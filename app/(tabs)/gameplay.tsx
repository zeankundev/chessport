import { StyleSheet, Image, Platform } from 'react-native';
import { ScrollView, View } from 'react-native';
import Chessboard from 'react-native-chessboard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabTwoScreen() {
  return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1d1d1d', paddingTop: 60, height: 100,}}>
        <GestureHandlerRootView >
          <Chessboard />
        </GestureHandlerRootView>
      </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
