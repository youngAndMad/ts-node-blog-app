# ts-node-chat-app(frontend repo: https://github.com/youngAndMad/ng-node-chat-app-front)

## Used technologies

- Typescript
- PostgreSQl database
- Prisma orm
- Mail sending with nodemailer
- Socket.io for real time communication
- Redis to store cache
- Winston for logging
- Minio object storage
- JWT tokens
- Docker


- ## Steps to Setup

**1. Clone the application**
```bash
git clone https://github.com/youngAndMad/ts-node-chat-app
```

**2. Add .env to root of project(check .env.example)**

**3. Install dependencied**
```bash
npm install --legacy-peer-deps
```

**4. Do database migrations**
```bash
npx prisma migrate dev --name init
```

**5. Run app**
```bash
npm run dev
```
