import { createClient } from "@supabase/supabase-js";

import { mockProducts, mockCategories } from '../data/mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  !supabaseUrl.includes('your_supabase') && 
  !supabaseAnonKey.includes('your_supabase');

let supabaseClient: any = null;

if (isSupabaseConfigured) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase not configured, using mock data for demo');
}

// ✅ Raw supabase client (with fallback)
export const supabase = supabaseClient || {
  auth: {
    signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    updateUser: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null })
  })
};

// ✅ Auth helpers
export const auth = {
  signUp: (email: string, password: string, metadata?: any) =>
    supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: metadata
      }
    }),

  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  signOut: () => supabase.auth.signOut(),

  getSession: () => supabase.auth.getSession(),

  onAuthStateChange: (callback: (event: any, session: any) => void) =>
    supabase.auth.onAuthStateChange(callback),

  updateUser: (updates: any) => supabase.auth.updateUser(updates),
};

// ✅ Database helpers
export const db = {
  // Products
  getProducts: (categoryId?: string) => {
    if (!isSupabaseConfigured) {
      // Return mock data
      let products = mockProducts.map(p => ({
        ...p,
        category: mockCategories.find(c => c.id === p.category_id)
      }));
      
      if (categoryId) {
        products = products.filter(p => p.category_id === categoryId);
      }
      
      return Promise.resolve({ data: products, error: null });
    }

    let query = supabase
      .from("products")
      .select(`
        *,
        category:categories(*)
      `)
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    return query;
  },

  getProduct: (id: string) => {
    if (!isSupabaseConfigured) {
      const product = mockProducts.find(p => p.id === id);
      if (product) {
        const productWithCategory = {
          ...product,
          category: mockCategories.find(c => c.id === product.category_id)
        };
        return Promise.resolve({ data: productWithCategory, error: null });
      }
      return Promise.resolve({ data: null, error: { message: 'Product not found' } });
    }

    return supabase
      .from("products")
      .select(`
        *,
        category:categories(*)
      `)
      .eq("id", id)
      .single();
  },

  // Categories
  getCategories: () => {
    if (!isSupabaseConfigured) {
      return Promise.resolve({ data: mockCategories, error: null });
    }

    return supabase.from("categories").select("*").order("name");
  },

  // Orders
  createOrder: (order: any) => {
    console.log('Creating order in database:', order);
    
    if (!isSupabaseConfigured) {
      // Mock order creation
      const mockOrder = {
        ...order,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return Promise.resolve({ data: mockOrder, error: null });
    }

    return supabase
      .from("orders")
      .insert([order])
      .select("*")
      .single();
  },

  createOrderItems: (orderItems: any[]) => {
    console.log('Creating order items in database:', orderItems);
    
    if (!isSupabaseConfigured) {
      // Mock order items creation
      const mockItems = orderItems.map(item => ({
        ...item,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      }));
      return Promise.resolve({ data: mockItems, error: null });
    }

    return supabase
      .from("order_items")
      .insert(orderItems)
      .select("*");
  },

  getUserOrders: (userId: string) => {
    if (!isSupabaseConfigured) {
      // Mock user orders
      return Promise.resolve({ data: [], error: null });
    }

    return supabase
      .from("orders")
      .select(`
        *,
        order_items:order_items(
          *,
          product:products(name, name_fr, image_url, price)
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  },

  // Fallback method for getUserOrders
  getUserOrdersFallback: (userId: string) => {
    if (!isSupabaseConfigured) {
      return Promise.resolve({ data: [], error: null });
    }

    return supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  },

  // Basic user orders without joins
  getBasicUserOrders: (userId: string) => {
    if (!isSupabaseConfigured) {
      return Promise.resolve({ data: [], error: null });
    }

    return supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  },

  // Get order items separately
  getOrderItems: (orderId: string) => {
    if (!isSupabaseConfigured) {
      return Promise.resolve({ data: [], error: null });
    }

    return supabase
      .from("order_items")
      .select(`
        *,
        product:products(name, name_fr, image_url, price)
      `)
      .eq("order_id", orderId);
  },
  // User Profiles
  getProfile: (userId: string) => {
    if (!isSupabaseConfigured) {
      // Mock profile for demo users
      const mockProfile = {
        id: userId,
        email: userId.includes('admin') ? 'admin@demo.com' : 'user@demo.com',
        is_admin: userId.includes('admin'),
        full_name: userId.includes('admin') ? 'Demo Admin' : 'Demo User',
        phone: '+237123456789',
        loyalty_points: 150,
        level: 'Bronze',
        created_at: new Date().toISOString()
      };
      return Promise.resolve({ data: mockProfile, error: null });
    }

    return supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
  },

  updateProfile: (userId: string, updates: any) => {
    if (!isSupabaseConfigured) {
      // Mock profile update
      return Promise.resolve({ data: { id: userId, ...updates }, error: null });
    }

    return supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
  },

  // Categories
  createCategory: (category: any) => {
    return supabase.from("categories").insert(category).select().single();
  },

  updateCategory: (id: string, updates: any) => {
    return supabase.from("categories").update(updates).eq("id", id).select().single();
  },

  deleteCategory: (id: string) => {
    return supabase.from("categories").delete().eq("id", id);
  },

  // Rewards System
  getUserRewards: (userId: string) => {
    // Mock rewards for demo since table doesn't exist
    return Promise.resolve({
      data: [
        {
          id: '1',
          user_id: userId,
          type: 'daily_login',
          title: 'Daily Login Bonus',
          description: 'Welcome back! Here are your daily points.',
          points: 50,
          claimed: false,
          created_at: new Date().toISOString()
        }
      ],
      error: null
    });
  },

  claimReward: (rewardId: string) => {
    // Mock claim for demo
    return Promise.resolve({ data: null, error: null });
  },

  createReward: (reward: any) => {
    // Mock create for demo
    return Promise.resolve({ data: reward, error: null });
  },

  // Achievements
  getAchievements: () => {
    // Mock achievements for demo
    return Promise.resolve({
      data: [
        {
          id: '1',
          title: 'First Purchase',
          description: 'Complete your first order',
          icon: 'trophy',
          points: 100,
          requirement_type: 'orders',
          requirement_value: 1
        }
      ],
      error: null
    });
  },

  getUserAchievements: (userId: string) => {
    // Mock user achievements for demo
    return Promise.resolve({ data: [], error: null });
  },

  // Surprise Events
  getActiveSurpriseEvents: () => {
    // Mock surprise events for demo
    return Promise.resolve({ data: [], error: null });
  },

  // Admin functions
  createUser: async (userData: any) => {
    // In a real app, you'd use supabase.auth.admin.createUser
    // For demo purposes, we'll create a profile directly
    return supabase.from("profiles").insert({
      id: crypto.randomUUID(),
      email: userData.email,
      full_name: userData.full_name,
      phone: userData.phone,
      is_admin: userData.is_admin,
    }).select().single();
  },

  updateUser: (userId: string, updates: any) => {
    return supabase.from("profiles").update(updates).eq("id", userId).select().single();
  },

  deleteUser: (userId: string) => {
    return supabase.from("profiles").delete().eq("id", userId);
  },

  createProduct: (product: any) => {
    return supabase.from("products").insert(product).select().single();
  },

  updateProduct: (id: string, updates: any) => {
    return supabase.from("products").update(updates).eq("id", id).select().single();
  },

  deleteProduct: (id: string) => {
    return supabase.from("products").delete().eq("id", id);
  },

  getAllProducts: () => {
    return supabase
      .from("products")
      .select(`
        *,
        category:categories(*)
      `)
      .order("created_at", { ascending: false });
  },

  getAllUsers: () => {
    return supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
  },

  getAllOrders: () => {
    return supabase
      .from("orders")
      .select(`
        *,
        order_items:order_items(
          *,
          product:products(name)
        )
      `)
      .order("created_at", { ascending: false });
  },

  updateOrderStatus: (orderId: string, status: string) => {
    return supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);
  },

  // Analytics
  getAnalytics: () => {
    return Promise.all([
      supabase.from("products").select("id", { count: "exact" }),
      supabase.from("profiles").select("id", { count: "exact" }),
      supabase.from("orders").select("total"),
      supabase.from("orders").select("id", { count: "exact" }),
    ]);
  },
};

// ✅ Storage helpers
export const storage = {
  uploadFile: (bucket: string, path: string, file: File) =>
    supabase.storage.from(bucket).upload(path, file),

  getPublicUrl: (bucket: string, path: string) =>
    supabase.storage.from(bucket).getPublicUrl(path),

  deleteFile: (bucket: string, path: string) =>
    supabase.storage.from(bucket).remove([path]),
};