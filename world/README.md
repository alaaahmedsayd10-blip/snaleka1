# My Virtual World v9 — Auth + Online

Arabic social-world prototype with the existing garden/beach map, avatar customization, seating, chat bubbles, pinch zoom, Supabase email/password authentication, and an authenticated WebSocket room capped at 50 concurrent connections.

## 1. Configure Supabase

1. Open the Supabase project matching the URL configured in `public/game.js`.
2. In **SQL Editor**, run `supabase_setup.sql` to create `public.players` and its row-level security policies.
3. In **Authentication → URL Configuration**, set the Site URL to your deployed website URL. Add your deployed URL to the allowed redirect URLs.
4. For production, keep email confirmation enabled. New users may need to click the confirmation link before they can log in.
5. The browser publishable key is intended for public clients; security depends on RLS and server-side authorization. Never put a Supabase `service_role` secret in browser code.

## 2. Run locally

Requires Node.js 18+.

```sh
npm install
npm start
```

Open `http://localhost:3000`. Register or log in with Supabase. WebSocket connections are accepted only when the access token is valid, and the server refuses new connections once 50 players are connected.

For deployment, set `SUPABASE_URL` and `SUPABASE_ANON_KEY` (or `SUPABASE_PUBLISHABLE_KEY`) as server environment variables when your host supports them. Use HTTPS/WSS in production.

## 3. Included

- Supabase email/password signup, login, session restore, and password reset email.
- Player profile upsert protected by row-level security (requires the SQL setup above).
- Server validates the Supabase access token before allowing multiplayer.
- A single shared WebSocket room, with a hard limit of 50 concurrent connections and existing-player snapshots for new arrivals.
- Movement/avatar state sync and simple chat bubbles using the current game's protocol.
- Pinch-to-zoom on touchscreens and wheel zoom on desktop.
- Existing map/assets and the current game systems are retained as the starting point.

## 4. Important limitations

This is a playable prototype, not a complete commercial-scale replica of Sanalika. It does not yet include private messaging, friend requests, moderation tools, a server-authoritative economy, payment processing, persistent inventories, or production monitoring. The current game currency and shop remain client-side prototype systems and must not be treated as secure or valuable. The server's 50-player cap is a connection cap for one shared room, not a load-tested guarantee of 50 smooth players on every hosting provider.

## v14 — Avatar dress-up creator

- Old characters (`char1-3.png`) removed. The avatar is now drawn in code (`public/avatar.js`): white chibi base body + items that sit on it.
- Items: Soft Floral Eyes, Furrowed Brows, Kpop Glasses (with chain), Nose Ring, Baby Monster Mouth, Plump Pout, Night Bloom Tats, Formal Button Up Undershirt, Black Baggy Sweatpants, White Airmojo 21s. Skin/eye/shirt/pants/shoe colors are selectable.
- Login -> creator screen -> press "ابدأ" to enter the world. The 👕 button reopens the creator in-game.
- Front and back views (back view shows while walking away), arms swing opposite to legs, and the look is synced to other players through the Realtime payload (`look`, validated by `cleanLook`).
- The look is saved in localStorage on the device (not yet in Supabase).

## v19 — Layered PNG avatar pack

- New `public/avatar-pack.js` + `public/avatar-pack-manifest.js`: set `enabled:true` and the avatar, creator tabs, item thumbnails and in-game sprites are composed from same-size transparent PNG layers in `public/avatar/<slot>/`. See `public/avatar/HOWTO.txt`.
- Ships disabled with a placeholder body (pearl/tan) generated from the code-drawn mannequin. Add your own licensed/original layers, register them in the manifest, then enable.
- With the pack on, arm-swing animation is off (the body is one image). With it off, everything works as in v18.
