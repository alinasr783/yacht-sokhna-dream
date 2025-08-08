import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import { eq, desc, and } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  AdminUser,
  InsertAdminUser,
  Location,
  InsertLocation,
  Yacht,
  InsertYacht,
  YachtImage,
  InsertYachtImage,
  Article,
  InsertArticle,
  ContactInfo,
  InsertContactInfo,
  User,
  InsertUser,
} from "@shared/schema";

export interface IStorage {
  // Legacy user methods for compatibility
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Admin User methods
  getAdminUser(email: string, password: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: string, user: Partial<InsertAdminUser>): Promise<AdminUser>;
  deleteAdminUser(id: string): Promise<void>;
  getAllAdminUsers(): Promise<AdminUser[]>;

  // Location methods
  getAllLocations(): Promise<Location[]>;
  getLocationById(id: string): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: string, location: Partial<InsertLocation>): Promise<Location>;
  deleteLocation(id: string): Promise<void>;
  getHomepageLocations(): Promise<Location[]>;

  // Yacht methods
  getAllYachts(): Promise<Yacht[]>;
  getYachtById(id: string): Promise<Yacht | undefined>;
  getYachtsByLocation(locationId: string): Promise<Yacht[]>;
  createYacht(yacht: InsertYacht): Promise<Yacht>;
  updateYacht(id: string, yacht: Partial<InsertYacht>): Promise<Yacht>;
  deleteYacht(id: string): Promise<void>;
  getHomepageYachts(): Promise<Yacht[]>;

  // Yacht Image methods
  getYachtImages(yachtId: string): Promise<YachtImage[]>;
  createYachtImage(image: InsertYachtImage): Promise<YachtImage>;
  updateYachtImage(id: string, image: Partial<InsertYachtImage>): Promise<YachtImage>;
  deleteYachtImage(id: string): Promise<void>;

  // Article methods
  getAllArticles(): Promise<Article[]>;
  getArticleById(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: string): Promise<void>;
  getHomepageArticles(): Promise<Article[]>;

  // Contact Info methods
  getContactInfo(): Promise<ContactInfo | undefined>;
  updateContactInfo(contactInfo: Partial<InsertContactInfo>): Promise<ContactInfo>;
}

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    neonConfig.webSocketConstructor = ws;
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle({ client: pool, schema });
  }

  // Legacy user methods for compatibility
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(schema.users).where(eq(schema.users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(schema.users).where(eq(schema.users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(schema.users).values(insertUser).returning();
    return result[0];
  }

  // Admin User methods
  async getAdminUser(email: string, password: string): Promise<AdminUser | undefined> {
    const result = await this.db
      .select()
      .from(schema.adminUsers)
      .where(and(eq(schema.adminUsers.email, email), eq(schema.adminUsers.password, password)));
    return result[0];
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const result = await this.db.insert(schema.adminUsers).values(user).returning();
    return result[0];
  }

  async updateAdminUser(id: string, user: Partial<InsertAdminUser>): Promise<AdminUser> {
    const result = await this.db
      .update(schema.adminUsers)
      .set(user)
      .where(eq(schema.adminUsers.id, id))
      .returning();
    return result[0];
  }

  async deleteAdminUser(id: string): Promise<void> {
    await this.db.delete(schema.adminUsers).where(eq(schema.adminUsers.id, id));
  }

  async getAllAdminUsers(): Promise<AdminUser[]> {
    return this.db.select().from(schema.adminUsers).orderBy(desc(schema.adminUsers.createdAt));
  }

  // Location methods
  async getAllLocations(): Promise<Location[]> {
    return this.db.select().from(schema.locations).orderBy(desc(schema.locations.createdAt));
  }

  async getLocationById(id: string): Promise<Location | undefined> {
    const result = await this.db.select().from(schema.locations).where(eq(schema.locations.id, id));
    return result[0];
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const result = await this.db.insert(schema.locations).values(location).returning();
    return result[0];
  }

  async updateLocation(id: string, location: Partial<InsertLocation>): Promise<Location> {
    const result = await this.db
      .update(schema.locations)
      .set(location)
      .where(eq(schema.locations.id, id))
      .returning();
    return result[0];
  }

  async deleteLocation(id: string): Promise<void> {
    await this.db.delete(schema.locations).where(eq(schema.locations.id, id));
  }

  async getHomepageLocations(): Promise<Location[]> {
    return this.db
      .select()
      .from(schema.locations)
      .where(eq(schema.locations.showOnHomepage, true))
      .orderBy(desc(schema.locations.createdAt))
      .limit(6);
  }

  // Yacht methods
  async getAllYachts(): Promise<Yacht[]> {
    return this.db.select().from(schema.yachts).orderBy(desc(schema.yachts.createdAt));
  }

  async getYachtById(id: string): Promise<Yacht | undefined> {
    const result = await this.db.select().from(schema.yachts).where(eq(schema.yachts.id, id));
    return result[0];
  }

  async getYachtsByLocation(locationId: string): Promise<Yacht[]> {
    return this.db.select().from(schema.yachts).where(eq(schema.yachts.locationId, locationId));
  }

  async createYacht(yacht: InsertYacht): Promise<Yacht> {
    const result = await this.db.insert(schema.yachts).values(yacht).returning();
    return result[0];
  }

  async updateYacht(id: string, yacht: Partial<InsertYacht>): Promise<Yacht> {
    const result = await this.db
      .update(schema.yachts)
      .set(yacht)
      .where(eq(schema.yachts.id, id))
      .returning();
    return result[0];
  }

  async deleteYacht(id: string): Promise<void> {
    await this.db.delete(schema.yachts).where(eq(schema.yachts.id, id));
  }

  async getHomepageYachts(): Promise<Yacht[]> {
    return this.db
      .select()
      .from(schema.yachts)
      .where(eq(schema.yachts.showOnHomepage, true))
      .orderBy(desc(schema.yachts.createdAt))
      .limit(6);
  }

  // Yacht Image methods
  async getYachtImages(yachtId: string): Promise<YachtImage[]> {
    return this.db.select().from(schema.yachtImages).where(eq(schema.yachtImages.yachtId, yachtId));
  }

  async createYachtImage(image: InsertYachtImage): Promise<YachtImage> {
    const result = await this.db.insert(schema.yachtImages).values(image).returning();
    return result[0];
  }

  async updateYachtImage(id: string, image: Partial<InsertYachtImage>): Promise<YachtImage> {
    const result = await this.db
      .update(schema.yachtImages)
      .set(image)
      .where(eq(schema.yachtImages.id, id))
      .returning();
    return result[0];
  }

  async deleteYachtImage(id: string): Promise<void> {
    await this.db.delete(schema.yachtImages).where(eq(schema.yachtImages.id, id));
  }

  // Article methods
  async getAllArticles(): Promise<Article[]> {
    return this.db.select().from(schema.articles).orderBy(desc(schema.articles.createdAt));
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    const result = await this.db.select().from(schema.articles).where(eq(schema.articles.id, id));
    return result[0];
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const result = await this.db.insert(schema.articles).values(article).returning();
    return result[0];
  }

  async updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article> {
    const result = await this.db
      .update(schema.articles)
      .set(article)
      .where(eq(schema.articles.id, id))
      .returning();
    return result[0];
  }

  async deleteArticle(id: string): Promise<void> {
    await this.db.delete(schema.articles).where(eq(schema.articles.id, id));
  }

  async getHomepageArticles(): Promise<Article[]> {
    return this.db
      .select()
      .from(schema.articles)
      .where(eq(schema.articles.showOnHomepage, true))
      .orderBy(desc(schema.articles.createdAt))
      .limit(3);
  }

  // Contact Info methods
  async getContactInfo(): Promise<ContactInfo | undefined> {
    const result = await this.db.select().from(schema.contactInfo).limit(1);
    return result[0];
  }

  async updateContactInfo(contactInfo: Partial<InsertContactInfo>): Promise<ContactInfo> {
    // First try to update, if no rows affected, then insert
    const existing = await this.getContactInfo();
    if (existing) {
      const result = await this.db
        .update(schema.contactInfo)
        .set(contactInfo)
        .where(eq(schema.contactInfo.id, existing.id))
        .returning();
      return result[0];
    } else {
      const result = await this.db.insert(schema.contactInfo).values(contactInfo as InsertContactInfo).returning();
      return result[0];
    }
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private adminUsers: Map<string, AdminUser>;
  private locations: Map<string, Location>;
  private yachts: Map<string, Yacht>;
  private yachtImages: Map<string, YachtImage>;
  private articles: Map<string, Article>;
  private contactInfo: ContactInfo | null;
  private currentUserId: number;

  constructor() {
    this.users = new Map();
    this.adminUsers = new Map();
    this.locations = new Map();
    this.yachts = new Map();
    this.yachtImages = new Map();
    this.articles = new Map();
    this.contactInfo = null;
    this.currentUserId = 1;
  }

  // Legacy user methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Admin User methods
  async getAdminUser(email: string, password: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(
      (user) => user.email === email && user.password === password
    );
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const id = `admin-${Date.now()}`;
    const adminUser: AdminUser = {
      ...user,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.adminUsers.set(id, adminUser);
    return adminUser;
  }

  async updateAdminUser(id: string, user: Partial<InsertAdminUser>): Promise<AdminUser> {
    const existing = this.adminUsers.get(id);
    if (!existing) throw new Error("Admin user not found");
    const updated = { ...existing, ...user, updatedAt: new Date() };
    this.adminUsers.set(id, updated);
    return updated;
  }

  async deleteAdminUser(id: string): Promise<void> {
    this.adminUsers.delete(id);
  }

  async getAllAdminUsers(): Promise<AdminUser[]> {
    return Array.from(this.adminUsers.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Location methods
  async getAllLocations(): Promise<Location[]> {
    return Array.from(this.locations.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getLocationById(id: string): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const id = `location-${Date.now()}`;
    const newLocation: Location = {
      ...location,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      descriptionEn: location.descriptionEn ?? null,
      descriptionAr: location.descriptionAr ?? null,
      googleMapsLink: location.googleMapsLink ?? null,
      showOnHomepage: location.showOnHomepage ?? null,
    };
    this.locations.set(id, newLocation);
    return newLocation;
  }

  async updateLocation(id: string, location: Partial<InsertLocation>): Promise<Location> {
    const existing = this.locations.get(id);
    if (!existing) throw new Error("Location not found");
    const updated = { ...existing, ...location, updatedAt: new Date() };
    this.locations.set(id, updated);
    return updated;
  }

  async deleteLocation(id: string): Promise<void> {
    this.locations.delete(id);
  }

  async getHomepageLocations(): Promise<Location[]> {
    return Array.from(this.locations.values())
      .filter((location) => location.showOnHomepage)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 6);
  }

  // Yacht methods
  async getAllYachts(): Promise<Yacht[]> {
    return Array.from(this.yachts.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getYachtById(id: string): Promise<Yacht | undefined> {
    return this.yachts.get(id);
  }

  async getYachtsByLocation(locationId: string): Promise<Yacht[]> {
    return Array.from(this.yachts.values()).filter((yacht) => yacht.locationId === locationId);
  }

  async createYacht(yacht: InsertYacht): Promise<Yacht> {
    const id = `yacht-${Date.now()}`;
    const newYacht: Yacht = {
      ...yacht,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      descriptionEn: yacht.descriptionEn ?? null,
      descriptionAr: yacht.descriptionAr ?? null,
      featuresEn: yacht.featuresEn ?? null,
      featuresAr: yacht.featuresAr ?? null,
      price: yacht.price ?? null,
      priceFrom: yacht.priceFrom ?? null,
      priceTo: yacht.priceTo ?? null,
      currency: yacht.currency ?? null,
      locationId: yacht.locationId ?? null,
      showOnHomepage: yacht.showOnHomepage ?? null,
    };
    this.yachts.set(id, newYacht);
    return newYacht;
  }

  async updateYacht(id: string, yacht: Partial<InsertYacht>): Promise<Yacht> {
    const existing = this.yachts.get(id);
    if (!existing) throw new Error("Yacht not found");
    const updated = { ...existing, ...yacht, updatedAt: new Date() };
    this.yachts.set(id, updated);
    return updated;
  }

  async deleteYacht(id: string): Promise<void> {
    this.yachts.delete(id);
  }

  async getHomepageYachts(): Promise<Yacht[]> {
    return Array.from(this.yachts.values())
      .filter((yacht) => yacht.showOnHomepage)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 6);
  }

  // Yacht Image methods
  async getYachtImages(yachtId: string): Promise<YachtImage[]> {
    return Array.from(this.yachtImages.values()).filter((image) => image.yachtId === yachtId);
  }

  async createYachtImage(image: InsertYachtImage): Promise<YachtImage> {
    const id = `image-${Date.now()}`;
    const newImage: YachtImage = {
      ...image,
      id,
      createdAt: new Date(),
      isPrimary: image.isPrimary ?? null,
    };
    this.yachtImages.set(id, newImage);
    return newImage;
  }

  async updateYachtImage(id: string, image: Partial<InsertYachtImage>): Promise<YachtImage> {
    const existing = this.yachtImages.get(id);
    if (!existing) throw new Error("Yacht image not found");
    const updated = { ...existing, ...image };
    this.yachtImages.set(id, updated);
    return updated;
  }

  async deleteYachtImage(id: string): Promise<void> {
    this.yachtImages.delete(id);
  }

  // Article methods
  async getAllArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const id = `article-${Date.now()}`;
    const newArticle: Article = {
      ...article,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      imageUrl: article.imageUrl ?? null,
      showOnHomepage: article.showOnHomepage ?? null,
    };
    this.articles.set(id, newArticle);
    return newArticle;
  }

  async updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article> {
    const existing = this.articles.get(id);
    if (!existing) throw new Error("Article not found");
    const updated = { ...existing, ...article, updatedAt: new Date() };
    this.articles.set(id, updated);
    return updated;
  }

  async deleteArticle(id: string): Promise<void> {
    this.articles.delete(id);
  }

  async getHomepageArticles(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter((article) => article.showOnHomepage)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 3);
  }

  // Contact Info methods
  async getContactInfo(): Promise<ContactInfo | undefined> {
    return this.contactInfo || undefined;
  }

  async updateContactInfo(contactInfo: Partial<InsertContactInfo>): Promise<ContactInfo> {
    if (this.contactInfo) {
      this.contactInfo = { ...this.contactInfo, ...contactInfo, updatedAt: new Date() };
    } else {
      this.contactInfo = {
        id: `contact-${Date.now()}`,
        email: contactInfo.email || "",
        phone: contactInfo.phone || null,
        whatsapp: contactInfo.whatsapp || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return this.contactInfo;
  }
}

// Use DatabaseStorage now that we have DATABASE_URL
export const storage = new DatabaseStorage();
