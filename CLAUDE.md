# Lewensloop — vir Claude

'n Suid-Afrikaanse lewe-simulasie (BitLife-styl) in vanilla JavaScript. Lees
`README.md` vir wat in watter lêer is, en `VERANDERINGE.md` vir die meesterplan:
wat klaar is, wat oop is, en hoe elke stelsel gemeet is.

## Reëls

- Gewone `<script src>`-lêers, **nie ES modules nie** — dubbelklik op `index.html` moet werk.
- Elke nuwe veld in `s` kry 'n verstek in `vulNuweVelde()` (`lewe.js`), sodat ou stoor-data laai.
- Kode, kommentaar en speler-teks is in Afrikaans. Gebruik die helpers in `hulp.js`
  (`meerv()`, `lysTeks()`, `geld()`, `persent()`, `besit()` …) eerder as om teks self aanmekaar te las.
- Misdaad het geen moord of geweld nie. Geen koppeling met Buffett of waardasies nie.
- Commit op `hoof` en push self na `origin/hoof`.
- Antwoord die gebruiker in Afrikaans; tegniese terme mag Engels bly.

## Toets — gebruik die harnas, moenie 'n nuwe een bou nie

`toets/` is 'n klaar harnas wat die spel in Node laai en duisende lewens speel:

```bash
node toets/toets.js                      # alles: 8 scenario's × 150 lewens (~2 min)
node toets/toets.js -n 500 -s tronk,vlug # meer lewens, net sekere scenario's
node toets/toets.js -s tronk --saad 42   # speel een lewe na, met sy hele log
node toets/toets.js tekste > uit.tsv     # elke unieke speler-teks, om self te lees
node toets/toets.js bron                 # taal-reëls oor die bronkode se strings (net 'n wenk)
```

Dit kyk vir crashes, gebroke invariante (NaN, 'n werk in die tronk, 'n ma jonger as haar kind),
teks wat in 'n toestand verbode is (die hond wat jou huis toe volg terwyl jy in die tronk is), 
taalfoute (ontbrekende tweede "nie", "1 jare", "dier(e)", punt as desimaal), en of 'n Fase 1-stoor
nog laai. Elke fout kom met 'n saad; `--saad` speel daardie lewe presies weer.

**Brei dit uit in plaas van om iets nuuts te bou:**
- 'n Nuwe stelsel → 'n scenario in `toets/scenarios.js` wat dit gebruik.
- 'n Fout reggemaak → 'n reël in `toets/reels.js` (`TAAL`, `VERBODE` of `INVARIANTE`) sodat dit nie terugkom nie.
- 'n Eenmalige meting (bv. "hoeveel % gaan tronk toe") → 'n klein script wat `require('./toets/harnas.js')` gebruik.

Voor jy commit: `node toets/toets.js` moet met "✓ Alles skoon." eindig.

Vir die blaaier: `.claude/launch.json` het 'n konfigurasie `lewensloop` (python3 http.server).
Speel op 375 px breed — die spel is foon-eerste.
