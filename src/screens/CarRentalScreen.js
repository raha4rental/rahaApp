import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';

const cars = [
  {
    id: 1,
    name: 'مرسيدس الفئة S | Mercedes S-Class',
    image: require('../../assets/car.jpg'),
    price: '1,200 ريال/يوم',
    features: [
      'تأمين شامل | Full Insurance',
      'خدمة 24/7 | 24/7 Service',
      'توصيل مجاني | Free Delivery',
    ],
  },
  {
    id: 2,
    name: 'بي إم دبليو الفئة 7 | BMW 7 Series',
    image: require('../../assets/car.jpg'),
    price: '1,100 ريال/يوم',
    features: [
      'تأمين شامل | Full Insurance',
      'خدمة 24/7 | 24/7 Service',
      'توصيل مجاني | Free Delivery',
    ],
  },
  {
    id: 3,
    name: 'رنج روفر | Range Rover',
    image: require('../../assets/car.jpg'),
    price: '1,500 ريال/يوم',
    features: [
      'تأمين شامل | Full Insurance',
      'خدمة 24/7 | 24/7 Service',
      'توصيل مجاني | Free Delivery',
    ],
  },
];

export default function CarRentalScreen() {
  const [insuranceEnabled, setInsuranceEnabled] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        تأجير السيارات الفاخرة | Luxury Car Rental
      </Text>

      <View style={styles.insuranceContainer}>
        <Text style={styles.insuranceText}>
          التأمين الشامل | Comprehensive Insurance
        </Text>
        <Switch
          value={insuranceEnabled}
          onValueChange={setInsuranceEnabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={insuranceEnabled ? '#007AFF' : '#f4f3f4'}
        />
      </View>

      {cars.map(car => (
        <TouchableOpacity key={car.id} style={styles.carCard}>
          <Image source={car.image} style={styles.carImage} />
          <View style={styles.carInfo}>
            <Text style={styles.carName}>{car.name}</Text>
            <Text style={styles.carPrice}>{car.price}</Text>
            {car.features.map((feature, index) => (
              <Text key={index} style={styles.feature}>
                • {feature}
              </Text>
            ))}
            <TouchableOpacity style={styles.rentButton}>
              <Text style={styles.rentButtonText}>احجز الآن | Book Now</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  insuranceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
  },
  insuranceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  carCard: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  carImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  carInfo: {
    padding: 15,
  },
  carName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  carPrice: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 10,
  },
  feature: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  rentButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  rentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
