# Vercel Deployment Guide - WrongWayAI

## Quick Deploy

1. **Push your code to GitHub**

2. **Go to [vercel.com](https://vercel.com)** → Sign in with GitHub

3. **Import Project**:
   - Click "Add New" → "Project"
   - Select your repository
   - **Root Directory**: Set to `Frontend` (if repo has WrongWay AI folder structure)

4. **Environment Variables** (optional, for Live Monitoring real-time features):
   - `VITE_SOCKET_URL` = Your backend WebSocket URL
   - Leave empty for local dev fallback

5. **Deploy** → Click "Deploy"

---

## Backend (Socket.io)

The Live Monitoring page uses WebSocket. Vercel does not support long-running WebSocket servers. Deploy the backend separately on Railway, Render, or Fly.io, then add `VITE_SOCKET_URL` in Vercel with your backend URL.
