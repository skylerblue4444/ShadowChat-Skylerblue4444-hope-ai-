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
});

export type AppRouter = typeof appRouter;
