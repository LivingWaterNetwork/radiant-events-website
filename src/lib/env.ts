/** True only on the Vercel production deployment. Previews and local builds stay noindex. */
export function isProductionDeploy(env: NodeJS.ProcessEnv = process.env) {
  return env.VERCEL_ENV === "production";
}
