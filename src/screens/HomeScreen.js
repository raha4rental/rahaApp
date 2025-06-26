import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

// Professional corporate color scheme with Royal Green
const COLORS = {
  primary: '#065F46',      // Royal Green
  primaryDark: '#064E3B',  // Darker Royal Green
  primaryLight: '#10B981', // Light Royal Green
  secondary: '#6B7280',    // Professional gray
  emergency: '#DC2626',    // Professional red
  success: '#047857',      // Deep Green
  white: '#FFFFFF',        // Pure white
  dark: '#111827',         // Professional dark
  background: '#F8FAFC',   // Clean background
  card: '#FFFFFF',         // Card background
  border: '#E5E7EB',       // Subtle border
  shadow: 'rgba(0,0,0,0.1)', // Subtle shadow
  accent: '#059669',       // Royal Green accent
  textSecondary: '#6B7280', // Professional gray text
  gold: '#D97706'          // Corporate gold accent
};

export default function HomeScreen({ navigation }) {
  const properties = [
    {
      id: 1,
      title: 'سكن الأستر',
      titleEn: 'Aster Residence',
      description: 'مبنى سكني فاخر مع جميع المرافق الحديثة',
      descriptionEn: 'Luxury residential building with all modern amenities',
      image: require('../../assets/aster.jpg'),
      apartments: [
        { 
          id: 1, 
          type: 'غرفتين', 
          price: '60$', 
          image: require('../../assets/aster4.jpg'),
          features: ['مساحة واسعة', 'حمامين', 'مطبخ فاخر', 'شرفة كبيرة']
        },
        { 
          id: 2, 
          type: 'ثلاث غرف', 
          price: '80$', 
          image: require('../../assets/aster5.jpg'),
          features: ['مساحة كبيرة جداً', 'ثلاث حمامات', 'مطبخ فاخر مجهز', 'شرفتان', 'غرفة معيشة واسعة']
        },
      ]
    },
    {
      id: 2,
      title: 'الفانتج',
      titleEn: 'Vantage Residence',
      description: 'مساحات واسعة، مجالس رجال ونساء، أمام أكبر مجمع تجاري',
      descriptionEn: 'Spacious areas, men and women majlis, facing the largest commercial complex',
      image: require('../../assets/vantage.jpg'),
      apartments: [
        { 
          id: 1, 
          type: 'غرفتين', 
          price: '65$', 
          image: require('../../assets/vantage3.jpg'),
          features: ['مساحات فاخرة', 'مجلس رجال ونساء', 'مطبخ واسع', 'موقع مميز']
        },
        { 
          id: 2, 
          type: 'ثلاث غرف', 
          price: '85$', 
          image: require('../../assets/vantage4.jpg'),
          features: ['مساحة استثنائية', 'مجلسين منفصلين', 'مطبخ فاخر جداً', 'إطلالة بانورامية', 'مواقف متعددة']
        },
      ]
    },
    {
      id: 3,
      title: 'شقق لوموس',
      titleEn: 'Lumos Apartments',
      description: 'في حرم المستشفى، هدوء وخدمة مثالية',
      descriptionEn: 'In hospital campus, quiet and perfect service',
      image: require('../../assets/lumos.jpg'),
      apartments: [
        { 
          id: 1, 
          type: 'غرفتين', 
          price: '45$', 
          image: require('../../assets/lumos3.jpg'),
          features: ['للعائلات', 'مساحة واسعة', 'قرب من الخدمات الطبية', 'راحة تامة']
        },
        { 
          id: 2, 
          type: 'ثلاث غرف', 
          price: '65$', 
          image: require('../../assets/lumos4.jpg'),
          features: ['للعائلات الكبيرة', 'مساحة فاخرة', 'غرفة معيشة كبيرة', 'قرب من العناية المركزة', 'خدمة VIP']
        },
      ]
    },
    {
      id: 4,
      title: 'شقق المستشفى',
      titleEn: 'Hospital Apartments',
      description: 'داخل حرم المستشفى، في قلب المدينة، أمان متكامل',
      descriptionEn: 'Inside hospital campus, in the city center, complete security',
      image: require('../../assets/hospital.jpg'),
      apartments: [
        { 
          id: 1, 
          type: 'غرفتين', 
          price: '50$', 
          image: require('../../assets/hospital3.jpg'),
          features: ['للعائلات الكبيرة', 'مساحة مريحة', 'خدمة VIP', 'أولوية في العلاج']
        },
        { 
          id: 2, 
          type: 'ثلاث غرف', 
          price: '70$', 
          image: require('../../assets/hospital4.jpg'),
          features: ['للعائلات الممتدة', 'مساحة واسعة جداً', 'خدمة متميزة', 'قرب من جميع الأقسام الطبية', 'راحة فائقة']
        },
      ]
    },
    {
      id: 5,
      title: 'تأجير السيارات',
      titleEn: 'Car Rental Service',
      description: 'سيارات حديثة مع التأمين الشامل - 25$ يومياً',
      descriptionEn: 'Modern cars with comprehensive insurance - $25 daily',
      image: require('../../assets/car.jpg'),
      buttonText: 'احجز سيارتك الآن',
      buttonTextEn: 'Book Your Car Now',
      isCarRental: true,
      features: ['تأمين شامل', 'صيانة دورية', 'خدمة 24 ساعة', 'أسعار منافسة']
    },
    {
      id: 6,
      title: 'الصيانة والطلبات',
      titleEn: 'Maintenance & Requests',
      description: 'خدمات الصيانة وتلبية جميع طلبات النزلاء على مدار الساعة',
      descriptionEn: 'Maintenance services and fulfilling all guest requests 24/7',
      image: require('../../assets/الصيانة.jpg'),
      buttonText: 'طلب خدمة',
      buttonTextEn: 'Request Service',
      isMaintenance: true,
      whatsappUrl: 'https://wa.me/message/SDLDLIW54YJQK1'
    }
  ];

  const callEmergency = () => {
    Alert.alert(
      'طوارئ طبية 911 | Medical Emergency 911',
      'هل تريد الاتصال بالإسعاف؟\nDo you want to call ambulance?\n\n• للحالات الطبية العاجلة فقط\n• For urgent medical cases only',
      [
        { text: 'إلغاء | Cancel', style: 'cancel' },
        { 
          text: 'اتصال | Call', 
          onPress: () => {
            Linking.openURL('tel:911');
          }
        }
      ]
    );
  };

  const openWhatsApp = () => {
    Alert.alert(
      'واتساب | WhatsApp',
      'رقم التواصل: +12166444441\nContact: +12166444441',
      [{ text: 'حسناً | OK', style: 'default' }]
    );
  };

  const handlePropertyPress = (property) => {
    if (property.isCarRental) {
      Alert.alert(
        'خدمة تأجير السيارات | Car Rental Service',
        'سيارات حديثة مع تأمين شامل\nModern cars with comprehensive insurance\n\n• تأمين شامل\n• صيانة دورية\n• خدمة 24 ساعة\n• أسعار منافسة\n\nللحجز: +12166444441',
        [{ text: 'حسناً | OK', style: 'default' }]
      );
    } else if (property.isMaintenance) {
      // Navigate to MaintenanceScreen
      navigation.navigate && navigation.navigate('MaintenanceScreen');
    } else {
      // Navigate to PropertyDetails with complete property data
      navigation.navigate && navigation.navigate('PropertyDetails', { property });
    }
  };

  const getButtonStyle = (property) => {
    if (property.isMedical) {
      return [styles.moreInfoButton, styles.medicalButton];
    }
    return styles.moreInfoButton;
  };

  const getButtonShadowColor = (property) => {
    if (property.isMedical) {
      return '#DC143C';
    }
    return '#006400';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" backgroundColor={COLORS.primary} />
      
      {/* Header with Logo */}
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/راحة ثقة امان.jpg')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Properties/Services */}
        {properties.reduce((rows, property, index) => {
          if (index % 2 === 0) {
            rows.push([property]);
          } else {
            rows[rows.length - 1].push(property);
          }
          return rows;
        }, []).map((row, rowIndex) => (
          <View key={rowIndex} style={styles.propertyRow}>
            {row.map((property) => (
              <View key={property.id} style={styles.propertyCard}>
                            <Image
              source={property.image}
              style={styles.propertyImage}
              resizeMode="cover"
            />
                
                <View style={styles.contentContainer}>
                  <Text style={styles.propertyTitle}>{property.title}</Text>
                  <Text style={styles.propertyDescription}>{property.description}</Text>
                  
                  <TouchableOpacity 
                    style={[
                      getButtonStyle(property),
                      {
                        shadowColor: getButtonShadowColor(property),
                      }
                    ]}
                    onPress={() => handlePropertyPress(property)}
                  >
                    <Text style={styles.moreInfoText}>المزيد من المعلومات</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}

        {/* Emergency Medical Service Card */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyBadge}>
            <Text style={styles.emergencyBadgeText}>طوارئ</Text>
          </View>
          
          <View style={styles.emergencyContent}>
            <View style={styles.emergencyIconContainer}>
              <MaterialIcons name="local-hospital" size={34} color={COLORS.white} />
            </View>
            
            <Text style={styles.emergencyTitle}>طوارئ طبية 911</Text>
            <Text style={styles.emergencyDescription}>
              اتصال فوري بالإسعاف للحالات الطبية العاجلة
            </Text>
            
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={callEmergency}
            >
              <MaterialIcons name="phone" size={20} color={COLORS.white} />
              <Text style={styles.emergencyButtonText}>اتصال بالإسعاف فوراً</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Information Card */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>معلومات التواصل</Text>
          
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <MaterialIcons name="schedule" size={16} color={COLORS.white} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>ساعات العمل</Text>
              <Text style={styles.contactValue}>24/7 - على مدار الساعة</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <MaterialIcons name="phone" size={16} color={COLORS.white} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>أرقام الطوارئ</Text>
              <Text style={styles.contactValue}>طوارئ طبية: 911 | صيانة: واتساب</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <MaterialIcons name="info" size={16} color={COLORS.white} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>تعليمات مهمة</Text>
              <Text style={styles.contactValue}>اذكر الاسم والعنوان عند الاتصال بالإسعاف</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  logoImage: {
    width: width - 16,
    height: 180,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    marginHorizontal: 8,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#F8F9FA',
  },
  emergencyCard: {
    backgroundColor: COLORS.emergency,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  emergencyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  emergencyBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  emergencyContent: {
    alignItems: 'center',
    paddingTop: 15,
  },
  emergencyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  emergencyDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  emergencyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    width: '100%',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  emergencyButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  contactCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 8,
    textAlign: 'left',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 2,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  contactValue: {
    fontSize: 12,
    color: COLORS.dark,
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  propertyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  propertyCard: {
    width: '48%',
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.background,
    marginBottom: 0,
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  contentContainer: {
    backgroundColor: COLORS.white,
    padding: 4,
    alignItems: 'center',
    marginHorizontal: 0,
    marginTop: 0,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  propertyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 1,
    letterSpacing: 0.1,
    lineHeight: 14,
    width: '100%',
  },
  propertyDescription: {
    fontSize: 9,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 11,
    marginBottom: 4,
    fontWeight: '500',
    width: '100%',
    letterSpacing: 0.1,
    backgroundColor: COLORS.background,
    paddingVertical: 1,
    paddingHorizontal: 3,
    borderRadius: 2,
  },
  moreInfoButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    minWidth: 90,
    transform: [{ scale: 1 }],
  },
  medicalButton: {
    backgroundColor: COLORS.emergency,
    borderColor: '#FF6666',
    shadowColor: COLORS.emergency,
  },
  moreInfoText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
