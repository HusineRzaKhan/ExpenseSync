import React from 'react';
import { View, Button, Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function QRShare({ url }) {
  const onShare = async () => {
    try {
      await Share.share({ message: `Install ExpenseSync: ${url}` });
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View>
      <View style={{ alignItems: 'center', padding: 8 }}>
        <QRCode value={url} size={160} />
      </View>
      <Button title="Share App (QR)" onPress={onShare} />
    </View>
  );
}
