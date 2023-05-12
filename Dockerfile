# Building layer
FROM node:18-alpine as development

# Optional NPM automation (auth) token build argument
# ARG NPM_TOKEN

# Optionally authenticate NPM registry
# RUN npm set //registry.npmjs.org/:_authToken ${NPM_TOKEN}

WORKDIR /app

# Copy configuration files
COPY tsconfig*.json yarn.lock package*.json ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy application sources (.ts, .tsx, js)
COPY . .

# Build application (produces dist/ folder)
RUN yarn prisma generate

RUN yarn build

CMD ["node", "dist/src/main.js"]

## Runtime (production) layer
#FROM node:18-alpine as production
#
## Optional NPM automation (auth) token build argument
## ARG NPM_TOKEN
#
## Optionally authenticate NPM registry
## RUN npm set //registry.npmjs.org/:_authToken ${NPM_TOKEN}
#
#WORKDIR /app
#
## Copy dependencies files
#COPY package*.json ./
#
## Install runtime dependecies (without dev/test dependecies)
#RUN yarn install --production
#
#COPY --from=development /app/node_modules/@prisma ./node_modules/@prisma
#
## Copy production build
#COPY --from=development /app/dist/ ./dist/
#
#RUN yarn prisma generate
#
## Expose application port
#EXPOSE 8080
#
## Start application
#CMD [ "node", "dist/src/main.js" ]