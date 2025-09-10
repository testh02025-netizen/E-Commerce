import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  !supabaseUrl.includes('your_supabase') && 
  !supabaseAnonKey.includes('your_supabase');

if (!isSupabaseConfigured) {
  throw new Error('Supabase configuration is required. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
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

// Database helpers
export const db = {
  // Products
  getProducts: (categoryId?: string) => {
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
    return supabase.from("categories").select("*").order("name");
  },

  // Orders
  createOrder: (order: any) => {
    return supabase
      .from("orders")
      .insert([order])
      .select("*")
      .single();
  },

  createOrderItems: (orderItems: any[]) => {
    return supabase
      .from("order_items")
      .insert(orderItems)
      .select("*");
  },

  getUserOrders: (userId: string) => {
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

  getBasicUserOrders: (userId: string) => {
    return supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  },

  getOrderItems: (orderId: string) => {
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
    return supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
  },

  updateProfile: (userId: string, updates: any) => {
    return supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
  },

  // Categories Management
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
    return supabase
      .from("user_rewards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  },

  claimReward: (rewardId: string) => {
    return supabase
      .from("user_rewards")
      .update({ claimed: true })
      .eq("id", rewardId);
  },

  createReward: (reward: any) => {
    return supabase
      .from("user_rewards")
      .insert(reward)
      .select()
      .single();
  },

  // Achievements
  getAchievements: () => {
    return supabase
      .from("achievements")
      .select("*")
      .order("points", { ascending: false });
  },

  getUserAchievements: (userId: string) => {
    return supabase
      .from("user_achievements")
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq("user_id", userId);
  },

  // Surprise Events
  getActiveSurpriseEvents: () => {
    return supabase
      .from("surprise_events")
      .select("*")
      .eq("active", true)
      .gte("end_date", new Date().toISOString());
  },

  // Admin functions
  createUser: async (userData: any) => {
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

// Storage helpers
export const storage = {
  uploadFile: (bucket: string, path: string, file: File) =>
    supabase.storage.from(bucket).upload(path, file),

  getPublicUrl: (bucket: string, path: string) =>
    supabase.storage.from(bucket).getPublicUrl(path),

  deleteFile: (bucket: string, path: string) =>
    supabase.storage.from(bucket).remove([path]),
};