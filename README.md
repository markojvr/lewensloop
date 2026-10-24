# Lewensloop

’n Suid-Afrikaanse lewe-simulasie in die styl van BitLife. Jy word in ’n
dorp gebore, gaan skool, kies vakke, studeer, werk, trou, koop ’n huis,
belê, word siek, kry kinders — en as jy sterf, speel jy verder as een van
jou kinders.

## Hoe om te speel

**Op jou rekenaar:** dubbelklik op `index.html`. Dit is al. Daar is niks om
te installeer nie en geen server nodig nie.

**Aanlyn:** as die spel op GitHub Pages gehost word, maak die skakel oop
op jou foon of rekenaar. Die spel is foon-eerste gebou: alles werk met
tik, sonder ’n sleutelbord.

Jou lewe word outomaties in die blaaier se `localStorage` gestoor, so jy
kan die blad toemaak en later verder speel (op dieselfde toestel en
blaaier).

## Wat in watter lêer is

| Lêer | Wat daarin is |
|---|---|
| `index.html` | Die HTML-raam en die `<script>`-lys. |
| `styl.css` | Al die uitleg en kleure. |
| `hulp.js` | Klein hulpfunksies. |
| `data.js` | Al die lyste en getalle (name, skole, beroepe, die ekonomie). |
| `gebeure.js` | Die lukrake gebeure. |
| `lewe.js` | Die status, stoor/laai en die jaarmasjien. |
| `aksies.js` | Alles wat die speler self kies. |
| `uitleg.js` | Bou die HTML vir elke tab. |
| `skerm.js` | Modale vensters, wenke, grafsteen, beginskerm. |
| `minispel.js` | Die mini-spele: blackjack, roulette, slots en video poker. |
| `begin.js` | Die inskryfpunt — laai laaste. |

Dit is gewone `<script src>`-lêers en nie ES modules nie, sodat
dubbelklik op `index.html` werk. Alle paaie is relatief, so dieselfde
lêers werk ook net so op GitHub Pages. `VERANDERINGE.md` is die
meesterplan met alles wat al gedoen is en wat nog kom.

## Hosting op GitHub Pages

Die repo het ’n leë `.nojekyll`-lêer sodat GitHub die lêers net so bedien.
Stoot die repo na GitHub, en gaan dan na **Settings → Pages → Build and
deployment → Deploy from a branch**, kies die `hoof`-tak en die `/ (root)`-
gids. Die spel is dan op `https://<gebruikersnaam>.github.io/<repo-naam>/`.
