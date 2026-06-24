# Backend conventions

## Layer separation

- **Controllers** — routing, HTTP params, response DTOs
- **Services** — business logic only
- **Repositories** — database access via Prisma

Services MUST NOT call `this.prisma` directly. Always delegate to a repository method.
If a repository method doesn't exist, add it rather than querying Prisma inline.

Each repository belongs to its own module (e.g. `UsersRepository` in `src/users/`).
If a service from module A needs data from module B, inject module B's repository
into the service constructor — never add cross-domain queries to module A's repository.

```ts
// Good — inject the other module's repository
constructor(prisma: PrismaService) {
  this.repository = new MyRepository(prisma);
  this.usersRepository = new UsersRepository(prisma); // from src/users/
}
```

## Steam login flow

1. Steam OpenID callback → `AuthService.handleSteamCallback()`
2. Fetches Steam profile (displayName, avatarUrl) via `fetchSteamProfile()`
3. Fetches AoE2 profile (profileId, alias, elo, peakElo) from Worlds Edge Link API
   via `fetchAoe2Profile()` in `auth.service.ts`
4. Upserts user in DB with all fields
5. Returns JWT token

URLs documented in `src/common/aoe2-api-urls.ts`.
