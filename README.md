# Solana-Crypto-Wallet

## App flow example (in the making)

### Nasa baza
Imamo za sada jednu user tablicu koja sadrzi (nadodaj sta god mislis da je potrebno):
  - uuid id
  - moze uuid ili svjdn random generated ugl username
  - passcode kao string hashirani
  - public wallet key
  - refresh token
  - created_at

TODO: morat cemo za bazu jos osmislit one igre kako ce funkcionirat

### Backend endpoints (for now koji mislim da ce trebat 100%)
  - random phrase od 12 rijeci generator endpoint
  - register endpoint koji ce primiti passcode, treba spremiti onda novog usera, kreirati wallet i kreirati tokene, u responseu treba biti access_token, refresh_token i wallet_private_key
  - nekakav get wallet balance endpoint da vidimo trenutni balance i coine koje ima
  - nekakav get wallet history transactions endpoint da vidimo transakcije koje je radio
  - recover wallet endpoint (to cemo jos smisliti)
