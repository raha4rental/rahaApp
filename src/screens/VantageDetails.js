import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { bookingsService } from '../services/database';

const screenWidth = Dimensions.get('window').width;

const buildingImages = [
  require('../../assets/vantage1.jpg'),
  require('../../assets/vantage2.jpg'),
  require('../../assets/vantage3.jpg'),
  require('../../assets/vantage4.jpg'),
  require('../../assets/vantage5.jpg'),
];

const apartmentData = [
  {
    id: 1,
    number: '205',
    type: 'شقة فاخرة مع مجلس خاص',
    rooms: 'ثلاث غرف نوم + صالة + مجلس + مطبخ + حمامان',
    floor: 'الدور الثاني',
    view: 'إطلالة مباشرة على المجمع التجاري',
    price: '$2,800 شهرياً',
    features: [
      'مفروشة بالكامل',
      'مجلس خاص منفصل',
      'تلفزيون ذكي',
      'ستلايت عربي كامل',
      'إنترنت عالي السرعة',
      'تكييف مركزي',
      'مطبخ مجهز بالكامل',
      'شرفة واسعة',
    ],
    images: [
      require('../../assets/vantage6.jpg'),
      require('../../assets/vantage7.jpg'),
      require('../../assets/vantage8.jpg'),
    ],
    available: true,
    bookingMessage:
      'مرحبًا، أرغب في حجز الشقة رقم 205 في سكن الفانتج (ثلاث غرف + مجلس خاص) - السعر $2,800 شهرياً 🏠✨',
  },
  {
    id: 2,
    number: '312',
    type: 'شقة فاخرة عائلية',
    rooms: 'أربع غرف نوم + صالة + مجلس + مطبخ + ثلاثة حمامات',
    floor: 'الدور الثالث',
    view: 'إطلالة بانورامية على المجمع التجاري والحدائق',
    price: '$2,800 شهرياً',
    features: [
      'مفروشة فاخرة',
      'مجلس رجال منفصل',
      'صالة نساء مخصصة',
      'تلفزيون ذكي متعدد',
      'ستلايت عربي كامل',
      'إنترنت فائق السرعة',
      'تكييف ذكي',
      'مطبخ أمريكي واسع',
      'شرفتان واسعتان',
    ],
    images: [
      require('../../assets/vantage10.jpg'),
      require('../../assets/vantage11.jpg'),
      require('../../assets/vantage14.jpg'),
    ],
    available: true,
    bookingMessage:
      'مرحبًا، أرغب في حجز الشقة رقم 312 في سكن الفانتج (أربع غرف + مجالس منفصلة) - السعر $2,800 شهرياً 🌟✨',
  },
];

// رقم واتساب الصحيح بصيغة دولية بدون + أو ()
  const whatsappNumber = '+12166444441';
const inquiryMessage = 'السلام عليكم، لدي استفسار بخصوص سكن الفانتج الفاخر.';

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

