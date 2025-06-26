// خدمات قاعدة البيانات البسيطة | Simple Database Services
// نسخة مؤقتة بدون Supabase | Temporary version without Supabase

// إعدادات عامة للخدمات
const DB_CONFIG = {
  timeout: 10000, // 10 seconds timeout
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// دالة مساعدة لمعالجة الأخطاء
const handleError = (operation, error) => {
  console.error(`Database Error in ${operation}:`, error);
  return {
    data: null,
    error: error.message || 'حدث خطأ في قاعدة البيانات',
    code: error.code,
  };
};

// دالة مساعدة للنجاح
const handleSuccess = data => {
  return {
    data,
    error: null,
    success: true,
  };
};

// البيانات التجريبية | Mock Data
const mockBuildings = [
  {
    id: 1,
    name: 'أستر',
    name_en: 'Aster',
    description: 'مبنى سكني فاخر مع جميع المرافق',
    description_en: 'Luxury residential building with all amenities',
    total_apartments: 24,
    available_apartments: 8,
    image_path: '../../assets/aster.jpg',
    is_active: true,
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'الفانتج',
    name_en: 'Vantage',
    description: 'تصميم عصري مع إطلالات رائعة',
    description_en: 'Modern design with stunning views',
    total_apartments: 30,
    available_apartments: 12,
    image_path: '../../assets/vantage.jpg',
    is_active: true,
    created_at: '2023-01-02T00:00:00Z'
  },
  {
    id: 3,
    name: 'شقق المستشفى',
    name_en: 'Hospital Apartments',
    description: 'داخل حرم المستشفى، في قلب المدينة، أمان متكامل',
    description_en: 'Inside hospital campus, in the city center, complete security',
    total_apartments: 20,
    available_apartments: 7,
    image_path: '../../assets/hospital.jpg',
    is_active: true,
    created_at: '2023-01-03T00:00:00Z'
  },
  {
    id: 4,
    name: 'شقق لوموس',
    name_en: 'Lumos Apartments',
    description: 'في حرم المستشفى، هدوء وخدمة مثالية',
    description_en: 'In hospital campus, tranquility and perfect service',
    total_apartments: 16,
    available_apartments: 5,
    image_path: '../../assets/lumos.jpg',
    is_active: true,
    created_at: '2023-01-04T00:00:00Z'
  },
];

// دالة مساعدة لمحاكاة التأخير | Helper function to simulate delay
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// خدمة المباني المحسنة
export const buildingsService = {
  // جلب جميع المباني مع الشقق
  getBuildings: async () => {
    try {
      await simulateDelay(); // محاكاة تأخير الشبكة
      return handleSuccess(mockBuildings);
    } catch (error) {
      return handleError('getBuildings', error);
    }
  },

  // جلب مبنى محدد مع الشقق
  getBuildingById: async id => {
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select(
          `
          *,
          apartments(*)
        `
        )
        .eq('id', id)
        .single();

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('getBuildingById', error);
    }
  },

  // جلب الشقق حسب المبنى
  getApartmentsByBuilding: async buildingId => {
    try {
      const { data, error } = await supabase
        .from('apartments')
        .select('*')
        .eq('building_id', buildingId)
        .eq('is_active', true)
        .order('apartment_number', { ascending: true });

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('getApartmentsByBuilding', error);
    }
  },

  // إحصائيات المباني
  getBuildingStats: async () => {
    try {
      const { data, error } = await supabase.from('buildings').select(`
          id,
          name,
          apartments:apartments(count),
          bookings:bookings(count)
        `);

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('getBuildingStats', error);
    }
  },
};

