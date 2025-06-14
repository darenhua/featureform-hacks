import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Modal } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { COLORS } from "../app/styles/global";

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
        <Text style={styles.fabText}>Cam</Text>
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
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: "#fff",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: COLORS.background,
    fontSize: 20,
    fontWeight: "bold",
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  message: {
    color: "#fff",
    fontSize: 16,
  },
  scanAgainButton: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  scanAgainText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
}); 