import React, { useState } from 'react';
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
  FlatList,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

// Add unified color constants
const COLORS = {
  primary: '#B8956D',      // Brand gold/bronze color
  emergency: '#FF4444',    // Emergency red
  whatsapp: '#25D366',     // WhatsApp green
  white: '#ffffff',        // White for text on colored backgrounds
  dark: '#2C3E50',        // Dark text
  background: '#f0f4f8',   // Light background
  card: '#ffffff',         // Card background
  border: '#e8ecf0',       // Border color
  shadow: 'rgba(0,0,0,0.1)' // Shadow color
};

export default function PropertyDetails({ route, navigation }) {
  const { property } = route.params || {};
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!property) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>خطأ في تحميل البيانات</Text>
          <Text style={styles.errorTextEn}>Error loading data</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get all images for the property
  const getAllImages = () => {
    const images = [property.image];
    if (property.apartments) {
      property.apartments.forEach(apt => {
        if (apt.image) images.push(apt.image);
      });
    }
    return images;
  };

  const images = getAllImages();

  const handleBooking = (apartment) => {
    Alert.alert(
      `حجز ${apartment.type} | Book ${apartment.type}`,
      `السعر: ${apartment.price} يومياً\nPrice: ${apartment.price} daily\n\nالمزايا المشمولة:\nIncluded Features:\n${apartment.features.slice(0,3).join('\n')}\n\nهل تريد المتابعة؟\nProceed with booking?`,
      [
        { text: 'إلغاء | Cancel', style: 'cancel' },
        { 
          text: 'احجز الآن | Book Now', 
          onPress: () => {
            Alert.alert(
              'تم تأكيد طلب الحجز | Booking Request Confirmed',
              'سيتم التواصل معك خلال 30 دقيقة لتأكيد التفاصيل\nWe will contact you within 30 minutes to confirm details\n\nرقم التواصل: +12166444441'
            );
          }
        }
      ]
    );
  };

  const handleWhatsAppBooking = (apartment) => {
    const message = `مرحباً، أريد حجز ${apartment.type} في ${property.title}\nالسعر: ${apartment.price} يومياً\n\nHello, I want to book ${apartment.type} at ${property.titleEn}\nPrice: ${apartment.price} daily`;
    
    Alert.alert(
      'حجز عبر واتساب | WhatsApp Booking',
      `سيتم فتح واتساب لإرسال رسالة الحجز\nWhatsApp will open to send booking message\n\nالرسالة:\n"${message}"\n\nرقم واتساب: +12166444441`,
      [
        { text: 'إلغاء | Cancel', style: 'cancel' },
        { text: 'فتح واتساب | Open WhatsApp', onPress: () => console.log('Opening WhatsApp...') }
      ]
    );
  };

  const openWhatsApp = () => {
    Alert.alert(
      'تواصل عبر واتساب | WhatsApp Contact',
      'رقم التواصل: +12166444441\nاضغط للنسخ أو المراسلة\n\nContact: +12166444441\nTap to copy or message',
      [
        { text: 'إغلاق | Close', style: 'cancel' },
        { text: 'فتح واتساب | Open WhatsApp', onPress: () => console.log('Opening WhatsApp...') }
      ]
    );
  };

  const renderImageItem = ({ item, index }) => (
    <Image
      source={item}
      style={styles.carouselImage}
      resizeMode="cover"
    />
  );

  const renderDotIndicator = () => (
    <View style={styles.dotContainer}>
      {images.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentImageIndex ? styles.activeDot : styles.inactiveDot
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" backgroundColor="#4CAF50" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.dark} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{property.titleEn} | {property.title}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageSection}>
          <FlatList
            data={images}
            renderItem={renderImageItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(slideIndex);
            }}
            scrollEventThrottle={16}
          />
          {renderDotIndicator()}
          
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>
              {property.id === 2 ? 'الفانتج - حيث الرفاهية تلتقي بالموقع المثالي' : 
               property.id === 1 ? 'سكن الأستر حيث الفخامة والرقي' :
               property.id === 3 ? 'لوموس - الهدوء والراحة في حرم المستشفى' :
               property.id === 4 ? 'شقق المستشفى - الأمان والرعاية المتكاملة' :
               'مجمع سكني فاخر'}
            </Text>
            <Text style={styles.heroSubtitle}>
              {property.id === 2 ? 'Vantage - Where Luxury Meets Perfect Location' :
               property.id === 1 ? 'Luxury and Elegance at Aster Residence' :
               property.id === 3 ? 'Lumos - Peace and Comfort in Hospital Campus' :
               property.id === 4 ? 'Hospital Apartments - Safety and Comprehensive Care' :
               'Luxury Residential Complex'}
            </Text>
          </View>
        </View>

        {/* Property Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>تفاصيل السكن</Text>
          <Text style={styles.sectionSubtitle}>RESIDENCE DETAILS</Text>
          
          <Text style={styles.description}>
            {property.id === 2 ? 
              'يقع مجمع الفانتج السكني في أفضل المواقع الاستراتيجية مباشرة أمام أكبر مجمع تجاري في المنطقة، مما يوفر سهولة الوصول إلى جميع الخدمات والمتاجر. يتميز المجمع بمساحاته الواسعة الاستثنائية ووجود مجالس منفصلة للرجال والنساء تحترم الخصوصية والتقاليد. بالإضافة إلى قربه من مستشفى كليفلاند كلينك بيتشود الشهير عالمياً، مما يضمن الحصول على أفضل الخدمات الطبية.' :
             property.id === 1 ?
              'يقع سكن الأستر في موقع مميز يجمع بين الهدوء والراحة مع القرب من جميع الخدمات الأساسية. يتميز المجمع بتصميمه العصري والفاخر، حيث تم تجهيز جميع الشقق بأعلى معايير الجودة والرفاهية. يوفر المجمع بيئة سكنية مثالية للعائلات والأفراد الباحثين عن الراحة والخصوصية.' :
                          property.id === 3 ?
               'يقع مجمع لوموس في موقع استراتيجي على مسافة دقيقتين مشي فقط من مستشفى كليفلاند كلينك الشهير عالمياً، كما يقع بالقرب من مستشفى الجامعة. يوفر المجمع بيئة هادئة وآمنة ومناسبة للمرضى ومرافقيهم، مع توفير أعلى مستويات الأمان والراحة والهدوء اللازمين للشفاء والاستجمام.' :
                            property.id === 4 ?
                'تقع شقق المستشفى على مسافة أربع دقائق فقط من المستشفى في قلب المدينة، وتوفر أعلى مستويات الأمان والراحة. تم تصميمها خصيصاً لخدمة المرضى وعائلاتهم، مع إمكانية الوصول السريع إلى جميع الخدمات الطبية والطوارئ.' :
              'مجمع سكني فاخر يوفر جميع وسائل الراحة والرفاهية.'
            }
          </Text>
          
          <Text style={styles.descriptionEn}>
            {property.id === 2 ?
              'Vantage Residential Complex is strategically located directly facing the largest commercial complex in the area, providing easy access to all services and stores. The complex features exceptional spacious areas and separate majlis for men and women that respect privacy and traditions. Additionally, its proximity to the world-renowned Cleveland Clinic Bitchood ensures access to the finest medical services.' :
             property.id === 1 ?
              'Aster Residential Complex is located in a prime location that combines tranquility and comfort with proximity to all essential services. The complex features modern and luxurious design, with all apartments equipped to the highest standards of quality and comfort. It provides an ideal residential environment for families and individuals seeking comfort and privacy.' :
                           property.id === 3 ?
               'Lumos Complex is strategically located just a 2-minute walk from the world-renowned Cleveland Clinic hospital, and close to University Hospital. The complex provides a quiet, safe and suitable environment for patients and their companions, offering the highest levels of security, comfort and tranquility necessary for healing and recuperation.' :
                           property.id === 4 ?
               'Hospital Apartments are located just 4 minutes away from the hospital in the heart of the city, providing the highest levels of safety and comfort. They are specially designed to serve patients and their families, with quick access to all medical services and emergencies.' :
              'A luxury residential complex providing all means of comfort and luxury.'
            }
          </Text>
        </View>

        {/* Key Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>
            {property.id === 2 ? 'مزايا الفانتج الاستثنائية' :
             property.id === 1 ? 'مزايا سكن الأستر المميزة' :
             property.id === 3 ? 'مزايا لوموس الطبية' :
             property.id === 4 ? 'مزايا شقق المستشفى' :
             'المزايا الرئيسية'}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {property.id === 2 ? 'VANTAGE EXCEPTIONAL FEATURES' :
             property.id === 1 ? 'ASTER UNIQUE FEATURES' :
             property.id === 3 ? 'LUMOS MEDICAL FEATURES' :
             property.id === 4 ? 'HOSPITAL APARTMENTS FEATURES' :
             'KEY FEATURES'}
          </Text>
          
          <View style={styles.featureGrid}>
            {property.id === 2 ? (
              // Vantage Features
              <>
                <View style={styles.featureCard}>
                  <MaterialIcons name="store-mall-directory" size={32} color={COLORS.primary} />
                  <Text style={styles.featureTitle}>أمام أكبر مجمع تجاري</Text>
                  <Text style={styles.featureDesc}>موقع استراتيجي أمام أكبر مجمع تجاري</Text>
                </View>
                
                <View style={styles.featureCard}>
                  <MaterialIcons name="groups" size={32} color={COLORS.primary} />
                  <Text style={styles.featureTitle}>مجالس منفصلة</Text>
                  <Text style={styles.featureDesc}>مجالس خاصة للرجال والنساء</Text>
                </View>
                
                <View style={styles.featureCard}>
                  <MaterialIcons name="local-hospital" size={32} color={COLORS.primary} />
                  <Text style={styles.featureTitle}>كليفلاند كلينك</Text>
                  <Text style={styles.featureDesc}>قرب من مستشفى كليفلاند كلينك بيتشود</Text>
                </View>
                
                <View style={styles.featureCard}>
                  <MaterialIcons name="aspect-ratio" size={32} color={COLORS.primary} />
                  <Text style={styles.featureTitle}>مساحات استثنائية</Text>
                  <Text style={styles.featureDesc}>مساحات واسعة وفاخرة</Text>
                </View>
              </>
            ) : property.id === 3 ? (
              // Lumos Features
              <>
                <View style={styles.featureCard}>
                  <MaterialIcons name="security" size={32} color={COLORS.primary} />
                  <Text style={styles.featureTitle}>أمن عالي</Text>
                  <Text style={styles.featureDesc}>أنظمة أمان متطورة وحراسة مستمرة</Text>
                </View>
                
                <View style={styles.featureCard}>
                  <MaterialIcons name="local-hospital" size={32} color={COLORS.primary} />
                  <Text style={styles.featureTitle}>قريب من كليفلاند كلينك</Text>
                  <Text style={styles.featureDesc}>دقيقتين مشي من مستشفى كليفلاند</Text>
                </View>
                
                <View style={styles.featureCard}>
                  <MaterialIcons name="medical-services" size={32} color={COLORS.primary} />
                  <Text style={styles.featureTitle}>قريب من مستشفى الجامعة</Text>
                  <Text style={styles.featureDesc}>وصول سريع لمستشفى الجامعة</Text>
                </View>
                
                <View style={styles.featureCard}>
                  <MaterialIcons name="tranquil" size={32} color={COLORS.primary} />
                  <Text style={styles.featureTitle}>بيئة هادئة</Text>
                  <Text style={styles.featureDesc}>جو مناسب للشفاء والراحة</Text>
                </View>
              </>
            ) : (
              // Default Features for other properties
              <>
                <View style={styles.featureCard}>
                  <MaterialIcons name="security" size={32} color={COLORS.primary} />
                  <Text style={styles.featureTitle}>أمان وحراسة</Text>
                  <Text style={styles.featureDesc}>حراسة 24 ساعة وأنظمة أمان متطورة</Text>
                </View>
                
                <View style={styles.featureCard}>
                  <MaterialIcons name="home" size={32} color={COLORS.primary} />
                  <Text style={styles.featureTitle}>تصميم فاخر</Text>
                  <Text style={styles.featureDesc}>تشطيبات عالية الجودة وتصميم عصري</Text>
                </View>
                
                <View style={styles.featureCard}>
                  <MaterialIcons name="wifi" size={32} color={COLORS.primary} />
                  <Text style={styles.featureTitle}>إنترنت فائق السرعة</Text>
                  <Text style={styles.featureDesc}>شبكة إنترنت عالية السرعة مجانية</Text>
                </View>
                
                <View style={styles.featureCard}>
                  <MaterialIcons name="local-parking" size={32} color={COLORS.primary} />
                  <Text style={styles.featureTitle}>مواقف مجانية</Text>
                  <Text style={styles.featureDesc}>مواقف سيارات مخصصة ومؤمنة</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Exclusive Facilities */}
        <View style={styles.facilitiesSection}>
          <Text style={styles.sectionTitle}>
            {property.id === 2 ? 'خدمات الفانتج المتميزة' :
             property.id === 1 ? 'خدمات سكن الأستر المتكاملة' :
             property.id === 3 ? 'خدمات لوموس الطبية' :
             property.id === 4 ? 'خدمات شقق المستشفى' :
             'الخدمات المتكاملة'}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {property.id === 2 ? 'VANTAGE PREMIUM SERVICES' :
             property.id === 1 ? 'ASTER INTEGRATED SERVICES' :
             property.id === 3 ? 'LUMOS MEDICAL SERVICES' :
             property.id === 4 ? 'HOSPITAL APARTMENTS SERVICES' :
             'INTEGRATED SERVICES'}
          </Text>
          
          <View style={styles.facilitiesGrid}>
            {property.id === 3 ? (
              // Lumos specific services
              <>
                <View style={styles.facilityItem}>
                  <MaterialIcons name="security" size={24} color={COLORS.primary} />
                  <View style={styles.facilityContent}>
                    <Text style={styles.facilityTitle}>أمن عالي</Text>
                    <Text style={styles.facilityDesc}>حراسة متخصصة وأنظمة مراقبة متطورة</Text>
                  </View>
                </View>
                
                <View style={styles.facilityItem}>
                  <MaterialIcons name="local-hospital" size={24} color={COLORS.primary} />
                  <View style={styles.facilityContent}>
                    <Text style={styles.facilityTitle}>قريب من كليفلاند كلينك</Text>
                    <Text style={styles.facilityDesc}>مسافة دقيقتين مشي فقط من المستشفى الشهير</Text>
                  </View>
                </View>
                
                <View style={styles.facilityItem}>
                  <MaterialIcons name="medical-services" size={24} color={COLORS.primary} />
                  <View style={styles.facilityContent}>
                    <Text style={styles.facilityTitle}>قريب من مستشفى الجامعة</Text>
                    <Text style={styles.facilityDesc}>وصول سهل وسريع لمستشفى الجامعة</Text>
                  </View>
                </View>
                
                <View style={styles.facilityItem}>
                  <MaterialIcons name="health-and-safety" size={24} color={COLORS.primary} />
                  <View style={styles.facilityContent}>
                    <Text style={styles.facilityTitle}>خدمات طبية متاحة</Text>
                    <Text style={styles.facilityDesc}>إمكانية الوصول للعناية الطبية الفورية</Text>
                  </View>
                </View>
              </>
            ) : property.id === 4 ? (
              // Hospital apartments specific services
              <>
                <View style={styles.facilityItem}>
                  <MaterialIcons name="local-hospital" size={24} color={COLORS.primary} />
                  <View style={styles.facilityContent}>
                    <Text style={styles.facilityTitle}>قريب من المستشفى</Text>
                    <Text style={styles.facilityDesc}>مسافة 4 دقائق فقط من المستشفى</Text>
                  </View>
                </View>
                
                <View style={styles.facilityItem}>
                  <MaterialIcons name="security" size={24} color={COLORS.primary} />
                  <View style={styles.facilityContent}>
                    <Text style={styles.facilityTitle}>أمان مضاعف</Text>
                    <Text style={styles.facilityDesc}>أنظمة أمان متطورة وحراسة مستمرة</Text>
                  </View>
                </View>
                
                <View style={styles.facilityItem}>
                  <MaterialIcons name="emergency" size={24} color={COLORS.primary} />
                  <View style={styles.facilityContent}>
                    <Text style={styles.facilityTitle}>خدمة طوارئ سريعة</Text>
                    <Text style={styles.facilityDesc}>وصول سريع لخدمات الطوارئ الطبية</Text>
                  </View>
                </View>
                
                <View style={styles.facilityItem}>
                  <MaterialIcons name="local-laundry-service" size={24} color={COLORS.primary} />
                  <View style={styles.facilityContent}>
                    <Text style={styles.facilityTitle}>غسالة ونشافة</Text>
                    <Text style={styles.facilityDesc}>غسالة ونشافة داخل كل شقة</Text>
                  </View>
                </View>
              </>
            ) : (
              // Default services for Aster & Vantage
              <>
                <View style={styles.facilityItem}>
                  <MaterialIcons name="build" size={24} color={COLORS.primary} />
                  <View style={styles.facilityContent}>
                    <Text style={styles.facilityTitle}>خدمة الصيانة</Text>
                    <Text style={styles.facilityDesc}>فريق صيانة متاح على مدار الساعة</Text>
                  </View>
                </View>
                
                <View style={styles.facilityItem}>
                  <MaterialIcons name="local-laundry-service" size={24} color={COLORS.primary} />
                  <View style={styles.facilityContent}>
                    <Text style={styles.facilityTitle}>غسالة ونشافة</Text>
                    <Text style={styles.facilityDesc}>غسالة ونشافة داخل كل شقة</Text>
                  </View>
                </View>
                
                <View style={styles.facilityItem}>
                  <MaterialIcons name="fitness-center" size={24} color={COLORS.primary} />
                  <View style={styles.facilityContent}>
                    <Text style={styles.facilityTitle}>صالة رياضية</Text>
                    <Text style={styles.facilityDesc}>مجهزة بأحدث الأجهزة الرياضية</Text>
                  </View>
                </View>
                
                <View style={styles.facilityItem}>
                  <MaterialIcons name="wifi" size={24} color={COLORS.primary} />
                  <View style={styles.facilityContent}>
                    <Text style={styles.facilityTitle}>إنترنت عالي السرعة</Text>
                    <Text style={styles.facilityDesc}>شبكة إنترنت مجانية عالية الجودة</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Vantage Special Features Section */}
        {property.id === 2 && (
          <View style={styles.vantageSpecialSection}>
            <Text style={styles.sectionTitle}>مزايا الفانتج الحصرية</Text>
            <Text style={styles.sectionSubtitle}>VANTAGE EXCLUSIVE ADVANTAGES</Text>
            
            <View style={styles.vantageDetailsGrid}>
              <View style={styles.vantageDetailCard}>
                <MaterialIcons name="store" size={40} color={COLORS.primary} />
                <Text style={styles.vantageDetailTitle}>المجمع التجاري</Text>
                <Text style={styles.vantageDetailDesc}>
                  موقع استثنائي مباشرة أمام أكبر مجمع تجاري في المنطقة، يضم مئات المتاجر والمطاعم والخدمات، مع سهولة الوصول سيراً على الأقدام
                </Text>
              </View>
              
              <View style={styles.vantageDetailCard}>
                <MaterialIcons name="meeting-room" size={40} color={COLORS.primary} />
                <Text style={styles.vantageDetailTitle}>المجالس المنفصلة</Text>
                <Text style={styles.vantageDetailDesc}>
                  تصميم يحترم التقاليد مع مجالس منفصلة للرجال والنساء، مزودة بأثاث فاخر ونظام تكييف منفصل وخصوصية تامة
                </Text>
              </View>
              
              <View style={styles.vantageDetailCard}>
                <MaterialIcons name="local-hospital" size={40} color={COLORS.primary} />
                <Text style={styles.vantageDetailTitle}>كليفلاند كلينك بيتشود</Text>
                <Text style={styles.vantageDetailDesc}>
                  قربه من مستشفى كليفلاند كلينك بيتشود الشهير عالمياً، مما يوفر الوصول إلى أفضل الخدمات الطبية والتخصصات النادرة
                </Text>
              </View>
              
              <View style={styles.vantageDetailCard}>
                <MaterialIcons name="square-foot" size={40} color={COLORS.primary} />
                <Text style={styles.vantageDetailTitle}>المساحات الاستثنائية</Text>
                <Text style={styles.vantageDetailDesc}>
                  شقق بمساحات واسعة جداً تبدأ من 120 متر مربع، مع أسقف عالية ونوافذ كبيرة وتصميم داخلي فاخر يناسب العائلات الكبيرة
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Lumos Medical Features Section */}
        {property.id === 3 && (
          <View style={styles.vantageSpecialSection}>
            <Text style={styles.sectionTitle}>مزايا لوموس الطبية المتميزة</Text>
            <Text style={styles.sectionSubtitle}>LUMOS DISTINGUISHED MEDICAL ADVANTAGES</Text>
            
            <View style={styles.vantageDetailsGrid}>
              <View style={styles.vantageDetailCard}>
                <MaterialIcons name="local-hospital" size={40} color={COLORS.primary} />
                <Text style={styles.vantageDetailTitle}>كليفلاند كلينك</Text>
                <Text style={styles.vantageDetailDesc}>
                  موقع مثالي على مسافة دقيقتين مشي فقط من مستشفى كليفلاند كلينك الشهير عالمياً، مما يوفر وصولاً سريعاً وسهلاً للخدمات الطبية المتقدمة
                </Text>
              </View>
              
              <View style={styles.vantageDetailCard}>
                <MaterialIcons name="medical-services" size={40} color={COLORS.primary} />
                <Text style={styles.vantageDetailTitle}>مستشفى الجامعة</Text>
                <Text style={styles.vantageDetailDesc}>
                  قرب استراتيجي من مستشفى الجامعة مع إمكانية الوصول السريع لجميع التخصصات الطبية والخدمات الصحية المتنوعة
                </Text>
              </View>
              
              <View style={styles.vantageDetailCard}>
                <MaterialIcons name="security" size={40} color={COLORS.primary} />
                <Text style={styles.vantageDetailTitle}>أمن عالي المستوى</Text>
                <Text style={styles.vantageDetailDesc}>
                  نظام أمني متطور مع حراسة متخصصة على مدار الساعة وأنظمة مراقبة حديثة لضمان الأمان والراحة التامة للمقيمين
                </Text>
              </View>
              
              <View style={styles.vantageDetailCard}>
                <MaterialIcons name="healing" size={40} color={COLORS.primary} />
                <Text style={styles.vantageDetailTitle}>بيئة العلاج والشفاء</Text>
                <Text style={styles.vantageDetailDesc}>
                  تصميم خاص يوفر بيئة هادئة ومريحة مناسبة للمرضى ومرافقيهم، مع مراعاة احتياجات الراحة والهدوء اللازمين للتعافي
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Available Apartments */}
        <View style={styles.apartmentsSection}>
          <Text style={styles.sectionTitle}>الشقق المتاحة</Text>
          <Text style={styles.sectionSubtitle}>AVAILABLE APARTMENTS</Text>
          
          {property.apartments && property.apartments.map((apartment) => (
            <View key={apartment.id} style={styles.apartmentCard}>
              <Image
                source={apartment.image}
                style={styles.apartmentImage}
                resizeMode="cover"
              />
              
              <View style={styles.apartmentContent}>
                <View style={styles.apartmentHeader}>
                  <Text style={styles.apartmentType}>{apartment.type}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.apartmentPrice}>${apartment.price.replace('$', '')}</Text>
                    <Text style={styles.priceUnit}>/ يومياً</Text>
                  </View>
                </View>
                
                <Text style={styles.apartmentDesc}>
                  {property.id === 2 ? 'شقة فاخرة بمساحات واسعة ومجالس منفصلة' :
                   property.id === 1 ? 'شقة مفروشة بالكامل مع جميع المرافق' :
                   property.id === 3 ? 'شقة هادئة مناسبة للمرضى ومرافقيهم' :
                   property.id === 4 ? 'شقة قريبة من المستشفى على بُعد 4 دقائق' :
                   'شقة مفروشة بالكامل مع جميع المرافق'}
                </Text>
                
                {/* Features */}
                <View style={styles.apartmentFeatures}>
                  {apartment.features && apartment.features.slice(0, 4).map((feature, index) => (
                    <View key={index} style={styles.featureChip}>
                      <MaterialIcons name="check-circle" size={16} color={COLORS.primary} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                
                {/* Booking Buttons */}
                <View style={styles.bookingButtons}>
                  <TouchableOpacity
                    style={styles.bookNowButton}
                    onPress={() => handleBooking(apartment)}
                  >
                    <MaterialIcons name="event-available" size={20} color={COLORS.white} />
                    <Text style={styles.bookNowText}>احجز الآن</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.whatsappBookButton}
                    onPress={() => handleWhatsAppBooking(apartment)}
                  >
                    <MaterialIcons name="chat" size={20} color={COLORS.white} />
                    <Text style={styles.whatsappBookText}>واتساب</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  content: {
    flex: 1,
  },
  imageSection: {
    height: 380,
    position: 'relative',
  },
  carouselImage: {
    width: width,
    height: 380,
  },
  dotContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#B8956D',
    textAlign: 'center',
    marginTop: 5,
  },
  descriptionSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#B8956D',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 1,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    textAlign: 'right',
    marginBottom: 15,
  },
  descriptionEn: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
    textAlign: 'left',
    fontStyle: 'italic',
  },
  featuresSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  featureDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  facilitiesSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  facilitiesGrid: {
    marginTop: 10,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 10,
  },
  facilityContent: {
    flex: 1,
    marginLeft: 15,
  },
  facilityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  facilityDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  apartmentsSection: {
    padding: 20,
    marginTop: 10,
    paddingBottom: 40,
  },
  apartmentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  apartmentImage: {
    width: '100%',
    height: 260,
  },
  apartmentContent: {
    padding: 20,
  },
  apartmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  apartmentType: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  priceContainer: {
    alignItems: 'center',
  },
  apartmentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  priceUnit: {
    fontSize: 12,
    color: '#666',
  },
  apartmentDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  apartmentFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#2E7D32',
    marginLeft: 5,
  },
  bookingButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  bookNowButton: {
    flex: 1,
    backgroundColor: '#1B5E20',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
  },
  bookNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  whatsappBookButton: {
    flex: 1,
    backgroundColor: '#1B5E20',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 25,
  },
  whatsappBookText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#E53935',
    textAlign: 'center',
  },
  errorTextEn: {
    fontSize: 14,
    color: '#E53935',
    textAlign: 'center',
    marginTop: 5,
  },

  // Vantage Special Section Styles
  vantageSpecialSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  vantageDetailsGrid: {
    marginTop: 15,
  },
  vantageDetailCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  vantageDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  vantageDetailDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 