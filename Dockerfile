# Railway build (railway.json): standalone Next.js server on Node 24.
FROM node:24-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 NEXT_STANDALONE=1
COPY package.json package-lock.json ./
RUN npm ci --include=dev
# Public settings the static pages are built with. Railway passes service
# variables declared here; secrets (SADAD_SECRET_KEY, SMTP_PASS, DATABASE_URL)
# are runtime-only and never reach the build.
ARG NEXT_PUBLIC_SITE_URL=https://abktradingservice.com
ARG NEXT_PUBLIC_PLAUSIBLE_DOMAIN
ARG NEXT_PUBLIC_ADS_LABEL_PPF_BOOKING
ARG SADAD_MERCHANT_ID
ARG PAYMENTS_PUBLIC
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN=$NEXT_PUBLIC_PLAUSIBLE_DOMAIN \
    NEXT_PUBLIC_ADS_LABEL_PPF_BOOKING=$NEXT_PUBLIC_ADS_LABEL_PPF_BOOKING \
    SADAD_MERCHANT_ID=$SADAD_MERCHANT_ID \
    PAYMENTS_PUBLIC=$PAYMENTS_PUBLIC
COPY . .
RUN npm run build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production HOSTNAME=0.0.0.0 NEXT_TELEMETRY_DISABLED=1
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 8080
CMD ["node", "server.js"]
