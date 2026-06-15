# Security & Authorization

## Current State

All CRUD endpoints are fully open — no authentication, no authorization, no rate limiting.
Any client can call `POST`, `PATCH`, `DELETE` on any resource without restriction.

This is acceptable for early development but **must not reach production** in this state.

## Required

- **Steam login** — authenticate users via Steam OpenID / OAuth.
- **Admin roles** — only users with an admin role may perform mutating operations (`POST`, `PATCH`, `DELETE`).
- **User-specific scoping** — read / write access to owned resources (e.g., a user can only edit their own player civilizations).
- **Rate limiting** — protect mutation endpoints from abuse.

## Implementation Plan (future)

1. Add `roles` field to `User` model in Prisma schema (enum: `USER`, `ADMIN`).
2. Create an `AuthModule` with Steam OAuth strategy.
3. Create an `AuthGuard` that extracts user + role from the session/JWT.
4. Create a `RolesGuard` that checks for required roles.
5. Apply guards globally (or per-module) to protect mutation endpoints.
6. Expose Steam login URL + callback in `AuthController`.

## Endpoints that need protection

| Method | Path | Why |
|--------|------|-----|
| `POST` | `/users`, `/leagues`, `/civilizations`, `/series`, `/matches`, `/player-civilizations` | Admin only |
| `PATCH` | `/users/:id`, `/leagues/:id`, `/civilizations/:id`, `/series/:id`, `/matches/:id` | Admin only |
| `DELETE` | `/users/:id`, `/leagues/:id`, `/civilizations/:id`, `/series/:id`, `/matches/:id`, `/player-civilizations/:id` | Admin only |
| `GET` | All | Open (read-only is safe) |
