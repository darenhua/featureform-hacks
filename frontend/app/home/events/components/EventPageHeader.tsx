import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { COLORS, FONTS } from "../../../styles/global";

interface EventPageHeaderProps {
  backHref?: "/home" | any;
}

export default function EventPageHeader({ backHref = "/home" }: EventPageHeaderProps) {
  return (
    <View style={styles.header}>
      <Link href={backHref} asChild>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </Link>
      <View style={styles.headerSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 20,
    marginBottom: 20,
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  backText: {
    color: COLORS.maintext,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  headerSpacer: {
    width: 50,
  },
}); 