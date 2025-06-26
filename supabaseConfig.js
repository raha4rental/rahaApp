// Temporary supabase config to avoid import errors
// This can be properly configured later with real credentials

export const supabase = {
  from: () => ({
    select: () => ({
      order: () => ({ data: [], error: null }),
      eq: () => ({ data: [], error: null }),
      single: () => ({ data: {}, error: null })
    }),
    insert: () => ({
      select: () => ({ data: [], error: null })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({ data: [], error: null })
      })
    }),
    delete: () => ({
      eq: () => ({ error: null })
    })
  }),
  channel: () => ({
    on: () => ({
      subscribe: () => ({})
    })
  }),
  removeChannel: () => {}
}; 