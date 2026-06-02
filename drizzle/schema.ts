import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  json,
  index,
} from "drizzle-orm/mysql-core";

// ─── USERS ───────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "creator", "moderator"]).default("user").notNull(),
  username: varchar("username", { length: 64 }),
  bio: text("bio"),
  avatarUrl: text("avatarUrl"),
  bannerUrl: text("bannerUrl"),
  walletAddress: varchar("walletAddress", { length: 128 }),
  solanaAddress: varchar("solanaAddress", { length: 64 }),
  skyBalance: decimal("skyBalance", { precision: 20, scale: 8 }).default("0"),
  reputationScore: int("reputationScore").default(0),
  level: int("level").default(1),
  xp: int("xp").default(0),
  isVerified: boolean("isVerified").default(false),
  isOnline: boolean("isOnline").default(false),
  referralCode: varchar("referralCode", { length: 16 }),
  referredBy: int("referredBy"),
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "pro", "elite", "founder"]).default("free"),
  subscriptionExpiresAt: timestamp("subscriptionExpiresAt"),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// ─── SOCIAL POSTS ─────────────────────────────────────────────────────────────
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  content: text("content").notNull(),
  mediaUrls: json("mediaUrls").$type<string[]>(),
  tags: json("tags").$type<string[]>(),
  likes: int("likes").default(0),
  reposts: int("reposts").default(0),
  comments: int("comments").default(0),
  views: int("views").default(0),
  aiScore: decimal("aiScore", { precision: 5, scale: 2 }).default("0"),
  isNFT: boolean("isNFT").default(false),
  nftTokenId: varchar("nftTokenId", { length: 128 }),
  isPinned: boolean("isPinned").default(false),
  isHidden: boolean("isHidden").default(false),
  parentId: int("parentId"),
  repostId: int("repostId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => [index("posts_authorId_idx").on(t.authorId)]);

// ─── POST LIKES ───────────────────────────────────────────────────────────────
export const postLikes = mysqlTable("postLikes", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── FOLLOWS ──────────────────────────────────────────────────────────────────
export const follows = mysqlTable("follows", {
  id: int("id").autoincrement().primaryKey(),
  followerId: int("followerId").notNull(),
  followingId: int("followingId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }),
  isGroup: boolean("isGroup").default(false),
  isEncrypted: boolean("isEncrypted").default(true),
  avatarUrl: text("avatarUrl"),
  lastMessageAt: timestamp("lastMessageAt").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const conversationMembers = mysqlTable("conversationMembers", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["admin", "member"]).default("member"),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  senderId: int("senderId").notNull(),
  content: text("content").notNull(),
  mediaUrl: text("mediaUrl"),
  mediaType: varchar("mediaType", { length: 32 }),
  isRead: boolean("isRead").default(false),
  isDeleted: boolean("isDeleted").default(false),
  replyToId: int("replyToId"),
  reactions: json("reactions").$type<Record<string, number>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("messages_convId_idx").on(t.conversationId)]);

// ─── WALLET / TRANSACTIONS ────────────────────────────────────────────────────
export const wallets = mysqlTable("wallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  skyBalance: decimal("skyBalance", { precision: 20, scale: 8 }).default("0"),
  ethBalance: decimal("ethBalance", { precision: 20, scale: 8 }).default("0"),
  solBalance: decimal("solBalance", { precision: 20, scale: 8 }).default("0"),
  usdcBalance: decimal("usdcBalance", { precision: 20, scale: 8 }).default("0"),
  btcBalance: decimal("btcBalance", { precision: 20, scale: 8 }).default("0"),
  stakedSky: decimal("stakedSky", { precision: 20, scale: 8 }).default("0"),
  stakingRewards: decimal("stakingRewards", { precision: 20, scale: 8 }).default("0"),
  totalValueUsd: decimal("totalValueUsd", { precision: 20, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["send", "receive", "buy", "sell", "stake", "unstake", "reward", "fee", "swap"]).notNull(),
  asset: varchar("asset", { length: 16 }).notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  amountUsd: decimal("amountUsd", { precision: 20, scale: 2 }),
  toAddress: varchar("toAddress", { length: 128 }),
  fromAddress: varchar("fromAddress", { length: 128 }),
  txHash: varchar("txHash", { length: 128 }),
  status: mysqlEnum("status", ["pending", "confirmed", "failed"]).default("pending"),
  network: varchar("network", { length: 32 }),
  fee: decimal("fee", { precision: 20, scale: 8 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("tx_userId_idx").on(t.userId)]);

// ─── EXCHANGE / TRADES ────────────────────────────────────────────────────────
export const trades = mysqlTable("trades", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  pair: varchar("pair", { length: 32 }).notNull(),
  side: mysqlEnum("side", ["buy", "sell"]).notNull(),
  orderType: mysqlEnum("orderType", ["market", "limit", "stop"]).default("market"),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  total: decimal("total", { precision: 20, scale: 8 }).notNull(),
  fee: decimal("fee", { precision: 20, scale: 8 }),
  status: mysqlEnum("status", ["open", "filled", "cancelled", "partial"]).default("open"),
  filledAt: timestamp("filledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("trades_userId_idx").on(t.userId)]);

// ─── GOVERNANCE ───────────────────────────────────────────────────────────────
export const proposals = mysqlTable("proposals", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", ["protocol", "treasury", "feature", "partnership", "emergency"]).default("feature"),
  status: mysqlEnum("status", ["draft", "active", "passed", "rejected", "executed"]).default("active"),
  votesFor: int("votesFor").default(0),
  votesAgainst: int("votesAgainst").default(0),
  votesAbstain: int("votesAbstain").default(0),
  quorum: int("quorum").default(1000),
  requiredApproval: decimal("requiredApproval", { precision: 5, scale: 2 }).default("51.00"),
  endsAt: timestamp("endsAt").notNull(),
  executedAt: timestamp("executedAt"),
  onChainId: varchar("onChainId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const votes = mysqlTable("votes", {
  id: int("id").autoincrement().primaryKey(),
  proposalId: int("proposalId").notNull(),
  userId: int("userId").notNull(),
  choice: mysqlEnum("choice", ["for", "against", "abstain"]).notNull(),
  votingPower: decimal("votingPower", { precision: 20, scale: 8 }).notNull(),
  txHash: varchar("txHash", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── NFT GALLERY ──────────────────────────────────────────────────────────────
export const nfts = mysqlTable("nfts", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  creatorId: int("creatorId").notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  animationUrl: text("animationUrl"),
  collection: varchar("collection", { length: 128 }),
  tokenId: varchar("tokenId", { length: 128 }),
  contractAddress: varchar("contractAddress", { length: 128 }),
  network: varchar("network", { length: 32 }).default("ethereum"),
  rarity: mysqlEnum("rarity", ["common", "uncommon", "rare", "epic", "legendary"]).default("common"),
  attributes: json("attributes").$type<Record<string, string | number>>(),
  price: decimal("price", { precision: 20, scale: 8 }),
  currency: varchar("currency", { length: 16 }).default("ETH"),
  isListed: boolean("isListed").default(false),
  isMinted: boolean("isMinted").default(false),
  views: int("views").default(0),
  likes: int("likes").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("nfts_ownerId_idx").on(t.ownerId)]);

// ─── MARKETPLACE ──────────────────────────────────────────────────────────────
export const listings = mysqlTable("listings", {
  id: int("id").autoincrement().primaryKey(),
  sellerId: int("sellerId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["digital", "physical", "service", "nft", "subscription"]).default("digital"),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 16 }).default("SKY"),
  imageUrls: json("imageUrls").$type<string[]>(),
  tags: json("tags").$type<string[]>(),
  stock: int("stock").default(1),
  sold: int("sold").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: int("reviewCount").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  buyerId: int("buyerId").notNull(),
  listingId: int("listingId").notNull(),
  quantity: int("quantity").default(1),
  totalPrice: decimal("totalPrice", { precision: 20, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 16 }).default("SKY"),
  status: mysqlEnum("status", ["pending", "paid", "shipped", "delivered", "disputed", "refunded"]).default("pending"),
  txHash: varchar("txHash", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── AI AGENTS ────────────────────────────────────────────────────────────────
export const aiAgents = mysqlTable("aiAgents", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  persona: varchar("persona", { length: 64 }).notNull(),
  systemPrompt: text("systemPrompt"),
  model: varchar("model", { length: 64 }).default("gpt-4o-mini"),
  isActive: boolean("isActive").default(true),
  isPublic: boolean("isPublic").default(false),
  totalEarnings: decimal("totalEarnings", { precision: 20, scale: 8 }).default("0"),
  totalTasks: int("totalTasks").default(0),
  successRate: decimal("successRate", { precision: 5, scale: 2 }).default("100.00"),
  capabilities: json("capabilities").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const aiConversations = mysqlTable("aiConversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  agentId: int("agentId"),
  title: varchar("title", { length: 256 }),
  persona: varchar("persona", { length: 64 }).default("oracle"),
  messages: json("messages").$type<Array<{ role: string; content: string; timestamp: number }>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["like", "comment", "follow", "mention", "trade", "governance", "reward", "system", "message"]).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  body: text("body"),
  data: json("data"),
  isRead: boolean("isRead").default(false),
  actorId: int("actorId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("notif_userId_idx").on(t.userId)]);

// ─── STAKING ──────────────────────────────────────────────────────────────────
export const stakingPositions = mysqlTable("stakingPositions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  lockPeriodDays: int("lockPeriodDays").default(30),
  apy: decimal("apy", { precision: 5, scale: 2 }).notNull(),
  rewards: decimal("rewards", { precision: 20, scale: 8 }).default("0"),
  status: mysqlEnum("status", ["active", "unlocking", "completed"]).default("active"),
  stakedAt: timestamp("stakedAt").defaultNow().notNull(),
  unlocksAt: timestamp("unlocksAt").notNull(),
  claimedAt: timestamp("claimedAt"),
});

// ─── REFERRALS ────────────────────────────────────────────────────────────────
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrerId").notNull(),
  referredId: int("referredId").notNull(),
  reward: decimal("reward", { precision: 20, scale: 8 }).default("0"),
  status: mysqlEnum("status", ["pending", "active", "rewarded"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── EVENTS ───────────────────────────────────────────────────────────────────
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  organizerId: int("organizerId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  category: varchar("category", { length: 64 }),
  startAt: timestamp("startAt").notNull(),
  endAt: timestamp("endAt"),
  location: varchar("location", { length: 256 }),
  isVirtual: boolean("isVirtual").default(false),
  streamUrl: text("streamUrl"),
  maxAttendees: int("maxAttendees"),
  attendeeCount: int("attendeeCount").default(0),
  ticketPrice: decimal("ticketPrice", { precision: 20, scale: 8 }).default("0"),
  currency: varchar("currency", { length: 16 }).default("SKY"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── CREATOR CONTENT ──────────────────────────────────────────────────────────
export const creatorContent = mysqlTable("creatorContent", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["video", "audio", "article", "image", "course"]).default("article"),
  contentUrl: text("contentUrl"),
  thumbnailUrl: text("thumbnailUrl"),
  isPremium: boolean("isPremium").default(false),
  price: decimal("price", { precision: 20, scale: 8 }).default("0"),
  views: int("views").default(0),
  likes: int("likes").default(0),
  earnings: decimal("earnings", { precision: 20, scale: 8 }).default("0"),
  isPublished: boolean("isPublished").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────
export const leaderboardEntries = mysqlTable("leaderboardEntries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  category: mysqlEnum("category", ["trading", "social", "governance", "creator", "referral", "overall"]).notNull(),
  score: decimal("score", { precision: 20, scale: 8 }).default("0"),
  rank: int("rank"),
  period: varchar("period", { length: 16 }).default("weekly"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── SUBSCRIPTIONS ────────────────────────────────────────────────────────────
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  subscriberId: int("subscriberId").notNull(),
  creatorId: int("creatorId").notNull(),
  tier: mysqlEnum("tier", ["basic", "supporter", "vip"]).default("basic"),
  price: decimal("price", { precision: 20, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 16 }).default("SKY"),
  status: mysqlEnum("status", ["active", "cancelled", "expired"]).default("active"),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── DIGITAL TWIN ─────────────────────────────────────────────────────────────
export const digitalTwins = mysqlTable("digitalTwins", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  name: varchar("name", { length: 128 }),
  personality: json("personality").$type<Record<string, number>>(),
  tradingStyle: varchar("tradingStyle", { length: 64 }),
  riskTolerance: mysqlEnum("riskTolerance", ["conservative", "moderate", "aggressive"]).default("moderate"),
  automatedTrading: boolean("automatedTrading").default(false),
  automatedPosting: boolean("automatedPosting").default(false),
  totalEarnings: decimal("totalEarnings", { precision: 20, scale: 8 }).default("0"),
  isActive: boolean("isActive").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── FEATURE FLAGS ────────────────────────────────────────────────────────────
export const featureFlags = mysqlTable("featureFlags", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  isEnabled: boolean("isEnabled").default(false),
  rolloutPercentage: int("rolloutPercentage").default(0),
  conditions: json("conditions"),
  updatedBy: int("updatedBy"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── SECURITY LOGS ────────────────────────────────────────────────────────────
export const securityLogs = mysqlTable("securityLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  event: varchar("event", { length: 128 }).notNull(),
  severity: mysqlEnum("severity", ["info", "warning", "critical"]).default("info"),
  ipAddress: varchar("ipAddress", { length: 64 }),
  userAgent: text("userAgent"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [index("sec_userId_idx").on(t.userId)]);

// ─── EXPORTS ──────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Wallet = typeof wallets.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Trade = typeof trades.$inferSelect;
export type Proposal = typeof proposals.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type NFT = typeof nfts.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type AIAgent = typeof aiAgents.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
