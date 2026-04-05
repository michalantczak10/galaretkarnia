# Deployment Guide

Ten dokument opisuje aktualny, uproszczony deployment:

- frontend: Vercel
- backend: Render
- baza: MongoDB Atlas

## 1. Wymagane sekrety

### Render (backend)

Obowiązkowe:
- **MONGODB_URI** - connection string do MongoDB Atlas
- **RESEND_API_KEY** - API key do Resend (email service)
- **ORDER_EMAIL** - adres e-mail na który wysyłać powiadomienia o zamówieniach
- **RESEND_FROM_EMAIL** - adres e-mail nadawcy (musi być zweryfikowany w Resend)
- **FRONTEND_URL** - https://galaretkarnia.pl (używane do CORS i linków w mailach)
- **NODE_ENV** - production

### Vercel (frontend)

- Brak wymaganych sekretów dla frontendu

## 2. Aktualny pipeline

Repo pracuje w modelu:

- develop: codzienna praca
- main: produkcja

Publikacja produkcji:

1. push zmian na develop
2. push develop na main
3. Vercel i Render robia automatyczny deployment

W tym repo jest skonfigurowane:

- Vercel buduje frontend bezposrednio komenda `npm run build --prefix client`
- Output frontendu to folder `client/dist`
- **Ważne**: Rootowy folder `dist` został usunięty (backend obsługuje serwowanie statycznych plików z `client/dist`)

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

2. Smoke testy frontendu na produkcji

```bash
npm run test:prod:smoke
```
Uruchamia testy Playwright przeciwko wdrożonej aplikacji na https://galaretkarnia.pl

3. Smoke testy lokalnie

```bash
npm run test:e2e:smoke
```
Uruchamia testy Playwright na localhost (wymaga uruchomionego dev servera)

## 4. Merge strategy

### Aby dodać zmiany do produkcji:

1. Pracuj na `develop` (daily changes)
2. Po testach i veryfikacji na develop, stwórz PR `develop` → `main`
3. Review i merge do `main`
4. Automatycznie Vercel i Render robia deployment z gałęzi `main`

**Ważne**: Nigdy nie pushuj bezpośrednio na `main`, zawsze przez PR.

## 5. Najczestsze problemy

1. Vercel: vite command not found

Przyczyna: brak instalacji zaleznosci client.
Aktualna konfiguracja vercel.json rozwiazuje ten problem.

2. Backend health ma status degraded

Najczesciej brak polaczenia z MongoDB. Sprawdz MONGODB_URI na Render.

3. Brak maili o zamowieniach

Sprawdz RESEND_API_KEY, RESEND_FROM_EMAIL i ORDER_EMAIL oraz logi backendu na Render.

## 6. Troubleshooting w trakcie development

### Frontend nie buduje się lokalnie

```bash
cd client && npm install && npm run build
```
Upewnij się że zainstalowałeś zależności.

### Backend nie działa lokalnie

```bash
cd server && npm install
```
Jeśli używasz lokalnego MongoDB, ustaw w `.env`:
```
MONGODB_URI=mongodb://localhost:27017/galaretkarnia
NODE_ENV=development
```

### Vite dev server się sypie

Cleaning cache:
```bash
rm -rf client/node_modules client/.vite
npm run dev
```

## 7. Operacyjna checklista

Do release i kontroli produkcji uzywaj:

- README.md
- PRODUCTION-CHECKLIST.md

