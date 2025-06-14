import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";

const events = [
  { id: "1", name: "Featureform 2025" },
  { id: "2", name: "Networking" },
  { id: "3", name: "Entrepreneurship Meeting" },
  { id: "4", name: "Entrepreneurship Meeting" },
];

export default function Index() {
  const router = useRouter();

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Profile Button */}
      <TouchableOpacity style={styles.profileButton} onPress={() => router.push("/profile")}> 
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      {/* Event Grid */}
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
      {/* Floating Cam Button */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>Cam</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#162955',
    paddingTop: 60,
  },
  profileButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  grid: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#253A6D',
    borderRadius: 20,
    width: 150,
    height: 150,
    margin: 12,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 16,
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#fff',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: '#162955',
    fontSize: 20,
    fontWeight: 'bold',
  },
});