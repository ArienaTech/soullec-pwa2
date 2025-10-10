import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./supabaseStorage";
import { detectEmotion, generateBarnumMessage, generateAffirmation, generateDailyHoroscope } from "./openai";
import { calculateHoroscope, formatHoroscopeContext } from "./horoscope";
import { insertMessageSchema, insertPaymentSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";

// Initialize Stripe only if key is provided
const stripe = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover",
    })
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);

  // Get authenticated user info
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Link anonymous user to authenticated account
  app.post('/api/auth/link', isAuthenticated, async (req: any, res) => {
    try {
      const authenticatedId = req.user.claims.sub;
      const { anonymousId } = req.body;

      if (!anonymousId) {
        return res.status(400).json({ message: "Anonymous ID required" });
      }

      const linkedUser = await storage.linkAnonymousToAuthenticated(anonymousId, authenticatedId);
      
      res.json({ 
        success: true,
        user: linkedUser,
        soulGems: await storage.getSoulGems(authenticatedId),
        isPremium: linkedUser?.subscriptionStatus === "premium"
      });
    } catch (error: any) {
      console.error("Error linking accounts:", error);
      res.status(500).json({ message: "Failed to link accounts" });
    }
  });
  
  // Create or get anonymous user session
  app.post("/api/user/session", async (req, res) => {
    try {
      let userId = req.body.userId;
      let user;
      
      if (!userId) {
        user = await storage.createUser({ email: null });
        userId = user.id;
      } else {
        user = await storage.getUser(userId);
        if (!user) {
          user = await storage.createUser({ email: null });
          userId = user.id;
        } else {
          // Refresh daily gems if it's a new day
          user = await storage.refreshDailyGems(userId) || user;
        }
      }
      
      const soulGems = await storage.getSoulGems(userId);
      
      res.json({ 
        userId,
        soulGems,
        isPremium: user.subscriptionStatus === "premium"
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating session: " + error.message });
    }
  });

  // Get Soul Gems balance
  app.get("/api/user/gems/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const soulGems = await storage.getSoulGems(userId);
      
      res.json({ 
        soulGems,
        isPremium: user.subscriptionStatus === "premium"
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error getting gems: " + error.message });
    }
  });

  // Generate AI message from emotional input
  app.post("/api/messages/generate", async (req, res) => {
    try {
      const { feeling, userId, uiLanguage } = req.body;
      
      if (!feeling || !userId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check Soul Gems balance
      const soulGems = await storage.getSoulGems(userId);
      if (soulGems < 1) {
        return res.status(403).json({ 
          message: "Insufficient Soul Gems",
          soulGems: 0
        });
      }

      const user = await storage.getUser(userId);
      let horoscopeContext: string | undefined;
      
      if (user?.birthDate && user?.horoscopePreferences && user.horoscopePreferences.length > 0) {
        const horoscopeReading = calculateHoroscope(
          {
            birthDate: user.birthDate,
            birthTime: user.birthTime || undefined,
            birthPlace: user.birthPlace || undefined
          },
          user.horoscopePreferences
        );
        horoscopeContext = formatHoroscopeContext(horoscopeReading);
      }

      const emotionAnalysis = await detectEmotion(feeling);
      const language = uiLanguage || "English";
      const { message, emotion } = await generateBarnumMessage(
        feeling, 
        emotionAnalysis.emotion,
        horoscopeContext,
        user?.religion || undefined,
        language
      );

      const insertData = insertMessageSchema.parse({
        userId,
        input: feeling,
        aiResponse: message,
        emotion,
        type: "message",
      });

      const savedMessage = await storage.createMessage(insertData);
      
      // Deduct 1 Soul Gem (atomic operation prevents double-spend)
      const updatedUser = await storage.deductSoulGems(userId, 1);
      if (!updatedUser) {
        return res.status(403).json({ 
          message: "Insufficient Soul Gems",
          soulGems: 0
        });
      }
      
      const remainingGems = await storage.getSoulGems(userId);
      
      res.json({ 
        message: savedMessage.aiResponse,
        emotion: savedMessage.emotion,
        messageId: savedMessage.id,
        soulGems: remainingGems
      });
    } catch (error: any) {
      console.error("Generate message error:", error);
      res.status(500).json({ message: "Error generating message: " + error.message });
    }
  });

  // Generate manifestation affirmation
  app.post("/api/manifestation/generate", async (req, res) => {
    try {
      const { desire, userId, uiLanguage } = req.body;
      
      if (!desire || !userId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check Soul Gems balance
      const soulGems = await storage.getSoulGems(userId);
      if (soulGems < 1) {
        return res.status(403).json({ 
          message: "Insufficient Soul Gems",
          soulGems: 0
        });
      }

      const user = await storage.getUser(userId);
      let horoscopeContext: string | undefined;
      
      if (user?.birthDate && user?.horoscopePreferences && user.horoscopePreferences.length > 0) {
        const horoscopeReading = calculateHoroscope(
          {
            birthDate: user.birthDate,
            birthTime: user.birthTime || undefined,
            birthPlace: user.birthPlace || undefined
          },
          user.horoscopePreferences
        );
        horoscopeContext = formatHoroscopeContext(horoscopeReading);
      }

      const language = uiLanguage || "English";
      const { affirmation } = await generateAffirmation(
        desire,
        horoscopeContext,
        user?.religion || undefined,
        language
      );

      const insertData = insertMessageSchema.parse({
        userId,
        input: desire,
        aiResponse: affirmation,
        type: "affirmation",
      });

      const savedMessage = await storage.createMessage(insertData);
      
      // Deduct 1 Soul Gem (atomic operation prevents double-spend)
      const updatedUser = await storage.deductSoulGems(userId, 1);
      if (!updatedUser) {
        return res.status(403).json({ 
          message: "Insufficient Soul Gems",
          soulGems: 0
        });
      }
      
      const remainingGems = await storage.getSoulGems(userId);
      
      res.json({ 
        affirmation: savedMessage.aiResponse,
        messageId: savedMessage.id,
        soulGems: remainingGems
      });
    } catch (error: any) {
      console.error("Generate affirmation error:", error);
      res.status(500).json({ message: "Error generating affirmation: " + error.message });
    }
  });

  // Update user profile
  app.post("/api/user/profile", async (req, res) => {
    try {
      const { userId, birthDate, birthTime, birthPlace, religion, horoscopePreferences } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
      }

      const updatedUser = await storage.updateUserProfile(userId, {
        birthDate,
        birthTime,
        birthPlace,
        religion,
        horoscopePreferences
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ 
        success: true,
        user: updatedUser
      });
    } catch (error: any) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Error updating profile: " + error.message });
    }
  });

  // Get user profile
  app.get("/api/user/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error: any) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Error getting profile: " + error.message });
    }
  });

  // Generate daily horoscope
  app.post("/api/horoscope/daily", async (req, res) => {
    try {
      const { userId, uiLanguage } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
      }

      // Check Soul Gems balance
      const soulGems = await storage.getSoulGems(userId);
      if (soulGems < 1) {
        return res.status(403).json({ 
          message: "Insufficient Soul Gems",
          soulGems: 0
        });
      }

      const user = await storage.getUser(userId);
      
      if (!user?.birthDate || !user?.horoscopePreferences || user.horoscopePreferences.length === 0) {
        return res.status(400).json({ message: "Please set up your birth info and horoscope preferences first" });
      }

      const horoscopeReading = calculateHoroscope(
        {
          birthDate: user.birthDate,
          birthTime: user.birthTime || undefined,
          birthPlace: user.birthPlace || undefined
        },
        user.horoscopePreferences
      );

      const horoscopeContext = formatHoroscopeContext(horoscopeReading);
      const language = uiLanguage || "English";
      const dailyReading = await generateDailyHoroscope(
        horoscopeContext,
        user.religion || undefined,
        language
      );

      const insertData = insertMessageSchema.parse({
        userId,
        input: "Daily Horoscope",
        aiResponse: dailyReading,
        type: "horoscope",
      });

      const savedMessage = await storage.createMessage(insertData);

      // Deduct 1 Soul Gem (atomic operation prevents double-spend)
      const updatedUser = await storage.deductSoulGems(userId, 1);
      if (!updatedUser) {
        return res.status(403).json({ 
          message: "Insufficient Soul Gems",
          soulGems: 0
        });
      }

      const remainingGems = await storage.getSoulGems(userId);

      res.json({ 
        horoscope: dailyReading,
        reading: horoscopeReading,
        messageId: savedMessage.id,
        soulGems: remainingGems
      });
    } catch (error: any) {
      console.error("Daily horoscope error:", error);
      res.status(500).json({ message: "Error generating daily horoscope: " + error.message });
    }
  });

  // Enhanced horoscope reading with period and optional question
  app.post("/api/horoscope/reading", async (req, res) => {
    try {
      const { userId, uiLanguage, period = "daily", question, date } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
      }

      if (!["daily", "monthly", "yearly", "specific"].includes(period)) {
        return res.status(400).json({ message: "Invalid period. Must be one of: daily, monthly, yearly, specific" });
      }

      if (period === "specific" && !date) {
        return res.status(400).json({ message: "Date is required for specific period" });
      }

      // Check Soul Gems balance
      const soulGems = await storage.getSoulGems(userId);
      if (soulGems < 1) {
        return res.status(403).json({ 
          message: "Insufficient Soul Gems",
          soulGems: 0
        });
      }

      const user = await storage.getUser(userId);
      
      if (!user?.birthDate || !user?.horoscopePreferences || user.horoscopePreferences.length === 0) {
        return res.status(400).json({ message: "Please set up your birth info and horoscope preferences first" });
      }

      const horoscopeReading = calculateHoroscope(
        {
          birthDate: user.birthDate,
          birthTime: user.birthTime || undefined,
          birthPlace: user.birthPlace || undefined
        },
        user.horoscopePreferences
      );

      const horoscopeContext = formatHoroscopeContext(horoscopeReading);
      const language = uiLanguage || "English";
      
      const reading = await generateDailyHoroscope(
        horoscopeContext,
        user.religion || undefined,
        language,
        period,
        question,
        date
      );

      const inputText = question 
        ? `${period.charAt(0).toUpperCase() + period.slice(1)} Horoscope - Question: ${question}`
        : `${period.charAt(0).toUpperCase() + period.slice(1)} Horoscope${date ? ` for ${date}` : ''}`;

      const insertData = insertMessageSchema.parse({
        userId,
        input: inputText,
        aiResponse: reading,
        type: "horoscope",
      });

      const savedMessage = await storage.createMessage(insertData);

      // Deduct 1 Soul Gem (atomic operation prevents double-spend)
      const updatedUser = await storage.deductSoulGems(userId, 1);
      if (!updatedUser) {
        return res.status(403).json({ 
          message: "Insufficient Soul Gems",
          soulGems: 0
        });
      }

      const remainingGems = await storage.getSoulGems(userId);

      res.json({
        horoscope: reading,
        messageId: savedMessage.id,
        soulGems: remainingGems
      });
    } catch (error: any) {
      console.error("Horoscope reading error:", error);
      res.status(500).json({ message: "Error generating horoscope: " + error.message });
    }
  });

  // Generate or get referral code for a user
  app.get("/api/referral/generate/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      const referralCode = await storage.generateReferralCode(userId);
      const user = await storage.getUser(userId);

      res.json({
        referralCode,
        referralCount: user?.referralCount || 0
      });
    } catch (error: any) {
      console.error("Referral code generation error:", error);
      res.status(500).json({ message: error.message || "Failed to generate referral code" });
    }
  });

  // Redeem a referral code
  app.post("/api/referral/redeem", async (req, res) => {
    try {
      const { code, userId } = req.body;
      
      if (!code || !userId) {
        return res.status(400).json({ message: "Code and user ID required" });
      }

      // Validate code
      const validation = await storage.validateReferralCode(code);
      
      if (!validation.valid) {
        return res.status(404).json({ message: "Invalid referral code" });
      }

      // Check if user is trying to use their own code
      const user = await storage.getUser(userId);
      if (user?.referralCode === code) {
        return res.status(400).json({ message: "You cannot use your own referral code" });
      }

      // Check if user already used a referral code
      if (user?.referredBy) {
        return res.status(400).json({ message: "Referral code already used" });
      }

      // Apply rewards
      await storage.applyReferralReward(validation.referrerId!, userId);

      // Get updated user data with fresh referralCount
      const referrer = await storage.getUser(validation.referrerId!);
      const referee = await storage.getUser(userId);

      res.json({
        success: true,
        message: "Referral code applied! You received 5 Soul Gems",
        soulGems: referee?.soulGems || 0,
        referralCount: referee?.referralCount || 0,
        referrerGems: referrer?.soulGems || 0
      });
    } catch (error: any) {
      console.error("Referral redemption error:", error);
      res.status(500).json({ message: error.message || "Failed to redeem referral code" });
    }
  });

  // Create Soul Gems purchase payment intent
  app.post("/api/payments/gems", async (req, res) => {
    try {
      const { userId, gemPackage } = req.body;
      
      if (!userId || !gemPackage) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Define gem packages (better volume discounts)
      const packages: Record<string, { amount: number; gems: number }> = {
        small: { amount: 99, gems: 5 },     // $0.99 = 5 gems ($0.20/gem)
        medium: { amount: 299, gems: 20 },   // $2.99 = 20 gems ($0.15/gem) - 25% more gems
        large: { amount: 499, gems: 50 },    // $4.99 = 50 gems ($0.10/gem) - 50% more gems
      };

      const selectedPackage = packages[gemPackage];
      if (!selectedPackage) {
        return res.status(400).json({ message: "Invalid gem package" });
      }

      if (!stripe) {
        return res.status(500).json({ message: "Payment system not configured" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: selectedPackage.amount,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: { 
          userId, 
          type: "gems",
          gemAmount: selectedPackage.gems.toString()
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Payment intent error:", error);
      res.status(500).json({ message: "Error creating payment: " + error.message });
    }
  });

  // Create subscription checkout ($9.99/month)
  app.post("/api/payments/subscription", async (req, res) => {
    try {
      const { userId, email } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!stripe) {
        return res.status(500).json({ message: "Payment system not configured" });
      }

      let customerId = user.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: email || undefined,
          metadata: { userId },
        });
        customerId = customer.id;
        await storage.updateUserStripeInfo(userId, customerId, "");
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Soullec Premium',
                description: 'Unlimited Soul Gems - All features unlimited access',
              },
              unit_amount: 999, // $9.99 in cents
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin}?subscription=success`,
        cancel_url: `${req.headers.origin}?subscription=cancelled`,
        metadata: { userId },
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      console.error("Subscription error:", error);
      res.status(500).json({ message: "Error creating subscription: " + error.message });
    }
  });

  // Stripe webhook handler
  app.post("/api/webhooks/stripe", async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    
    if (!stripe) {
      return res.status(500).json({ message: "Payment system not configured" });
    }

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId && session.subscription) {
          await storage.updateUserStripeInfo(
            userId,
            session.customer as string,
            session.subscription as string
          );
          await storage.updateUserSubscription(userId, "premium");

          const insertData = insertPaymentSchema.parse({
            userId,
            amount: 999,
            type: "subscription",
            stripePaymentId: session.payment_intent as string,
          });
          await storage.createPayment(insertData);
        }
      }

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata?.userId;
        const type = paymentIntent.metadata?.type;

        if (userId && type === 'gems') {
          const gemAmount = parseInt(paymentIntent.metadata?.gemAmount || '0', 10);
          
          // Add Soul Gems to user account
          if (gemAmount > 0) {
            await storage.addSoulGems(userId, gemAmount);
          }

          const insertData = insertPaymentSchema.parse({
            userId,
            amount: paymentIntent.amount,
            type: "gems",
            stripePaymentId: paymentIntent.id,
          });
          await storage.createPayment(insertData);
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(400).json({ message: "Webhook error: " + error.message });
    }
  });

  // Get user messages
  app.get("/api/messages/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const messages = await storage.getUserMessages(userId);
      res.json({ messages });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching messages: " + error.message });
    }
  });

  // Get user subscription status
  app.get("/api/user/:userId/status", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ 
        subscriptionStatus: user.subscriptionStatus,
        isPremium: user.subscriptionStatus === "premium"
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching status: " + error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
