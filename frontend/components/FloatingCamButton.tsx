import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Modal } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS } from "../app/styles/global";

interface FloatingCamButtonProps {
  /**
   * Callback fired when a barcode/QR code is scanned.
   * Receives the raw data string.
   */
  onScan?: (data: string) => void;
}

export default function FloatingCamButton({ onScan }: FloatingCamButtonProps) {
  const [cameraVisible, setCameraVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    if (onScan) onScan(data);
  };

  return (
    <>
      {/* Floating Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setCameraVisible(true)}>
        <Ionicons name="camera" size={24} color={COLORS.background} />
      </TouchableOpacity>

      {/* Camera Modal */}
      <Modal visible={cameraVisible} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.cameraContainer}>
          {hasPermission === null && <Text style={styles.message}>Requesting camera permission...</Text>}
          {hasPermission === false && <Text style={styles.message}>No access to camera.</Text>}
          {hasPermission && (
            <CameraView
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ["qr", "pdf417"] }}
              style={StyleSheet.absoluteFillObject}
            />
          )}
          {/* Scan Again button */}
          {scanned && (
            <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
              <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
            </TouchableOpacity>
          )}
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={() => setCameraVisible(false)}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: "#fff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    color: "#fff",
    fontSize: 16,
    fontFamily: FONTS.regular,
    textAlign: "center",
  },
  scanAgainButton: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  scanAgainText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONTS.medium,
  },
}); 