import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { maintenanceService } from '../../services/database';

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

export default function MaintenanceDetails({ navigation }) {
  const [submittingRequest, setSubmittingRequest] = useState(false);
  
  // أرقام التواصل لكل خدمة
  // رقم الصيانة: +1(216)314-4144
  // رقم الحجوزات: +1(216)644-4441 (للحجوزات فقط)
  const contactNumbers = {
    electrical: {
      whatsapp: '12163144144',  // رقم واتساب صيانة الكهرباء
      phone: '12163144144',     // رقم الاتصال العادي
      hasWhatsApp: true
    },
    plumbing: {
      whatsapp: '12163144144',  // رقم واتساب صيانة السباكة
      phone: '12163144144',     // رقم الاتصال العادي
      hasWhatsApp: true
    },
    ac: {
      whatsapp: '12163144144',  // رقم واتساب صيانة التكييف
      phone: '12163144144',     // رقم الاتصال العادي
      hasWhatsApp: true
    },
    general: {
      whatsapp: '12163144144',  // رقم واتساب الصيانة العامة
      phone: '12163144144',     // رقم الاتصال العادي
      hasWhatsApp: true
    },
    emergency: {
      phone: '911',             // رقم الطوارئ
      hasWhatsApp: false
    }
  };

  const emergencyNumber = '911'; // رقم الإسعاف

  const getMaintenanceRequestTemplate = serviceType => {
    return `🔧 طلب صيانة - ${serviceType}

الاسم:
[اكتب اسمك هنا]

رقم الشقة:

رقم الجوال:

نوع المشكلة:

وصف المشكلة:

صور للمشكلة (إن وجدت):
[ارفق صورة إن أمكن]`;
  };

  const maintenanceServices = [
    {
      id: 1,
      title: 'صيانة الكهرباء',
      description: 'إصلاح الأعطال الكهربائية',
      icon: 'electrical-services',
      urgency: 'عادي',
      serviceType: 'electrical',
      message: getMaintenanceRequestTemplate('الكهرباء'),
    },
    {
      id: 2,
      title: 'صيانة السباكة',
      description: 'إصلاح تسريبات المياه، صيانة الحنفيات',
      icon: 'plumbing',
      urgency: 'عاجل',
      serviceType: 'plumbing',
      message: getMaintenanceRequestTemplate('السباكة'),
    },
    {
      id: 3,
      title: 'صيانة التكييف',
      description: 'صيانة وتنظيف المكيفات، إصلاح الأعطال',
      icon: 'ac-unit',
      urgency: 'عادي',
      serviceType: 'ac',
      message: getMaintenanceRequestTemplate('التكييف'),
    },
    {
      id: 4,
      title: 'صيانة عامة',
      description: 'إصلاح الأبواب والنوافذ',
      icon: 'home-repair-service',
      urgency: 'عادي',
      serviceType: 'general',
      message: getMaintenanceRequestTemplate('الصيانة العامة'),
    },

    {
      id: 5,
      title: 'طوارئ طبية 911',
      description: 'اتصال فوري بالإسعاف للحالات الطبية العاجلة',
      icon: 'local-hospital',
      urgency: 'طوارئ',
      serviceType: 'emergency',
      isEmergencyCall: true,
    },
  ];

  const openWhatsApp = async (message, serviceType) => {
    console.log('🚀 بدء openWhatsApp');
    console.log('📝 serviceType:', serviceType);
    console.log('💬 message length:', message?.length);
    
    try {
      setSubmittingRequest(true);
      console.log('⏳ setSubmittingRequest(true)');

      // Get phone number
      const phoneNumber = contactNumbers[serviceType]?.whatsapp || contactNumbers.general.whatsapp;
      
      console.log('🔧 فتح واتساب');
      console.log('📱 الرقم:', phoneNumber);
      console.log('💬 الرسالة:', message.substring(0, 50) + '...');
      
      // Simple WhatsApp URL - try the most basic format first
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      console.log('🔗 الرابط:', url);
      console.log('🔗 طول الرابط:', url.length);
      
      // Open WhatsApp directly
      console.log('🎯 محاولة فتح الرابط...');
      await Linking.openURL(url);
      console.log('✅ تم فتح الواتساب');

    } catch (error) {
      console.error('❌ خطأ في فتح الواتساب:', error);
      console.log('🔍 نوع الخطأ:', error.name);
      console.log('🔍 رسالة الخطأ:', error.message);
      
      // Try alternative format
      try {
        console.log('🔄 محاولة الرابط البديل...');
        const phoneNumber = contactNumbers[serviceType]?.whatsapp || contactNumbers.general.whatsapp;
        const altUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        console.log('🔄 محاولة الرابط البديل:', altUrl);
        await Linking.openURL(altUrl);
        console.log('✅ تم فتح الواتساب بالرابط البديل');
      } catch (altError) {
        console.error('❌ فشل الرابط البديل:', altError);
        console.log('🔍 نوع خطأ بديل:', altError.name);
        console.log('🔍 رسالة خطأ بديل:', altError.message);
        Alert.alert(
          '⚠️ مشكلة في الواتساب',
          'لا يمكن فتح الواتساب.\n\n• تأكد من تثبيت واتساب\n• جرب زر الاختبار أدناه\n• الرقم: +1(216)314-4144',
          [{ text: 'موافق' }]
        );
      }
    } finally {
      console.log('🏁 انتهاء openWhatsApp');
      setSubmittingRequest(false);
    }
  };

  const callEmergency = () => {
    Linking.openURL(`tel:${emergencyNumber}`).catch(err =>
      console.error('حدث خطأ عند الاتصال بالطوارئ', err)
    );
  };

  const getUrgencyColor = urgency => {
    switch (urgency) {
      case 'طوارئ':
        return '#e74c3c';
      case 'عاجل':
        return '#f39c12';
      default:
        return '#27ae60';
    }
  };

  // زر اختبار مباشر للواتساب
  const testWhatsApp = () => {
    const testNumber = '12163144144';
    const testMessage = 'مرحباً! هذا اختبار من تطبيق راحة للصيانة 🔧';
    
    Alert.alert(
      '🧪 اختبار الواتساب',
      'اختر طريقة الاختبار:',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: '1️⃣ رابط أساسي', 
          onPress: () => {
            const url = `https://wa.me/${testNumber}`;
            console.log('🔗 اختبار رابط أساسي:', url);
            Linking.openURL(url)
              .then(() => {
                console.log('✅ نجح الرابط الأساسي');
                Alert.alert('✅ نجح', 'تم فتح الواتساب بالرابط الأساسي');
              })
              .catch(err => {
                console.log('❌ فشل الرابط الأساسي:', err);
                Alert.alert('❌ فشل', 'الرابط الأساسي: ' + err.message);
              });
          }
        },
        { 
          text: '2️⃣ مع رسالة', 
          onPress: () => {
            const url = `https://wa.me/${testNumber}?text=${encodeURIComponent(testMessage)}`;
            console.log('🔗 اختبار مع رسالة:', url);
            Linking.openURL(url)
              .then(() => {
                console.log('✅ نجح مع رسالة');
                Alert.alert('✅ نجح', 'تم فتح الواتساب مع الرسالة');
              })
              .catch(err => {
                console.log('❌ فشل مع رسالة:', err);
                Alert.alert('❌ فشل', 'مع رسالة: ' + err.message);
              });
          }
        },
        { 
          text: '3️⃣ whatsapp://', 
          onPress: () => {
            const url = `whatsapp://send?phone=${testNumber}&text=${encodeURIComponent(testMessage)}`;
            console.log('🔗 اختبار whatsapp://:', url);
            Linking.openURL(url)
              .then(() => {
                console.log('✅ نجح whatsapp://');
                Alert.alert('✅ نجح', 'تم فتح الواتساب بـ whatsapp://');
              })
              .catch(err => {
                console.log('❌ فشل whatsapp://:', err);
                Alert.alert('❌ فشل', 'whatsapp://: ' + err.message);
              });
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>خدمات الصيانة</Text>
          <Text style={styles.headerSubtitle}>MAINTENANCE SERVICES</Text>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>📋 كيفية طلب الصيانة</Text>
        <Text style={styles.instructionsText}>
          1. اختر نوع الخدمة المطلوبة من القائمة أدناه
          {'\n'}2. سيتم فتح واتساب فوراً مع نموذج جاهز
          {'\n'}3. املأ البيانات المطلوبة في النموذج
          {'\n'}4. أرسل الرسالة وسنتواصل معك على الفور
        </Text>
      </View>

      {/* Services Grid */}
      <View style={styles.servicesContainer}>
        <Text style={styles.sectionTitle}>اختر نوع الخدمة المطلوبة</Text>

        {maintenanceServices.map(service => (
          <TouchableOpacity
            key={service.id}
            style={[
              styles.serviceCard,
              submittingRequest && styles.serviceCardDisabled,
            ]}
            onPress={() =>
              service.isEmergencyCall
                ? callEmergency()
                : openWhatsApp(service.message, service.serviceType)
            }
            activeOpacity={0.8}
            disabled={submittingRequest && !service.isEmergencyCall}
          >
            <View style={styles.serviceHeader}>
              <View style={styles.serviceIconContainer}>
                <MaterialIcons name={service.icon} size={32} color={COLORS.primary} />
              </View>

              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <View
                  style={[
                    styles.urgencyBadge,
                    { backgroundColor: getUrgencyColor(service.urgency) },
                  ]}
                >
                  <Text style={styles.urgencyText}>{service.urgency}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.serviceDescription}>{service.description}</Text>

            <View
              style={[
                styles.requestButton,
                submittingRequest &&
                  !service.isEmergencyCall &&
                  styles.requestButtonDisabled,
              ]}
            >
              <MaterialIcons
                name={
                  submittingRequest && !service.isEmergencyCall
                    ? 'hourglass-empty'
                    : service.isEmergencyCall
                      ? 'phone'
                      : 'chat'
                }
                size={20}
                color="#ffffff"
              />
              <Text style={styles.requestButtonText}>
                {submittingRequest && !service.isEmergencyCall
                  ? 'جاري إرسال الطلب...'
                  : service.isEmergencyCall
                    ? 'اتصال بالإسعاف فوراً'
                    : `📱 واتساب: +1(216)314-4144`}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contact Info */}
      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>معلومات التواصل</Text>

        <View style={styles.contactCard}>
          <MaterialIcons name="schedule" size={24} color={COLORS.primary} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>ساعات العمل</Text>
            <Text style={styles.contactValue}>24/7 - على مدار الساعة</Text>
          </View>
        </View>

        <View style={styles.contactCard}>
          <MaterialIcons name="local-hospital" size={24} color={COLORS.emergency} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>طوارئ طبية</Text>
            <Text style={styles.contactValue}>اتصل بـ 911 فوراً</Text>
          </View>
        </View>

        <View style={styles.contactCard}>
          <MaterialIcons name="whatsapp" size={24} color={COLORS.whatsapp} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>أرقام التواصل</Text>
            <Text style={styles.contactValue}>
              🔧 الصيانة: +1(216)314-4144
              {'\n'}📅 الحجوزات: +1(216)644-4441
              {'\n'}📱 واتساب متاح على كلا الرقمين
            </Text>
          </View>
        </View>

        <View style={styles.contactCard}>
          <MaterialIcons name="info" size={24} color={COLORS.primary} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>تعليمات مهمة</Text>
            <Text style={styles.contactValue}>
              • التطبيق يفتح واتساب الصيانة تلقائياً{'\n'}
              • املأ النموذج الجاهز بالتفاصيل{'\n'}
              • إذا لم يفتح الواتساب، جرب زر الاختبار أدناه{'\n'}
              • للحجوزات اتصل بـ +1(216)644-4441{'\n'}
              • للطوارئ الطبية اتصل بـ 911
            </Text>
          </View>
        </View>

        {/* Test WhatsApp Button */}
        <TouchableOpacity 
          style={[styles.requestButton, { backgroundColor: COLORS.whatsapp, marginTop: 15 }]} 
          onPress={testWhatsApp}
        >
          <MaterialIcons name="bug-report" size={20} color="#ffffff" />
          <Text style={[styles.requestButtonText, { marginLeft: 8 }]}>
            🧪 اختبار فتح الواتساب
          </Text>
        </TouchableOpacity>
      </View>

      {/* Emergency Contact */}
      <TouchableOpacity style={styles.emergencyButton} onPress={callEmergency}>
        <MaterialIcons name="local-hospital" size={28} color={COLORS.white} />
        <Text style={styles.emergencyButtonText}>
          طوارئ طبية - اتصال بالإسعاف 911
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#d35400',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 5,
    letterSpacing: 1,
  },
  instructionsContainer: {
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#d35400',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d35400',
    marginBottom: 15,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  instructionsText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 22,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  servicesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 25,
    writingDirection: 'rtl',
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffeaa7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
    writingDirection: 'rtl',
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  urgencyText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
    writingDirection: 'rtl',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 15,
    writingDirection: 'rtl',
  },
  requestButton: {
    backgroundColor: '#27ae60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
  },
  requestButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
    writingDirection: 'rtl',
  },
  contactSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
    writingDirection: 'rtl',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  contactInfo: {
    marginLeft: 15,
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    writingDirection: 'rtl',
  },
  contactValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
    marginTop: 2,
    writingDirection: 'rtl',
  },
  emergencyButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 30,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  emergencyButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    writingDirection: 'rtl',
  },
  serviceCardDisabled: {
    opacity: 0.6,
  },
  requestButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
});