export default function VantageDetails() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: '',
    checkOut: '',
    numberOfGuests: '1',
    notes: '',
  });
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const scrollViewRef = useRef(null);

  // التمرير التلقائي للصور
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % buildingImages.length;
      setCurrentImageIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  const handleScroll = event => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setCurrentImageIndex(index);
  };

  // دالة فتح نموذج الحجز الأونلاين
  const openOnlineBooking = apartment => {
    setSelectedApartment(apartment);
    setShowBookingModal(true);
    // إعداد تواريخ افتراضية
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    setBookingForm(prev => ({
      ...prev,
      checkIn: today,
      checkOut: nextMonth,
    }));
  };

  // دالة إرسال الحجز والإشعار
  const submitOnlineBooking = async () => {
    // التحقق من البيانات المطلوبة
    if (
      !bookingForm.guestName ||
      !bookingForm.guestEmail ||
      !bookingForm.guestPhone ||
      !bookingForm.checkIn ||
      !bookingForm.checkOut
    ) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // التحقق من التواريخ
    const checkInDate = new Date(bookingForm.checkIn);
    const checkOutDate = new Date(bookingForm.checkOut);
    if (checkInDate >= checkOutDate) {
      Alert.alert('خطأ', 'تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول');
      return;
    }

    setSubmittingBooking(true);

    try {
      // حساب عدد الأيام والتكلفة
      const days = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
      );
      const totalAmount = (selectedApartment.price || 2800) * days;

      // إنشاء بيانات الحجز
      const bookingData = {
        apartment_id: selectedApartment.id,
        building_id: 2, // Vantage building ID
        guest_name: bookingForm.guestName,
        guest_email: bookingForm.guestEmail,
        guest_phone: bookingForm.guestPhone,
        check_in: bookingForm.checkIn,
        check_out: bookingForm.checkOut,
        number_of_guests: parseInt(bookingForm.numberOfGuests),
        status: 'confirmed', // حجز مؤكد
        booking_source: 'mobile_app',
        notes: bookingForm.notes || 'حجز أونلاين مباشر',
        total_amount: totalAmount,
        created_at: new Date().toISOString(),
      };

      // حفظ الحجز في قاعدة البيانات
      const bookingResponse = await bookingsService.createBooking(bookingData);

      if (bookingResponse.error) {
        throw new Error(bookingResponse.error);
      }

      const newBooking = bookingResponse.data;

      // إرسال إشعار عبر واتساب للمالك
      const ownerNotification = `🎉 حجز جديد تم تأكيده!

📋 تفاصيل الحجز:
• رقم الحجز: ${newBooking.id}
• الاسم: ${bookingForm.guestName}
• الهاتف: ${bookingForm.guestPhone}
• البريد: ${bookingForm.guestEmail}
• الشقة: ${selectedApartment.number} - سكن الفانتج
• تاريخ الوصول: ${bookingForm.checkIn}
• تاريخ المغادرة: ${bookingForm.checkOut}
• عدد النزلاء: ${bookingForm.numberOfGuests}
• عدد الأيام: ${days}
• إجمالي التكلفة: $${totalAmount}
• ملاحظات: ${bookingForm.notes || 'لا توجد'}

✅ تم تأكيد الحجز تلقائياً
📱 حجز عبر التطبيق المحمول`;

      // فتح واتساب لإرسال الإشعار
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(ownerNotification)}`;
      Linking.openURL(url);

      // إظهار رسالة نجاح للعميل
      Alert.alert(
        '🎉 تم تأكيد الحجز بنجاح!',
        `رقم الحجز: ${newBooking.id}\n\nتفاصيل الحجز:\n• الشقة: ${selectedApartment.number}\n• التواريخ: ${bookingForm.checkIn} إلى ${bookingForm.checkOut}\n• التكلفة الإجمالية: $${totalAmount}\n\nسيتم التواصل معك قريباً لتأكيد التفاصيل النهائية.`,
        [
          {
            text: 'موافق',
            onPress: () => {
              setShowBookingModal(false);
              // إعادة تعيين النموذج
              setBookingForm({
                guestName: '',
                guestEmail: '',
                guestPhone: '',
                checkIn: '',
                checkOut: '',
                numberOfGuests: '1',
                notes: '',
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error('خطأ في إنشاء الحجز:', error);
      Alert.alert(
        'خطأ في الحجز',
        'حدث خطأ أثناء معالجة الحجز. يرجى المحاولة مرة أخرى أو التواصل معنا.',
        [{ text: 'موافق' }]
      );
    } finally {
      setSubmittingBooking(false);
    }
  };

  const openWhatsApp = async (message, apartmentId = null) => {
    try {
      // If booking a specific apartment, create a booking record
      if (apartmentId) {
        const bookingData = {
          apartment_id: apartmentId,
          guest_name: 'عميل واتساب', // Will be updated with actual name later
          guest_phone: whatsappNumber,
          check_in: new Date().toISOString().split('T')[0], // Today's date
          check_out: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0], // 30 days from now
          status: 'inquiry',
          booking_source: 'whatsapp',
          notes: 'طلب حجز عبر واتساب - يحتاج متابعة',
        };

        // Create booking record in Supabase (optional - for tracking inquiries)
        try {
          const inquiryResponse =
            await bookingsService.createBooking(bookingData);
          if (inquiryResponse.error) {
            throw new Error(inquiryResponse.error);
          }
          console.log('تم إنشاء سجل الاستفسار بنجاح');
        } catch (bookingError) {
          console.log('خطأ في إنشاء سجل الاستفسار:', bookingError);
          // Don't block WhatsApp opening if booking creation fails
        }
      }

      // Open WhatsApp
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      Linking.openURL(url).catch(err =>
        console.error('حدث خطأ عند فتح واتساب', err)
      );
    } catch (error) {
      console.error('خطأ في معالجة الحجز:', error);
      // Still open WhatsApp even if there's an error
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      Linking.openURL(url).catch(err =>
        console.error('حدث خطأ عند فتح واتساب', err)
      );
    }
  };

  const renderApartmentImages = images => {
    return (
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.apartmentImageSlider}
      >
        {images.map((img, index) => (
          <View key={index} style={styles.apartmentImageContainer}>
            <Image
              source={img}
              style={styles.apartmentImage}
              resizeMode="cover"
            />
            <View style={styles.apartmentImageOverlay} />
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header عصري مع تدرج جذاب */}
      <View style={styles.modernHeader}>
        <View style={styles.headerGradient}>
          <Text style={styles.title}>سكن الفانتج</Text>
          <Text style={styles.titleEn}>VANTAGE RESIDENCE</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>مساحات واسعة وموقع مثالي</Text>
            <Text style={styles.subtitleEn}>
              Spacious Living in Prime Location
            </Text>
          </View>
        </View>
      </View>

      {/* معرض صور المبنى مع تأثيرات جذابة */}
      <View style={styles.buildingSliderContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          style={styles.buildingSlider}
        >
          {buildingImages.map((img, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image
                source={img}
                style={styles.buildingImage}
                resizeMode="cover"
              />
              <View style={styles.imageGradientOverlay} />
              <View style={styles.imageTextOverlay}>
                <Text style={styles.overlayText}>سكن الفانتج المميز</Text>
                <Text style={styles.overlaySubtext}>
                  Premium Lifestyle Experience
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* مؤشرات الصفحات العصرية */}
        <View style={styles.pagination}>
          {buildingImages.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                currentImageIndex === index && styles.paginationDotActive,
              ]}
              onPress={() => {
                setCurrentImageIndex(index);
                scrollViewRef.current?.scrollTo({
                  x: index * screenWidth,
                  animated: true,
                });
              }}
            />
          ))}
        </View>
      </View>

      {/* قسم التفاصيل مع تصميم جذاب */}
      <View style={styles.detailsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>تفاصيل السكن</Text>
          <Text style={styles.sectionTitleEn}>RESIDENCE DETAILS</Text>
          <View style={styles.titleUnderline} />
        </View>
        <View style={styles.descriptionCard}>
          <Text style={styles.text}>
            يقع سكن الفانتج في موقع استراتيجي مميز أمام أكبر مجمع تجاري في
            المنطقة، وبجانب مستشفى كليفلاند كلينك بيتشود العالمي المشهور. مما
            يوفر سهولة الوصول للتسوق والمطاعم والخدمات الطبية المتطورة. يتميز
            بمساحاته الواسعة ومجالس منفصلة للرجال والنساء مع مرافق ترفيهية
            متكاملة.
          </Text>
          <Text style={styles.textEn}>
            Vantage Residence is strategically located in front of the largest
            shopping mall in the area, and next to the world-renowned Cleveland
            Clinic Beachwood. This provides easy access to shopping,
            restaurants, and advanced medical services. Features spacious areas
            and separate majlis for men and women with complete recreational
            facilities.
          </Text>
        </View>
      </View>

      {/* الموقع المميز */}
      <View style={styles.locationSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>الموقع المميز</Text>
          <Text style={styles.sectionTitleEn}>PRIME LOCATION</Text>
          <View style={styles.titleUnderline} />
        </View>
        <View style={styles.locationCard}>
          <View style={styles.locationFeature}>
            <Text style={styles.locationIcon}>🏬</Text>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>أمام أكبر مجمع تجاري</Text>
              <Text style={styles.locationDesc}>مسافة المشي دقيقتين فقط</Text>
            </View>
          </View>
          <View style={styles.locationFeature}>
            <MaterialIcons name="restaurant" size={24} color={COLORS.primary} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>مطاعم متنوعة</Text>
              <Text style={styles.locationDesc}>مأكولات عالمية ومحلية</Text>
            </View>
          </View>
          <View style={styles.locationFeature}>
            <MaterialIcons name="store" size={24} color={COLORS.primary} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>خدمات متكاملة</Text>
              <Text style={styles.locationDesc}>بنوك ومتاجر وصيدليات</Text>
            </View>
          </View>
          <View style={styles.locationFeature}>
            <MaterialIcons name="local-hospital" size={24} color={COLORS.primary} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>قريب من المستشفى</Text>
              <Text style={styles.locationDesc}>
                سهولة الوصول للخدمات الطبية
              </Text>
            </View>
          </View>
          <View style={styles.locationFeature}>
            <MaterialIcons name="medical-services" size={24} color={COLORS.primary} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>
                بجانب كليفلاند كلينك بيتشود
              </Text>
              <Text style={styles.locationDesc}>
                مستشفى عالمي مشهور على مسافة قريبة جداً
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* مرافق السكن المميزة */}
      <View style={styles.facilitiesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>مرافق السكن المميزة</Text>
          <Text style={styles.sectionTitleEn}>EXCLUSIVE FACILITIES</Text>
          <View style={styles.titleUnderline} />
        </View>
        <View style={styles.facilitiesGrid}>
          <View style={[styles.facilityCard, { backgroundColor: '#fff5f5' }]}>
            <View
              style={[
                styles.facilityIconContainer,
                { backgroundColor: '#ffe6e6' },
              ]}
            >
              <MaterialIcons name="groups" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.facilityTitle}>مجلس رجال خاص</Text>
            <Text style={styles.facilityDescription}>
              مساحة مخصصة للضيوف مع خصوصية تامة
            </Text>
          </View>

          <View style={[styles.facilityCard, { backgroundColor: '#fdf2f8' }]}>
            <View
              style={[
                styles.facilityIconContainer,
                { backgroundColor: '#fce7f3' },
              ]}
            >
              <MaterialIcons name="group" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.facilityTitle}>مجلس نساء خاص</Text>
            <Text style={styles.facilityDescription}>
              صالة مخصصة للسيدات مع الخصوصية الكاملة
            </Text>
          </View>

          <View style={[styles.facilityCard, { backgroundColor: '#f0f9ff' }]}>
            <View
              style={[
                styles.facilityIconContainer,
                { backgroundColor: '#dbeafe' },
              ]}
            >
              <MaterialIcons name="pool" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.facilityTitle}>مسبح خارجي</Text>
            <Text style={styles.facilityDescription}>
              مسبح واسع مع منطقة استرخاء
            </Text>
          </View>

          <View style={[styles.facilityCard, { backgroundColor: '#f0f9ff' }]}>
            <View
              style={[
                styles.facilityIconContainer,
                { backgroundColor: '#dbeafe' },
              ]}
            >
              <MaterialIcons name="pool" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.facilityTitle}>مسبح داخلي</Text>
            <Text style={styles.facilityDescription}>
              مسبح مغطى للاستخدام على مدار السنة
            </Text>
          </View>

          <View style={[styles.facilityCard, { backgroundColor: '#fefce8' }]}>
            <View
              style={[
                styles.facilityIconContainer,
                { backgroundColor: '#fef3c7' },
              ]}
            >
              <MaterialIcons name="celebration" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.facilityTitle}>قاعة احتفالات خاصة</Text>
            <Text style={styles.facilityDescription}>
              لإقامة المناسبات مع الحفاظ على الخصوصية
            </Text>
          </View>

          <View style={[styles.facilityCard, { backgroundColor: '#f0fdf4' }]}>
            <View
              style={[
                styles.facilityIconContainer,
                { backgroundColor: '#dcfce7' },
              ]}
            >
              <MaterialIcons name="fitness-center" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.facilityTitle}>صالة رياضة مغلقة</Text>
            <Text style={styles.facilityDescription}>
              معدات متطورة مع خصوصية تامة
            </Text>
          </View>

          <View style={[styles.facilityCard, { backgroundColor: '#f8fafc' }]}>
            <View
              style={[
                styles.facilityIconContainer,
                { backgroundColor: '#e2e8f0' },
              ]}
            >
              <MaterialIcons name="wifi" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.facilityTitle}>إنترنت فائق السرعة</Text>
            <Text style={styles.facilityDescription}>
              اتصال مجاني عالي الجودة
            </Text>
          </View>

          <View style={[styles.facilityCard, { backgroundColor: '#f8fafc' }]}>
            <View
              style={[
                styles.facilityIconContainer,
                { backgroundColor: '#e2e8f0' },
              ]}
            >
              <Text style={styles.facilityIcon}>🔒</Text>
            </View>
            <Text style={styles.facilityTitle}>أمن وحراسة</Text>
            <Text style={styles.facilityDescription}>
              مراقبة متواصلة وحماية شاملة
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>الشقق المتاحة</Text>
        <Text style={styles.sectionTitleEn}>AVAILABLE APARTMENTS</Text>
        <View style={styles.titleUnderline} />
      </View>

      {/* قائمة الشقق مع تصميم عصري وجذاب */}
      {apartmentData.map(apartment => (
        <View key={apartment.id} style={styles.modernApartmentCard}>
          <View style={styles.apartmentHeader}>
            <View style={styles.apartmentNumberContainer}>
              <Text style={styles.apartmentNumber}>#{apartment.number}</Text>
            </View>
            <View style={styles.availableBadge}>
              <Text style={styles.statusText}>✓ متاحة</Text>
            </View>
          </View>

          {/* صور الشقة مع تأثيرات */}
          <View style={styles.imageSliderWrapper}>
            {renderApartmentImages(apartment.images)}
          </View>

          <View style={styles.apartmentDetails}>
            <Text style={styles.apartmentType}>{apartment.type}</Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MaterialIcons name="square-foot" size={20} color={COLORS.primary} />
                  <Text style={styles.infoText}>{apartment.rooms}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MaterialIcons name="business" size={20} color={COLORS.primary} />
                  <Text style={styles.infoText}>{apartment.floor}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MaterialIcons name="visibility" size={20} color={COLORS.primary} />
                  <Text style={styles.infoText}>{apartment.view}</Text>
                </View>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <View style={styles.priceGradient}>
                <Text style={styles.apartmentPrice}>{apartment.price}</Text>
                <Text style={styles.priceLabel}>
                  شامل جميع الخدمات والمرافق
                </Text>
              </View>
            </View>

            <Text style={styles.featuresTitle}>المميزات المتاحة</Text>
            <View style={styles.featuresContainer}>
              {apartment.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureDotContainer}>
                    <Text style={styles.featureDot}>●</Text>
                  </View>
                  <Text style={styles.feature}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* أزرار الحجز */}
            <View style={styles.bookingButtonsContainer}>
              <TouchableOpacity
                style={[styles.modernBookButton, styles.onlineBookButton]}
                onPress={() => openOnlineBooking(apartment)}
              >
                <View style={styles.buttonGradient}>
                  <View style={styles.buttonTextContainer}>
                    <MaterialIcons
                      name="calendar-today"
                      size={20}
                      color={COLORS.white}
                    />
                    <Text style={styles.bookButtonText}>
                      {' '}
                      احجز أونلاين فوراً
                    </Text>
                  </View>
                  <Text style={styles.bookButtonSubtext}>
                    INSTANT ONLINE BOOKING
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modernBookButton, styles.whatsappBookButton]}
                onPress={() =>
                  openWhatsApp(apartment.bookingMessage, apartment.id)
                }
              >
                <View style={styles.buttonGradient}>
                  <View style={styles.buttonTextContainer}>
                    <MaterialIcons name="phone" size={20} color={COLORS.white} />
                    <Text style={styles.bookButtonText}> احجز عبر واتساب</Text>
                  </View>
                  <Text style={styles.bookButtonSubtext}>
                    BOOK VIA WHATSAPP
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {/* زر الاستفسار العام مع تصميم جذاب */}
      <TouchableOpacity
        style={styles.modernInquiryButton}
        onPress={() => openWhatsApp(inquiryMessage)}
      >
        <View style={styles.inquiryButtonGradient}>
          <View style={styles.buttonTextContainer}>
            <MaterialIcons name="chat" size={20} color={COLORS.white} />
            <Text style={styles.inquiryButtonText}> استفسار عام</Text>
          </View>
          <Text style={styles.inquiryButtonSubtext}>GENERAL INQUIRY</Text>
        </View>
      </TouchableOpacity>

      {/* نموذج الحجز الأونلاين */}
      <Modal
        visible={showBookingModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              {/* رأس النموذج */}
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowBookingModal(false)}
                >
                  <MaterialIcons name="close" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>احجز أونلاين فوراً 🎉</Text>
                <Text style={styles.modalSubtitle}>INSTANT ONLINE BOOKING</Text>
              </View>

              {/* تفاصيل الشقة المختارة */}
              {selectedApartment && (
                <View style={styles.selectedApartmentInfo}>
                  <Text style={styles.selectedApartmentTitle}>
                    الشقة المختارة
                  </Text>
                  <View style={styles.apartmentInfoRow}>
                    <MaterialIcons name="home" size={20} color={COLORS.primary} />
                    <Text style={styles.apartmentInfoText}>
                      شقة رقم {selectedApartment.number}
                    </Text>
                  </View>
                  <View style={styles.apartmentInfoRow}>
                    <MaterialIcons
                      name="attach-money"
                      size={20}
                      color={COLORS.primary}
                    />
                    <Text style={styles.apartmentInfoText}>
                      ${selectedApartment.price || '2,800'} شهرياً
                    </Text>
                  </View>
                </View>
              )}

              {/* نموذج البيانات */}
              <View style={styles.formSection}>
                <Text style={styles.formSectionTitle}>المعلومات الشخصية</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>الاسم الكامل *</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={bookingForm.guestName}
                    onChangeText={text =>
                      setBookingForm({ ...bookingForm, guestName: text })
                    }
                    placeholder="أدخل اسمك الكامل"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>البريد الإلكتروني *</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={bookingForm.guestEmail}
                    onChangeText={text =>
                      setBookingForm({ ...bookingForm, guestEmail: text })
                    }
                    placeholder="example@email.com"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>رقم الهاتف *</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={bookingForm.guestPhone}
                    onChangeText={text =>
                      setBookingForm({ ...bookingForm, guestPhone: text })
                    }
                    placeholder="+1234567890"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                  />
                </View>

                <Text style={styles.formSectionTitle}>تفاصيل الإقامة</Text>

                <View style={styles.dateInputsRow}>
                  <View style={styles.dateInputGroup}>
                    <Text style={styles.inputLabel}>تاريخ الوصول *</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={bookingForm.checkIn}
                      onChangeText={text =>
                        setBookingForm({ ...bookingForm, checkIn: text })
                      }
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#999"
                    />
                  </View>

                  <View style={styles.dateInputGroup}>
                    <Text style={styles.inputLabel}>تاريخ المغادرة *</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={bookingForm.checkOut}
                      onChangeText={text =>
                        setBookingForm({ ...bookingForm, checkOut: text })
                      }
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>عدد النزلاء</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={bookingForm.numberOfGuests}
                    onChangeText={text =>
                      setBookingForm({ ...bookingForm, numberOfGuests: text })
                    }
                    placeholder="1"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>ملاحظات إضافية</Text>
                  <TextInput
                    style={[styles.modalInput, styles.notesInput]}
                    value={bookingForm.notes}
                    onChangeText={text =>
                      setBookingForm({ ...bookingForm, notes: text })
                    }
                    placeholder="أي ملاحظات أو طلبات خاصة..."
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* حساب التكلفة */}
                {bookingForm.checkIn &&
                  bookingForm.checkOut &&
                  selectedApartment && (
                    <View style={styles.costCalculation}>
                      <Text style={styles.costTitle}>تقدير التكلفة</Text>
                      <View style={styles.costRow}>
                        <Text style={styles.costLabel}>
                          {Math.ceil(
                            (new Date(bookingForm.checkOut) -
                              new Date(bookingForm.checkIn)) /
                              (1000 * 60 * 60 * 24)
                          )}{' '}
                          أيام
                        </Text>
                        <Text style={styles.costAmount}>
                          $
                          {(selectedApartment.price || 2800) *
                            Math.ceil(
                              (new Date(bookingForm.checkOut) -
                                new Date(bookingForm.checkIn)) /
                                (1000 * 60 * 60 * 24)
                            )}
                        </Text>
                      </View>
                    </View>
                  )}

                {/* أزرار التحكم */}
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowBookingModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>إلغاء</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      submittingBooking && styles.confirmButtonDisabled,
                    ]}
                    onPress={submitOnlineBooking}
                    disabled={submittingBooking}
                  >
                    {submittingBooking ? (
                      <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                      <>
                        <MaterialIcons
                          name="check-circle"
                          size={20}
                          color={COLORS.white}
                        />
                        <Text style={styles.confirmButtonText}>
                          {' '}
                          تأكيد الحجز
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafb',
  },
  modernHeader: {
    height: 180,
    marginBottom: 25,
  },
  headerGradient: {
    flex: 1,
    backgroundColor: '#B8956D',
    paddingVertical: 35,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  titleEn: {
    fontSize: 18,
    color: '#d5f4e6',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 15,
    opacity: 0.9,
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 3,
    fontWeight: '500',
    writingDirection: 'rtl',
  },
  subtitleEn: {
    fontSize: 14,
    color: '#d5f4e6',
    textAlign: 'center',
    opacity: 0.85,
  },
  buildingSliderContainer: {
    height: 320,
    marginBottom: 35,
  },
  buildingSlider: {
    height: 370,
  },
  imageContainer: {
    position: 'relative',
  },
  buildingImage: {
    width: screenWidth - 32,
    height: 370,
    borderRadius: 25,
    marginHorizontal: 16,
  },
  imageGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 25,
  },
  imageTextOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 36,
    right: 36,
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    writingDirection: 'rtl',
  },
  overlaySubtext: {
    fontSize: 14,
    color: '#e0e0e0',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  paginationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ddd',
    marginHorizontal: 6,
  },
  paginationDotActive: {
    backgroundColor: '#B8956D',
    width: 30,
    height: 12,
    borderRadius: 6,
    shadowColor: '#B8956D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsSection: {
    paddingHorizontal: 20,
    marginBottom: 35,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
    writingDirection: 'rtl',
  },
  sectionTitleEn: {
    fontSize: 13,
    color: '#7f8c8d',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 10,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#B8956D',
    borderRadius: 2,
  },
  descriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  text: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 28,
    textAlign: 'right',
    marginBottom: 15,
    writingDirection: 'rtl',
  },
  textEn: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 24,
    textAlign: 'left',
    fontStyle: 'italic',
  },
  locationSection: {
    paddingHorizontal: 20,
    marginBottom: 35,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  locationFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 15,
  },
  locationIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  locationDesc: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  facilitiesSection: {
    paddingHorizontal: 20,
    marginBottom: 35,
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  facilityCard: {
    width: '48%',
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  facilityIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    alignSelf: 'center',
  },
  facilityIcon: {
    fontSize: 22,
  },
  facilityTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  facilityDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 18,
    writingDirection: 'rtl',
  },
  modernApartmentCard: {
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  apartmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  apartmentNumberContainer: {
    backgroundColor: '#B8956D',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  apartmentNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  availableBadge: {
    backgroundColor: '#d4edda',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  statusText: {
    fontSize: 12,
    color: '#155724',
    fontWeight: '600',
  },
  imageSliderWrapper: {
    height: 220,
  },
  apartmentImageSlider: {
    height: 220,
  },
  apartmentImageContainer: {
    position: 'relative',
  },
  apartmentImage: {
    width: screenWidth - 40,
    height: 280,
    resizeMode: 'cover',
  },
  apartmentImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  apartmentDetails: {
    padding: 25,
  },
  apartmentType: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
    writingDirection: 'rtl',
  },
  infoGrid: {
    marginBottom: 20,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    justifyContent: 'flex-end',
  },
  infoIcon: {
    fontSize: 18,
    marginLeft: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#2c3e50',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  priceContainer: {
    marginBottom: 25,
  },
  priceGradient: {
    backgroundColor: '#B8956D',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#B8956D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  apartmentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  priceLabel: {
    fontSize: 12,
    color: '#d5f4e6',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
    writingDirection: 'rtl',
  },
  featuresContainer: {
    marginBottom: 25,
  },
  featureItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  featureDotContainer: {
    backgroundColor: '#B8956D',
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 5,
  },
  featureDot: {
    fontSize: 6,
    color: '#fff',
    fontWeight: 'bold',
  },
  feature: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  modernBookButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#1a5a3e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    backgroundColor: '#1a5a3e',
    paddingVertical: 18,
    paddingHorizontal: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#B8956D',
  },
  buttonTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#B8956D',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
    writingDirection: 'rtl',
  },
  bookButtonSubtext: {
    color: '#B8956D',
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 1,
  },
  modernInquiryButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#1a5a3e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  inquiryButtonGradient: {
    backgroundColor: '#1a5a3e',
    paddingVertical: 18,
    paddingHorizontal: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#B8956D',
  },
  inquiryButtonText: {
    color: '#B8956D',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
    writingDirection: 'rtl',
  },
  inquiryButtonSubtext: {
    color: '#B8956D',
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 1,
  },
  // Online booking styles
  bookingButtonsContainer: {
    flexDirection: 'column',
    gap: 15,
  },
  onlineBookButton: {
    backgroundColor: '#2e7d32',
    marginBottom: 10,
  },
  whatsappBookButton: {
    backgroundColor: '#25D366',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  modalScrollView: {
    flex: 1,
  },
  modalHeader: {
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    letterSpacing: 1,
  },
  selectedApartmentInfo: {
    backgroundColor: '#f8f9fa',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#B8956D',
  },
  selectedApartmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  apartmentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'flex-end',
  },
  apartmentInfoText: {
    fontSize: 16,
    color: '#2c3e50',
    marginRight: 10,
    textAlign: 'right',
  },
  formSection: {
    padding: 20,
  },
  formSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'right',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    textAlign: 'right',
  },
  dateInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  dateInputGroup: {
    flex: 1,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  costCalculation: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  costTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
    textAlign: 'center',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 16,
    color: '#2e7d32',
    textAlign: 'right',
  },
  costAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
