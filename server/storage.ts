import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users, messages, payments, type User, type InsertUser, type UpsertUser, type Message, type InsertMessage, type Payment, type InsertPayment } from "@shared/schema";
import { randomUUID } from "crypto";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  linkAnonymousToAuthenticated(anonymousId: string, authenticatedId: string): Promise<User | undefined>;
  updateUserSubscription(userId: string, status: string): Promise<User | undefined>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User | undefined>;
  updateUserProfile(userId: string, profile: { birthDate?: string; birthTime?: string; birthPlace?: string; religion?: string; horoscopePreferences?: string[] }): Promise<User | undefined>;
  
  getSoulGems(userId: string): Promise<number>;
  addSoulGems(userId: string, amount: number): Promise<User | undefined>;
  deductSoulGems(userId: string, amount: number): Promise<User | undefined>;
  refreshDailyGems(userId: string): Promise<User | undefined>;
  
  generateReferralCode(userId: string): Promise<string>;
  validateReferralCode(code: string): Promise<{ valid: boolean; referrerId?: string; alreadyUsed?: boolean }>;
  applyReferralReward(referrerId: string, refereeId: string): Promise<void>;
  
  createMessage(message: InsertMessage): Promise<Message>;
  getUserMessages(userId: string): Promise<Message[]>;
  
  createPayment(payment: InsertPayment): Promise<Payment>;
  getUserPayments(userId: string): Promise<Payment[]>;
}

class PostgresStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0] as User;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const result = await this.db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0] as User;
  }

  async linkAnonymousToAuthenticated(anonymousId: string, authenticatedId: string): Promise<User | undefined> {
    const anonymousUser = await this.getUser(anonymousId);
    const authenticatedUser = await this.getUser(authenticatedId);
    
    if (!anonymousUser || !authenticatedUser) {
      return authenticatedUser;
    }

    // Transfer Soul Gems from anonymous to authenticated account
    const newGemBalance = (authenticatedUser.soulGems ?? 0) + (anonymousUser.soulGems ?? 0);
    
    // FIRST: Transfer messages and payments to authenticated user (BEFORE deleting)
    await this.db
      .update(messages)
      .set({ userId: authenticatedId })
      .where(eq(messages.userId, anonymousId));
    
    await this.db
      .update(payments)
      .set({ userId: authenticatedId })
      .where(eq(payments.userId, anonymousId));

    // SECOND: Update authenticated user with merged data
    const [updatedUser] = await this.db
      .update(users)
      .set({
        soulGems: newGemBalance,
        birthDate: authenticatedUser.birthDate || anonymousUser.birthDate,
        birthTime: authenticatedUser.birthTime || anonymousUser.birthTime,
        birthPlace: authenticatedUser.birthPlace || anonymousUser.birthPlace,
        religion: authenticatedUser.religion || anonymousUser.religion,
        horoscopePreferences: authenticatedUser.horoscopePreferences || anonymousUser.horoscopePreferences,
        stripeCustomerId: authenticatedUser.stripeCustomerId || anonymousUser.stripeCustomerId,
        stripeSubscriptionId: authenticatedUser.stripeSubscriptionId || anonymousUser.stripeSubscriptionId,
        lastFreeGemsDate: authenticatedUser.lastFreeGemsDate || anonymousUser.lastFreeGemsDate,
      })
      .where(eq(users.id, authenticatedId))
      .returning();

    // LAST: Delete anonymous user (after everything is transferred)
    await this.db.delete(users).where(eq(users.id, anonymousId));

    return updatedUser;
  }

  async updateUserSubscription(userId: string, status: string): Promise<User | undefined> {
    const result = await this.db
      .update(users)
      .set({ subscriptionStatus: status })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User | undefined> {
    const result = await this.db
      .update(users)
      .set({ 
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId 
      })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async updateUserProfile(userId: string, profile: { birthDate?: string; birthTime?: string; birthPlace?: string; religion?: string; horoscopePreferences?: string[] }): Promise<User | undefined> {
    const result = await this.db
      .update(users)
      .set(profile)
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async getSoulGems(userId: string): Promise<number> {
    const user = await this.getUser(userId);
    if (!user) return 0;
    
    // Premium users have unlimited gems
    if (user.subscriptionStatus === "premium") {
      return 999999;
    }
    
    return user.soulGems ?? 0;
  }

  async addSoulGems(userId: string, amount: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const result = await this.db
      .update(users)
      .set({ soulGems: (user.soulGems ?? 0) + amount })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async deductSoulGems(userId: string, amount: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    // Premium users don't deduct gems
    if (user.subscriptionStatus === "premium") {
      return user;
    }
    
    // Atomic deduction with balance check - prevents double-spending
    const result = await this.db
      .update(users)
      .set({ soulGems: sql`GREATEST(0, ${users.soulGems} - ${amount})` })
      .where(sql`${users.id} = ${userId} AND ${users.soulGems} >= ${amount}`)
      .returning();
    
    // If no rows updated, insufficient gems
    return result[0];
  }

  async refreshDailyGems(userId: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const today = new Date().toISOString().split('T')[0];
    const lastFreeDate = user.lastFreeGemsDate;
    
    // If it's a new day, refresh to 1 gem
    if (lastFreeDate !== today) {
      const result = await this.db
        .update(users)
        .set({ 
          soulGems: 1,
          lastFreeGemsDate: today
        })
        .where(eq(users.id, userId))
        .returning();
      return result[0];
    }
    
    return user;
  }

  async generateReferralCode(userId: string): Promise<string> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    // If user already has a code, return it
    if (user.referralCode) {
      return user.referralCode;
    }
    
    // Generate unique 6-character alphanumeric code
    let code: string;
    let isUnique = false;
    
    while (!isUnique) {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existing = await this.db.select().from(users).where(eq(users.referralCode, code)).limit(1);
      isUnique = existing.length === 0;
    }
    
    // Save code to user
    const result = await this.db
      .update(users)
      .set({ referralCode: code! })
      .where(eq(users.id, userId))
      .returning();
    
    return result[0].referralCode!;
  }

  async validateReferralCode(code: string): Promise<{ valid: boolean; referrerId?: string; alreadyUsed?: boolean }> {
    const result = await this.db.select().from(users).where(eq(users.referralCode, code)).limit(1);
    
    if (result.length === 0) {
      return { valid: false };
    }
    
    return { valid: true, referrerId: result[0].id };
  }

  async applyReferralReward(referrerId: string, refereeId: string): Promise<void> {
    // Check if referee already used a referral code
    const referee = await this.getUser(refereeId);
    if (referee?.referredBy) {
      throw new Error("Referral code already used");
    }
    
    // Add 10 gems to referrer
    await this.db
      .update(users)
      .set({ 
        soulGems: sql`${users.soulGems} + 10`,
        referralCount: sql`${users.referralCount} + 1`
      })
      .where(eq(users.id, referrerId));
    
    // Add 5 gems to referee and mark them as referred
    await this.db
      .update(users)
      .set({ 
        soulGems: sql`${users.soulGems} + 5`,
        referredBy: referrerId
      })
      .where(eq(users.id, refereeId));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const result = await this.db.insert(messages).values(insertMessage).returning();
    return result[0];
  }

  async getUserMessages(userId: string): Promise<Message[]> {
    return await this.db.select().from(messages).where(eq(messages.userId, userId));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const result = await this.db.insert(payments).values(insertPayment).returning();
    return result[0];
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return await this.db.select().from(payments).where(eq(payments.userId, userId));
  }
}

class MemStorage implements IStorage {
  private users: Map<string, User>;
  private messages: Map<string, Message>;
  private payments: Map<string, Payment>;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.payments = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      email: insertUser.email ?? null,
      firstName: null,
      lastName: null,
      profileImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      subscriptionStatus: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      soulGems: 1,
      lastFreeGemsDate: null,
      birthDate: null,
      birthTime: null,
      birthPlace: null,
      religion: null,
      horoscopePreferences: null,
      referralCode: null,
      referredBy: null,
      referralCount: 0
    };
    this.users.set(id, user);
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id!);
    const user: User = {
      ...existingUser,
      ...userData,
      id: userData.id!,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      subscriptionStatus: userData.subscriptionStatus ?? "free",
      stripeCustomerId: userData.stripeCustomerId ?? null,
      stripeSubscriptionId: userData.stripeSubscriptionId ?? null,
      soulGems: userData.soulGems ?? 1,
      lastFreeGemsDate: userData.lastFreeGemsDate ?? null,
      birthDate: userData.birthDate ?? null,
      birthTime: userData.birthTime ?? null,
      birthPlace: userData.birthPlace ?? null,
      religion: userData.religion ?? null,
      horoscopePreferences: userData.horoscopePreferences ?? null,
      referralCode: userData.referralCode ?? null,
      referredBy: userData.referredBy ?? null,
      referralCount: userData.referralCount ?? 0,
      createdAt: existingUser?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async linkAnonymousToAuthenticated(anonymousId: string, authenticatedId: string): Promise<User | undefined> {
    const anonymousUser = this.users.get(anonymousId);
    const authenticatedUser = this.users.get(authenticatedId);
    
    if (!anonymousUser || !authenticatedUser) {
      return authenticatedUser;
    }

    // FIRST: Transfer messages and payments to authenticated user (before deleting)
    Array.from(this.messages.entries()).forEach(([id, message]) => {
      if (message.userId === anonymousId) {
        message.userId = authenticatedId;
        this.messages.set(id, message);
      }
    });
    
    Array.from(this.payments.entries()).forEach(([id, payment]) => {
      if (payment.userId === anonymousId) {
        payment.userId = authenticatedId;
        this.payments.set(id, payment);
      }
    });

    // SECOND: Transfer Soul Gems and merge data
    const newGemBalance = (authenticatedUser.soulGems ?? 0) + (anonymousUser.soulGems ?? 0);
    
    authenticatedUser.soulGems = newGemBalance;
    authenticatedUser.birthDate = authenticatedUser.birthDate || anonymousUser.birthDate;
    authenticatedUser.birthTime = authenticatedUser.birthTime || anonymousUser.birthTime;
    authenticatedUser.birthPlace = authenticatedUser.birthPlace || anonymousUser.birthPlace;
    authenticatedUser.religion = authenticatedUser.religion || anonymousUser.religion;
    authenticatedUser.horoscopePreferences = authenticatedUser.horoscopePreferences || anonymousUser.horoscopePreferences;
    authenticatedUser.stripeCustomerId = authenticatedUser.stripeCustomerId || anonymousUser.stripeCustomerId;
    authenticatedUser.stripeSubscriptionId = authenticatedUser.stripeSubscriptionId || anonymousUser.stripeSubscriptionId;
    authenticatedUser.lastFreeGemsDate = authenticatedUser.lastFreeGemsDate || anonymousUser.lastFreeGemsDate;
    
    this.users.set(authenticatedId, authenticatedUser);

    // LAST: Delete anonymous user (after everything is transferred)
    this.users.delete(anonymousId);

    return authenticatedUser;
  }

  async updateUserSubscription(userId: string, status: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      user.subscriptionStatus = status;
      this.users.set(userId, user);
      return user;
    }
    return undefined;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      user.stripeCustomerId = customerId;
      user.stripeSubscriptionId = subscriptionId;
      this.users.set(userId, user);
      return user;
    }
    return undefined;
  }

  async updateUserProfile(userId: string, profile: { birthDate?: string; birthTime?: string; birthPlace?: string; religion?: string; horoscopePreferences?: string[] }): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      Object.assign(user, profile);
      this.users.set(userId, user);
      return user;
    }
    return undefined;
  }

  async getSoulGems(userId: string): Promise<number> {
    const user = this.users.get(userId);
    if (!user) return 0;
    
    // Premium users have unlimited gems
    if (user.subscriptionStatus === "premium") {
      return 999999;
    }
    
    return user.soulGems ?? 0;
  }

  async addSoulGems(userId: string, amount: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      user.soulGems = (user.soulGems ?? 0) + amount;
      this.users.set(userId, user);
      return user;
    }
    return undefined;
  }

  async deductSoulGems(userId: string, amount: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      // Premium users don't deduct gems
      if (user.subscriptionStatus === "premium") {
        return user;
      }
      
      // Atomic check - only deduct if sufficient balance (prevents double-spend)
      if ((user.soulGems ?? 0) < amount) {
        return undefined; // Insufficient gems
      }
      
      user.soulGems = Math.max(0, (user.soulGems ?? 0) - amount);
      this.users.set(userId, user);
      return user;
    }
    return undefined;
  }

  async refreshDailyGems(userId: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      const lastFreeDate = user.lastFreeGemsDate;
      
      // If it's a new day, refresh to 1 gem
      if (lastFreeDate !== today) {
        user.soulGems = 1;
        user.lastFreeGemsDate = today;
        this.users.set(userId, user);
      }
      
      return user;
    }
    return undefined;
  }

  async generateReferralCode(userId: string): Promise<string> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    // If user already has a code, return it
    if (user.referralCode) {
      return user.referralCode;
    }
    
    // Generate unique 6-character alphanumeric code
    let code: string;
    let isUnique = false;
    
    while (!isUnique) {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      isUnique = !Array.from(this.users.values()).some(u => u.referralCode === code);
    }
    
    // Save code to user
    user.referralCode = code!;
    this.users.set(userId, user);
    
    return code!;
  }

  async validateReferralCode(code: string): Promise<{ valid: boolean; referrerId?: string; alreadyUsed?: boolean }> {
    const referrer = Array.from(this.users.values()).find(u => u.referralCode === code);
    
    if (!referrer) {
      return { valid: false };
    }
    
    return { valid: true, referrerId: referrer.id };
  }

  async applyReferralReward(referrerId: string, refereeId: string): Promise<void> {
    // Check if referee already used a referral code
    const referee = this.users.get(refereeId);
    if (referee?.referredBy) {
      throw new Error("Referral code already used");
    }
    
    // Add 10 gems to referrer
    const referrer = this.users.get(referrerId);
    if (referrer) {
      referrer.soulGems = (referrer.soulGems ?? 0) + 10;
      referrer.referralCount = (referrer.referralCount ?? 0) + 1;
      this.users.set(referrerId, referrer);
    }
    
    // Add 5 gems to referee and mark them as referred
    if (referee) {
      referee.soulGems = (referee.soulGems ?? 0) + 5;
      referee.referredBy = referrerId;
      this.users.set(refereeId, referee);
    }
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      id,
      userId: insertMessage.userId ?? null,
      input: insertMessage.input,
      aiResponse: insertMessage.aiResponse,
      emotion: insertMessage.emotion ?? null,
      type: insertMessage.type ?? "message",
      timestamp: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async getUserMessages(userId: string): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(m => m.userId === userId);
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = {
      id,
      userId: insertPayment.userId ?? null,
      amount: insertPayment.amount,
      type: insertPayment.type,
      stripePaymentId: insertPayment.stripePaymentId ?? null,
      timestamp: new Date(),
    };
    this.payments.set(id, payment);
    return payment;
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(p => p.userId === userId);
  }
}

export const storage = process.env.DATABASE_URL 
  ? new PostgresStorage() 
  : new MemStorage();
