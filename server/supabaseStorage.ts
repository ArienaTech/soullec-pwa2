import { supabase } from "./supabase";
import type { User, InsertUser, UpsertUser, Message, InsertMessage, Payment, InsertPayment } from "@shared/schema";
import { randomUUID } from "crypto";
import type { IStorage } from "./storage";

export class SupabaseStorage implements IStorage {
  
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return undefined; // Not found
      throw error;
    }
    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const userData = {
      id: randomUUID(),
      ...insertUser,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        ...userData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  async linkAnonymousToAuthenticated(anonymousId: string, authenticatedId: string): Promise<User | undefined> {
    const anonymousUser = await this.getUser(anonymousId);
    const authenticatedUser = await this.getUser(authenticatedId);

    if (!anonymousUser || !authenticatedUser) {
      throw new Error("User not found");
    }

    // Update messages
    await supabase
      .from('messages')
      .update({ user_id: authenticatedId })
      .eq('user_id', anonymousId);

    // Update payments
    await supabase
      .from('payments')
      .update({ user_id: authenticatedId })
      .eq('user_id', anonymousId);

    // Merge data
    const mergedData = {
      id: authenticatedId,
      email: authenticatedUser.email || anonymousUser.email,
      first_name: authenticatedUser.firstName || anonymousUser.firstName,
      last_name: authenticatedUser.lastName || anonymousUser.lastName,
      profile_image_url: authenticatedUser.profileImageUrl || anonymousUser.profileImageUrl,
      subscription_status: authenticatedUser.subscriptionStatus,
      stripe_customer_id: authenticatedUser.stripeCustomerId || anonymousUser.stripeCustomerId,
      stripe_subscription_id: authenticatedUser.stripeSubscriptionId || anonymousUser.stripeSubscriptionId,
      soul_gems: (authenticatedUser.soulGems || 0) + (anonymousUser.soulGems || 0),
      last_free_gems_date: authenticatedUser.lastFreeGemsDate || anonymousUser.lastFreeGemsDate,
      birth_date: authenticatedUser.birthDate || anonymousUser.birthDate,
      birth_time: authenticatedUser.birthTime || anonymousUser.birthTime,
      birth_place: authenticatedUser.birthPlace || anonymousUser.birthPlace,
      religion: authenticatedUser.religion || anonymousUser.religion,
      horoscope_preferences: authenticatedUser.horoscopePreferences || anonymousUser.horoscopePreferences,
      referral_code: authenticatedUser.referralCode || anonymousUser.referralCode,
      referred_by: authenticatedUser.referredBy || anonymousUser.referredBy,
      referral_count: (authenticatedUser.referralCount || 0) + (anonymousUser.referralCount || 0),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('users')
      .update(mergedData)
      .eq('id', authenticatedId)
      .select()
      .single();

    if (error) throw error;

    // Delete anonymous user
    await supabase
      .from('users')
      .delete()
      .eq('id', anonymousId);

    return data as User;
  }

  async updateUserSubscription(userId: string, status: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .update({ 
        subscription_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .update({ 
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  async updateUserProfile(userId: string, profile: { 
    birthDate?: string; 
    birthTime?: string; 
    birthPlace?: string; 
    religion?: string; 
    horoscopePreferences?: string[] 
  }): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .update({
        birth_date: profile.birthDate,
        birth_time: profile.birthTime,
        birth_place: profile.birthPlace,
        religion: profile.religion,
        horoscope_preferences: profile.horoscopePreferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  async getSoulGems(userId: string): Promise<number> {
    const user = await this.getUser(userId);
    return user?.soulGems || 0;
  }

  async addSoulGems(userId: string, amount: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;

    const { data, error } = await supabase
      .from('users')
      .update({ 
        soul_gems: (user.soulGems || 0) + amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  async deductSoulGems(userId: string, amount: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user || user.soulGems < amount) return undefined;

    const { data, error } = await supabase
      .from('users')
      .update({ 
        soul_gems: user.soulGems - amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  async refreshDailyGems(userId: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;

    const today = new Date().toISOString().split('T')[0];
    const lastFreeGemsDate = user.lastFreeGemsDate;

    if (lastFreeGemsDate !== today && user.subscriptionStatus !== 'premium') {
      const { data, error } = await supabase
        .from('users')
        .update({ 
          soul_gems: (user.soulGems || 0) + 1,
          last_free_gems_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data as User;
    }

    return user;
  }

  async generateReferralCode(userId: string): Promise<string> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    if (user.referralCode) return user.referralCode;

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { data, error } = await supabase
      .from('users')
      .update({ 
        referral_code: code,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return code;
  }

  async validateReferralCode(code: string): Promise<{ valid: boolean; referrerId?: string; alreadyUsed?: boolean }> {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('referral_code', code)
      .single();

    if (error || !data) {
      return { valid: false };
    }

    return { valid: true, referrerId: data.id };
  }

  async applyReferralReward(referrerId: string, refereeId: string): Promise<void> {
    // Add gems to referrer
    await this.addSoulGems(referrerId, 10);
    
    // Add gems to referee
    await this.addSoulGems(refereeId, 5);
    
    // Update referral count
    const referrer = await this.getUser(referrerId);
    if (referrer) {
      await supabase
        .from('users')
        .update({ 
          referral_count: (referrer.referralCount || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', referrerId);
    }

    // Mark referee as referred
    await supabase
      .from('users')
      .update({ 
        referred_by: referrerId,
        updated_at: new Date().toISOString()
      })
      .eq('id', refereeId);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const messageData = {
      id: randomUUID(),
      ...message,
      timestamp: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();

    if (error) throw error;
    return data as Message;
  }

  async getUserMessages(userId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return (data || []) as Message[];
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const paymentData = {
      id: randomUUID(),
      ...payment,
      timestamp: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single();

    if (error) throw error;
    return data as Payment;
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return (data || []) as Payment[];
  }
}

export const storage = new SupabaseStorage();
