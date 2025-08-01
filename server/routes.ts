import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertAdminUserSchema, 
  insertLocationSchema, 
  insertYachtSchema, 
  insertYachtImageSchema, 
  insertArticleSchema, 
  insertContactInfoSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await storage.getAdminUser(email, password);
      
      if (admin) {
        res.json({
          success: true,
          user: {
            id: admin.id,
            email: admin.email,
            loginTime: Date.now()
          }
        });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  // Admin Users Routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllAdminUsers();
      res.json(users);
    } catch (error) {
      console.error("Get admin users error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/users", async (req, res) => {
    try {
      const userData = insertAdminUserSchema.parse(req.body);
      const user = await storage.createAdminUser(userData);
      res.json(user);
    } catch (error) {
      console.error("Create admin user error:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.put("/api/admin/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const userData = insertAdminUserSchema.partial().parse(req.body);
      const user = await storage.updateAdminUser(id, userData);
      res.json(user);
    } catch (error) {
      console.error("Update admin user error:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteAdminUser(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete admin user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Locations Routes
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getAllLocations();
      res.json(locations);
    } catch (error) {
      console.error("Get locations error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/locations/homepage", async (req, res) => {
    try {
      const locations = await storage.getHomepageLocations();
      res.json(locations);
    } catch (error) {
      console.error("Get homepage locations error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/locations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const location = await storage.getLocationById(id);
      if (location) {
        res.json(location);
      } else {
        res.status(404).json({ message: "Location not found" });
      }
    } catch (error) {
      console.error("Get location error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/locations", async (req, res) => {
    try {
      const locationData = insertLocationSchema.parse(req.body);
      const location = await storage.createLocation(locationData);
      res.json(location);
    } catch (error) {
      console.error("Create location error:", error);
      res.status(400).json({ message: "Invalid location data" });
    }
  });

  app.put("/api/locations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const locationData = insertLocationSchema.partial().parse(req.body);
      const location = await storage.updateLocation(id, locationData);
      res.json(location);
    } catch (error) {
      console.error("Update location error:", error);
      res.status(400).json({ message: "Invalid location data" });
    }
  });

  app.delete("/api/locations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteLocation(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete location error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Yachts Routes
  app.get("/api/yachts", async (req, res) => {
    try {
      const yachts = await storage.getAllYachts();
      // Get images for each yacht
      const yachtsWithImages = await Promise.all(
        yachts.map(async (yacht) => {
          const images = await storage.getYachtImages(yacht.id);
          return { ...yacht, yacht_images: images };
        })
      );
      res.json(yachtsWithImages);
    } catch (error) {
      console.error("Get yachts error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/yachts/homepage", async (req, res) => {
    try {
      const yachts = await storage.getHomepageYachts();
      // Get images for each yacht
      const yachtsWithImages = await Promise.all(
        yachts.map(async (yacht) => {
          const images = await storage.getYachtImages(yacht.id);
          return { ...yacht, yacht_images: images };
        })
      );
      res.json(yachtsWithImages);
    } catch (error) {
      console.error("Get homepage yachts error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/yachts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const yacht = await storage.getYachtById(id);
      if (yacht) {
        const images = await storage.getYachtImages(yacht.id);
        res.json({ ...yacht, yacht_images: images });
      } else {
        res.status(404).json({ message: "Yacht not found" });
      }
    } catch (error) {
      console.error("Get yacht error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/yachts/location/:locationId", async (req, res) => {
    try {
      const { locationId } = req.params;
      const yachts = await storage.getYachtsByLocation(locationId);
      // Get images for each yacht
      const yachtsWithImages = await Promise.all(
        yachts.map(async (yacht) => {
          const images = await storage.getYachtImages(yacht.id);
          return { ...yacht, yacht_images: images };
        })
      );
      res.json(yachtsWithImages);
    } catch (error) {
      console.error("Get yachts by location error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/yachts", async (req, res) => {
    try {
      const yachtData = insertYachtSchema.parse(req.body);
      const yacht = await storage.createYacht(yachtData);
      res.json(yacht);
    } catch (error) {
      console.error("Create yacht error:", error);
      res.status(400).json({ message: "Invalid yacht data" });
    }
  });

  app.put("/api/yachts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const yachtData = insertYachtSchema.partial().parse(req.body);
      const yacht = await storage.updateYacht(id, yachtData);
      res.json(yacht);
    } catch (error) {
      console.error("Update yacht error:", error);
      res.status(400).json({ message: "Invalid yacht data" });
    }
  });

  app.delete("/api/yachts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteYacht(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete yacht error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Yacht Images Routes
  app.get("/api/yacht-images/:yachtId", async (req, res) => {
    try {
      const { yachtId } = req.params;
      const images = await storage.getYachtImages(yachtId);
      res.json(images);
    } catch (error) {
      console.error("Get yacht images error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/yacht-images", async (req, res) => {
    try {
      const imageData = insertYachtImageSchema.parse(req.body);
      const image = await storage.createYachtImage(imageData);
      res.json(image);
    } catch (error) {
      console.error("Create yacht image error:", error);
      res.status(400).json({ message: "Invalid image data" });
    }
  });

  app.put("/api/yacht-images/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const imageData = insertYachtImageSchema.partial().parse(req.body);
      const image = await storage.updateYachtImage(id, imageData);
      res.json(image);
    } catch (error) {
      console.error("Update yacht image error:", error);
      res.status(400).json({ message: "Invalid image data" });
    }
  });

  app.delete("/api/yacht-images/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteYachtImage(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete yacht image error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Articles Routes
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getAllArticles();
      res.json(articles);
    } catch (error) {
      console.error("Get articles error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/articles/homepage", async (req, res) => {
    try {
      const articles = await storage.getHomepageArticles();
      res.json(articles);
    } catch (error) {
      console.error("Get homepage articles error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.getArticleById(id);
      if (article) {
        res.json(article);
      } else {
        res.status(404).json({ message: "Article not found" });
      }
    } catch (error) {
      console.error("Get article error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      res.json(article);
    } catch (error) {
      console.error("Create article error:", error);
      res.status(400).json({ message: "Invalid article data" });
    }
  });

  app.put("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const articleData = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(id, articleData);
      res.json(article);
    } catch (error) {
      console.error("Update article error:", error);
      res.status(400).json({ message: "Invalid article data" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteArticle(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete article error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Contact Info Routes
  app.get("/api/contact-info", async (req, res) => {
    try {
      const contactInfo = await storage.getContactInfo();
      res.json(contactInfo);
    } catch (error) {
      console.error("Get contact info error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/contact-info", async (req, res) => {
    try {
      const contactData = insertContactInfoSchema.parse(req.body);
      const contactInfo = await storage.updateContactInfo(contactData);
      res.json(contactInfo);
    } catch (error) {
      console.error("Update contact info error:", error);
      res.status(400).json({ message: "Invalid contact data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
