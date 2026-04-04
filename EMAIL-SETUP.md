# Konfiguracja email (Resend)

## Co robi backend

Po zlozeniu zamowienia backend:

1. zapisuje zamowienie do MongoDB
2. zwraca klientowi numer zamowienia
3. probuje wyslac email z detalami zamowienia

Wysylka email nie blokuje zapisu zamowienia. Jezeli Resend ma blad, zamowienie nadal jest w bazie.

## Wymagane zmienne srodowiskowe

W Render ustaw:

- RESEND_API_KEY
- RESEND_FROM_EMAIL
- ORDER_EMAIL

Opcjonalnie dla testow live:

- ORDER_EMAIL_TEST

Przyklad:

RESEND_API_KEY=re_twoj_klucz_api
RESEND_FROM_EMAIL=noreply@galaretkarnia.onresend.com
ORDER_EMAIL=kontakt@galaretkarnia.pl

## Jak przetestowac

1. sprawdz logi backendu na Render po wyslaniu zamowienia
2. wykonaj testowe zamowienie przez frontend
3. potwierdz, ze email dotarl na ORDER_EMAIL

W logach backendu szukaj komunikatow:

- EMAIL accepted by Resend
- EMAIL rejected by Resend
- EMAIL send request failed

## Najczestsze problemy

1. Brak maili

- zly RESEND_API_KEY
- niepoprawny RESEND_FROM_EMAIL
- wiadomosci trafiaja do spam

2. Mail nie wychodzi, ale zamowienie jest zapisane

To oczekiwane zachowanie. System nie traci zamowienia przez problem z email.

3. Rozdzielenie produkcji i testow

Jesli uzywasz testow live, ustaw ORDER_EMAIL_TEST, aby testowe zamowienia nie trafialy na glowna skrzynke.

## Bezpieczenstwo

Nie commituj plikow env do repo. Sekrety trzymaj tylko w Render/Vercel.
