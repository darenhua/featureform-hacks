import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { COLORS, FONTS } from "../../../styles/global";
import CompactProfileCard from "./CompactProfileCard";
import { mockPeopleByCategory } from "../../mock-people";
import axios from "axios";
import Constants from "expo-constants";

const NODE_URL = Constants.expoConfig?.extra?.NODE_URL;

interface PeopleSectionProps {
  title: string;
  eventId: string;
  categories: {
    name: string;
    count: number;
  }[];
}

type Person = {
  id: string;
  firstName: string;
  lastName: string;
  image_url: string;
  headline: string;
};

export default function PeopleSection({
  title,
  categories,
  eventId,
}: PeopleSectionProps) {
  const [people, set_people] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios({
      method: "get",
      url: `${NODE_URL}/${eventId}/users`,
    })
      .then((response) => {
        set_people(response.data.users)
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [eventId]);

  // const getCategoryColor = (categoryName: string) => {
  //   switch (categoryName) {
  //     case "Entrepreneurship":
  //       return `#${COLORS.darkOrange}`;
  //     case "Artificial Intelligence":
  //       return `#${COLORS.darkBlue}`;
  //     case "Product Design":
  //       return `#${COLORS.darkGreen}`;
  //     default:
  //       return `#${COLORS.darkYellow}`;
  //   }
  // };

  if (loading) {
    return (
      <View style={styles.peopleSection}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ActivityIndicator size="large" color={COLORS.maintext} />
      </View>
    );
  }

  return (
    <View style={styles.peopleSection}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.peopleScrollContent}
        style={styles.peopleScrollContainer}
      >
        {people.map((person) => (
          <View key={person.id} style={styles.compactCardWrapper}>
            <CompactProfileCard
              name={`${person.firstName} ${person.lastName}`}
              image="https://randomuser.me/api/portraits/men/7.jpg"
              title={person.headline}
              userId={person.id}
              eventId={eventId}
            />
          </View>
        ))}
      </ScrollView>




      {/* {categories.map((category, index) => (
        <View key={index} style={styles.categoryContainer}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            <View
              style={[
                styles.categoryAccent,
                { backgroundColor: getCategoryColor(category.name) },
              ]}
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.peopleScrollContent}
            style={styles.peopleScrollContainer}
          >
            {people[category.name as keyof typeof people]?.map((person) => (
              <View key={person.id} style={styles.compactCardWrapper}>
                <CompactProfileCard
                  name={`${person.firstName}`}
                  image={person.image}
                  title={person.title}
                  userId={person.userId}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      ))} */}
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
