import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { socialRouter } from "./routers/social";
import { walletRouter } from "./routers/wallet";
import { exchangeRouter } from "./routers/exchange";
import { aiRouter } from "./routers/ai";
import { governanceRouter } from "./routers/governance";
import { marketplaceRouter } from "./routers/marketplace";
import { messagingRouter } from "./routers/messaging";
import { notificationsRouter } from "./routers/notifications";
import { adminRouter } from "./routers/admin";
import { analyticsRouter } from "./routers/analytics";
import { profileRouter } from "./routers/profile";
import { eventBusRouter } from "./routers/eventBus";
import { knowledgeRouter } from "./routers/knowledge";
import { workflowRouter } from "./routers/workflow";
import { searchRouter } from "./routers/search";
import { securityRouter } from "./routers/security";
import { developerRouter } from "./routers/developer";
import { digitalTwinRouter } from "./routers/digitalTwin";
import { observabilityRouter } from "./routers/observability";
import { treasuryRouter } from "./routers/treasury";
import { advancedGovernanceRouter } from "./routers/advancedGovernance";
import { datingRouter } from "./routers/dating";
import { liveVideoRouter } from "./routers/liveVideo";
import { creatorStudioRouter } from "./routers/creatorStudio";
import { paymentsRouter } from "./routers/payments";
import { socialGraphRouter } from "./routers/socialGraph";
import { sandboxRouter } from "./routers/sandbox";
import { moderationRouter } from "./routers/moderation";
import { cryptoRouter } from "./routers/crypto";
import { aiEngineerRouter } from "./routers/aiEngineer";
import { casinoRouter } from "./routers/casino";
import { charityRouter } from "./routers/charity";
import { icoRouter } from "./routers/ico";
import { adultAreaRouter, greyToolsRouter } from "./routers/adultArea";
import { wisePaymentsRouter } from "./routers/wisePayments";
import { knowledgeGraphRouter } from "./routers/knowledgeGraph";
import { aiMemoryRouter } from "./routers/aiMemory";
import { agentOSRouter } from "./routers/agentOS";
import { organizationRouter } from "./routers/organization";
import { revenueEngineRouter } from "./routers/revenueEngine";
import { gamificationRouter } from "./routers/gamification";
import { enterpriseB2BRouter } from "./routers/enterpriseB2B";
import { aiIDERouter } from "./routers/aiIDE";
import { devWorkspaceRouter } from "./routers/devWorkspace";
import { tokenomicsRouter } from "./routers/tokenomics";
import { dataLakeRouter } from "./routers/dataLake";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ShadowChat feature routers
  social: socialRouter,
  wallet: walletRouter,
  exchange: exchangeRouter,
  ai: aiRouter,
  governance: governanceRouter,
  marketplace: marketplaceRouter,
  messaging: messagingRouter,
  notifications: notificationsRouter,
  admin: adminRouter,
  analytics: analyticsRouter,
  profile: profileRouter,

  // Enterprise platform routers
  eventBus: eventBusRouter,
  knowledge: knowledgeRouter,
  workflow: workflowRouter,
  search: searchRouter,
  security: securityRouter,
  developer: developerRouter,
  digitalTwin: digitalTwinRouter,
  observability: observabilityRouter,
  treasury: treasuryRouter,
  advancedGovernance: advancedGovernanceRouter,

  // Phase 3 feature recovery routers
  dating: datingRouter,
  liveVideo: liveVideoRouter,
  creatorStudio: creatorStudioRouter,
  payments: paymentsRouter,
  socialGraph: socialGraphRouter,
  sandbox: sandboxRouter,
  moderation: moderationRouter,

  // Enterprise Crypto
  crypto: cryptoRouter,
  aiEngineer: aiEngineerRouter,

  // Casino & Entertainment
  casino: casinoRouter,
  charity: charityRouter,

  // ICO & Investment
  ico: icoRouter,

  // Adult & Grey Area
  adultArea: adultAreaRouter,
  greyTools: greyToolsRouter,

  // International Payments
  wisePayments: wisePaymentsRouter,

  // AI Operating System Layer
  knowledgeGraph: knowledgeGraphRouter,
  aiMemory: aiMemoryRouter,
  agentOS: agentOSRouter,
  organization: organizationRouter,

  // Billion-Dollar Platform Layer
  revenue: revenueEngineRouter,
  gamification: gamificationRouter,
  enterpriseB2B: enterpriseB2BRouter,

  // AI IDE & Developer Workspace
  aiIDE: aiIDERouter,
  devWorkspace: devWorkspaceRouter,

  // Tokenomics — Full Crypto Economy
  tokenomics: tokenomicsRouter,

  // Data Lake — Enterprise Data Management
  dataLake: dataLakeRouter,
});

export type AppRouter = typeof appRouter;
