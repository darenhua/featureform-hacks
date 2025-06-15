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
  let globalColorIndex = 0;

  return (
    <View style={styles.peopleSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      
      {categories.map((category, index) => (
        <View key={index} style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>{category.name}</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.peopleScrollContent}
            style={styles.peopleScrollContainer}
          >
            {mockPeopleByCategory[category.name as keyof typeof mockPeopleByCategory]?.map((person) => {
              const colorIndex = globalColorIndex;
              globalColorIndex++;
              return (
                <View key={person.id} style={styles.compactCardWrapper}>
                  <CompactProfileCard 
                    name={person.name}
                    image={person.image}
                    title={person.title}
                    colorIndex={colorIndex}
                  />
                </View>
              );
            })}
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
  categoryTitle: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.subtext,
    marginBottom: 16,
    paddingHorizontal: 28,
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