import { supabase } from '../supabaseConfig';

// خدمة المباني | Buildings Service
export const buildingsService = {
  // جلب جميع المباني | Get all buildings
  async getAllBuildings() {
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('خطأ في جلب المباني:', error);
      return [];
    }
  },

  // إضافة مبنى جديد | Add new building
  async addBuilding(buildingData) {
    try {
      const { data, error } = await supabase
        .from('buildings')
        .insert([buildingData])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('خطأ في إضافة المبنى:', error);
      throw error;
    }
  },

  // تحديث مبنى | Update building
  async updateBuilding(id, updates) {
    try {
      const { data, error } = await supabase
        .from('buildings')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('خطأ في تحديث المبنى:', error);
      throw error;
    }
  },

  // حذف مبنى | Delete building
  async deleteBuilding(id) {
    try {
      const { error } = await supabase.from('buildings').delete().eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('خطأ في حذف المبنى:', error);
      throw error;
    }
  },

  // جلب مبنى واحد | Get single building
  async getBuildingById(id) {
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('خطأ في جلب المبنى:', error);
      throw error;
    }
  },

  // جلب شقق المبنى | Get building apartments
  async getApartmentsByBuilding(buildingId) {
    try {
      const { data, error } = await supabase
        .from('apartments')
        .select('*')
        .eq('building_id', buildingId)
        .eq('available', true)
        .order('apartment_number');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('خطأ في جلب الشقق:', error);
      return [];
    }
  },

  // جلب شقة واحدة | Get single apartment
  async getApartmentById(id) {
    try {
      const { data, error } = await supabase
        .from('apartments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('خطأ في جلب الشقة:', error);
      throw error;
    }
  },

  // إنشاء حجز (للاستعلامات) | Create booking inquiry
  async createBooking(bookingData) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            ...bookingData,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('خطأ في إنشاء الحجز:', error);
      throw error;
    }
  },
};

// خدمة الحجوزات | Bookings Service
export const bookingsService = {
  // جلب حجوزات المستخدم | Get user bookings
  async getUserBookings(userId) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(
          `
          *,
          buildings (
            id,
            name,
            name_en,
            location
          )
        `
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('خطأ في جلب الحجوزات:', error);
      return [];
    }
  },

  // إنشاء حجز جديد | Create new booking
  async createBooking(bookingData) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            ...bookingData,
            status: 'pending',
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('خطأ في إنشاء الحجز:', error);
      throw error;
    }
  },
};

// خدمة المستخدمين | Users Service
export const usersService = {
  // جلب بيانات المستخدم | Get user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('خطأ في جلب بيانات المستخدم:', error);
      return null;
    }
  },

  // تحديث بيانات المستخدم | Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('خطأ في تحديث البيانات:', error);
      throw error;
    }
  },
};

// خدمة طلبات الصيانة | Maintenance Service
export const maintenanceService = {
  // إرسال طلب صيانة | Submit maintenance request
  async submitMaintenanceRequest(requestData) {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert([
          {
            ...requestData,
            status: 'pending',
            priority: requestData.priority || 'medium',
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('خطأ في إرسال طلب الصيانة:', error);
      throw error;
    }
  },

  // إنشاء طلب صيانة | Create maintenance request
  async createMaintenanceRequest(requestData) {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert([
          {
            ...requestData,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('خطأ في إنشاء طلب الصيانة:', error);
      throw error;
    }
  },

  // جلب طلبات الصيانة | Get maintenance requests
  async getMaintenanceRequests(userId) {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('خطأ في جلب طلبات الصيانة:', error);
      return [];
    }
  },
};

// خدمة الاشتراكات الفورية | Real-time Subscriptions
export const realtimeService = {
  // الاستماع لتغييرات المباني | Listen to buildings changes
  subscribeToBuildingsChanges(callback) {
    return supabase
      .channel('buildings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'buildings' },
        callback
      )
      .subscribe();
  },

  // الاستماع لتغييرات الحجوزات | Listen to bookings changes
  subscribeToBookingsChanges(userId, callback) {
    return supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  // إلغاء الاشتراك | Unsubscribe
  unsubscribe(subscription) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  },
};
