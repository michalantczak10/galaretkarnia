# Deployment Guide

Ten dokument opisuje aktualny, uproszczony deployment:

- frontend: Vercel
- backend: Render
- baza: MongoDB Atlas

## 1. Wymagane sekrety

Render (backend):

- MONGODB_URI
- RESEND_API_KEY
- ORDER_EMAIL
- RESEND_FROM_EMAIL
- FRONTEND_URL=https://galaretkarnia.pl
- NODE_ENV=production

Vercel (frontend):

- brak wymaganych sekretow dla frontendu

## 2. Aktualny pipeline

Repo pracuje w modelu:

- develop: codzienna praca
- main: produkcja

Publikacja produkcji:

1. push zmian na develop
2. push develop na main
3. Vercel i Render robia automatyczny deployment

W tym repo jest skonfigurowane:

- Vercel buduje frontend bezposrednio komenda npm run build --prefix client
- output frontendu to folder client/dist
- rootowy folder dist nie jest juz wymagany do deployu

## 3. Szybka weryfikacja po deployu

1. API health

GET https://galaretkarnia.onrender.com/api/health

Oczekiwany ksztalt odpowiedzi:

{
  "status": "ok",
  "service": "galaretkarnia-api",
  "environment": "production",
  "timestamp": "...",
  "uptimeSeconds": 123,
  "database": {
    "connected": true,
    "collection": "orders"
  }
}

2. Smoke frontendu na produkcji

npm run test:prod:smoke

3. Smoke lokalny

npm run test:e2e:smoke

## 4. Najczestsze problemy

1. Vercel: vite command not found

Przyczyna: brak instalacji zaleznosci client.
Aktualna konfiguracja vercel.json rozwiazuje ten problem.

2. Backend health ma status degraded

Najczesciej brak polaczenia z MongoDB. Sprawdz MONGODB_URI na Render.

3. Brak maili o zamowieniach

Sprawdz RESEND_API_KEY, RESEND_FROM_EMAIL i ORDER_EMAIL oraz logi backendu na Render.

## 5. Operacyjna checklista

Do release i kontroli produkcji uzywaj:

- README.md
- PRODUCTION-CHECKLIST.md

