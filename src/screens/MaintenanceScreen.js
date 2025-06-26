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

export default function MaintenanceScreen({ navigation }) {
  const maintenanceServices = [
    {
      id: 1,
      title: 'صيانة الكهرباء',
      titleEn: 'Electrical Maintenance',
      description: 'إصلاح الأعطال الكهربائية',
      descriptionEn: 'Electrical repairs and troubleshooting',
      icon: 'bolt',
      priority: 'عادي',
      priorityEn: 'Normal',
      priorityColor: '#4CAF50',
      whatsappMessage: `السلام عليكم
أحتاج خدمة صيانة كهرباء

📍 الموقع: 
🏠 رقم الشقة: 
📱 رقم الهاتف: 
⏰ الوقت المفضل: 
📝 تفاصيل المشكلة: 

شكراً لكم`
    },
    {
      id: 2,
      title: 'صيانة السباكة',
      titleEn: 'Plumbing Maintenance',
      description: 'إصلاح تسريبات المياه، صيانة الحنفيات',
      descriptionEn: 'Water leaks repair, faucet maintenance',
      icon: 'water-drop',
      priority: 'عاجل',
      priorityEn: 'Urgent',
      priorityColor: '#FF9800',
      whatsappMessage: `السلام عليكم
أحتاج خدمة صيانة سباكة عاجلة

📍 الموقع: 
🏠 رقم الشقة: 
📱 رقم الهاتف: 
⏰ الوقت المفضل: 
📝 تفاصيل المشكلة: 
💧 نوع المشكلة: (تسريب/انسداد/أخرى)

شكراً لكم`
    },
    {
      id: 3,
      title: 'صيانة التكييف',
      titleEn: 'AC Maintenance',
      description: 'صيانة وتنظيف المكيفات، إصلاح الأعطال',
      descriptionEn: 'AC cleaning, maintenance and repairs',
      icon: 'ac-unit',
      priority: 'عادي',
      priorityEn: 'Normal',
      priorityColor: '#4CAF50',
      whatsappMessage: `السلام عليكم
أحتاج خدمة صيانة تكييف

📍 الموقع: 
🏠 رقم الشقة: 
📱 رقم الهاتف: 
⏰ الوقت المفضل: 
📝 تفاصيل المشكلة: 
❄️ نوع المشكلة: (تنظيف/إصلاح/صيانة دورية)

شكراً لكم`
    },
    {
      id: 4,
      title: 'صيانة عامة',
      titleEn: 'General Maintenance',
      description: 'إصلاح الأبواب والنوافذ',
      descriptionEn: 'Doors and windows repair',
      icon: 'home-repair-service',
      priority: 'عادي',
      priorityEn: 'Normal',
      priorityColor: '#4CAF50',
      whatsappMessage: `السلام عليكم
أحتاج خدمة صيانة عامة

📍 الموقع: 
🏠 رقم الشقة: 
📱 رقم الهاتف: 
⏰ الوقت المفضل: 
📝 تفاصيل المشكلة: 
🔧 نوع الصيانة: (أبواب/نوافذ/أخرى)

شكراً لكم`
    }
  ];

  const openWhatsApp = (message) => {
    const whatsappUrl = 'https://wa.me/message/SDLDLIW54YJQK1';
    const url = `${whatsappUrl}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to direct WhatsApp URL without message
        Linking.openURL(whatsappUrl).catch(() => {
          Alert.alert(
            'واتساب غير متاح | WhatsApp Not Available',
            'يرجى تثبيت واتساب أولاً أو التواصل مباشرة\nPlease install WhatsApp first or contact directly',
            [{ text: 'حسناً | OK', style: 'default' }]
          );
        });
      }
    });
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" backgroundColor={COLORS.primary} />
      
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
          <Text style={styles.headerTitle}>خدمات الصيانة</Text>
          <Text style={styles.headerSubtitle}>MAINTENANCE SERVICES</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Instructions Section */}
        <View style={styles.instructionsSection}>
          <View style={styles.instructionsHeader}>
            <MaterialIcons name="info" size={24} color={COLORS.primary} />
            <Text style={styles.instructionsTitle}>كيفية طلب الصيانة</Text>
          </View>
          
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>1.</Text>
              <Text style={styles.instructionText}>اختر نوع الخدمة المطلوبة من القائمة أدناه</Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>2.</Text>
              <Text style={styles.instructionText}>سيتم فتح واتساب مع نموذج جاهز</Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>3.</Text>
              <Text style={styles.instructionText}>املأ البيانات المطلوبة في النموذج</Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>4.</Text>
              <Text style={styles.instructionText}>أرسل الرسالة وسنتواصل معك فوراً</Text>
            </View>
          </View>
        </View>

        {/* Service Selection Title */}
        <View style={styles.servicesTitleSection}>
          <Text style={styles.servicesTitle}>اختر نوع الخدمة المطلوبة</Text>
          <Text style={styles.servicesTitleEn}>Select Required Service Type</Text>
        </View>

        {/* Maintenance Services */}
        {maintenanceServices.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <View style={styles.serviceIcon}>
                <MaterialIcons name={service.icon} size={32} color={COLORS.primary} />
              </View>
              <View style={styles.serviceInfo}>
                <View style={styles.serviceTitleContainer}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: service.priorityColor }]}>
                    <Text style={styles.priorityText}>{service.priority}</Text>
                  </View>
                </View>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={() => openWhatsApp(service.whatsappMessage)}
            >
              <MaterialIcons name="chat" size={20} color={COLORS.white} />
              <Text style={styles.whatsappButtonText}>طلب الخدمة عبر واتساب</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Emergency Medical Service */}
        <View style={styles.emergencyCard}>
          <View style={styles.serviceHeader}>
            <View style={styles.emergencyIcon}>
              <MaterialIcons name="local-hospital" size={32} color={COLORS.white} />
            </View>
            <View style={styles.serviceInfo}>
              <View style={styles.serviceTitleContainer}>
                <Text style={styles.emergencyTitle}>طوارئ طبية 911</Text>
                <View style={styles.emergencyBadge}>
                  <Text style={styles.emergencyBadgeText}>طوارئ</Text>
                </View>
              </View>
              <Text style={styles.emergencyDescription}>اتصال فوري بالإسعاف للحالات الطبية العاجلة</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={callEmergency}
          >
            <MaterialIcons name="phone" size={20} color={COLORS.white} />
            <Text style={styles.emergencyButtonText}>اتصال بالإسعاف فوراً</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>معلومات التواصل</Text>
          
          <View style={styles.contactItem}>
            <MaterialIcons name="schedule" size={24} color={COLORS.primary} />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>ساعات العمل</Text>
              <Text style={styles.contactValue}>24/7 - على مدار الساعة</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <MaterialIcons name="phone" size={24} color={COLORS.primary} />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>أرقام الطوارئ</Text>
              <Text style={styles.contactValue}>طوارئ طبية: 911 | صيانة: واتساب</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <MaterialIcons name="info" size={24} color={COLORS.primary} />
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactLabel}>تعليمات مهمة</Text>
              <Text style={styles.contactValue}>اذكر الاسم والعنوان عند الاتصال بالإسعاف</Text>
            </View>
          </View>
        </View>

        {/* Emergency Call Button */}
        <TouchableOpacity style={styles.emergencyCallButton} onPress={callEmergency}>
          <MaterialIcons name="local-hospital" size={24} color={COLORS.white} />
          <Text style={styles.emergencyCallText}>طوارئ طبية - اتصال بالإسعاف 911</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.card,
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
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
    color: COLORS.dark,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  instructionsSection: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginLeft: 10,
  },
  instructionsList: {
    paddingLeft: 10,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    width: 25,
  },
  instructionText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    lineHeight: 20,
  },
  servicesTitleSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  servicesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
  },
  servicesTitleEn: {
    fontSize: 14,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 4,
  },
  serviceCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(184, 149, 109, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'rgba(184, 149, 109, 0.2)',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  whatsappButton: {
    backgroundColor: COLORS.whatsapp,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
  },
  whatsappButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emergencyCard: {
    backgroundColor: COLORS.emergency,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
  },
  emergencyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emergencyBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emergencyDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  emergencyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  emergencyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  contactSection: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 15,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: '500',
  },
  emergencyCallButton: {
    backgroundColor: COLORS.emergency,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: COLORS.emergency,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emergencyCallText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 