// خدمة الحجوزات المحسنة
export const bookingsService = {
  // إنشاء حجز جديد مع التحقق من التوفر
  createBooking: async bookingData => {
    try {
      // التحقق من صحة البيانات
      if (
        !bookingData.guest_name ||
        !bookingData.guest_email ||
        !bookingData.check_in
      ) {
        throw new Error('البيانات المطلوبة مفقودة');
      }

      // إضافة معرف فريد للحجز
      const bookingWithId = {
        ...bookingData,
        booking_number: `RH${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingWithId)
        .select()
        .single();

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('createBooking', error);
    }
  },

  // جلب الحجوزات مع تفاصيل المبنى والشقة
  getBookings: async (filters = {}) => {
    try {
      let query = supabase.from('bookings').select(`
          *,
          building:buildings(name, name_en),
          apartment:apartments(apartment_number, type)
        `);

      // تطبيق الفلاتر
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.buildingId) {
        query = query.eq('building_id', filters.buildingId);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query.order('created_at', {
        ascending: false,
      });

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('getBookings', error);
    }
  },

  // تحديث حالة الحجز
  updateBookingStatus: async (bookingId, status, notes = '') => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          status,
          notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('updateBookingStatus', error);
    }
  },

  // البحث في الحجوزات
  searchBookings: async searchTerm => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(
          `
          *,
          building:buildings(name, name_en),
          apartment:apartments(apartment_number, type)
        `
        )
        .or(
          `guest_name.ilike.%${searchTerm}%,guest_email.ilike.%${searchTerm}%,guest_phone.ilike.%${searchTerm}%`
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('searchBookings', error);
    }
  },
};

// خدمة الصيانة المحسنة
export const maintenanceService = {
  // إرسال طلب صيانة
  submitRequest: async requestData => {
    try {
      const requestWithId = {
        ...requestData,
        request_number: `MR${Date.now()}`,
        status: 'pending',
        priority: requestData.priority || 'medium',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert(requestWithId)
        .select()
        .single();

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('submitRequest', error);
    }
  },

  // جلب طلبات الصيانة
  getRequests: async (filters = {}) => {
    try {
      let query = supabase.from('maintenance_requests').select(`
          *,
          building:buildings(name, name_en),
          apartment:apartments(apartment_number)
        `);

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.buildingId) {
        query = query.eq('building_id', filters.buildingId);
      }

      const { data, error } = await query.order('created_at', {
        ascending: false,
      });

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('getRequests', error);
    }
  },

  // تحديث حالة طلب الصيانة
  updateRequestStatus: async (requestId, status, notes = '') => {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .update({
          status,
          notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('updateRequestStatus', error);
    }
  },
};

// خدمة المستخدمين المحسنة
export const usersService = {
  // إنشاء مستخدم جديد
  createUser: async userData => {
    try {
      const userWithDefaults = {
        ...userData,
        is_active: true,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('users')
        .insert(userWithDefaults)
        .select()
        .single();

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('createUser', error);
    }
  },

  // جلب مستخدم حسب البريد الإلكتروني
  getUserByEmail: async email => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('getUserByEmail', error);
    }
  },

  // تحديث بيانات المستخدم
  updateUser: async (userId, updateData) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('updateUser', error);
    }
  },
};

// خدمة الاستفسارات المحسنة
export const inquiriesService = {
  // إنشاء استفسار جديد
  createInquiry: async inquiryData => {
    try {
      const inquiryWithDefaults = {
        ...inquiryData,
        inquiry_number: `INQ${Date.now()}`,
        status: 'new',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('inquiries')
        .insert(inquiryWithDefaults)
        .select()
        .single();

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('createInquiry', error);
    }
  },

  // جلب الاستفسارات
  getInquiries: async (filters = {}) => {
    try {
      let query = supabase.from('inquiries').select('*');

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.type) {
        query = query.eq('inquiry_type', filters.type);
      }

      const { data, error } = await query.order('created_at', {
        ascending: false,
      });

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('getInquiries', error);
    }
  },

  // الرد على استفسار
  replyToInquiry: async (inquiryId, reply, status = 'replied') => {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .update({
          reply,
          status,
          replied_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', inquiryId)
        .select()
        .single();

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('replyToInquiry', error);
    }
  },
};

// خدمة التحليلات والإحصائيات الجديدة
export const analyticsService = {
  // إحصائيات عامة
  getDashboardStats: async () => {
    try {
      const [buildings, bookings, maintenance, inquiries] = await Promise.all([
        supabase.from('buildings').select('id').eq('is_active', true),
        supabase.from('bookings').select('id, status'),
        supabase.from('maintenance_requests').select('id, status'),
        supabase.from('inquiries').select('id, status'),
      ]);

      const stats = {
        totalBuildings: buildings.data?.length || 0,
        totalBookings: bookings.data?.length || 0,
        pendingBookings:
          bookings.data?.filter(b => b.status === 'pending').length || 0,
        confirmedBookings:
          bookings.data?.filter(b => b.status === 'confirmed').length || 0,
        totalMaintenance: maintenance.data?.length || 0,
        pendingMaintenance:
          maintenance.data?.filter(m => m.status === 'pending').length || 0,
        totalInquiries: inquiries.data?.length || 0,
        newInquiries:
          inquiries.data?.filter(i => i.status === 'new').length || 0,
      };

      return handleSuccess(stats);
    } catch (error) {
      return handleError('getDashboardStats', error);
    }
  },

  // إحصائيات الحجوزات الشهرية
  getMonthlyBookingStats: async (year = new Date().getFullYear()) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('created_at, total_amount')
        .gte('created_at', `${year}-01-01`)
        .lte('created_at', `${year}-12-31`);

      if (error) throw error;

      // تجميع البيانات حسب الشهر
      const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        bookings: 0,
        revenue: 0,
      }));

      data?.forEach(booking => {
        const month = new Date(booking.created_at).getMonth();
        monthlyStats[month].bookings += 1;
        monthlyStats[month].revenue += booking.total_amount || 0;
      });

      return handleSuccess(monthlyStats);
    } catch (error) {
      return handleError('getMonthlyBookingStats', error);
    }
  },
};

// خدمة الإشعارات الجديدة
export const notificationsService = {
  // إنشاء إشعار
  createNotification: async notificationData => {
    try {
      const notification = {
        ...notificationData,
        is_read: false,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('createNotification', error);
    }
  },

  // جلب الإشعارات
  getNotifications: async (userId, unreadOnly = false) => {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId);

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query.order('created_at', {
        ascending: false,
      });

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('getNotifications', error);
    }
  },

  // تحديد الإشعار كمقروء
  markAsRead: async notificationId => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return handleSuccess(data);
    } catch (error) {
      return handleError('markAsRead', error);
    }
  },
};

// التصدير الافتراضي المحسن
export default {
  buildingsService,
  bookingsService,
  maintenanceService,
  usersService,
  inquiriesService,
  analyticsService,
  notificationsService,
  // دوال مساعدة
  handleError,
  handleSuccess,
  DB_CONFIG,
};
