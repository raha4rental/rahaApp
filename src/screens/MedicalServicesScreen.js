import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Add unified color constants
const COLORS = {
  primary: '#B8956D',      // Brand gold/bronze color
  emergency: '#FF4444',    // Emergency red
  whatsapp: '#25D366',     // WhatsApp green
  white: '#ffffff',        // White for text on colored backgrounds
  dark: '#2C3E50',        // Dark text
  background: '#f8f9fa',   // Light background
  card: '#ffffff',         // Card background
  border: '#e8ecf0',       // Border color
  shadow: 'rgba(0,0,0,0.1)' // Shadow color
};

export default function MedicalServicesScreen({ navigation }) {
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

  const openWhatsAppMaintenance = () => {
    const phoneNumber = '+12166444441';
    const message = `السلام عليكم
أحتاج مساعدة في الصيانة

📍 الموقع: 
🏠 رقم الشقة: 
📱 رقم الهاتف: 
⏰ الوقت المفضل: 
📝 تفاصيل المشكلة: 

شكراً لكم`;
    
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(
          'واتساب غير متاح | WhatsApp Not Available',
          `يرجى التواصل عبر الرقم: ${phoneNumber}\nPlease contact via: ${phoneNumber}`,
          [{ text: 'حسناً | OK', style: 'default' }]
        );
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" backgroundColor="#F44336" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.dark} />
          <Text style={styles.backText}>العودة</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>الخدمات الطبية</Text>
          <Text style={styles.headerSubtitle}>MEDICAL SERVICES</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Emergency Medical Service Card */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyBadge}>
            <Text style={styles.emergencyBadgeText}>طوارئ</Text>
          </View>
          
          <View style={styles.emergencyContent}>
            <View style={styles.emergencyIconContainer}>
              <MaterialIcons name="local-hospital" size={28} color={COLORS.white} />
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
              <MaterialIcons name="schedule" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>ساعات العمل</Text>
              <Text style={styles.contactValue}>24/7 - على مدار الساعة</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <MaterialIcons name="phone" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>أرقام الطوارئ</Text>
              <Text style={styles.contactValue}>طوارئ طبية: 911 | صيانة: واتساب</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <View style={styles.contactIconContainer}>
              <MaterialIcons name="info" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>تعليمات مهمة</Text>
              <Text style={styles.contactValue}>اذكر الاسم والعنوان عند الاتصال بالإسعاف</Text>
            </View>
          </View>
        </View>

        {/* Bottom Emergency Call Button */}
        <TouchableOpacity style={styles.bottomEmergencyButton} onPress={callEmergency}>
          <MaterialIcons name="local-hospital" size={24} color={COLORS.white} />
          <Text style={styles.bottomEmergencyText}>طوارئ طبية - اتصال بالإسعاف 911</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#F44336',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  emergencyCard: {
    backgroundColor: '#F44336',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  emergencyBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  emergencyBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emergencyContent: {
    alignItems: 'center',
    paddingTop: 20,
  },
  emergencyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emergencyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emergencyDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  emergencyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    width: '100%',
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    lineHeight: 20,
  },
  bottomEmergencyButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 40,
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bottomEmergencyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 