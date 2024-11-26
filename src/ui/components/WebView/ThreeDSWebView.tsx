// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import WebView from 'react-native-webview';

interface ThreeDSWebViewProps {
  url?: string;
  onComplete: () => void;
  returnURL: string;
}

export const ThreeDSWebView: React.FC<ThreeDSWebViewProps> = ({
  url,
  onComplete,
  returnURL,
}) => {
  const lastRedirectUrl = useRef('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [url]);

  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#0277FF" />
    </View>
  );
  return (
    <Modal visible={!!url} animationType="slide" onRequestClose={onComplete}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/*<TouchableOpacity style={styles.closeButton} onPress={onComplete}>*/}
          {/*  <X size={22} color="#000" />*/}
          {/*</TouchableOpacity>*/}
          <WebView
            source={{ uri: url }}
            style={styles.webview}
            onError={(e) => {
              if ((e?.nativeEvent?.url || '').includes(returnURL)) {
                setIsLoading(true);
              } else {
                setIsLoading(false);
              }
            }}
            onLoadStart={(e) => {
              if ((e?.nativeEvent?.url || '').includes(returnURL)) {
                setIsLoading(true);
              } else {
                setIsLoading(false);
              }
            }}
            onShouldStartLoadWithRequest={(e) => {
              return !(e?.nativeEvent?.url || '').includes(returnURL);
            }}
            onNavigationStateChange={(navState) => {
              if (
                url &&
                navState.url.includes(returnURL) &&
                !navState.loading &&
                lastRedirectUrl.current !== url
              ) {
                lastRedirectUrl.current = url;
                onComplete();
              }
            }}
          />
          {isLoading && renderLoader()}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    position: 'relative',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255,1)',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
});
