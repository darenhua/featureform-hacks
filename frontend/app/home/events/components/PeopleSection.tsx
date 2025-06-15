import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { COLORS, FONTS } from "../../../styles/global";
import CompactProfileCard from "./CompactProfileCard";
import { mockPeopleByCategory } from "../../mock-people";

interface PeopleSectionProps {
  title: string;
  categories: {
    name: string;
    count: number;
  }[];
}

export default function PeopleSection({ title, categories }: PeopleSectionProps) {
  const getCategoryColor = (categoryName: string) => {
    switch (categoryName) {
      case "Entrepreneurship":
        return `#${COLORS.darkOrange}`;
      case "Artificial Intelligence":
        return `#${COLORS.darkBlue}`;
      case "Product Design":
        return `#${COLORS.darkGreen}`;
      default:
        return `#${COLORS.darkYellow}`;
    }
  };

  return (
    <View style={styles.peopleSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      
      {categories.map((category, index) => (
        <View key={index} style={styles.categoryContainer}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            <View 
              style={[
                styles.categoryAccent, 
                { backgroundColor: getCategoryColor(category.name) }
              ]} 
            />
          </View>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.peopleScrollContent}
            style={styles.peopleScrollContainer}
          >
            {mockPeopleByCategory[category.name as keyof typeof mockPeopleByCategory]?.map((person) => (
              <View key={person.id} style={styles.compactCardWrapper}>
                <CompactProfileCard 
                  name={person.name}
                  image={person.image}
                  title={person.title}
                  userId={person.userId}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  peopleSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
    marginBottom: 20,
    paddingHorizontal: 28,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryHeader: {
    paddingHorizontal: 28,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.subtext,
    marginBottom: 8,
  },
  categoryAccent: {
    height: 3,
    width: 80,
    borderRadius: 2,
  },
  peopleScrollContainer: {
    paddingLeft: 28,
  },
  peopleScrollContent: {
    paddingRight: 28,
  },
  compactCardWrapper: {
    marginRight: 12,
  },
}); 