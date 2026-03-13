# Rotacja sekretów — szybka instrukcja

Nie umieszczaj sekretów w repo. Ten plik zawiera kroki i polecenia, które ułatwią bezpieczną rotację kluczy i weryfikację.

1) Wygeneruj nowe sekrety lokalnie

PowerShell (48 znaków base64):
```powershell
[Convert]::ToBase64String((New-Object Byte[] 36 | %{ [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($_) ; $_ }))
```

Node.js (hex, 32 bajty):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2) Zaktualizuj zmienne środowiskowe w panelu hostingu

- `ADMIN_SECRET`
- `RESEND_API_KEY`
- `MONGODB_URI` (uaktualnij użytkownika/hasło jeśli zmieniasz DB usera)
- `SESSION_SECRET` (jeśli używany)

Przykłady platform:
- Vercel: użyj dashboard lub `vercel env add NAME production`
- Render: Dashboard → Environment → Add Secret
- GitHub Actions (repo secrets): `gh secret set ADMIN_SECRET --body "<wartosc>"`

3) Zrestartuj / deploy

4) Zweryfikuj działanie usług

```bash
curl -sS https://YOUR_APP_URL/api/health
curl -X POST -H "Content-Type: application/json" -d '{"orderRef":"F...","email":"you@example.com"}' https://YOUR_APP_URL/api/auth/magic
curl -H "X-Admin-Secret: <ADMIN_SECRET>" https://YOUR_APP_URL/api/admin/auth-audit
```

5) Unieważnij stare klucze

- W panelach providerów usuń lub zresetuj stare API keys (Resend) i stare DB users

6) Dobre praktyki

- Nie commituj `server/.env` — trzymaj tylko `server/.env.example`
- Powiadom współpracowników o rotacji i krótkim oknie deploy
- Jeżeli sekret był publicznie widoczny w repo, rozważ rewrite historii lub wymuszoną rotację w providerach

Kontakt: jeśli chcesz, mogę wygenerować skrypt (Windows/Unix) do automatycznego ustawiania sekretów przez CLI twojego hosta.
