# TaskFlow

A team task board where work moves through a visible pipeline — **Backlog → In Flow → Done**
— with live activity powered by an event-driven backend.

Built to demonstrate a real full-stack skill set: REST API design, relational data modeling,
authentication, caching, event streaming, containerization, and cloud deployment.

## Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React (Vite) + Tailwind CSS | Fast dev loop, utility-first styling for a custom design system |
| API | Node.js + Express | REST endpoints, JWT-protected routes |
| Database | PostgreSQL + Prisma ORM | Relational integrity between users, tasks, and notifications |
| Cache | Redis | 30s cache on the task list endpoint, invalidated on writes |
| Event bus | Kafka (via Redpanda) | Decouples task changes from notification generation |
| Containers | Docker + Docker Compose | One command spins up all six services |

## Architecture

```
 ┌──────────┐      REST/JWT      ┌──────────┐
 │  React   │ ─────────────────▶ │  Express │
 │  client  │ ◀───────────────── │   API    │
 └──────────┘                    └────┬─────┘
                                       │
                     ┌─────────────────┼─────────────────┐
                     ▼                 ▼                 ▼
               ┌──────────┐      ┌──────────┐      ┌──────────┐
               │ Postgres │      │  Redis   │      │ Redpanda │
               │ (Prisma) │      │ (cache)  │      │ (Kafka)  │
               └──────────┘      └──────────┘      └────┬─────┘
                                                          │
                                                          ▼
                                                ┌────────────────────┐
                                                │ notification-service│
                                                │ (Kafka consumer)    │
                                                └──────────┬──────────┘
                                                            │ writes
                                                            ▼
                                                      Postgres (Notification)
```

When a task is created or updated, the API publishes an event to Kafka and returns
immediately — it never waits on notification logic. A separate `notification-service`
process consumes those events and writes rows the frontend's Activity feed polls for.
If that consumer goes down, task creation still works; the notifications just catch up
once it's back.

## Running it locally

Requires [Docker](https://docs.docker.com/get-docker/) and Docker Compose.

```bash
git clone <your-repo-url>
cd taskflow
docker-compose up --build
```

This starts Postgres, Redis, Redpanda, the API, the notification consumer, and the
frontend. Once it's up:

- Frontend: http://localhost:5173
- API: http://localhost:4000

The database schema is applied automatically on first boot via `prisma migrate deploy`.

## Running without Docker (for active development)

**Backend**
```bash
cd server
cp .env.example .env   # point DATABASE_URL at a local Postgres, or run one via Docker
npm install
npx prisma migrate deploy
npm run dev             # API on :4000
```

In a second terminal:
```bash
npm run consumer        # notification-service
```

**Frontend**
```bash
cd client
cp .env.example .env
npm install
npm run dev              # on :5173
```

## Environment variables

See `server/.env.example` and `client/.env.example`. Never commit a real `.env` file —
`JWT_SECRET` in particular should be a long random string in any real deployment.

## Deploying to AWS EC2

1. Launch an Ubuntu EC2 instance; open ports 22, 4000, and 5173 in its security group.
2. SSH in, install Docker and Docker Compose.
3. Clone this repo and run `docker-compose up --build -d`.
4. Point `VITE_API_URL` in `client/.env` at the instance's public IP before building the
   client image, so the frontend calls the right API host.

## Project structure

```
taskflow/
├── server/            Express API + Prisma schema + Kafka producer/consumer
│   ├── routes/        auth, tasks, users, notifications
│   ├── middleware/     JWT auth
│   └── prisma/        schema + migrations
├── client/            React + Vite + Tailwind frontend
│   └── src/
│       ├── pages/      Login, Signup, Dashboard
│       └── components/ Navbar, Column, TaskCard, NewTaskModal, ActivityFeed
└── docker-compose.yml  wires all six services together
```
