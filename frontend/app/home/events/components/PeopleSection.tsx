import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { COLORS, FONTS } from "../../../styles/global";
import CompactProfileCard from "./CompactProfileCard";
import { getAllUsers, User } from "../../../api/users";

interface PeopleSectionProps {
  title: string;
  eventId: string;
  currentUserIdfv?: string | null;
  categories: {
    name: string;
    count: number;
  }[];
}

export default function PeopleSection({
  title,
  categories,
  eventId,
  currentUserIdfv,
}: PeopleSectionProps) {
  const [people, setPeople] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      // Filter users that have been processed (completed onboarding)
      const processedUsers = response.users.filter(user => user.processed === true);
      setPeople(processedUsers);
      console.log(`Fetched ${processedUsers.length} processed users for people section`);
    } catch (error) {
      console.error('Error fetching users for people section:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter out current user from the list
  const getFilteredPeople = () => {
    if (!currentUserIdfv) return people;
    return people.filter(user => user.idfv !== currentUserIdfv);
  };

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

  const filteredPeople = getFilteredPeople();

  return (
    <View style={styles.peopleSection}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {filteredPeople.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No other users available</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.peopleScrollContent}
          style={styles.peopleScrollContainer}
        >
          {filteredPeople.slice(0, 8).map((person) => (
            <View key={person.id} style={styles.compactCardWrapper}>
              <CompactProfileCard
                name={`${person.firstName || ''} ${person.lastName || ''}`.trim() || 'User'}
                image={person.image_url || "https://randomuser.me/api/portraits/men/7.jpg"}
                title={person.headline || 'User'}
                userId={person.id}
                eventId={eventId}
              />
            </View>
          ))}
        </ScrollView>
      )}




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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 28,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.subtext,
  },
});
