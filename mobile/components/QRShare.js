import React from 'react';
import { View, Button } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { useRef } from 'react';

export default function QRShare({ url }) {
  const qrRef = useRef();

  const share = async () => {
    try {
      const uri = await captureRef(qrRef, { format: 'png', quality: 0.9 });
      await Sharing.shareAsync(uri);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View>
      <View ref={qrRef} collapsable={false} style={{ alignItems: 'center', padding: 8 }}>
        <QRCode value={url} size={160} />
      </View>
      <Button title="Share App (QR)" onPress={share} />
    </View>
  );
}
