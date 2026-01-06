import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";
import { Responsive, rScale, rVerticalScale } from "../../utils/responsive";

interface ProfileInfoProps {
  name?: string;
  memberSince?: string;
  profileImage?: string;
  onImagePress?: () => void;
}

export default function ProfileInfo({
  name = "Achiever ⭐",
  memberSince = "2023",
  profileImage,
  onImagePress,
}: ProfileInfoProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={onImagePress}
        activeOpacity={0.7}
      >
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.memberSince}>Member Since {memberSince}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: Responsive.v.xxl,
  },
  imageContainer: {
    marginBottom: Responsive.v.md,
  },
  image: {
    width: rScale(100),
    height: rScale(100),
    borderRadius: rScale(50),
    backgroundColor: Colors.gradientBlue,
  },
  placeholderImage: {
    width: rScale(100),
    height: rScale(100),
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: rVerticalScale(99),
    backgroundColor: Colors.gradientBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: Responsive.f.xxxl,
    fontWeight: "700",
    color: Colors.primary,
    fontFamily: Fonts.avenir.heavy,
  },
  name: {
    fontSize: Responsive.f.xxl,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: Responsive.v.xs,
    fontFamily: Fonts.avenir.heavy,
  },
  memberSince: {
    fontSize: Responsive.f.md,
    color: Colors.textSecondary,
    fontFamily: Fonts.slackside,
  },
});
