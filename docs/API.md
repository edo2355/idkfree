# 📡 IDKFREE — API Reference

**Base URL:** http://localhost:3000/api
**JWT:** dura 15 min

---

## Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me 🔒

### Posts
- POST /api/posts 🔒
- GET /api/feed 🔒 (query: limit, offset, hashtag)
- GET /api/users/:id/posts 🔒
- DELETE /api/posts/:id 🔒

### Likes
- POST/DELETE /api/posts/:id/like 🔒
- POST/DELETE /api/comments/:id/like 🔒

### Follows
- POST/DELETE /api/users/:id/follow 🔒
- GET /api/users/:id/followers
- GET /api/users/:id/following

### Comments
- POST /api/posts/:postId/comments 🔒
- GET /api/posts/:postId/comments
- GET /api/comments/:id/replies
- DELETE /api/comments/:id 🔒

### Notifications
- GET /api/notifications 🔒
- GET /api/notifications/unread-count 🔒
- PATCH /api/notifications/:id/read 🔒
- POST /api/notifications/read-all 🔒
- POST /api/me/push-token 🔒

### Profile
- GET /api/users/:alias
- PATCH /api/me/profile 🔒
- POST /api/me/change-password 🔒

### Search
- GET /api/search/users?q=...
- GET /api/search/posts?q=...

### Hashtags
- GET /api/hashtags/trending
- GET /api/hashtags/:tag

### Vibes
- POST /api/vibes 🔒
- GET /api/vibes
- GET /api/vibes/matches 🔒
- DELETE /api/vibes/:id 🔒
- POST/DELETE /api/vibes/:id/resonate 🔒
- GET /api/users/:alias/vibes

### Legacy
- POST /api/me/legacy 🔒
- DELETE /api/me/legacy 🔒
- GET /api/me/legacy 🔒

---

## Códigos HTTP
- 200 OK · 201 Creado
- 400 inválido · 401 no auth · 403 bloqueado · 404 no existe · 409 conflicto · 500 error

## Vibes moods
silencio · charlar · crear · tranquilo · nose

## Colores de acento
blanco · negro · rojo · azul · verde · dorado · violeta · coral · menta · mostaza
