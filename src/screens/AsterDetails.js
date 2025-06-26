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
import { buildingsService, bookingsService } from '../services/database';

const screenWidth = Dimensions.get('window').width;

const buildingImages = [
  require('../../assets/aster.jpg'),
  require('../../assets/aster2.jpg'),
  require('../../assets/aster3.jpg'),
  require('../../assets/aster4.jpg'),
  require('../../assets/aster5.jpg'),
];

// Static fallback apartment data
const fallbackApartmentData = [
  {
    id: 1,
    number: '109',
    type: 'شقة مفروشة فاخرة',
    rooms: 'غرفتان نوم + صالة + مطبخ + حمامان',
    floor: 'الدور الأول',
    view: 'تطل على ساحة داخلية هادئة',
    price: '$3,200 شهرياً',
    features: [
      'مفروشة بالكامل',
      'تلفزيون ذكي',
      'ستلايت عربي كامل',
      'إنترنت عالي السرعة',
      'تكييف مركزي',
      'مطبخ مجهز بالكامل',
      'غسالة ملابس',
    ],
    images: [
      require('../../assets/aster6.jpg'),
      require('../../assets/aster7.jpg'),
      require('../../assets/aster8.jpg'),
    ],
    available: true,
  },
  {
    id: 2,
    number: '309',
    type: 'شقة مفروشة فاخرة',
    rooms: 'غرفتان نوم + صالة + مطبخ + حمامان',
    floor: 'الدور الثالث',
    view: 'إطلالة بانورامية على المدينة',
    price: '$3,200 شهرياً',
    features: [
      'مفروشة فاخرة',
      'تلفزيون ذكي',
      'ستلايت عربي كامل',
      'إنترنت فائق السرعة',
      'تكييف ذكي',
      'مطبخ أمريكي حديث',
      'غسالة ملابس',
      'شرفة واسعة',
    ],
    images: [
      require('../../assets/aster9.jpg'),
      require('../../assets/aster10.jpg'),
      require('../../assets/aster11.jpg'),
    ],
    available: true,
  },
];

// Static images mapping for apartments
const apartmentImagesMap = {
  109: [
    require('../../assets/aster6.jpg'),
    require('../../assets/aster7.jpg'),
    require('../../assets/aster8.jpg'),
  ],
  309: [
    require('../../assets/aster9.jpg'),
    require('../../assets/aster10.jpg'),
    require('../../assets/aster11.jpg'),
  ],
  default: [
    require('../../assets/aster6.jpg'),
    require('../../assets/aster7.jpg'),
    require('../../assets/aster8.jpg'),
  ],
};

// رقم واتساب الحجوزات الصحيح
const whatsappNumber = '12166444441'; // +1(216)644-4441
const inquiryMessage = 'السلام عليكم، لدي استفسار بخصوص سكن الأستر الفاخر 🏠✨';

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

// دالة إنشاء نموذج حجز مفصل
const getBookingTemplate = (apartmentNumber, apartmentType, price) => {
  return `🏠 طلب حجز شقة - سكن الأستر الفاخر

📋 تفاصيل الشقة:
• رقم الشقة: ${apartmentNumber}
• نوع الشقة: ${apartmentType}
• السعر: ${price}

👤 المعلومات الشخصية:
الاسم الكامل:
[اكتب اسمك هنا]

رقم الجوال:

البريد الإلكتروني:

📅 تفاصيل الحجز:
تاريخ الوصول:
[مثال: 2024-01-15]

تاريخ المغادرة:
[مثال: 2024-02-15]

عدد الأشخاص:

💰 نوع الحجز:
[ ] شهري
[ ] أسبوعي  
[ ] يومي

📝 ملاحظات إضافية:
[أي طلبات خاصة أو ملاحظات]

✨ شكراً لاختيارك سكن الأستر الفاخر! سنتواصل معك فوراً لتأكيد الحجز.`;
};

export default function AsterDetails({ route }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [apartmentData, setApartmentData] = useState([]);
  const [buildingInfo, setBuildingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
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

  // Get building ID from route params or default to Aster
  const buildingId = route?.params?.buildingId || 1;

  // Fetch building and apartment data from Supabase
  const fetchBuildingData = async () => {
    try {
      setLoading(true);

      // Fetch building information
      const buildingResponse =
        await buildingsService.getBuildingById(buildingId);

      if (buildingResponse.error) {
        throw new Error(buildingResponse.error);
      }

      setBuildingInfo(buildingResponse.data);

      // Mock apartments data since getApartmentsByBuilding doesn't exist
      const apartments = [
        {
          id: 1,
          apartment_number: '101',
          type: 'شقة مفروشة فاخرة',
          description: 'غرفتان نوم + صالة + مطبخ + حمامان',
          floor: 1,
          view: 'إطلالة مميزة',
          price: 3200,
          features: [
            'مفروشة بالكامل',
            'تلفزيون ذكي',
            'ستلايت عربي كامل',
            'إنترنت عالي السرعة',
            'تكييف مركزي',
            'مطبخ مجهز بالكامل',
            'غسالة ملابس',
          ],
          available: true,
        },
        {
          id: 2,
          apartment_number: '102',
          type: 'شقة مفروشة فاخرة',
          description: 'غرفة نوم + صالة + مطبخ + حمام',
          floor: 1,
          view: 'إطلالة حديقة',
          price: 2800,
          features: [
            'مفروشة بالكامل',
            'تلفزيون ذكي',
            'ستلايت عربي كامل',
            'إنترنت عالي السرعة',
            'تكييف مركزي',
            'مطبخ مجهز بالكامل',
          ],
          available: true,
        },
      ];

      // Transform apartment data to match our component structure
      const transformedApartments = apartments.map(apt => ({
        id: apt.id,
        number: apt.apartment_number,
        type: apt.type || 'شقة مفروشة فاخرة',
        rooms: apt.description || 'غرفتان نوم + صالة + مطبخ + حمامان',
        floor: apt.floor ? `الدور ${apt.floor}` : 'الدور الأول',
        view: apt.view || 'إطلالة مميزة',
        price: apt.price ? `$${apt.price} شهرياً` : '$3,200 شهرياً',
        features: apt.features || [
          'مفروشة بالكامل',
          'تلفزيون ذكي',
          'ستلايت عربي كامل',
          'إنترنت عالي السرعة',
          'تكييف مركزي',
          'مطبخ مجهز بالكامل',
          'غسالة ملابس',
        ],
        images:
          apartmentImagesMap[apt.apartment_number] ||
          apartmentImagesMap['default'],
        available: apt.available,
      }));

      setApartmentData(transformedApartments);
    } catch (error) {
      console.error('خطأ في جلب بيانات المبنى:', error);
      Alert.alert(
        'خطأ في التحميل',
        'فشل في تحميل بيانات الشقق. سيتم استخدام البيانات الافتراضية.',
        [{ text: 'موافق' }]
      );

      // Use fallback data if Supabase fails
      setApartmentData(fallbackApartmentData);
      setBuildingInfo({
        name: 'سكن الأستر',
        name_en: 'ASTER RESIDENCE',
        description: 'حيث الفخامة تلتقي بالعصرية',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load building data on component mount
  useEffect(() => {
    fetchBuildingData();
  }, [buildingId]);

  // التمرير التلقائي للصور
  useEffect(() => {
    if (loading) return; // Don't start auto-scroll while loading

    const interval = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % buildingImages.length;
      setCurrentImageIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentImageIndex, loading]);

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
      const totalAmount = (selectedApartment.price || 3200) * days;

      // إنشاء بيانات الحجز
      const bookingData = {
        apartment_id: selectedApartment.id,
        building_id: buildingId,
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
• الشقة: ${selectedApartment.number} - ${buildingInfo?.name}
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
      console.log('🏠 فتح واتساب للحجز');
      console.log('📱 الرقم:', whatsappNumber);
      console.log('💬 الرسالة:', message.substring(0, 50) + '...');
      
      // فتح واتساب مباشرة
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      console.log('🔗 الرابط:', url);
      
      await Linking.openURL(url);
      console.log('✅ تم فتح واتساب للحجز');

    } catch (error) {
      console.error('❌ خطأ في فتح واتساب:', error);
      
      // محاولة الرابط البديل
      try {
        const altUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
        console.log('🔄 محاولة الرابط البديل:', altUrl);
        await Linking.openURL(altUrl);
        console.log('✅ تم فتح واتساب بالرابط البديل');
      } catch (altError) {
        console.error('❌ فشل الرابط البديل:', altError);
        Alert.alert(
          '⚠️ مشكلة في الواتساب',
          'لا يمكن فتح الواتساب.\n\n• تأكد من تثبيت واتساب\n• الرقم: +1(216)644-4441',
          [{ text: 'موافق' }]
        );
      }
    }
  };

  // زر اختبار مباشر للواتساب
  const testWhatsApp = () => {
    const testMessage = 'مرحباً! هذا اختبار من تطبيق راحة للحجوزات 🏠✨';
    
    Alert.alert(
      '🧪 اختبار واتساب الحجوزات',
      'اختر طريقة الاختبار:',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: '1️⃣ رابط أساسي', 
          onPress: () => {
            const url = `https://wa.me/${whatsappNumber}`;
            console.log('🔗 اختبار رابط أساسي:', url);
            Linking.openURL(url)
              .then(() => {
                console.log('✅ نجح الرابط الأساسي');
                Alert.alert('✅ نجح', 'تم فتح واتساب بالرابط الأساسي');
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
            const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(testMessage)}`;
            console.log('🔗 اختبار مع رسالة:', url);
            Linking.openURL(url)
              .then(() => {
                console.log('✅ نجح مع رسالة');
                Alert.alert('✅ نجح', 'تم فتح واتساب مع الرسالة');
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
            const url = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(testMessage)}`;
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>
                جاري تحميل بيانات المبنى...
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.title}>
                {buildingInfo?.name || 'سكن الأستر'}
              </Text>
              <Text style={styles.titleEn}>
                {buildingInfo?.name_en || 'ASTER RESIDENCE'}
              </Text>
              <View style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>
                  {buildingInfo?.description || 'حيث الفخامة تلتقي بالعصرية'}
                </Text>
                <Text style={styles.subtitleEn}>
                  Where Luxury Meets Modernity
                </Text>
              </View>
            </>
          )}
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
                <Text style={styles.overlayText}>سكن الأستر الفاخر</Text>
                <Text style={styles.overlaySubtext}>
                  Premium Living Experience
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
            يقع سكن الأستر في منطقة راقية، قريب من المجمعات التجارية والمطاعم
            والخدمات الأساسية. يوفر وحدات سكنية فاخرة بتصميم عصري مع مرافق
            استثنائية لضمان تجربة معيشة لا تُنسى.
          </Text>
          <Text style={styles.textEn}>
            Aster Residence is located in an upscale area, close to shopping
            centers, restaurants, and essential services. It offers luxury
            residential units with modern design and exceptional facilities.
          </Text>
        </View>
      </View>

      {/* مرافق السكن مع تصميم جذاب */}
      <View style={styles.facilitiesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>مرافق السكن</Text>
          <Text style={styles.sectionTitleEn}>PREMIUM FACILITIES</Text>
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
              <MaterialIcons name="coffee" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.facilityTitle}>مكينة قهوة مجانية</Text>
            <Text style={styles.facilityDescription}>
              خدمة المشروبات الساخنة على مدار الساعة
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
            <Text style={styles.facilityTitle}>حمام سباحة</Text>
            <Text style={styles.facilityDescription}>
              مجهز بالكامل للاسترخاء والراحة
            </Text>
          </View>

          <View style={[styles.facilityCard, { backgroundColor: '#fefce8' }]}>
            <View
              style={[
                styles.facilityIconContainer,
                { backgroundColor: '#fef3c7' },
              ]}
            >
              <MaterialIcons name="outdoor-grill" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.facilityTitle}>منطقة الشواء</Text>
            <Text style={styles.facilityDescription}>
              جلسات خارجية مع كامل المعدات
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
            <Text style={styles.facilityTitle}>صالة رياضية</Text>
            <Text style={styles.facilityDescription}>معدات حديثة ومتطورة</Text>
          </View>

          <View style={[styles.facilityCard, { backgroundColor: '#f0fdf4' }]}>
            <View
              style={[
                styles.facilityIconContainer,
                { backgroundColor: '#dcfce7' },
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
              <MaterialIcons name="security" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.facilityTitle}>أمن متطور</Text>
            <Text style={styles.facilityDescription}>
              حراسة ومراقبة متواصلة
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>الشقق المتاحة</Text>
        <Text style={styles.sectionTitleEn}>AVAILABLE APARTMENTS</Text>
        <View style={styles.titleUnderline} />
      </View>

      {/* Loading indicator for apartments */}
      {loading && (
        <View style={styles.apartmentsLoadingContainer}>
          <ActivityIndicator size="large" color="#B8956D" />
          <Text style={styles.apartmentsLoadingText}>
            جاري تحميل الشقق المتاحة...
          </Text>
        </View>
      )}

      {/* قائمة الشقق مع تصميم عصري وجذاب */}
      {!loading &&
        apartmentData.map(apartment => (
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
                    <MaterialIcons
                      name="square-foot"
                      size={20}
                      color={COLORS.primary}
                    />
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
                    <MaterialIcons
                      name="visibility"
                      size={20}
                      color={COLORS.primary}
                    />
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
                    openWhatsApp(getBookingTemplate(apartment.number, apartment.type, apartment.price), apartment.id)
                  }
                >
                  <View style={styles.buttonGradient}>
                    <View style={styles.buttonTextContainer}>
                      <MaterialIcons name="phone" size={20} color={COLORS.white} />
                      <Text style={styles.bookButtonText}>
                        {' '}
                        احجز عبر واتساب فوراً
                      </Text>
                    </View>
                    <Text style={styles.bookButtonSubtext}>
                      نموذج جاهز + رقم مخصص
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
          <Text style={styles.inquiryButtonText}>💬 استفسار عام للحجوزات</Text>
          <Text style={styles.inquiryButtonSubtext}>📱 +1(216)644-4441</Text>
        </View>
      </TouchableOpacity>

      {/* زر اختبار مباشر للواتساب */}
      <TouchableOpacity
        style={styles.testWhatsAppButton}
        onPress={testWhatsApp}
      >
        <View style={styles.testWhatsAppButtonGradient}>
          <Text style={styles.testWhatsAppButtonText}>🧪 اختبار واتساب</Text>
          <Text style={styles.testWhatsAppButtonSubtext}>TEST WHATSAPP</Text>
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
                      ${selectedApartment.price || '3,200'} شهرياً
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
                          {(selectedApartment.price || 3200) *
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
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <>
                        <MaterialIcons
                          name="check-circle"
                          size={20}
                          color="#fff"
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
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 8,
  },
  text: {
    fontSize: 17,
    lineHeight: 28,
    color: '#34495e',
    textAlign: 'right',
    marginBottom: 15,
    writingDirection: 'rtl',
  },
  textEn: {
    fontSize: 15,
    lineHeight: 24,
    color: '#7f8c8d',
    textAlign: 'left',
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
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  facilityIconContainer: {
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  facilityIcon: {
    fontSize: 28,
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
    fontSize: 13,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 18,
    writingDirection: 'rtl',
  },
  modernApartmentCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  apartmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#f8f9fa',
  },
  apartmentNumberContainer: {
    backgroundColor: '#B8956D',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: '#B8956D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  apartmentNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  availableBadge: {
    backgroundColor: '#2ecc71',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    writingDirection: 'rtl',
  },
  imageSliderWrapper: {
    height: 300,
  },
  apartmentImageSlider: {
    height: 300,
  },
  apartmentImageContainer: {
    position: 'relative',
  },
  apartmentImage: {
    width: screenWidth - 40,
    height: 300,
    marginHorizontal: 20,
    borderRadius: 15,
  },
  apartmentImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 15,
  },
  apartmentDetails: {
    padding: 25,
  },
  apartmentType: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
    writingDirection: 'rtl',
  },
  infoGrid: {
    marginBottom: 25,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 15,
  },
  infoIcon: {
    fontSize: 18,
    marginLeft: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  priceLabel: {
    fontSize: 14,
    color: '#d5f4e6',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
    writingDirection: 'rtl',
  },
  featuresContainer: {
    marginBottom: 25,
  },
  featureItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
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
  },
  featureDot: {
    fontSize: 6,
    color: '#fff',
    fontWeight: 'bold',
  },
  feature: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  modernBookButton: {
    borderRadius: 25,
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
    borderRadius: 25,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  bookButtonSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 3,
    letterSpacing: 1,
  },
  modernInquiryButton: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 50,
    borderRadius: 25,
    shadowColor: '#1a5a3e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  inquiryButtonGradient: {
    backgroundColor: '#1a5a3e',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
  },
  inquiryButtonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  inquiryButtonSubtext: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.9,
    marginTop: 4,
    letterSpacing: 1,
  },
  // Loading styles
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    writingDirection: 'rtl',
    fontWeight: '600',
  },
  apartmentsLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginVertical: 20,
  },
  apartmentsLoadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#B8956D',
    textAlign: 'center',
    writingDirection: 'rtl',
    fontWeight: '600',
  },
  buttonTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // أنماط أزرار الحجز الجديدة
  bookingButtonsContainer: {
    gap: 15,
  },
  onlineBookButton: {
    backgroundColor: '#2ecc71', // أخضر للحجز الأونلاين
  },
  whatsappBookButton: {
    backgroundColor: '#1a5a3e', // أخضر داكن لواتساب
  },
  // أنماط النموذج المنبثق
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalScrollView: {
    maxHeight: '100%',
  },
  modalHeader: {
    alignItems: 'center',
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    padding: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    writingDirection: 'rtl',
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
    writingDirection: 'rtl',
  },
  apartmentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'flex-end',
  },
  apartmentInfoText: {
    fontSize: 16,
    color: '#555',
    marginRight: 10,
    writingDirection: 'rtl',
  },
  formSection: {
    padding: 20,
  },
  formSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
    writingDirection: 'rtl',
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
    writingDirection: 'rtl',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  dateInputGroup: {
    flex: 1,
  },
  costCalculation: {
    backgroundColor: '#B8956D',
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
  },
  costTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 16,
    color: '#ffffff',
    writingDirection: 'rtl',
  },
  costAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#95a5a6',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    writingDirection: 'rtl',
  },
  confirmButton: {
    flex: 2,
    backgroundColor: '#2ecc71',
    borderRadius: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    writingDirection: 'rtl',
  },
  testWhatsAppButton: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 50,
    borderRadius: 25,
    shadowColor: '#1a5a3e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  testWhatsAppButtonGradient: {
    backgroundColor: '#1a5a3e',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
  },
  testWhatsAppButtonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  testWhatsAppButtonSubtext: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.9,
    marginTop: 4,
    letterSpacing: 1,
  },
});
