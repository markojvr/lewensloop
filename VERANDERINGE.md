# Lewensloop — volledige lys veranderinge

Elke item het 'n kode-verwysing waar dit van toepassing is.
Prioriteite: **P0** = dis net verkeerd, **P1** = groot realisme-gaping, **P2** = nuwe inhoud.

### Lêerstruktuur

Die spel was een lêer van 2 104 reëls. Dit is op 22 Oktober 2026 opgedeel,
met presies dieselfde gedrag — net makliker om in te werk:

| Lêer | Wat daarin is |
|---|---|
| `index.html` | Net die HTML-raam en die `<script>`-lyste. 35 reëls. |
| `styl.css` | Al die uitleg en kleure. |
| `hulp.js` | Klein hulpfunksies: `R()`, `kans()`, `geld()`, `klem()`, en ná afdeling O die vier taalhelpers `meerv()`, `lysTeks()`, `rangTel()` en `hoofletter()`. |
| `data.js` | Al die lyste: name, skole, unies, beroepe, bates, misdade, flieks, diere. Onder "SKOOL EN STUDIE" staan die vakke, die APS-tabel en die slaagkanse; onder "EKONOMIE" staan al die geldgetalle bymekaar: dorpskoste, huurpryse, verbandkoerse, rente en pensioen; onder "GESIN EN GESONDHEID" staan die grootouer-dade, die voorbehoeding, die siektes (`TOESTANDE`), die mediese fondse, die gewoontes en die gene. |
| `gebeure.js` | `GEBEURE` — die lukrake dinge wat met jou gebeur. Elkeen het `min`/`max`, opsioneel `as()`, en ná afdeling O ’n `waar`-veld wat sê of dit ook in die tronk of op straat kan gebeur. Ná Fase 6 is dit 197 gebeure, waarvan 53 ’n keuse het: die oorspronklike lys, dan blokke per lewensfase, dan blokke wat by die stelsels inhaak (siektes, gewoontes, die straat, jou besigheid, jou vaardighede, jou kinders), en heel onder die **vlagverhale** (H14) wat ’n vroeëre keuse later laat terugkom. |
| `lewe.js` | Die status `s`, stoor/laai, en `wordOuer()` — die jaarmasjien. Fase 6 se drie nuwe blokke staan onderaan: die vlagstelsel (H14), vaardighede (H3), die besigheidsjaar (H4) en die generasie-oorgang (H1). |
| `aksies.js` | Alles wat die speler self kies: aktiwiteite, werk, studie, bates, verhoudings, diere. |
| `uitleg.js` | Bou die HTML vir elke tab, insluitend die Gesond-blad (siektes, mediese fonds, leefstyl, voorbehoeding). |
| `skerm.js` | Modale vensters, wenke, grafsteen, beginskerm. |
| `minispel.js` | **Fase 7.** Die mini-spel-raamwerk (’n volskerm-paneel met “Speel self” en “Doen dit vinnig”) en die vier casino-spele: blackjack, roulette, slots en video poker. Laai ná `skerm.js`. |
| `misdaad.js` | **Fase 8.** Die hele misdaadvloei (teiken, maat, ontsnapvoertuig, mini-spel, uitslag), hitte, die heler, die hof (jeugreg, prokureur, borgtog, pleit, vonnis), die witboordjie-oudit, en die vyf misdaad-mini-spele. Die getalle staan in `data.js` onder “MISDAAD EN REG”. Laai ná `minispel.js`. |
| `onderwereld.js` | **Fase 8b.** Jou rep as krimineel, die vier organisasies (aansluit, jobs, range) en jou eie organisasie (werf, jobs vir jou mense, lone). Laai ná `misdaad.js`. |
| `dev.js` | **Playtest.** Die ontwikkelaar-paneel — net aktief met `?dev` in die adres (sien N1). Laai heel laaste, ná `begin.js`. |
| `ontsnap.js` | **Fase 9.** Tronk-ontsnapping: die voorbereidings oor jare, die stealth-mini-spel (rooster, patrollies, kykkeëls, ’n foutlose-pad-oplosser en twee bots), en die lewe op die vlug (soektog, vals ID, trek, oorgee). Die getalle staan in `data.js` onder “ONTSNAPPING EN DIE LEWE OP DIE VLUG”. Laai ná `onderwereld.js`. |
| `begin.js` | Die inskryfpunt. Laai heel laaste. |
| `toets/` | **Die toets-harnas** (sien N6). `harnas.js` laai die spel in Node, `scenarios.js` hou die soorte spelers, `reels.js` die taal-, toestand- en invariant-reëls, en `toets.js` is die opdrag: `node toets/toets.js`. Nie deel van die spel nie. |

Dit is gewone `<script src>`-lêers, nie ES modules nie, **sodat dubbelklik op
`index.html` steeds werk**. Moet dit nie na `type="module"` verander nie —
dan blokkeer die browser dit oor `file://` en moet jy 'n server begin.

---

## A. Foute wat eerste gefix moet word (P0) — ✅ KLAAR (22 Oktober 2026)

Al 16 items is gedoen. Die kolom **Gedoen** sê kortliks wat verander het.
Nuwe velde in `s`: `skool.agter`, `tronkJare`, `kindersGebore`, `lisensie`, en
`artsBonus` per dier — almal met `||0`, sodat ou stoor-data in localStorage
steeds laai.

| # | Probleem | Waar | Gedoen |
|---|---|---|---|
| A1 | **Fliek-kaartjies.** `fliekMaat()` vra altyd `f.koste * 2` as jy iemand saamvat — ook as dit jou ma of pa is. 'n 8-jarige betaal dus vir sy ouer se kaartjie. Fix: 'n grootmens wat saamgaan betaal sy eie kaartjie (of betaal joune ook); net 'n maat van jou eie ouderdom kos jou geld. | `aksies.js:106` | ✅ `kaartjiePrys()` in `aksies.js`. Jy betaal jou eie kaartjie plus dié van ’n kind wat jy saamvat; ’n grootmens (18+) betaal self. ’n 8-jarige met sy ma betaal nou R90 in plaas van R300. |
| A2 | **Geen kinderkaartjie.** Een prys vir alle ouderdomme. SA-bioskope het kinder-/pensioenaris-pryse (± 60% van vol prys). Voeg `kinderPrys` by elke item in `FLIEKS`. | `data.js:177` | ✅ `kinderPrys` by elke fliek in `FLIEKS` (± 60% van vol prys). Geld vir kinders onder 13 **en** pensioenarisse van 60 af. |
| A3 | **Geen ouderdomsbeperking op flieks.** 'n 6-jarige kan 'n grillerprent (18) gaan kyk. Voeg `ouderdomsbeperking` by elke fliek en keer dit af onder die ouderdom (of "jou ouers sê nee"). | `data.js:177` | ✅ `ouderdomsbeperking` by elke fliek (0, 7, 10, 13, 18). Te jonk → die opsie is grys en “Dit is ’n 18-fliek. Hulle laat jou nie in nie.” |
| A4 | **Kind gaan alleen fliek/vakansie.** `fliek` is `min:6` en `vakansie` is `min:8` — 'n 8-jarige kan alleen Japan toe vlieg. Onder ± 13 moet 'n ouer/grootmens saamgaan, anders moet die opsie "Gaan alleen" wegval. | `aksies.js:36`, `aksies.js:40` | ✅ Onder 13 val “Gaan alleen” weg by fliek én vakansie — net grootmense (18+) is in die maatlys (`grootmensFilter`). Is daar niemand nie, sê die spel dit. |
| A5 | **Casino is 'n geldmasjien.** Koste R5 000, 46% kans op R8 000–R22 000 wins → verwagte wins ≈ **+R1 900 per draai**, 3 draaie per jaar. Moet negatief wees (bv. 42% kans op R2 000–R12 000). | `aksies.js:65` | ✅ Nou 2% kans op R30 000–R90 000 plus 36% op R6 000–R12 000. Verwagte opbrengs **−R624 per draai** (87,5% terugbetaling) in plaas van +R1 900. |
| A6 | **Lotto is te goed.** 0,12% kans op R6–38 m teen R30 → verwagte wins ≈ **+R26 000 per kaartjie**. Werklike Lotto-kans is ± 1 in 20 miljoen. Maak die jackpot-kans ± 0,002% en laat jou meer as een kaartjie per jaar koop. | `aksies.js:60` | ✅ Vier prysvlakke met regte kanse: jackpot 1 uit 2 miljoen. Verwagte opbrengs **−R12,80 per kaartjie** (57% terugbetaling) in plaas van +R26 000. Tot 5 kaartjies per jaar. |
| A7 | **Tronk breek skool permanent.** `skoolJaar()` begin met `if(s.tronk) return;`. Word jy op 10 toegesluit, pas `o===6` en `o>=7&&o<=12` nooit weer nie → jy sit vir ewig op `vlak:'laerskool'` en kan nooit matrikuleer of studeer nie. Nodig: 'n inhaal-/herhaalstelsel wat graad op ouderdom herbereken ná vrylating. | `lewe.js:140` | ✅ `skoolGraad()` = ouderdom − 5 − `skool.agter`. Elke jaar in die tronk tydens jou skooljare verhoog `agter`; ná vrylating gaan jy voort waar jy opgehou het (en slaan nie grade oor nie). Getoets: toegesluit op 12 in Graad 7 vir 8 jaar → Graad 8 op 20, matriek op 25. |
| A8 | **Kollegas bly aan ná 'n vonnis.** `tronkToe()` stel `s.beroep=null` maar roep nooit `losWerkMense()` nie, so jou baas en kollegas bly vir altyd in jou mense-lys. | `lewe.js:428` | ✅ `tronkToe()` roep nou `losWerkMense()` en noteer die werksverlies. Studies word ook met ’n boodskap gestaak. |
| A9 | **Troeteldier kan onsterflik word.** Elke dieretarts-besoek doen `d.maks += 1`, een keer per jaar — dus kan 'n goudvis 40 jaar oud word. Maak die bonus eenmalig of beperk tot +2 totaal. | `aksies.js:641` | ✅ `d.artsBonus` beperk die dierearts se bonus tot +2 jaar in totaal. |
| A10 | **Egskeiding verdeel net kontant.** `wat==='skei'` neem die helfte van `s.geld`, maar laat `s.bates` en `s.belegging` heeltemal uit. Jy hou die Camps Bay-huis. | `aksies.js:558`, `lewe.js:372` | ✅ Nuwe `skeiVerdeel()` in `lewe.js`, gebruik deur albei plekke. Verdeel die **netto waarde** (kontant + beleggings + bates) in die helfte, en verkoop bates — die duurste eerste — as daar nie genoeg kontant is nie. Die Camps Bay-huis word nou verkoop. |
| A11 | **Kinders kos vir ewig geld.** `uit += s.kinders * 38000` loop tot jy dood is, ook ná die kind op 18 "huis verlaat het". En `s.kinders` word nooit afgetrek as 'n kind sterf nie. | `lewe.js:326` | ✅ `kindersTuis()` tel net lewende kinders onder 18, en `s.kinders` word verminder as ’n kind sterf. `s.kindersGebore` hou by hoeveel jy ooit gehad het, vir die grafsteen. |
| A12 | **Troeteldiere is gratis vir kinders.** Al die onderhoudskoste sit binne `if(s.ouderdom>=18)`, dus kan 'n 10-jarige 'n perd (R62 000/jaar) gratis aanhou. | `lewe.js:325` | ✅ `diereKosteJaar()` hef die koste op elke ouderdom. Is jy ’n kind, betaal jou ouers — maar net as hulle dit kan bekostig (`rykf × 30 000`); anders gaan die dier SPCA toe. |
| A13 | **Dooie vlae.** `s.vlagge.gevang` en `s.vlagge.hond` word gestel maar nooit gelees nie. Die "hond volg jou huis toe"-gebeurtenis gee ook nie 'n regte dier in `s.diere` nie. | `gebeure.js:109`, `gebeure.js:165` | ✅ `s.vlagge.gevang` word nou gelees: is jy al gevang, val die uitsluip-kans van 60% na 34%, en jou ouers se band daal. Die hond gee nou ’n regte dier in `s.diere` (met sy R9 500/jaar) via `voegDierBy()`; die dooie `s.vlagge.hond` is weg. |
| A14 | **Tronkjare-telling is verkeerd** op die grafsteen: dit tel log-reëls wat met "Jy sit tronk" begin, maar die laaste jaar van elke vonnis log "vrygelaat" in plaas daarvan — dus altyd een jaar te min per vonnis. | `skerm.js:104` | ✅ Nuwe `s.tronkJare` tel elke jaar in `tronkJaar()`, ook die jaar waarin jy vrygelaat word. Twee vonnisse van 3 + 2 jaar wys nou 5, nie 3 nie. |
| A15 | **Jy kan werk terwyl jy op skool is, voltyds.** `doenAansoek()` kyk nooit na `s.skool.vlak` nie. 'n Graad 10-leerling kan voltyds kelner wees teen R78 000/jaar. Nodig: 'n aparte klas van **deeltydse werk** (sien D3). | `aksies.js:278` | ✅ `werkVereis()` keer voltydse werk terwyl `skool.vlak` `laerskool` of `hoerskool` is, en die Werk-blad wys “Nog op skool” met die rede. Universiteitstudente is nie geraak nie. Die volle deeltydse-werk-stelsel bly D3. |
| A16 | **Enige ouderdom kan 'n motor besit en bestuur.** Daar is geen lisensiestelsel nie — net een flavour-gebeurtenis oor 'n leerlinglisensie. 'n 12-jarige kan 'n Porsche koop en as ontsnapvoertuig gebruik. | `aksies.js:407`, `gebeure.js:45` | ✅ `magBestuur()` (18+) word getoets by `koopBate()` vir ’n motor en by die “Jou eie motor”-ontsnapvoertuig; `lisensieJaar()` gee die lisensie op 18 met ’n log-reël. Die volle motorstelsel bly H9. |

---

## B. Ekonomie en geld (die grootste realisme-gaping) — P1

**Fase 2 (B1, B2, B5, B6, B13, B14, B17) is ✅ KLAAR (22 Oktober 2026).** Die kolom
**Gedoen** sê kortliks wat verander het. Die ander items in hierdie afdeling wag nog.

**B18 en B19 (dakloosheid) is ✅ KLAAR (23 Oktober 2026).**

Nuwe velde in `s`: `spaar`, `blyplek`, `huurPlek`, `bond`, `swartlys`, `pensioenFonds`,
`pensioenKoers`, `afgetree`, `dakloos`, `dakloosJare` — almal met verstekwaardes in
`vulNuweVelde()`, sodat ou stoor-data in localStorage steeds laai (ook 'n lewe wat al
op pensioen was). `s.blyplek` het twee nuwe waardes by: `'familie'` (’n broer of suster
het jou ingetrek) en `'dakloos'`. Al die nuwe getalle staan bymekaar in `data.js` onder
"EKONOMIE".

| # | Verandering | Gedoen |
|---|---|---|
| B1 | **Geen huur.** Besit jy nie 'n huis nie, betaal jy niks vir blyplek. Nodig: huur as deel van `finansiesJaar()`, geskaleer volgens dorp en inkomste, plus die keuse om by jou ouers te bly (goedkoper, maar minder geluk ná ± 25). | ✅ `blyplekJaar()` in `lewe.js`. Drie keuses: by jou ouers (R950/maand as jy verdien, en van 25 af kos dit elke jaar geluk), een van vyf `HUURPLEKKE` (agterkamer tot huis in 'n goeie buurt), of jou eie huis. Alles word deur `DORP_KOSTE` geskaleer — dieselfde woonstel kos R108k in Kaapstad en R67k in Vryburg. Op 18 vra die spel een keer waar jy wil bly; daarna verander jy dit op die Bates-blad. Vreet die huur meer as die helfte van jou vermoë op, trek jy kleiner (`kleinerBlyplek()`). |
| B2 | **Geen huislening (bond).** Jy moet R950 000 **kontant** hê vir die goedkoopste woonstel. Nodig: deposito (10%), rentekoers, paaiement, termyn, en wat gebeur as jy agterraak (repossession). Dit is die enkele grootste ontbrekende stuk. | ✅ `bondJaar()`, `bondOpsies()` en `wysBondOpsies()`. Koop jy 'n huis sonder genoeg kontant, wys die bank vier opsies: 10% of 20% deposito oor 20 of 30 jaar, teen 11,75%, elk met sy paaiement én wat jy in totaal gaan betaal. Die bank keur net goed wat onder 33% van jou bruto inkomste val — 'n onderwyser op R330k kwalifiseer vir 30 jaar, nie vir 20 nie. Jy kan ekstra inbetaal (R250k op 'n nuwe verband sny 19 jaar af). Raak jy drie jaar agter, verkoop die bank die huis op 'n veiling teen 80% en jy word sewe jaar gelys. `netoWaarde()` en `skeiVerdeel()` trek die verband af. |
| B3 | **Geen voertuigfinansiering**, geen balloon payment, geen versekering (voertuig, huis, lewe), geen licence disc/registrasie. | |
| B4 | ~~**Geen inflasie.**~~ **(UITGESTEL — nie nou nie.)** Salarisse groei 4,5% per jaar (`lewe.js:292`), maar 'n fliek bly vir 80 jaar R180 en 'n huis bly R950 000. Nodig: een inflasie-multiplikator wat op alle pryse toegepas word, plus 'n beginjaar (bv. gebore in 2026) sodat die spel 'n kalender het. | |
| B5 | **Kontant verdien geen rente.** Geld in die bank moet ± 5–7% per jaar groei; nodig: spaarrekening vs tjekrekening. | ✅ `spaarRenteJaar()` plus 'n spaarrekening (`s.spaar`) op die Bates-blad. Geld daar groei 5–7% per jaar; geld in die tjekrekening doen steeds niks — jy moet dit self skuif, en die spel herinner jou as jy te veel laat lê. Rente bo SARS se R23 800-vrystelling word belas. Kort die tjekrekening geld vir 'n paaiement, trek die bank dit outomaties uit die spaarrekening (`dekUitSpaar()`). |
| B6 | **Skuld het geen gevolge.** Negatiewe `s.geld` kos net 9 geluk per jaar — geen rente, geen blacklisting, geen credit score, geen boedelbevel (sequestration), en jy kan onbeperk negatief gaan. | ✅ `skuldJaar()`. Skuld loop teen 19%. Oor die perk (35% van jou bruto inkomste, minstens R25 000) word eers jou spaargeld, dan jou beleggings, dan jou bates opgeëis — die balju vat die goedkoopste ding wat die skuld dek, teen 75% van sy waarde. Is daar niks meer nie, volg 'n boedelbevel: alles weg, skuld afgeskryf, tien jaar gelys. `betaalWatJyKan()` is die harde ondergrens: wat jy nie kan betaal nie, moet jy ontbeer (dit kos geluk en gesondheid) — jou skuld kan dus nie onbeperk groei nie. 'n Boedelbevel vereis minstens R120 000 skuld en kan net een keer elke tien jaar. |
| B7 | **Geen lenings beskikbaar.** Jy kan nie geld leen om te studeer, 'n besigheid te begin of 'n krisis te oorleef nie. Nodig: persoonlike lening, kredietkaart, mashonisa (hoë rente, swaar gevolge). | |
| B8 | **Belasting is te grof.** `finansiesJaar()` gebruik vier plat skale (14/22/30/36%). SA het marginale skale plus `primary rebate`, UIF en mediese krediete. Pensioeninkomste word ook teen volle koers belas. | |
| B9 | **Geen belasting op beleggings of bates:** geen CGT by verkoop, geen dividendbelasting, geen hereregte (transfer duty) of agentekommissie (± 7%) wanneer jy eiendom koop/verkoop. | |
| B10 | **Geen TFSA of retirement annuity.** Vir 'n spel met 'n Buffett-kant is dit belangrik: TFSA met 'n R36 000/jaar-limiet, 'n RA met belastingaftrekking, en die verskil tussen 'n indeksfonds en aandele. | |
| B11 | **Beleggingsopbrengs is onrealisties verdeel.** `tussen(-24,34)/100` is 'n plat (uniform) verdeling met gemiddeld +5%. Nodig: 'n skewe verdeling met seldsame groot verliese (crash-jare), en die keuse tussen kontant / indeksfonds / enkelaandele / krypto met verskillende risiko's. | |
| B12 | **Geen maandelikse debietorders.** Alles gebeur een keer per jaar in een groot bedrag; selfoonkontrak, internet, mediese fonds, gim-lidmaatskap en versekering bestaan nie as vaste uitgawes nie. | |
| B13 | **Lewenskoste is 'n vaste R56 000** vir almal van 18 af — of jy 'n student, werkloos, 'n miljoenêr of in 'n dorpie is. Nodig: koste wat skaal met leefstyl, dorp, gesinsgrootte en inkomste. | ✅ `lewenskosteJaar()` vervang die plat R56 000. Dit skaal met die dorp (`DORP_KOSTE`), met jou gesin (eggenoot + 60%, R30 000 per kind onder 18, albei ook dorp-geskaleer), en met jou inkomste: 'n student leef op 62%, wie min verdien leef karig (55% van sy netto), en elke rand netto bo R220 000 laat jou 18c meer spandeer. Bly jy by jou ouers en verdien jy nog niks, sit hulle die kos op die tafel — daarom beland 'n student of iemand tussen werke nie sommer in die skuld nie. |
| B14 | **Sakgeld is te laag.** R100–R600 **per jaar** (`lewe.js:321`) teenoor 'n fliekkaartjie van R180. En die tandfeetjie gee R5. Nodig: sakgeld per week/maand wat met ouderdom groei. | ✅ `sakgeldJaar()`. Sakgeld is nou (ouderdom − 4) × R7 per week × die gesin se rykdomfaktor, met ±15% ruis. 'n Sewejarige in 'n werkersklasgesin kry sowat R21 per week, 'n matriekleerling R91 — dus 'n fliek of twee per maand teenoor die R180-kaartjie. Werk jy self, hou die sakgeld op. Die tandfeetjie gee nou R20–R60 in plaas van R5. |
| B15 | **Geen begrafnis, testament of boedel.** As jy sterf, verdwyn alles. Nodig: 'n testament, boedelbelasting en 'n erfenis wat na jou kinders gaan (sien H1). | |
| B16 | **Geen staatstoelae.** Geen kindertoelaag, geen UIF as jy afgedank word, geen ouderdomspensioen (SASSA) as jy nooit 'n pensioenfonds gehad het nie. | |
| B17 | **Pensioen is 'n gratis geskenk:** `s.pensioen = salaris * 0,35` vir ewig, sonder dat jy ooit bygedra het, en net beskikbaar as jy op 60 nog 'n werk het. Is jy op 60 werkloos, kan jy nooit aftree nie. Nodig: jaarlikse bydraes wat opbou in 'n fonds. | ✅ `pensioenBydraeJaar()`, `pensioenFondsJaar()`, `treeAf()` en `aftreeJaar()`. Jy dra 0%, 5%, 7,5% of 15% by (knoppies op die Werk-blad), jou werkgewer pas dit tot 7,5%, en die bydrae is belastingaftrekbaar. Die fonds groei 0–12% per jaar en **bly joune as jy die werk verloor** — jy kan dus aftree al is jy op 60 werkloos. Van 55 af kan jy aftree: alles in 'n lewende annuïteit (5,5% per jaar), of eers 'n derde kontant (die eerste R550 000 vry). Op 65 vra die spel self. Jy kan die fonds ook vroeg uittrek — en dan vat SARS 36% bo R27 500, wat die les is. |
| B19 | **Dakloosheid (nuut, 23 Okt 2026).** Die ekonomie het ’n muur gehad (`betaalWatJyKan()` laat jou nie meer uitgee as `geld + skuldPerk()` nie) maar nooit ’n bodem nie: iemand sonder inkomste het net elke jaar swaar gekry sonder dat iets kon verander. `s.dakloos` is daardie bodem — ’n toestand soos `s.tronk`, met sy eie jaarfunksie, sy eie aksies en sy eie paneel. | ✅ Sien die blok onder die tabel. |
| B18 | **Ryk maar brandarm (nuut, 22 Okt 2026).** `betaalWatJyKan()` beperk wat jy kan uitgee tot `geld + skuldPerk()`, maar `skuldJaar()` eis eers op as die skuld **bo** die perk is. Iemand met 'n huis van R2,8 m en geen inkomste bly dus vir altyd op die skuldplafon vassteek: hy betaal elke jaar R25 000 van R100 000, kry elke jaar geluk en gesondheid af, verkoop nooit die huis nie — en sy netto waarde **styg** steeds. Oor 14 jaar getoets: R4,16 m → R5,21 m terwyl hy honger ly. Nodig: kan jy nie jou lewenskoste dek nie en besit jy iets verkoopbaars, vra die speler om te verkoop (of laat die balju optree *by* die perk, nie net daarbo nie). ✅ Twee dinge. (a) Kon jy nie ’n rekening dek nie en besit jy nog iets, **vra die spel jou om te verkoop** (`vraVerkoop()`): jy kry die volle waarde, en die balju hou daardie jaar sy hande tuis sodat die vraag sin maak. (b) Wys jy dit van die hand, tree die balju **by** die perk op, nie net daarbo nie (die `weierVerkoop`-vlag in `skuldJaar()`), en dan eis hulle die hele skuld op, nie net die deel bo die perk nie. Kom jy uit die skuld, is dit ’n skoon blad en mag jy weer kies. `verkoopBateUit()` keer ook nou dat dieselfde bate twee keer geld inbring as die balju dit reeds gevat het. Getoets: R2,8 m-strandhuis sonder inkomste — verkoop jy self, kry jy R2,94 m; weier jy, kom die balju die volgende jaar en die veiling bring R1,52 m in. Die netto waarde **daal** nou in albei gevalle, in plaas van R4,16 m → R5,21 m. |

### Die dakloosheid-modus (B19) in kort

**Hoe jy daar beland.** Al drie moet geld: jy kan jou blyplek nie betaal nie, jy het
niks verkoopbaars oor nie, en daar is geen familiehuis om na terug te gaan nie.
`blyplekJaar()` probeer eers kleiner trek (`kleinerBlyplek()` gee nou terug of daar nog
’n trappie oor was) en dan by familie gaan bly; is albei toe, roep dit `raakDakloos()`.

**Wat dit met jou doen.** Jou lewenskoste val heeltemal weg — dit is die ekonomiese
ontlaaiklep wat B18 oplos, want ’n mens sonder ’n dak kan nie ’n huishouding bekostig
nie, en daarom kan sy skuld ook nie eindeloos groei nie. Die prys: gesondheid –3 tot
–9 en geluk –6 tot –14 **elke jaar**, skool en studie toe soos in die tronk
(`skoolJaarVerloor()` word nou deur albei gebruik), jou diere SPCA toe, en werk kry word
baie swaar — een onderhoud per jaar in plaas van drie, en jou kans is net 20% van
normaal (55% as jy by ’n NGO aangemeld het).

**Wat jy kan doen** (`dakloosAksie()`, parallel met `tronkAksie()`): bedel by die
verkeerslig, los werk soek, by ’n skuiling slaap, by ’n NGO aanmeld (eenmalig: ’n ID en
’n adres) en familie om hulp vra. Misdaad bly ook beskikbaar — `renderMisdaad()` is
afgesonder sodat die gewone blad en die dakloos-paneel albei dit wys.

**Die vier paaie uit.** (1) Genoeg geld vir ’n deposito plus die eerste jaar se huur
(’n informele woning tel nie — dit staan op iemand anders se erf). (2) Familie wat jou
intrek. (3) Werk deur ’n skuiling (`skuilingWerk()`). (4) ’n Maatskaplike werker, met ’n
kans wat elke jaar groei — hy kry eers werk vir jou, want ’n dak sonder ’n inkomste hou
nie, en sit hy jou in, betaal die NGO die eerste jaar se huur.

**Die balans** (2 000 afgedwonge dakloos-lewens gemeet). ’n Speler wat die paneel
gebruik: mediaan **1 jaar** op straat, 90ste persentiel 2, maks 4. ’n Speler wat net
“+1 jaar” druk: mediaan **4 jaar**, 90ste persentiel 7, maks 11. Minder as **1%** sterf
daar, en **niemand** sit ná 40 jaar nog vas. In lukrake lewens raak 1–3% van die mense
wat nooit werk nie ooit dakloos — ’n speler met ’n werk of ’n familiehuis sien dit
nooit. Dit is dus moeilik maar uitkombaar, en nie ’n stadige dood nie.

---

## C. Skool en studie — SA-akkuraatheid (P1)

**Fase 3 (C1, C2, C4, C9) is ✅ KLAAR (23 Oktober 2026).** Die kolom **Gedoen** sê
kortliks wat verander het. Die ander items in hierdie afdeling wag nog.

Nuwe velde in `s.skool`: `vakke`, `wiskunde`, `uitslag`, `aps`, `ywer`, `herhaal`,
`geslaagJare`, `uitgeskop`, `jare` — almal met verstekwaardes in `vulNuweVelde()`,
sodat ou stoor-data steeds laai. 'n Ou lewe wat al matriek het maar net 'n
persentasie, kry 'n APS terug uit sy gemiddeld (`apsVanGemiddeld()`), en 'n ou
lewe wat nog in Graad 10–12 is, word by die eerste skooljaar na sy vakke gevra.
Die nuwe lyste en getalle staan bymekaar in `data.js` onder "SKOOL EN STUDIE".

| # | Verandering | Gedoen |
|---|---|---|
| C1 | **Geen vakkeuses.** In Graad 10 kies jy vakke, en dit bepaal alles daarna. Die belangrikste: **Wiskunde vs Wiskundige Geletterdheid** — sonder Wiskunde is Ingenieurswese, Rekeningkunde en Medies toe. Op die oomblik hang alles net van die `slim`-telling af. | ✅ `VAKKE` in `data.js` plus `vakkeKeuse()` in `lewe.js`. In Graad 10 kies jy sewe vakke: twee tale, Lewensoriëntering, **Wiskunde of Wiskundige Geletterdheid**, en drie keusevakke uit wat jou skool aanbied (`bied` per skool in `HOERSKOLE` — die Tegniese Hoërskool het die werkswinkelvakke, Die Akademie net die akademiese). Fisiese Wetenskappe, IT en Elektriese Tegnologie is net oop as jy Wiskunde geneem het. Elke vak het 'n `moeilik`-getal: Wiskunde kos jou 8 punte, Wiskundige Geletterdheid gee jou 9 — dit is die hele keuse in een getal. Getoets oor 200 lewens met slimheid 60–100 by die beste skool: **sonder Wiskunde was Ingenieurswese, Geneeskunde, Rekeningkunde en Rekenaarwetenskap nooit, by enige universiteit, oop nie.** 'n Speler met Wiskundige Geletterdheid en 'n APS van 42 word steeds geweier, met die rede: "Wiskunde op vlak 6 en Fisiese Wetenskappe op vlak 5 nodig." |
| C2 | **Matriek het nie 'n APS nie.** Die spel gebruik 'n persentasie-gemiddeld (`lewe.js:184`) en universiteite vra `punte>=70`. SA gebruik 'n **APS uit 42** plus vakspesifieke vereistes. | ✅ `berekenUitslag()` en `apsVlak()` in `lewe.js`. Jy kry nou 'n punt **per vak** (jou algemene vlak vir die jaar, plus die vak se `moeilik`, plus 'n bietjie toeval), elke vak kry 'n NSC-vlak van 1 tot 7 (80%+ = 7, 70% = 6, 60% = 5 …), en jou **APS is die som van jou ses beste vakke sonder Lewensoriëntering: 6 × 7 = 42**. `UNIES` vra nie meer `punte>=70` nie, maar `apsEkstra` bo-op die program se eie APS (UCT +4, Stellenbosch +2, UP 0, NWU −2, UVS −3, UNISA −5), en `STUDIES` het elkeen sy regte APS én sy vakvereistes. UNISA bied nie MBChB, BIng of Argitektuur aan nie. Die APS, die gemiddeld en die volledige vakuitslag wys op die Werk-blad se Opleiding-kaart en op die grafsteen. Verdeling oor 295 passiewe lewens: 10de persentiel 21, mediaan 33, 90ste 42. |
| C3 | **Geen drie slaagvlakke.** SA se NSC gee 'n *Hoër Sertifikaat*, *Diploma* of *Bachelor's pass*. Die spel het net "geslaag by 40%" of "gedruip". | *(Nie in Fase 3 nie, maar die hakie is gereed:* `s.skool.uitslag` *hou elke vak se persentasie en vlak, so die drie slaagvlakke kan bygevoeg word sonder om aan* `berekenUitslag()` *te raak.)* |
| C4 | **Elke graad is 3 jaar** (`aksies.js:363`). Werklik: BCom 3, BEng 4, LLB 4, MBChB 6, BEd 4. | ✅ `jare` by elke inskrywing in `STUDIES`: MBChB 6, BIng 4, LLB 4, BEd 4, BVerpl 4, BRek 3, BCom 3, BSc 3, BA 3. Elke program het ook sy `vol`-naam (BRek, MBChB, LLB …) wat in die keuselys wys. Die LLB en die MBChB is nou voorgraads, soos in SA — `kwalifikasies()` in `aksies.js` laat die Prokureur- en Geneesheer-poste langs die ou nagraadse pad **of** die nuwe voorgraadse pad kom, sodat niks breek. Die volle opruiming van die Amerikaanse "Mediese Skool"/"Regskool" bly C5. |
| C5 | **Medies en Regte is Amerikaans gemodelleer.** `NAGRAADS` het 'n "Mediese Skool" en "Regskool" ná 'n graad. In SA is MBChB en LLB voorgraads — direk ná matriek. |  |
| C6 | **Geen beroepsregistrasie of articles.** 'n CA(SA) moet SAICA-articles doen, 'n dokter moet internskap + community service doen, 'n ingenieur registreer by ECSA. Nou is 'n graad genoeg. |  |
| C7 | **Geen NSFAS.** Die enigste beurs is outomaties as `slim>=82` (`aksies.js:355`). NSFAS is die werklike roete vir die meerderheid; nodig: inkomste-toets, aansoek, en die kans dat die geld laat betaal word. |  |
| C8 | **Geen studentelening of studenteskuld.** |  |
| C9 | **Jy kan nie 'n jaar druip of uitgegooi word nie.** Universiteit is outomaties sukses solank jy die klasgeld betaal. Nodig: jaarlikse slaagkans op grond van `slim` + hoe hard jy studeer, en "academic exclusion". | ✅ `slaagKans()`, `studieJaar()`, `druipJaar()` en `uitgesluit()` in `lewe.js`. Elke jaar is daar 'n slaagkans: 64% as basis, plus 0,8 per punt slimheid bo 50, **+16 as jy daardie jaar "Studeer harder" gedoen het**, −8 in jou eerste jaar, −7 as jy deeltyds werk, −8 as jou gesondheid onder 40 is, en −1,2 vir elke APS-punt wat die graad bo 28 vra (BIng −6, MBChB −12). Druip jy, herhaal die jaar en betaal jy weer klasgeld; twee druipjare en jou beurs is weg; **drie en jy word akademies uitgesluit** (studies weg, aansien weg, 20 geluk weg). Twee uitsluitings en geen universiteit neem jou weer. Die kans wys op die Opleiding-kaart, so die speler sien wat studeer werd is. Oor 400 studente per geval: BCom met slimheid 50 wat nooit studeer 88% gegradueer / 12% uitgesluit; dieselfde student wat elke jaar studeer 99% / 1%; BEd met slimheid 40 wat nooit studeer 71% / 29%; MBChB met slimheid 90 wat studeer 100% in gemiddeld 6,2 jaar. |
| C10 | **Geen koshuis, geen res-lewe, geen pendel.** Klasgeld is die enigste koste; in die werklikheid is verblyf dikwels meer as die klasgeld. |  |
| C11 | **Geen TVET-kolleges, leerlingskappe of ambagte.** Daar is 'n Tegniese Hoërskool in die spel maar geen pad na 'n ambagsertifikaat (elektrisiën, loodgieter, sweiser) nie — 'n groot SA-loopbaanroete wat heeltemal ontbreek. |  |
| C12 | **Geen onderwysersopleiding-, polisie- of weermag-opleidingsfase.** Jy word sommer aangestel. |  |
| C13 | **Geen skoolgeld vir jou eie kinders**, en geen keuse van skool vir hulle. |  |
| C14 | **Hoërskool het geen sport, kultuur, prefek of leierskap nie** — net `klasGebeurtenis()` met vier uitkomste (`lewe.js:272`). Nodig: eerste span, debat, orkes, RSR, matriekafskeid as 'n keuse (nie net 'n gebeurtenis nie). |  |
| C15 | **Die jaar ná Graad 12 is leeg.** Op 18 kry jy net jou uitslag en doen niks. Nodig: 'n gap-jaar-keuse (werk, reis, studeer, weermag). |  |

---

## D. Werk en loopbaan (P1)

**Fase 3 (D3, D6) is ✅ KLAAR (23 Oktober 2026).** Nuwe velde in `s`: `deeltyds` en
`deeltydsJare`, plus `plafon` op `s.beroep` — almal met verstekwaardes in
`vulNuweVelde()`. Is 'n ou lewe se salaris al bo sy pos se plafon, word dit
by die volgende jaar afgesny en die spel sê dit in die log.

| # | Verandering | Gedoen |
|---|---|---|
| D1 | **Net 27 beroepe, en geen van hulle het 'n loopbaanpad nie.** `VLAK_NAAM` gee vier bevorderingsvlakke binne dieselfde pos, maar jy kan nooit van veld verander of oorgaan na bestuur nie. |  |
| D2 | **Geen selfstandige werk.** Geen eie besigheid, geen vryskut, geen side hustle — niks waar jy self 'n inkomste bou. (Vir jou eie website-besigheid sou dit die interessantste deel van die spel wees.) |  |
| D3 | **Geen deeltydse of vakansiewerk as stelsel.** Daar is net een lukrake gebeurtenis (`gebeure.js:41`). Nodig: 'n aparte lys deeltydse werke (pakhulp, kelner, nagskof) met min ure, lae betaling, 'n geluk-/slim-koste, en wat toelaatbaar is terwyl jy op skool is. | ✅ `DEELTYDS` in `data.js` plus `deeltydsJaar()` in `lewe.js` en `neemDeeltyds()`/`losDeeltyds()` in `aksies.js`. Ses werke met min ure en lae betaling: pakhulp by die supermark (R24 000/jaar, 16+), Desember-vakansiewerk (R12 000), tutor (R26 000, slimheid 62+, en dit **gee** jou slim), barista (R34 000), kelner oor naweke (R44 000, die wenke wissel 80–135%), nagskof by die vulstasie (R58 000, maar −5 geluk, −4 slim en −5 gesondheid per jaar). Jy mag dit doen terwyl jy op skool **of** op universiteit is; dit val weg sodra jy voltyds begin werk, in die tronk beland of op straat is, en net een op 'n keer. Dit bly onder SARS se drempel, dus word dit nie belas nie, maar dit stop jou sakgeld en dit kos jou 7 persentpunte van jou kans om 'n akademiese jaar te slaag (C9) — die werklike afruil. Die ou los "vakansiewerk by 'n kafee"-gebeurtenis geld net nog as jy nie 'n deeltydse werk het nie. |
| D4 | **Geen werkloosheid as toestand.** Jy kry drie onderhoude per jaar en dis dit; geen UIF, geen "hoe lank laas gewerk"-penalty, geen ekonomiese afswaai wat werk skaars maak. |  |
| D5 | **Geen afleggings (retrenchment).** Jy word net afgedank as jou prestasie onder 20 val (`lewe.js:299`). Geen maatskappy wat toemaak, geen herstrukturering. |  |
| D6 | **Salaris groei onbeperk** teen 4,5% per jaar saamgestel. 'n UH wat op 35 begin en 95 word, verdien uiteindelik ± R27 miljoen per jaar — in 'n spel sonder inflasie. Nodig: 'n plafon per pos. | ✅ `plafon` by elke pos in `BEROEPE` plus `pasPlafonToe()` in `lewe.js`. Elke pos het nou 'n boonste punt in vandag se rande: Petroljoggie R110 000, Onderwyser R820 000, Siviele Ingenieur R1,8 m, Sagteware-ontwikkelaar R2,2 m, Prokureur R3,5 m, Chirurg R6 m, Uitvoerende Hoof **R12 m in plaas van R27 m**. Die 4,5%-groei en die bevorderings werk steeds, maar hulle word by die plafon afgesny, en dit geld ook vir "Vra verhoging" (dan sê jou baas jy is op die boonste punt van die skaal). Die Werk-blad wys die plafon, en die spel log dit een keer wanneer jy dit haal. Getoets: 60 jaar in elke een van die 28 poste, 40 keer elk — **0 oortredings van die plafon**. Omdat die spel geen inflasie het (B4 is uitgelaat), bly hierdie getalle vir altyd in 2026-rande sinvol. |
| D7 | **Geen voordele:** geen mediese fonds, geen pensioenbydrae, geen bonus, geen aandele-opsies, geen maatskappymotor. |  |
| D8 | **Geen werksverhoudinge behalwe 'n baas en 2–4 kollegas.** Geen bevordering ten koste van 'n kollega, geen mentor, geen kantoorpolitiek, geen boelie-baas, geen teistering as 'n keuse-gebeurtenis. |  |
| D9 | **Gesondheid beïnvloed nie werk nie.** Jy kan met `gesondheid: 5` 'n chirurg bly. Geen siekteverlof, geen burnout, geen ongeskiktheid (disability). |  |
| D10 | **Geen werk in die buiteland of emigrasie.** `s.dorp` word by geboorte gestel en verander nooit — 'n baie groot SA-tema wat ontbreek. |  |
| D11 | **Geen aftree-oorgang.** Pensioen is 'n enkele knoppie op 60. Geen vroeë aftrede, geen deeltydse aftrede, geen besluit oor jou pensioenfonds (lewensannuïteit vs living annuity). |  |

---

## E. Gesin en verhoudings (P1)

**Fase 5 (E1, E4, E7, E12) is ✅ KLAAR (23 Oktober 2026).** Die kolom **Gedoen** sê
kortliks wat verander het. Die ander items in hierdie afdeling wag nog.

Nuwe velde in `s`: `voorbehoeding`, `swangerskappe` en `kleinkinders`; nuwe velde op
'n mens in `s.verhoudings`: `kant` (op 'n ouma/oupa), `kl` (op 'n kind of kleinkind —
sy hele eie lewe) en `werk`/`afgetree`/`tuis` (op 'n eggenoot). Almal met
verstekwaardes in `vulNuweVelde()`, sodat 'n ou lewe in localStorage steeds laai —
`kindInhaal()` bou boonop 'n ou kind se lewe agteruit op uit sy ouderdom, sodat 'n
seun van 34 nie skielik weer in Graad 1 begin nie.

| # | Verandering | Gedoen |
|---|---|---|
| E1 | **Geen oupas en oumas.** Jy word gebore met net 'n ma, pa en broers/susters (`lewe.js:35`). Grootouers is 'n groot deel van 'n kinderlewe. | ✅ `maakGrootouers()` gee jou tot vier grootouers by geboorte, elk 20–38 jaar ouer as sy eie kind, met `kant` ('ma se kant' / 'pa se kant'). Sowat een uit vyf is al voor jou geboorte dood (hulle staan onder “In geheue”). `grootouerJaar()` laat hulle elke jaar iets doen uit `GROOTOUER_DADE` — geld in die hand stop, leer brood bak, jou plaas toe vat — en van 78 af kan húlle jóú hulp nodig kry. Sterf een, erf jy uit sy boedel. Hulle staan in 'n eie “Grootouers”-groep op die Mense-blad. |
| E2 | **Geen uitgebreide familie:** geen ooms, tannies of niggies (net een "oom se testament"-gebeurtenis). | — |
| E3 | **Jou ouers se lewe staan stil.** Hulle skei nooit, trou nooit weer, verloor nooit 'n werk nie, word nooit siek nie. Geen stiefouers, geen stiefbroers. | — |
| E4 | **Geen baba sonder huwelik.** `raak(v,'baba')` is net vir `eggenoot` (`aksies.js:550`). Geen onverwagte swangerskap, geen tienerswangerskap, geen voorbehoeding as 'n keuse. Vir 'n lewe-simulasie is dit 'n groot gaping. | ✅ `raak(v,'baba')` werk nou ook vir 'n `lief`-verhouding, en `onbeplanJaar()` gee elke jaar in 'n verhouding 'n kans op 'n onbeplande swangerskap — hoër vir 'n tiener, laer vir 'n egpaar. `VOORBEHOEDING` is 'n werklike keuse op die Gesond-blad (niks / kondome / die pil / 'n implant / sterilisasie) met 'n prys per jaar en 'n effektiwiteit van 0% tot 99,9%. 'n Tienerswangerskap kos jou geluk, jou ouers se band, en dikwels 'n skooljaar (`skoolJaarVerloor`). Die kraamkoste hang aan F2: staatshospitaal R4 500, privaat R38 000, of net die gaping as jy 'n fonds het. |
| E5 | **Swangerskap is oombliklik** — geen 9 maande, geen tweeling, geen miskraam, geen komplikasies, geen kraamkoste. | — |
| E6 | **Geen aanneming, IVF of surrogaatskap.** Ook: geslag word heeltemal geïgnoreer, so twee mans kan 'n biologiese baba hê. | — |
| E7 | **Kinders doen niks.** Hulle verouder, "verlaat die huis" op 18 en bly dan staties — geen skool, geen graad, geen werk, geen troue, geen kleinkinders (al verwys een gebeurtenis na kleinkinders). | ✅ Elke kind kry `v.kl` — sy eie slimheid, skool, matriek-APS, studie, beroep, salaris, maat, kinders, gewoontes, siektes en 'n eie lewensverhaal. `kindJaar()` speel dit jaar vir jaar: Graad 1 op 6, hoërskool op 13, matriek met 'n APS uit 42 op 18 (jou band met hom en “Help met die huiswerk” maak dit beter), dan 'n vraag aan jou of jy sy graad betaal, dan werk, 'n eie maat, en jou kleinkinders — wat self as mense in `s.verhoudings` staan en hul eie kinderjare deurloop. Op 62 tree hy af. Jy lees alles onder “Lees sy lewensverhaal”, en die grafsteen sê wat van elke kind geword het. Die struktuur is doelbewus ruim vir Fase 6 se generasiespel. |
| E8 | **Geen ouer-kind-interaksie as stelsel:** geen huiswerk help, geen dissipline, geen keuse oor jou kind se skool. | — |
| E9 | ✅ **KLAAR (28 Okt 2026 — sien O32.)** `liefOuderdomPas()` blokkeer dit hard: onder 18 moet albei kinders wees en die gaping hoogstens twee jaar; `vreemdeling()` gebruik dieselfde reël. ~~`soekLief()` laat 'n verskil van tot 12 jaar toe en kollegas is 22–58 oud — so 'n 16-jarige met 'n werk kan 'n 28-jarige kollega uitvra.~~ | `aksies.js` |
| E10 | **Geen ontrouheid, geen saamblyery, geen verlowing.** Troue is een knoppie teen band ≥ 70. | — |
| E11 | **Geen huweliksgoederebedeling.** In SA maak "binne of buite gemeenskap van goed" (met of sonder accrual) die hele verskil by 'n egskeiding — en die spel verdeel net kontant (sien A10). | — |
| E12 | **Jou eggenoot verdien niks.** Een huishouding = een inkomste, plus R26 000 ekstra koste. Nodig: 'n eggenoot met 'n beroep, inkomste en loopbaan. | ✅ `maatBeroepKies()` gee jou eggenoot by die troue 'n pos uit `BEROEPE` wat by haar opleiding pas (wat weer aan joune hang — mense trou met mense soos hulself), met 72–118% van daardie pos se salaris. `maatWerkJaar()` gee verhogings tot by die pos se plafon, kan haar afdank, kan haar weer laat werk kry, en laat haar op 62 aftree. `inkomsteJaar()` belas haar salaris apart (soos SARS doen) en gooi dit by die huishouding se kontant; die nuwe `huishoudingBruto()` laat die bank, die krediteure en die huurmark na albei inkomste kyk. |
| E13 | **Vriende is passief.** Hulle vra jou nooit iets nie, kom nooit in die moeilikheid nie, vra nooit geld nie, trou nie, sterf net. Al die inisiatief is joune. | — |
| E14 | **Geen sosiale netwerk-effek:** geen groepe, geen "jou vriend stel jou aan iemand voor", geen vriende wat mekaar ken. | — |

---

## F. Gesondheid en liggaam (P1)

**Fase 5 (F1, F2, F4, F9) is ✅ KLAAR (23 Oktober 2026).** Hierdie vier is doelbewus
saam gedoen, want 'n siekte sonder koste en sonder 'n doodsverband beteken niks.

Nuwe velde in `s`: `siektes`, `mediesefonds`, `fondsJare`, `siekJare`, `gewoontes`,
`gewoonteJare`, `gewoonteLaas`, `opgehou`, `rehabs`, `lisensieWeg`, `dronkbestuur`,
`fiks` en `gene` — almal met verstekwaardes in `vulNuweVelde()`. Die nuwe data staan
in `data.js` onder "GESIN EN GESONDHEID (Fase 5)": `TOESTANDE`, `MEDIESE_FONDSE`,
`GEWOONTES`, `GENE` en hul getalle.

| # | Verandering | Gedoen |
|---|---|---|
| F1 | **Geen siektes.** `gesondheid` is een getal wat net dryf. Geen griep vs kanker vs diabetes, geen chroniese toestand wat jaarliks geld kos, geen behandelingskeuse, geen herstel. | ✅ `TOESTANDE` in `data.js` hou sewentien toestande: akuut (griep, maagvirus, 'n gebreekte been, blindedermontsteking, longontsteking, TB, 'n rugbesering) en chronies (asma, hoë bloeddruk, diabetes, artritis, hartsiekte, HIV, kanker, lewersiekte, chroniese longsiekte, nagevolge van 'n beroerte). `siekteJaar()` gee elke jaar 'n kans op iets nuuts — geweeg volgens jou ouderdom, jou gesondheid, jou gewoontes en die siekte wat in jou familie loop. 'n Akute toestand kom en gaan (en jy kry die meeste van jou gesondheid terug); 'n chroniese een bly, kos jaarliks geld, en kan 'n tweede toestand oopmaak as jy dit los. Alles staan op die nuwe **Gesond**-blad. |
| F2 | **Geen mediese fonds of hospitaalkoste.** 'n Doktersbesoek kos R850 en 'n hartaanval kos niks. Nodig: mediese fonds-premie vs staatshospitaal vs privaat rekening. | ✅ Drie paaie by elke diagnose: jou **mediese fonds** (`MEDIESE_FONDSE` — hospitaalplan R1 450 p.m. tot 'n omvattende plan teen R6 800, plus 80% vir 'n maat en 40% per kind, en 35% meer as jy al 'n chroniese toestand het), die **staatshospitaal** (gratis, maar 46% kans op 'n waglys en 'n uitkoms wat net 58% so goed is), of **privaat uit jou eie sak** (die volle rekening — kanker is R280 000 per jaar). `fondsJaar()` trek die premie elke jaar; kan jy dit nie meer nie, verval die plan en elke behandeling wat daaraan hang word 'n privaat rekening. 'n Rekening wat jy nie kan betaal nie, loop deur `betaalWatJyKan()` — dus deur Fase 2 se skuld, die balju en uiteindelik die straat. |
| F3 | **Geen geestesgesondheid.** Geen depressie, geen angs, geen terapie — al kan `geluk` tot 0 val sonder enige gevolg behalwe die log. | — |
| F4 | **Geen alkohol, sigarette of dwelms.** 'n Groot deel van 'n egte lewe-simulasie, en in SA met 'n drinkouderdom van 18, dronkbestuur, en verslawing as 'n langtermyn-spiraal. | ✅ `GEWOONTES` gee drank, sigarette en dwelms elk vier vlakke (nie / soms / gereeld / verslaaf), elk met sy eie koste, gesondheidskoste, werkskade en skade aan jou mense. Die spiraal is eg: wie dit elke jaar opsoek, skuif op; wie dit twee jaar laat lê, sak op die laer vlakke weer terug — maar van vlak 3 af laat dit jou nie los sonder `wysOphou()` (self, die kliniek, of R46 000 se rehabilitasie, met 'n laer kans elke keer wat jy al daar was) nie. Die drinkouderdom is 18, en jonger beteken jou ouers kan jou vang. Drink jy en het jy 'n motor, vra die spel hoe jy huis toe kom: ry jy self, is daar 'n boete, 'n ongeluk, jou motor wat die versekering nie dek nie, 'n rekord, en 'n lisensie wat 1–4 jaar weg is (`magBestuur()` uit Fase 1 weier dit solank). |
| F5 | **Geen dieet, gewig of fiksheid** behalwe `gim` en `draf` wat elk een keer per jaar +gesondheid gee. | — |
| F6 | **Geen besering of ongeskiktheid.** `ONGELUKKE` is net maniere om dood te gaan; jy kan nie 'n been breek of in 'n rolstoel beland nie. | — |
| F7 | **Geen babasterftes of kindersiektes**, geen inentings. | — |
| F8 | **Geen tandarts-gevolge.** Gaan nooit tandarts toe nie en niks gebeur. | — |
| F9 | **Dood is te eenvoudig.** `doodKontrole()` gebruik 'n ouderdomskromme plus 0,09% kans op 'n ongeluk. Geen verband met leefstyl (rook, gewig, stres, dwelms), geen gesondheidsorg-kwaliteit, geen genetika/familiegeskiedenis. | ✅ `doodKontrole()` gebruik nou 'n Gompertz-kromme (die kans verdubbel elke agt jaar ná twintig) maal ses dinge: jou **gene** (`GENE`, by geboorte gerol — van 'n familie wat 90 word tot hartsiekte of kanker in die familie), jou **gesondheid**, jou **siektes** (behandel tel net 28% van hul erns; die staat se uitkoms 1,6 keer soveel), **rook/drank/dwelms**, of jy **mediese sorg kan bekostig**, en waar jy is (tronk, straat). Ongelukke en geweld is 'n aparte kans wat veral 'n jong man tref. Twee ander dinge is reggemaak: `ouderdomDrywing()` se verval is sagter, en die nuwe `natuurlikeVlak()`/`herstelJaar()` gee die liggaam 'n vlak waarheen dit herstel in plaas daarvan dat gesondheid net een rigting ken — dít was die eintlike rede waarom elke speler kort ná 70 op nul uitgekom het. **Gemeet oor 300 lewens: nou 2 tot 89, mediaan 62; 'n speler wat gym toe gaan, 'n fonds het en sy siektes laat behandel haal mediaan 75 met 20% bo 85, en 'n roker-drinker haal mediaan 41.** |

---

## G. Misdaad en reg (P1)

| # | Verandering |
|---|---|
| G1 | ✅ **KLAAR (24 Okt 2026, Fase 8.)** `jeugHof()` in `misdaad.js`: onder 14 altyd diversie; tot 17 diversie vir ’n eerste of ligte oortreding, anders ’n jeugsorgsentrum (1–4 jaar, nooit verby 21 nie) waar jy skool gaan. Diversie kom nie op jou rekord nie. **Geen jeugreg.** 'n 12-jarige kry 'n volle grootmens-vonnis. In SA is 12 reg as minimum ouderdom van kriminele aanspreeklikheid, maar 'n kind gaan na 'n child and youth care centre en kry diversion, nie 8–20 jaar in "die tronk" nie. |
| G2 | ✅ **KLAAR (24 Okt 2026, Fase 8.)** `hofVonnis()`: die saak word teruggetrek, of ’n boete, gemeenskapsdiens, ’n opgeskorte vonnis of tronkstraf, na gelang van die misdaad se erns (1–5), jou rekord, ’n wapen, ’n jaagtog en jou pleit. ’n Ernstige misdaad het ’n vloer (’n bankroof is altyd tronk). **Elke betrapping is tronk.** Geen waarskuwing, geen boete, geen gemeenskapsdiens, geen opgeskorte vonnis. 'n Kind wat 'n sak lekkers steel, kry 1–2 jaar. |
| G3 | ✅ **KLAAR (24 Okt 2026, Fase 8.)** Arrestasie → prokureur (Regshulp gratis, ’n privaat prokureur of ’n senior advokaat teen R15 000 of R70 000 per erns-punt) → borgtog (of maande in aanhouding, wat jou werk kan kos) → pleit skuldig (pleitooreenkoms, ligter) of onskuldig (3–45% kans om vrygespreek te word, anders swaarder). **Geen hofproses.** Geen arrestasie, geen borgtog, geen prokureur (wat jy kan bekostig of nie), geen pleitooreenkoms, geen onskuldig bevind word. |
| G4 | ✅ **DEELS (24 Okt 2026, Fase 8.)** Parool: ná die helfte van ’n vonnis van 2+ jaar kom jy elke jaar met 40% kans vry, en die res word ’n paroolperiode wat soos ’n opgeskorte vonnis werk. ’n Vonnis wat met ’n ontsnappoging of ’n deursoeking verleng is, of wat ’n gevange vlugteling uitsit, kry nie parool nie (Fase 9). Goeie gedrag tel nog nie. **Geen parool, geen goeie gedrag, geen vroeë vrylating.** `tronkJaar()` tel net op. |
| G5 | ✅ **KLAAR (25 Okt 2026, Fase 9.)** Sien afdeling M: ’n ontsnapping wat jy oor jare beplan, ’n stealth-mini-spel, en ’n lewe op die vlug met ’n jaarlikse soektog, ’n vals ID, trek, oorgee en ’n pad uit. **Ontsnapping doen niks.** Slaag jy, is jy 'n "vlugteling" — en dan gebeur daar nooit weer iets nie. Geen jagtog, geen hervatting, geen lewe op die vlug. |
| G6 | **Jy word nooit 'n slagoffer nie.** Jy kan 'n huis beroof maar nooit beroof word nie. Vir SA-realisme: huisinbraak, hijacking, selfoon gesteel, bedrog/phishing, smash-and-grab. |
| G7 | **Geen verkeersoortredings.** Geen spoedboete, geen dronkbestuur, geen AARTO-demerits, geen motorongeluk waarvoor jy aanspreeklik is. |
| G8 | ✅ **KLAAR (24 Okt 2026, Fase 8.)** “Bedrog by die werk” (vereis ’n werk: SARS, fakture, verduistering, tender) met ’n vertraagde oudit via die vlag `oudit`, “Kuberbedrog” (vereis kodeer 2–4: phishing, kaartbedrog, SIM-swop), en ’n polisieman omkoop. **Geen white-collar misdaad.** Geen belastingontduiking as 'n keuse (net een SARS-gebeurtenis), geen bedrog, geen omkopery, geen cybercrime. |
| G9 | **Geen rekord-skoonmaak.** `skoon:true`-beroepe is vir ewig toe. In SA kan 'n rekord ná 10 jaar uitgewis word. |
| G10 | **Geen burgerlike sake.** Geen dagvaarding, geen skadevergoeding, geen dispuut met 'n huurder of werkgewer. |

---

## H. Nuwe stelsels wat die spel "voller" sal maak (P2)

**Fase 6 (H1, H3, H4, H13, H14) is ✅ KLAAR (23 Oktober 2026).** Die kolom **Gedoen**
sê kortliks wat verander het. Die ander items in hierdie afdeling wag nog.

Nuwe velde in `s`: `vaardighede`, `besigheid`, `besighedeGehad`, `generasie` en
`familielyn` — almal met verstekwaardes in `vulNuweVelde()`, sodat ou stoor-data in
localStorage steeds laai. Die nuwe lyste staan in `data.js` onder "H3 —
VAARDIGHEDE", "H4 — JOU EIE BESIGHEID" en "H1 — DIE BOEDEL".

| # | Nuwe inhoud | Gedoen |
|---|---|---|
| H1 | **Generasiespel.** Gaan voort as jou kind wanneer jy sterf, met jou bates as erfenis. Dit is die enkele grootste ding wat 'n lewe-simulasie herspeelbaar maak. | ✅ By die grafsteen staan nou ’n groen knoppie vir elke lewende kind: sy ouderdom, waar hy in sy lewe is, en wat hy sou erf. `gaanVoortAsKind()` maak daardie kind die nuwe `s`: sy eie statte, sy skoolloopbaan en APS, sy werk, sy maat en sy `kl.geskiedenis` as sy lewensverhaal. Die familie skuif een plek op — jou eggenoot word sy ma of pa, jou ander kinders word sy broers en susters, **jou kleinkinders word sy kinders** (met hul eie `kl`), jou ouers word sy oumas en oupas, en jou broers en susters word sy ooms en tantes (`neef`/`niggie`/`oom`/`tante` is nuwe tipes in `rol()`). Die boedel word verdeel ná die bestaande verband- en skuldreëls: ’n lewende eggenoot kry die helfte, die res gaan gelyk tussen die kinders, SARS vat 20% boedelbelasting bo R3,5 m, en is ’n kind se deel groot genoeg (en die verband afbetaal), erf hy die huis self. ’n Kind van 16+ erf ook die besigheid. `s.generasie` tel die geslagte en `s.familielyn` hou elkeen se naam, ouderdom, beroep en nalatenskap by — dit wys op die grafsteen en in ’n "Familielyn"-paneel bo-aan die Mense-blad. Getoets tot agt geslagte in een lyn. |
| H2 | **Prestasies / bucket list** — doelwitte wat jy oor 'n leeftyd afmerk, en "ribbons" op die grafsteen (bv. "Miljoenêr voor 30", "Nooit 'n misdaad gepleeg nie"). | |
| H3 | **Vaardighede en stokperdjies** as 'n aparte stelsel: klavier, karate, kodeer, kook, visvang — elkeen met vlakke wat oor jare opbou en nuwe geleenthede oopmaak. | ✅ 14 vaardighede in `VAARDIGHEDE` (klavier, kitaar, fotografie, skryf, kodeer, aandele, karate, sport, kook, braai, motorwerk, houtwerk, visvang, tuinmaak), elk met vyf vlakke en ’n eie naam per vlak ("speel by troues", "bou ’n werkende webwerf"). Jy oefen twee per jaar onder Aktiwiteite → "Oefen ’n vaardigheid"; dit kos geld (’n kind kan sy ouers vra) en gee punte wat met jou slimheid skaal — ’n grootmens vat ± 17 jaar tot vlak 5, ’n kind ± 12. Elke vlak maak iets oop: **geld** (`vaardigInkomsteJaar()`, belas teen jou gewone koers), **laer lewenskoste** (`vaardigKosSny()` — kook, tuinmaak, visvang), **’n beter opbrengs op die JSE** (`vaardigBeleggingBonus()` — aandele en waardasie), **’n beter werksaansoek** (`vaardigWerkBonus()`), **’n besigheid wat dit kan dra** (H4), **’n beter gas by ’n kuier**, en ’n hele klomp gebeure wat net oopgaan as jy die vlak het. ’n Vaardigheid wat jy agt jaar laat lê, roes (`vaardigJaar()`). Dit staan as ’n paneel onder Aktiwiteite en op die grafsteen. |
| H4 | **Eie besigheid:** begin iets, kry kliënte, huur mense, groei of gaan bankrot. (Jou website-besigheid as 'n spel-opsie.) | ✅ 11 soorte in `BESIGHEDE`, van ’n straatstalletjie van R9 000 tot ’n kleinboerdery van R850 000 — en ja, **"Webwerwe vir klein besighede" (R50–R100 per maand per klant)** is een daarvan. Dit loop op kliënte: `besigheidJaar()` laat kliënte bykom (bemarking, jou vaardigheid, jou slimheid) en wegval (`BESIG_VERLOOP`), beperk deur `besigheidKapasiteit()` = jyself + elke werker + toerusting. Omset − vaste koste − lone − bemarking = wins. **Dit haak in die bestaande finansiesketting in, nie langs dit nie:** die wins kom by `brutoInkomste()` en word saam met jou salaris belas, ’n verlies gaan deur `betaalWatJyKan()` en dus deur B6 se skuld, die balju en uiteindelik die straat, en `besigheidWaarde()` tel in `netoWaarde()`. Drie verliesjare agtermekaar is bankrot (`besigheidBankrot()` — krediteure, geluk, aansien, en ’n vlag wat later ’n tweede kans oopmaak). Jy kan bemark, mense huur en laat gaan (hulle het name), toerusting koop, verkoop (2,6 × die wins) of toemaak. Die tronk maak dit toe; op straat oorleef net die stalletjie. Het jy ook ’n voltydse werk, groei dit 45% stadiger. Gemeet oor 40 lopies van 20 jaar elk: webwerwe 0% bankrot, boerdery 40%. |
| H5 | **Sport- en kunsloopbane:** gekies op skool, geskeduleer, met 'n kort loopbaan en 'n groot inkomste — en wat jy doen ná 32. | |
| H6 | **Bekendheid / sosiale media:** volgelinge, inkomste, kanselleer-risiko. | |
| H7 | **Verhuising en emigrasie:** tussen SA-dorpe (ander kostes, ander werk, ander skole) en na die buiteland (visum, salaris in 'n ander geldeenheid, familie wat agterbly). | |
| H8 | **Eiendom as belegging:** koop om te verhuur, huurinkomste, slegte huurders, onderhoud, bond op 'n tweede eiendom. | |
| H9 | **Motor as stelsel:** leerlinglisensie → rylisensie (met 'n toets wat jy kan druip) → versekering → diens → ongelukke → verkoop. | |
| H10 | **Geloof en gemeenskap:** kerk, vrywilligerswerk, liefdadigheid (met 'n geluk- en aansien-effek). | |
| H11 | **Politiek:** stem, by 'n party aansluit, raadslid → LP → minister. | |
| H12 | **Kalender en geskiedenis.** Gee die spel 'n beginjaar en laat werklike SA-gebeurtenisse inkom volgens die jaar (beurtkrag, rand-insinking, Covid, 'n boom-jaar vir werk). | |
| H13 | **Meer gebeure.** Daar is net ± 36 lukrake gebeure en 10 keuse-gebeure vir 'n lewe van 80+ jaar — jy sien dieselfde goed herhaal. Mikpunt: 150+, en elkeen moet ten minste een keuse hê. | ✅ Van 46 na **197 gebeure, waarvan 53 ’n keuse het** (was 10). Hulle is per lewensfase en per stelsel gegroepeer: kleintyd, laerskool, hoërskool, jong grootmens, middeljare, oud — plus blokke wat by die nuwe stelsels inhaak: siektes en die mediese fonds, drank/rook/dwelms, die straat, jou besigheid, jou vaardighede, jou kinders en kleinkinders. ’n Gebeurtenis se `as:` lees nou gerus `chronies()`, `gewoonteVlak()`, `s.dakloos`, `s.besigheid`, `vaardigVlak()` of `kindersTuis()`, sodat jy dinge sien wat by jóú lewe pas. |
| H14 | **Gebeure wat onthou.** Niks wat jy kies, verander ooit 'n latere gebeurtenis nie. Nodig: vlae wat later gebeure oopsluit (jy het die boelie geslaan → hy kom op 30 weer voor). | ✅ ’n Vlagstelsel bo-op die bestaande `s.vlagge`: `stelVlag(naam, data)` hou die jaar, hoeveel keer, en wat ook al onthou moet word (gewoonlik ’n naam); `vlagRyp(naam, jare)` sê of genoeg jare verby is en of die verhaal nog oop is; `sluitVlag()` maak dit toe. `vlag()` hanteer ook die ou vlae wat blote getalle was, sodat ou stoor-data werk. Sowat 25 kettings loop nou: die boelie wat jy op tien geslaan het kom op dertig weer voor, die vriend wat jou R20 000 geskuld het daag op (of loop die ander kant toe), die borgskap wat jy geteken het kom as ’n dagvaarding terug, die kind by wie jy in Graad 5 gaan sit het beveel jou by ’n werk aan, die piramideskema-ou is terug met kripto, die eksamenvraestel kom by die werk op, die buurman se boom, die visum, die begrafnislening. Oor 120 lewens gemeet: 24 van 35 boelie-keuses, 25 van 27 borgskappe en 46 van 97 skemas het werklik later teruggekom. |
| H15 | **Meer stats:** Dissipline, Karakter/Reputasie, Stres, Energie — sodat keuses wisselwerking het eerder as net vier stawe. | |
| H16 | **Troeteldiere uitgebrei:** teel, dieretarts-noodgevalle, 'n dier wat wegraak, meer soorte. | |
| H17 | **Volledige SA-detail wat flavour gee:** taxi's, braai, Woolworths vs Shoprite, rugby, 'n plaas, matriekafskeid, kus-vakansie — party is daar, maar dit kan baie dieper. | |

---

## I. Klein detail en vloei (P2)

| # | Verandering |
|---|---|
| I1 | ✅ **KLAAR (28 Okt 2026 — sien O10.)** `klasRusiePlek()` kies die plek nou volgens geslag en skool. ~~`klasGebeurtenis()` sê altyd "op die rugbyveld gestry", ongeag geslag of skool.~~ |
| I2 | Die Graad 8-jaar (ouderdom 13) kry geen "jy is in Graad 8"-log nie — net die skoolkeuse. |
| I3 | Privaatskole het geen nadeel nie: `kanBekostig()` keer dit af, maar jou ouers betaal nooit werklik die R44 000–R98 000 nie, so dit is 'n gratis stat-bonus. |
| I4 | 'n Bate kan in dieselfde jaar gekoop en teen volle waarde verkoop word, sonder kommissie of koste. |
| I5 | ✅ **KLAAR (28 Okt 2026 — sien O25.)** Die teks verduidelik nou die afslag: "80% meer — julle deel ’n kamer". |
| I6 | Jy kan nie jou log/lewensverhaal stoor, uitvoer of met iemand deel nie. |
| I7 | Daar is net 6 vorige lewens in `GESKIEDENIS`, en geen statistieke oor al jou lewens heen nie. |
| I8 | Geen klank, geen animasie by die jaar-oorgang, geen "jy is dood"-oorgang behalwe die modaal. |
| I9 | Geen sleutelbord-kortpad vir "+1 jaar" (spasiebalk) — dit sou die spel baie vinniger laat voel. |
| I10 | Geen manier om 'n lewe doelbewus te eindig/herbegin sonder om te sterf nie. |
| I11 | Die spel waarsku jou nooit voor 'n onomkeerbare keuse nie (bv. skool los, bedank, ontsnap). |
| I12 | `wysModaal()` sit `titel` en `teks` ongefiltreerd in die HTML; dis veilig met interne teks, maar nie as jy later gebruikersteks daar deurgee nie. |
| I13 | ✅ **KLAAR (23 Okt 2026, saam met Fase 6.)** Die gebeurtenis dra nou die vlag `erfOom` en sy `as:` keer dat dit ’n tweede keer vuur. **Die oom se testament kon oor en oor vuur (nuut, 22 Okt 2026).** Die gebeurtenis is `min:25, max:120` sonder 'n eenmalig-vlag, en elke keer gee dit R40 000–R400 000 kontant of 'n plot van R300 000–R1,4 m. Oor 'n lang lewe kan dit 'n paar keer tref en jou netto waarde met miljoene opblaas sonder dat jy iets gedoen het. Nodig: 'n vlag sodat dit hoogstens een of twee keer gebeur. | `gebeure.js` |

---

## K. Fase 7 — mini-spele, beleggings en hosting — ✅ KLAAR (24 Oktober 2026)

Nuwe veld in `s`: `casino` = `{sessies, ingekoop, uitbetaal}` — wat jy oor jou hele
lewe by die casino ingesit en uitgehaal het. Verstek in `nuweLewe()` en in
`vulNuweVelde()` (`{sessies:0, ingekoop:0, uitbetaal:0}`), sodat ou stoor-data laai;
`gaanVoortAsKind()` begin dit weer by nul. Die nuwe getalle staan in `data.js` onder
EKONOMIE (`JSE_JARE`, `PENSIOEN_GROEI`) en bo-aan elke spel in `minispel.js`.

| # | Wat | Gedoen |
|---|---|---|
| K1 | **’n Mini-spel-raamwerk.** Tot nou was alles ’n knoppie met ’n lukrake uitslag. | ✅ `minispel.js` (gewone `<script src>`, ná `skerm.js`). ’n Mini-spel is ’n object met `begin(opts)`, `stapWeg()` en `vinnig(chips)`; `opts.klaar(uitslag)` gee die uitslag terug aan wie die spel oopgemaak het. `minispelIngang(spel, opts)` wys altyd twee knoppies: **“Speel self”** maak ’n volskerm-paneel (`#minispel`) bo-oor die toestel oop, en **“Doen dit vinnig”** simuleer ’n hele sessie (25 rondtes teen ’n tiende van jou chips) in een slag. Die vinnige weergawe speel altyd by ’n *effens swakker tafel* — so self speel betaal effens beter, maar die huis wen steeds. Die spelreëls (“enjins”) is los van die skerm: die vinnige sessie en die Monte Carlo-toets gebruik presies dieselfde funksies as wat jy op die skerm speel. Alles is tik-groot en pas op ’n 375×667-foon; die style staan onder “Mini-spele” in `styl.css`. |
| K2 | **Beleggingskoerse.** Die spaarrekening (5–7%) het die JSE (plat −24% tot +34%) in ± 80% van 40-jaar-lopies geklop — die omgekeerde van die werklikheid. | ✅ Die spaarrekening bly 5–7%. Die JSE trek nou elke jaar uit drie emmers (`JSE_JARE`): **65%** van jare is goed (+8% tot +26%), **26%** is plat (−6% tot +6%), en **9%** is ’n swak jaar of crash (−10% tot −25%, nooit erger nie). `vaardigBeleggingBonus()` tel steeds bo-op. Die pensioenfonds (`PENSIOEN_GROEI`) verloor nou ook een jaar uit tien (−2% tot −12%) en groei andersins 4–12%. Albei loop deur die nuwe `trekOpbrengs(tabel)`. Die JSE-kaart op die Bates-blad sê nou wat die risiko is. **Gemeet** (20 000 lopies elk, deur die spel se eie `beleggingJaar()` teen `SPAAR_KOERS`): die JSE klop die spaarrekening oor **1 jaar in 66%, 3 jaar 67%, 5 jaar 70%, 10 jaar 76%, 20 jaar 83%, 30 jaar 88% en 40 jaar 91%** van gevalle (was 46% / 42% / … / 27% / … / 19%). Gemiddeld +9,5% per jaar (meetkundig +8,7%); 21% van jare is negatief, 8,5% erger as −10% (was 41% en 24%). Die pensioenfonds klop die spaarrekening in 60–67%, en die JSE oortref dit oor ’n lang termyn. |
| K3 | **Die casino as mini-spele** (vervang die ou “Dobbel R5 000”-knoppie; Lotto bly). | ✅ Aktiwiteite → Geld → **“Gaan casino toe”** (18+, nie in die tronk nie, drie keer per jaar). Kies ’n tafel, koop chips (tot vier bedrae van R500 tot R250 000, na gelang van jou kontant), en speel self of vinnig. Jy stap weg wanneer jy wil (behalwe middel-in ’n hand of terwyl die wiel draai); die chips gaan na jou kontant, die sessie word gelog (“By die casino (blackjack) het jy R10 000 se chips gekoop, 14 rondtes gespeel en met R11 500 weggestap (+R1 500).”), jou geluk skuif saam, en die kaart wys jou leeftydtotaal. Die vier spele, met hul Monte Carlo-terugbetaling (RTP) oor **1 miljoen rondtes elk**: <br>• **Blackjack** — 6 pakke, die dealer staan op sagte 17 en loer vir blackjack, blackjack betaal 3:2, trek/staan/verdubbel/verdeel (een keer; verdeelde ase kry een kaart). Daar is ’n “Wat sê basiese strategie?”-knoppie. Self: **99,40% (huisvoordeel 0,60%)**; vinnig (blackjack betaal 6:5): **98,13% (1,87%)**. <br>• **Roulette** — die Europese wiel met een nul en ’n wiel-animasie; rooi/swart, ewe/onewe, die drie dosyne en enkelgetalle op ’n 9×4-bord. Self: **97,59%** (teorie 97,30%); vinnig (dubbelnul, op rooi/swart): **94,68%** (teorie 94,74%). <br>• **Slots** — drie rolle met gewigte, een lyn, ’n betaaltabel op die masjien. Presies uitgetel oor al 512 uitkomste: self **92,69%**, vinnig **87,82%** (Monte Carlo 92,46% en 87,21%). <br>• **Video poker** (Jacks or Better) — vyf kaarte, tik om te hou, trek een keer, met ’n “Wat sou ’n kenner hou?”-knoppie. Self is die 9/6-tabel (perfekte spel 99,54%), vinnig die 8/5-tabel (97,30%). Met die spel se eie eenvoudige strategie: self **99,51%** en vinnig **97,01%** oor 8 miljoen hande elk (± 0,16%). <br>Elke tafel verloor dus oor die lang termyn, en self speel is elke keer effens beter as vinnig. |
| K4 | **Hosting op GitHub Pages.** | ✅ ’n `README.md` (hoe om te speel, wat in watter lêer is, hoe om Pages aan te skakel) en ’n leë `.nojekyll`. Alle paaie in `index.html` en die kode is relatief, so dieselfde lêers werk met ’n dubbelklik op `index.html` én op Pages. Die repo het nog geen remote nie: om dit publiek te maak, is die gebruiker se besluit. |

---

## L. Fase 8 — misdaad uitbrei, die onderwêreld — ✅ KLAAR (24 Oktober 2026)

Nuwe velde in `s`: `hitte` (0–100), `opgeskort` (`{jare, tot, vir}` — ’n opgeskorte
vonnis of parool wat nog loop, anders `null`) en `misdaad` = `{pogings, gevang, buit,
koste}` (jou leeftyd se telling). `s.tronk` kry `vonnis` (die oorspronklike lengte, vir
parool) en `jeug` (’n jeugsorgsentrum). Verstek in `nuweLewe()` en `vulNuweVelde()`
(`0`, `null`, `{0,0,0,0}`, en `vonnis = jare` vir ’n ou tronkvonnis), sodat ou stoor-data
laai. Fase 8b voeg `straatRep` (0), `bende` (`{id, punte, rang, jobs, sedert}` of `null`)
en `eieOrg` (`{naam, werkRep, lede, gestig, jobs, buit}` of `null`) by, met dieselfde
verstekke; `gaanVoortAsKind()` begin dit weer by nul (die oudit-vlag verdwyn saam met
`s.vlagge`). Die nuwe kode staan in **`misdaad.js`** (laai ná `minispel.js`) en
**`onderwereld.js`** (Fase 8b, laai ná `misdaad.js`), die getalle in `data.js` onder
“MISDAAD EN REG” en “DIE ONDERWÊRELD”. Niemand word in enige misdaad
doodgemaak of beseer nie; ’n wapen maak net die vonnis swaarder.

| # | Wat | Gedoen |
|---|---|---|
| L1 | **Motors as ontsnapvoertuig.** Jou eie motor het die risiko met 17% *verhoog* (“hulle kan jou nommerplaat naspoor”). | ✅ Elke motor in `TE_KOOP` kry `spoed` (km/h) en `ontsnap`: **Tazz −8%, Polo −12%, Ranger −15%, BMW −20%, Porsche −25%**, en jy het een opsie per motor wat jy besit. Die ander voertuie is nou te voet +14%, fiets +8%, taxi +3% en ’n gesteelde bakkie −10% (maar word jy gevang, is die bakkie ’n ekstra erns-punt). Word jy gevang in ’n motor, kies jy “Trap die petrol” (’n **jaagtog**, sien L7) of “Gee jou oor” (die hof kyk gunstiger). Verloor jy die jaagtog ná ’n ernstige misdaad (erns 4+), lê die staat in 25% van gevalle beslag op jou motor. Die vloer op die gevangskans (`RISIKO_VLOER`, 30% van die basis) keer dat aanpassings ’n misdaad gratis maak. **Gemeet** met die eerste jaagtog, voor L7 (2 000–4 000 pogings elk, 25 jaar, slim 60, geen rekord nie, vinnig gespeel, Regshulp en skuldig gepleit) — persentasie wat **hof toe gaan**: <br>• Huisinbraak, gewone huis (basis 38%): te voet **50%**, fiets 46%, taxi 38%, gesteelde bakkie 24%, Tazz **26%**, Polo 22%, Ranger 19%, BMW 14%, Porsche **9%**. <br>• Smokkel, sigarette (38%): te voet 50%, Tazz 26%, Porsche 9%. <br>• Bankroof, klein tak (54%): te voet 66%, taxi 56%, Tazz 43%, BMW 25%, Porsche **20%** — en hier is dit altyd tronk. |
| L2 | **Hitte.** | ✅ Elke misdaad tel `m.hitte` (3 vir winkeldiefstal tot 25 vir ’n bankroof) plus ’n vyfde van die teiken se risiko by; gevang word gee nog 12. Elke 3,5 punte is 1% ekstra gevangskans (hitte 100 = +29%). Elke jaar val dit met 40% en dan nog 3 punte. Die Misdaad-blad wys ’n hitte-meter met twee knoppies: **“Lê laag”** (geen misdaad vanjaar, hitte halveer) en **“Koop ’n polisieman om”** (18+, hitte 10+, R2 000 + R1 200 per hittepunt; 70% kans dat hy dit vat en die hitte val na 35%, 30% kans dat hy eerlik is en jou vir omkopery arresteer). |
| L3 | **Die heler.** | ✅ Goedere (selfone, juwele, motors, koper, perlemoen, sigarette — `goed:true`) is nie kontant nie: die heler (of die chop shop in Bellville) bied 30–60% van die waarde, minder as jou hitte hoog is. Jy kan een keer onderhandel: 50% kans hy skuif 4–12 punte op, 30% hy bly staan, 20% hy word kwaad en sak 8 punte. |
| L4 | **Die hof (G1–G4).** | ✅ Sien G1–G4. Elke aanklag het ’n erns 1–5. Die punte vir die vonnis: erns×2, plus 1,5 per vorige veroordeling (tot 4), plus 2 vir ’n wapen, 2 as jou maat jou verklik het, 2 ná ’n jaagtog, 2 as ’n opgeskorte vonnis loop; min 1 as jy jou oorgegee het, min die prokureur se bonus (0/1/2), min 2 vir skuldig (plus 1 vir onskuldig en skuldig bevind), plus −1 tot +2 geluk. ≤2 (net sonder rekord): teruggetrek met ’n waarskuwing · ≤4 boete · ≤6 gemeenskapsdiens · ≤8 opgeskorte vonnis · daarbo tronk. Erns 3/4/5 het ’n vloer van boete/opgeskort/tronk. Wie skuldig bevind word terwyl ’n opgeskorte vonnis of parool loop, sit daardie jare uit. Alles gaan deur die bestaande `tronkToe()` en `s.rekord`; vrygespreek, teruggetrek en diversie kom nie op die rekord nie. **Gemeet** (eerste oortreding, Regshulp, skuldig): ’n klein misdaad eindig nooit in die tronk nie (boete of waarskuwing), ’n inbraak of motordiefstal byna nooit (opgeskort), en ’n gewapende roof of bankroof is altyd tronk (10–15 en 12–20 jaar). |
| L5 | **Nuwe misdade.** Daar was vyf. | ✅ Nou tien, in drie groepe op die blad (elkeen met ’n minimum ouderdom): <br>• **Klein misdaad**: winkeldiefstal, sakkerollery, en nuut **straatskarrel** (kaartjies teen woekerpryse, namaak-goed smous, onwettige kragaansluitings, koperkabels). <br>• **Groot misdaad**: huisinbraak, motordiefstal (16+), nuut **smokkel** (16+: perlemoen, sigarette, selfone deur die hawe), nuut **gewapende roof** (18+, een keer per jaar, 10–15 jaar), bankroof (18+, een keer per jaar, 12–20 jaar). <br>• **Witboordjie en kuber** (G8): **bedrog by die werk** (vereis ’n werk; die buit is ’n deel van jou salaris; tenderbedrog vereis R350 000+) en **kuberbedrog** (vereis kodeer-vlak 2/3/4; elke vlak bo die vereiste is −2% risiko). Witboordjie het ’n klein gevangskans nou, maar elke slag gaan as ’n saak in die vlag `oudit`, en elke jaar vir 7 jaar kan ’n forensiese oudit dit uitbring (`ouditJaar()` in die jaarmasjien) — dan betaal jy alles terug, plus die hof se uitspraak, en vir erns 3+ word jy afgedank. **Gemeet** (rekenmeester, R462 000, 4 000 lopies, 9 jaar daarna): SARS-ontduiking kom in **42%** uit (EV +R34 000, jy hou jou werk), fiktiewe fakture **49%** (EV +R69 000, **46% verloor hul werk**), verduistering **64%** (EV +R127 000, 61% werk weg), tenderbedrog **61%** (EV +R529 000, 56% werk weg). Die EV tel nie die salaris wat jy verloor nie — wat dit duidelik ’n slegte ruil maak. |
| L6 | **Misdaad-mini-spele** in die Fase 7-raamwerk, almal tik-groot op ’n 375-breë foon, met “Speel self” en “Doen dit vinnig”. | ✅ Elke spel gee ’n gehalte *q* (0–1). Die risiko skuif met `(0,6 − q) × 15`: “vinnig” trek *q* tussen 0,45 en 0,75 (gemiddeld 0,6 — die risiko bly gemiddeld dieselfde); ’n goeie speler haal 0,85–0,95 en kry 4–5% minder risiko, perfek is −6%, slordig speel kos tot +9%. <br>• **Slotoopsteek** (huisinbraak): vyf penne, druk as die merker in die groen sone is; die merker word vinniger en die sone smaller; vier foute en jy skop die deur oop. Gesimuleer met ’n mens se tydsfout van 60 ms: *q* = 0,86; 80 ms: 0,70. <br>• **Draai die drade** (motordiefstal): vier van vyf drade flits; tik hulle in dieselfde volgorde binne 9 sekondes. <br>• **Die kluis** (bankroof): ’n draaiskyf met ’n stetoskoop-meter (“Stil / Lou / Warm / KLIK”); drie getalle in 40 sekondes. Hoe vinniger, hoe meer buit (35–100% van die kluis). <br>• **Die greep** (sakkerollery): gryp as die slagoffer se aandag in die groen is; drie grepe, twee keer gevoel en hy hardloop. Ook hier hang die buit van *q* af. Gesimuleer met 250 ms reaksietyd: *q* = 0,78–0,88. <br>• **Jaagtog**: oorgedoen in Fase 8b — sien L7. |
| L7 | **Die jaagtog oorgedoen (Fase 8b).** Die gebruiker: foutloos moet jy altyd wegkom, ’n vinniger motor moet meer kanse gee, die jaagtog moet langer en moeiliker wees, en elke betrapping met ’n wegkommotor moet die keuse bied. | ✅ Die 60%-kans is weg: word jy gevang met ’n **motor** (jou eie, die gesteelde bakkie, of die motor wat jy steel), kies jy altyd self. Die jaagtog (`jaagOpstel()`) is **26 rye plus 6 per erns-punt plus 3 per 10 hitte** (32 vir ’n sak lekkers, 56 vir ’n bankroof, 80 vir ’n bankroof by hitte 80), en word al vinniger en digter: hoe hoër erns en hitte, hoe meer padblokkades oor twee bane en hoe korter die gaping. Elke ding wat jy raakry, kos ’n **kans**: Tazz en die gesteelde bakkie **2**, Polo en Ranger **3**, BMW **4**, Porsche **5** (`kanse` in `TE_KOOP`). Kom jy by die afrit uit met ’n kans oor, is jy weg; **foutloos is 100%**. Elke stamp kos 10% van die buit (’n sak wat by die venster uitwaai), en ’n ontsnapping gee +15 hitte en +3 rep. “Doen dit vinnig” ry elke ry raak met 6% (+ hitte/1 200, + 3% vir ’n padblokkade). **Gemeet** met die spel se eie enjin (`jaagTik()`), 150 jaagtogte per sel, deur ’n bot wat 360 ms neem om te reageer en elke 210 ms kan tik (“goeie speler”, mis 6% van die rye heeltemal) en een van 450 ms / 240 ms / 10% (“gemiddeld”): <br>• Erns 1 (32 rye): perfek 100% · goed Tazz 84%, Porsche 100% · gemiddeld 56% / 99% · vinnig 26% / 92%. <br>• Erns 3, hitte 0 (44 rye): perfek 100% · goed Tazz **69%**, Polo 89%, BMW 96%, Porsche **99%** · gemiddeld 31% / 66% / 89% / 95% · vinnig 14% / 31% / 48% / 70%. <br>• Erns 5, hitte 40 (68 rye): perfek 100% · goed Tazz **15%**, Polo 40%, BMW 75%, Porsche **78%** · gemiddeld 3% / 13% / 25% / 48% · vinnig byna 0. <br>• Erns 5, hitte 80 (80 rye): perfek 100% · goed Tazz 5%, Porsche **53%** · gemiddeld 0–17%. <br>**Herbalansering**, want ’n goeie speler kom nou baie meer weg: BMW het 4 en Porsche 5 kanse (nie 5/6 nie), die geldwa (R0,5–1,8 m) en die hoofkantoor (R1,5–6 m) betaal minder en vra **rep 20 en 45**, die kontantafhaal vra rep 15, en hitte maak die jaagtog langer en moeiliker (hierbo). **Gemeet** (enkelpoging, 25 jaar, hitte 0, Porsche, Regshulp en skuldig): hoofkantoor vinnig — **53% tronk toe**, EV +R0,9 m; goeie speler — **13% tronk toe**, EV +R1,9 m. Huisinbraak met ’n Porsche: 6% (vinnig) en 0,4% (goed) gaan hof toe. **Oor 20 jaar** (’n beroepsrower van 25 met ’n Porsche en rep 50 wat elke jaar die grootste bankteiken doen wat oop is): vinnig — gemiddeld 3,4 pogings, **R4,0 m buit, 100% tronk toe, 17,5 tronkjare**; goeie speler — 5,7 pogings, **R9,3 m buit, 98% tronk toe, 14,3 tronkjare**. Dit is sowat wat ’n goeie salaris oor 20 jaar betaal, maar met die helfte van die tyd agter tralies — nie ’n geldmasjien nie. |
| L8 | **Reputasie in die onderwêreld (Fase 8b).** | ✅ `s.straatRep` (0–100), met name van “’n Niemand” tot “’n Legende”. Dit groei met elke misdaad wat slaag (**1, 1, 2, 3, 5** vir erns 1–5), plus ’n job se eie rep, plus 3 vir ’n jaagtog wat jy wen en 1 per tronkjaar. Dit sak met 8% per jaar ná twee stil jare, en met **25** as jy iemand verklik. In die hof kan jy nou jou maat, jou organisasie of jou eie mense **verklik** vir ’n baie ligter vonnis (−5 vonnispunte); jou organisasie skop jou dan uit en ’n paar van hulle wag jou in (gesondheid −5 tot −15, nooit dood nie). Die groot bankteikens en die kontantafhaal vra rep (L7). |
| L9 | **Kriminele organisasies en jou eie organisasie (Fase 8b).** | ✅ Nuwe lêer **`onderwereld.js`** (laai ná `misdaad.js`). Vier organisasies (`ORGANISASIES`), elk met ’n rep-vereiste en vier range: **Die Vlakte-bende** (rep 0, 14+), **Die Chop-shop-netwerk** (rep 20, 16+), **Die Hawe-sindikaat** (rep 40, 18+) en **Die Sindikaat** (rep 65, 21+). Elkeen het vyf jobs (twee per jaar), en ’n hoër rang maak beter jobs oop. ’n Job loop deur die gewone misdaadvloei (voertuig, mini-spel, jaagtog, hof) en betaal kontant. ’n Job wat slaag, gee 2 punte plus die job se rang; een wat misluk, kos 1 (range by 4, 10 en 20 punte, en ’n rang val nie terug nie). Vanaf die tweede rang betaal die organisasie jou privaat prokureur, en die hoogste rang kry elke jaar ’n deel van die wins (R20 000 tot R400 000). Geen job maak iemand dood of seer nie. <br>**Jou eie organisasie** (rep 75+, 21+, R100 000): sy rep = 30% van jou rep plus **werkRep**, wat jou mense se jobs opbou (+ die job se rep vir elke sukses, − vir elke mislukking) en wat 15% per jaar verval. Twee keer per jaar kan jy probeer werf: die kans is **12% + 0,8 × die organisasie se rep** (sowat 30% met rep 80 en geen werkRep nie), en hoeveel mense jy kan hê, is 3 plus een per 20 rep. ’n Nuwe mens kom met vlak 1–3 en ’n lojaliteit van 40–75%. Een keer per jaar stuur jy almal op dieselfde job (`EIE_JOBS`, van “Smous op straat” tot ’n kontant-in-transito-roof, oopgesluit deur die organisasie se rep). Die sukseskans is 88% − 14 × moeilikheid + 10 × vlak − hitte/4. Jou mense hou die helfte van die buit, en elkeen wil R15 000 per vlak per jaar hê, anders val sy lojaliteit met 25 en loop hy uiteindelik weg. As ’n job misluk, word die helfte van die mense gevang, en wie gevang word, kan jou verklik (kans = (100 − lojaliteit)/2): dan staan jy self hof toe vir bendebedrywighede. **Gemeet** (300 lewens, begin op 40 met rep 80 en R1 m, werf twee keer per jaar): wie elke jaar die **veiligste** job stuur, het ná 5/10/15/20 jaar 2,5 / 3,8 / 3,6 / 3,1 mense, ’n org-rep van 31 / 41 / 46 / 45, verdien R0,54 m oor 20 jaar en gaan amper nooit tronk toe nie (1%). Wie elke jaar die **beste** job stuur, hou net 1,3–1,9 mense, verdien R2,2 m, maar 74% gaan tronk toe (1,4 hofsake per lewe). **Oor ’n hele lewe** (300 misdadigers wat vanaf 14 by die beste organisasie aansluit en twee jobs per jaar doen, Regshulp, skuldig): rep 20 word bereik deur 97% (mediaan ouderdom 18), rep 40 deur 92% (25), rep 65 deur 74% (35) en rep 75 deur 63% (40); 50% kom by Die Sindikaat uit, 23% word luitenant of hoër, en 48% begin hul eie organisasie, maar 98% sit tronk, gemiddeld 30 jaar. **0 foute** oor 300 passiewe lewens (gemiddelde ouderdom 61,7), 1 200 misdadiger-, 420 organisasie-, 600 eie-organisasie- en 300 kinder-lewens. |

**Is misdaad ’n geldmasjien? Nee.** Verwagte waarde per poging met die eerste jaagtog
(dieselfde opstelling as L1, 2 000 pogings elk, sonder die salaris en jare wat jy
verloor; vir die nuwe jaagtog en die nuwe bankbedrae, sien L7): klein misdaad bring
**R150 tot R6 400** (’n polisieman se foon: −R1 800); ’n huisinbraak met ’n Porsche
R6 600 (woonstel) tot R82 000 (landgoed); motordiefstal R8 000 (Tazz) tot R381 000
(Porsche, maar 67% word gevang); kuberbedrog R29 000–R128 000. Die groot geld is
gewapende roof en bankroof (’n Porsche-ontsnapping na die hoofkantoor: EV +R2,3 m), maar
daar gaan **17–40%** van pogings vir 12–20 jaar tronk toe, en die hitte maak elke
volgende een erger. **Oor ’n hele lewe**, weer gemeet ná Fase 8b (300 lewens elk, vanaf
14 elke jaar een lukrake misdaad, Regshulp, skuldig, vinnige jaagtog, laag lê by hitte
40+): wie net klein misdaad doen, gaan in **26%** van lewens tronk toe, sit gemiddeld
1,5 jaar en buit R61 000 in sy hele lewe; wie enige misdaad doen, gaan in **95%** tronk
toe, sit **22 jaar** (mediaan 22), en buit gemiddeld R488 000 (mediaan R375 000) —
sowat **R22 000 per tronkjaar**. Met twee misdade per jaar en lukrake keuses in die hof
(soms ’n duur advokaat) word dit 95%, 29 jaar, en R445 000 buit teen R312 000 se
regskoste. Kinders wat van 12 af elke jaar
vyf klein misdade doen, kry gemiddeld 1,7 diversies, en 95% beland teen 18 in ’n
jeugsorgsentrum — sonder dat hulle ’n skooljaar verloor. **0 foute** oor 300 passiewe
lewens (gemiddelde ouderdom 59–62 oor die lopies, soos voor Fase 8), 1 500
misdadiger-lewens en 300 kinder-lewens, en weer ná Fase 8b (sien L9).

*Nie in Fase 8 nie:* tronk-ontsnapping en die lewe op die vlug (G5) is Fase 9 — die
ou “Probeer ontsnap”-knoppie is onaangeraak (’n verlengde vonnis kry net nie parool
nie). Slagoffer word (G6), verkeersoortredings (G7), rekord-skoonmaak (G9) en
burgerlike sake (G10) staan nog oop.

---

## M. Fase 9 — tronk-ontsnapping en die lewe op die vlug — ✅ KLAAR (25 Oktober 2026)

Nuwe velde in `s`: `vlug` (`{oor, ekstra, sedert, jare, vals, laag, getrek}` — hoeveel
jaar van die vonnis oop is, wat die ontsnapping self sal kos as hulle jou vang, en wat jy
gedoen het om weg te bly; anders `null`) en `vlugJare` (jou leeftyd se jare op die vlug,
op die grafsteen). `s.tronk` kry `plan` (`{tonnel 0–3, laken, uniform, roete, helper,
bewaarder, kar}`) en `geenParool`. Verstek in `nuweLewe()`, `vulNuweVelde()` (ook ’n
leë plan vir ’n ou tronkvonnis) en `tronkToe()`; `gaanVoortAsKind()` begin `vlug` en
`vlugJare` skoon. Die nuwe kode staan in **`ontsnap.js`** (laai ná `onderwereld.js`), die
getalle in `data.js` onder “ONTSNAPPING EN DIE LEWE OP DIE VLUG”. Die ou “Probeer
ontsnap”-knoppie (14% + slim/12, en dan niks) is weg. Niemand word seergemaak nie: die
bewaarders vang jou, hulle skiet nie.

| # | Wat | Gedoen |
|---|---|---|
| M1 | **Beplanning oor jare.** | ✅ Tronklewe → **“Beplan ’n ontsnapping”**. Een voorbereiding per jaar, elk met ’n prys: **’n tonnel met ’n lepel** (drie jaar se grawe, 12% per jaar om gevang te word), **lakens as ’n tou** (8%), **’n bewaarder se uniform** (20%), **die skofte en roete uitwerk** (geen risiko, maar 30% + slim/2 kans per jaar), **’n medegevangene as helper** (35% + geluk/3, +20 as jy vanjaar vriende gemaak het; 15% kans hy verklik jou en jy verloor iets), **’n bewaarder omkoop** (R25 000 en 25% kans hy is eerlik — *Fase 8b:* gratis en 10% as jou organisasie dit doen, R15 000 as jou eie mense dit reël), en **’n wegkomkar buite** (net deur ’n organisasie, jou eie mense of ’n kontak met rep 30+, R0–R40 000). Gevang met die goed is ’n dissiplinêre verhoor: ’n jaar by (twee vir omkopery), en omdat die vonnis dan nie meer die oorspronklike is nie, is **parool weg**. Elke jaar is daar boonop ’n **deursoeking** van jou sel: 4% + 7% per ding wat jy wegsteek (tonnel, tou, uniform). Een poging per jaar. **’n Jeugsorgsentrum het geen ontsnapping nie**: daar is nie tralies nie, jy is binnekort uit, en dit kom nie op ’n grootmens se rekord nie. |
| M2 | **Die ontsnapping as stealth-mini-spel** in die Fase 7-raamwerk. | ✅ ’n Rooster van 9 × 11 van bo af: jou sel onder, ’n selgang, ’n muur met ’n deur, die binneplaas, ’n binnemuur met twee deure, die buitewerf, en die heining met een hek. Kratte keer beweging en sig. Vyf bewaarders patrolleer heen en weer (een in die selgang, twee op die binneplaas, twee op die buitewerf) en sien in ’n kegel van drie selle voor hulle uit; aan die einde van hul roete draai hulle om. Jy **tik** ’n sel langs jou (of verder: een tree in daardie rigting) of op jouself om te wag — geen sleutelbord. Haal die hek voor die oggendtelling (die kortste foutlose pad + 10 skuiwe, minstens 36). Word jy gesien, gaan die alarm af en jaag al die bewaarders jou (een sel per skuif; langs jou is gevang), en ná 5 skuiwe word die hek gesluit. **Foutloos is altyd uit**: elke kaart word eers met ’n BFS deur tyd (`osOplos()`) getoets, en net ’n kaart met ’n foutlose pad word gegee — **gemeet: 1 100 kaarte oor 11 voorbereidingsvlakke, die BFS-pad deur die spel se eie enjin teruggespeel, 100% uit sonder om gesien te word**. Elke voorbereiding verander die spel: die **tonnel** laat jou verder uitkom (1 jaar: op die binneplaas, 2: op die buitewerf, 3: langs die heining); die **tou** maak die hele heining ’n uitgang, ook as die hek gesluit is; die **uniform** laat die eerste bewaarder wat jou sien net knik (hy ignoreer jou daarna); die **roete** wys die patrollies se roetes en waarheen elkeen volgende kyk; die **helper** gee twee afleidings van vyf skuiwe waarin die bewaarders vries en niks sien nie; die **omgekoopte nagskof** haal die twee buitewerf-patrollies weg. **“Doen dit vinnig”** speel ’n bot op ’n nuwe kaart met jou voorbereiding (dit skaal dus vanself), en die ingang wys die kans (30 simulasies). **Gemeet** (400 kaarte per sel): ’n *goeie speler* (ken die patrollies, kyk 6 skuiwe vooruit, waag dit 3% van die tyd, 1,5% met die roete) teenoor *vinnig* (5 skuiwe vooruit, 6% / 4%): <br>• geen voorbereiding: goed **68%**, vinnig **56%** <br>• roete 77 / 66 · laken 77 / 71 · helper 75 / 69 · bewaarder 78 / 68 · uniform **90 / 87** <br>• tonnel 1 jaar 85 / 74 · 2 jaar 89 / 86 · 3 jaar 86 / 88 <br>• roete + uniform 90 / 89 · plus laken 93 / 94 · vyf dinge (sonder tonnel) **99 / 98** · alles **100 / 100** <br>Vinnig is dus 3–12 punte swakker sonder veel voorbereiding en gelyk (binne die ruis van ± 3) as jy goed voorberei is. |
| M3 | **Ná die heining.** | ✅ Niemand het jou gesien nie: jy begin op die vlug met hitte **55**; die alarm het afgegaan: **85**; ’n kar het gewag: **35**. Wag die kar en het die alarm afgegaan, kies jy: **“Trap die petrol”** (die Fase 8b-jaagtog met 3 kanse, 47 hindernisse; weg = hitte 60 en rep +3) of **“Los die kar, hardloop”** (hitte 85). Elke ontsnapping kom op jou rekord en gee rep +6. **Misluk dit** (of verloor jy die jaagtog): 2–5 jaar by, parool weg, alles wat jy versamel het weg, hitte +20. “Gee op” in die spel sluip jou terug na jou sel sonder straf — behalwe as die alarm al loei. |
| M4 | **Die lewe op die vlug (G5).** | ✅ ’n Kaart bo-aan Aktiwiteite wys hoeveel jaar oop is, die kans om volgende jaar gevang te word, en hoe lank nog tot jy vry is. Elke jaar (`vlugJaar()`, ná die hitteverval in `misdaadJaar()`) is die kans **12% + hitte × 0,3**, **+12%** as jy by jou ouers of familie bly (die eerste plek waar hulle soek), **+8%** as jy ’n huis besit, **−5%** op straat, **−8%** as jy verlede jaar laag gelê het, **−12%** as jy verlede jaar getrek het (−6% die jaar daarna), **−10%** met ’n vals ID, **−4%** in ’n organisasie, en **−1% per jaar** wat die spoor kouer word (tot −8%); tussen 2% en 85%. **Sonder ’n vals ID** is werk (voltyds, deeltyds, die skuiling se werk), ’n besigheid (behalwe smous), die spaarrekening, die JSE, ’n verband, ’n mediese fonds en die NGO toe; **los werk vir kontant** (twee keer per jaar), straatwerk en misdaad bly oop. **’n Vals ID** kos R10 000 (5% kans dit is ’n polisie-lokval) deur jou organisasie of jou eie mense, R20 000 (10%) deur ’n kontak as jy rep 25+ het, en R35 000 (25%) by ’n vreemdeling. **Trek weg** (R6 000, gratis op straat, een keer per jaar) skuif jou na ’n ander dorp; wie by sy ouers bly, trek in ’n kommune in. **Gevang** (in die jaarlikse soektog, by ’n lokval, of by enige hofsaak — jou vingerafdrukke verraai jou, selfs as jy onskuldig bevind word): jy sit die res van jou vonnis plus **2–4 jaar** vir die ontsnapping uit, **sonder parool**. **Gee jouself oor**: die res plus **net 1 jaar**, en parool bly moontlik. **Die pad uit**: ná **10 jaar** met ’n vals ID sit jou nuwe identiteit vas, ná **15 jaar** sonder een raak die saak koud. Twee nuwe gebeure (iemand herken jou in die winkel; jy kan nie jou ouers bel nie). Werk saam met die dakloosheid-modus (op straat soek hulle minder, maar die NGO is toe), die hof (`hofBeslis()` en `jeugHof()`), organisasies (rep, vals ID, ’n kar, ’n bewaarder) en die generasiespel (’n kind begin skoon). |

**Hoe lank bly ’n vlugteling vry?** Gemeet met 300–600 gevangenes van 25 met ’n vonnis van
14 jaar wat dadelik ontsnap (“vinnig”) en dan vir die res van hul lewe gevolg word:
<br>• Wie **niks** doen nie: **74%** word gevang, die mediaan is **4 jaar** vry, 22% haal
15 jaar en is vry, 4% sterf op die vlug.
<br>• Wie **aktief** wegkruip (elke jaar laag lê, elke tweede jaar trek, ’n vals ID by ’n
vreemdeling koop): **24%** loop in die lokval, nog **12%** word op die vlug gevang, **57%**
is ná 10 jaar vry, 6% sterf. Met rep 30 (’n kontak in plaas van ’n vreemdeling): 10%
lokval, 18% gevang, **66% vry**.
<br>• Met voorbereiding in die tronk (3 dinge eers): 92% kom uiteindelik uit (die res kry
parool of word in die proses gevang); wie op al 7 wag, kom in net **50%** van gevalle by
’n poging uit — parool en deursoekings vreet die tyd op.
<br>**0 foute** oor 600 passiewe lewens (gemiddelde ouderdom 59–61), 600 misdadiger-lewens
wat elke tronkjaar lukraak beplan en ontsnap (3 186 pogings, 2 404 ontsnappings — 75% —
en 6,6 jaar op die vlug per lewe), 300 kinder-lewens, 300 organisasie- en 300
eie-organisasie-lewens, ± 4 000 gevolgde vlugtelinge, ’n ou stoor-lêer met ’n tronkvonnis
sonder Fase 9-velde, en ’n vlugteling se kind in die generasiespel. In die blaaier gespeel:
die beplanning, die stealth-spel (self en vinnig), die vlug-kaart, trek, ’n vals ID,
oorgee, die alarm met die wegkomkar en die jaagtog, en stoor/laai.

---

## N. Playtest en regstellings (25 Oktober 2026)

| # | Wat | Gedoen |
|---|---|---|
| N1 | **’n Ontwikkelaar-paneel om te playtest.** | ✅ Nuwe lêer **`dev.js`** (laai ná `begin.js`). Net aktief as die adres `?dev` of `#dev` bevat (`index.html?dev`, of `…github.io/lewensloop/?dev`); andersins verskyn niks en verander niks. ’n 🛠-knoppie onder-links maak ’n paneel oop met: die statte (ouderdom, kontant, geluk, gesondheid, slim, voorkoms, straat-rep, hitte) om te stel, “Alles 100”, +R1 m/+R10 m, **onsterflik** (`doodKontrole()` word oorgeslaan); **1/5/10 jaar spring** met outo-antwoord op vrae (dit stop by ’n mini-spel); **elke mini-spel direk** — die vier casino-spele met R10 000 se chips wat niks kos nie, die vier misdaad-spele, die jaagtog (Tazz, Porsche, bankroof) en die ontsnapping (sonder of met alle voorbereiding) — en die uitslag (*q*, ontsnap, stampe …) word gewys sonder enige gevolg in die spel; tronk toe, alle ontsnap-voorbereiding, ontsnap nou (die regte vloei), word vlugteling, laat vry, word dakloos, hitte en rekord skoon; by enige organisasie aansluit, rang op, jou eie organisasie stig, +3 lede; enige werk direk kry, enige motor (met ’n lisensie); en die stoor kopieer na of laai uit die knipbord, of ’n nuwe lewe. |
| N2 | **Jobs waarvoor jy nie gearresteer kan word nie.** Drie organisasie-jobs is self nie ’n misdaad nie — jy kyk, spot of verken net — maar het ’n gevangskans gehad. | ✅ **“Hou die hoek dop vir die polisie”** (Vlakte-bende), **“Spot duur motors in die parkeerterreine”** (Chop-shop) en **“Verken ’n geldwa se roete”** (Sindikaat) is nou `veilig:true`: geen risiko, geen hitte, geen voertuig of hof — net betaling, rep en rangpunte (`orgJob()` stuur dit reguit na `misdaadBetaal()`). Die joblys sê “geen risiko”. Gemeet: 2 000 keer elk, **0 keer gevang**, hitte bly 0. *Om dop te hou:* omdat dit rangpunte gee, kan jy nou sonder risiko tot die hoogste rang styg (2 jobs per jaar = sowat 5 jaar), en dan kry jy elke jaar ’n deel van die wins. |
| N3 | **’n Betroubare pad na bo (28 Oktober 2026).** Die gebruiker: *“Ek wil hê dat ’n mens consistently bo kan uitkom in die kriminele wêreld. Daar moet jobs wees met geen risiko wat wel rep gee. Die risiko se beloning moet dus ’n vinniger pad tot bo wees.”* | ✅ **Elke rang in elke organisasie het nou ’n veilige job** (16 altesaam; `veilig:true`, geen gevangskans, hitte, voertuig of hof): die Vlakte-bende (hou die hoek dop · dra boodskappe · leer die loopjongs die strate · praat vrede met die bende oorkant die spoorlyn), die Chop-shop (spot motors · hou die onderdele-boeke · bou kontakte by handelaars · beplan die bestellings), die Hawe-sindikaat (hou boek van die skepe · uitkyk op die kaai · leer die doeane by ’n braai ken · beplan die skeepsroosters) en die Sindikaat (verken ’n geldwa · bestudeer ’n bank se sekuriteit · toets nuwe spesialiste · adviseer die baas). ’n Veilige job gee net sy eie rep (**2–4**, nie die misdaad se `REP_PER_ERNS` nie) en **1 + rang** punte; ’n riskante job wat slaag, gee die misdaad se rep plus sy eie (**4–14**) en **4 + 2 × rang** punte (`orgJobRep()`, `orgJobPunte()`). Die joblys wys elke job se rep en punte. <br>**Die risiko-pad is nou die vinniger pad**, want ’n organisasie beskerm sy mense: op sy eie jobs val jou gevangskans met **6% per rang** (`ORG_BESKERM`, die vloer van 30% van die basis bly), en word jy tog gevang, is daar **30 / 45 / 60 / 75%** kans (per rang, `ORG_PLAN`) dat die organisasie ’n plan maak — ’n getuie verander sy storie, ’n dossier raak weg — en die saak nooit hof toe gaan nie (`orgPlan()`; geen geweld). Die joblys wys die risiko ná beskerming. Vyf nuwe riskante jobs met erns 3–4 vul die gate waar daar net erns-5-jobs was: herregistreer gesteelde motors (Chop, rang 2), verander die vragmanifeste (Hawe, rang 2), ry die kontant na ’n wasplek, vervals dokumente vir ’n spookmaatskappy, en koop ’n bankbestuurder om (Sindikaat, rang 0–2). <br>**Gemeet** (nuwe harnas `pad.js`, 300–400 lewens vanaf 14, slim 60; elke speler klim deur al vier organisasies en skuif eers aan as hy die hoogste rang het; Regshulp, skuldig, vinnige jaagtog; die riskante speler kies op sy hoogste rang die job met die minste risiko en lê laag by hitte 50+): <br>• **Veilig** (net veilige jobs): **100%** haal alles as die dood afgeskakel is (met die gewone sterftes: 88% — 13% sterf voor 37 van gewone oorsake). Die hoogste rang in die Vlakte-bende op **19**, Chop-shop **25**, Hawe-sindikaat **31**, Sindikaat **37**; rep 75 (jou eie organisasie) op **28**. Dit is presies voorspelbaar: **23 jaar** vanaf 14, **0 keer** tronk toe, R2,1–2,3 m verdien. Die rep se stil-jare-verval raak die veilige pad nie, want elke veilige job tel as ’n jaar met misdaad. <br>• **Riskant**: die hoogste rang op **16 / 20 / 24 / 30** (mediaan), rep 75 op **25**; **88–98%** haal alles, mediaan **16 jaar** (kwartiele 10 / 12 / 16 / 23 jaar). Wie nooit gevang word nie (**32%**), doen dit in **11 jaar — die helfte** van die veilige pad. Maar **64–68%** gaan minstens een keer tronk toe (gemiddeld 1,7 keer, **8 tronkjare**), en verdien R4,0–4,4 m. <br>• Ter vergelyking, voor hierdie werk: die riskante speler het in **0%** van lewens die Sindikaat se hoogste rang gehaal, met 35 tronkjare; die ou Fase 8b-harnas (wat altyd die beste job doen) gaan nou in 80% van lewens tronk toe vir 11,5 jaar, teenoor 98% en 30 jaar. |
| N4 | **Werf uit vriende en familie (28 Oktober 2026).** *“’n Mens moet vriende en familie kan vra om aan te sluit. Hoe naby hulle aan jou is, moet die kans bepaal van ’n ja.”* | ✅ Op jou eie organisasie: **“Vra iemand wat jy ken”** wys jou lewende vriende, klasmaats, kollegas, maat of eggenoot, broers en susters, neefs en niggies, ooms en tantes, en volwasse kinders en kleinkinders (18+, nie in die tronk nie, nie al lid nie), gesorteer volgens band, met die kans. Dieselfde knoppie staan op elke persoon se kaart onder Mense. Die kans is **band − 20 + 0,3 × die org se rep** (3–95%; `eieVraKans()`): ’n vriend met band 95 by ’n nuwe organisasie (rep 23) = **82%**. Elkeen kan jy een keer per jaar vra; ’n **nee kos 5–12 band**, ’n ja gee +3. ’n Vreemdeling werf (twee keer per jaar) is nou moeiliker: **8% + 0,6 × die org se rep** (22% by ’n nuwe organisasie). Wie aansluit, is aan sy persoon in `s.verhoudings` gekoppel (`pid`): sterf hy, verlaat hy die organisasie; word hy gevang, sit hy (`v.tronk`, wys op sy kaart as “in die tronk (n jaar oor)”, en hy is dan nie beskikbaar as maat vir ’n misdaad nie). Die maksimum lede is nou **4 + 1 per 15 org-rep** (was 3 + 1 per 20). **Gemeet** (`eie.js`, 300 lewens, organisasie op 30 met rep 80 en R1 m, ’n speler wat elke jaar tyd maak vir sy vier naaste mense en almal met ’n kans van 40%+ vra): band 40–59 sê **44%** van die tyd ja, 60–79 **57%**, 80+ **87%**; vreemdelinge **26–34%**. Ná 5 jaar het ’n speler 4,3–4,7 lede. |
| N5 | **Elke lid apart (28 Oktober 2026).** *“’n Mens moet ook met elke recruit apart kan interact en vir elkeen sy eie job gee. Hulle unlock beter jobs soos wat hul rep vermeerder. Hulle sukses hang af van hul rep.”* | ✅ Elke lid het sy eie **rep (0–100)**, **rang** (Lid, Vertroude by rep 25, Luitenant by rep 50), lojaliteit, jobs, buit en tronkjare. Die organisasie-kaart wys elke lid (🤝 iemand wat jy ken, 👤 ’n vreemdeling, 🔒 in die tronk); tik op een vir sy kaart: **gee ’n job** (een per lid per jaar), **betaal ’n bonus** (R20 000: lojaliteit +15, band +8), **bevorder** (lojaliteit +15, beter sukses, maar ’n hoër loon), of **laat gaan** (band −10). **“Stuur almal”** stuur elke vry lid weer op sy laaste job. Die sewe jobs (`EIE_JOBS`) vra elk ’n **lid-rep** (0, 0, 10, 15, 25, 40, 60) en ’n org-rep: van **“Spot teikens vir die organisasie”** (geen risiko, rep +3 — ’n nuweling se veilige pad) en smous op straat tot ’n kontant-in-transito-roof. **Sukses = 85 − 10 × moeilikheid + (lid-rep − die job se vereiste) − hitte/5 + 5 per rang** (10–95%). ’n Sukses gee die lid **+4 tot +10 rep**, jou die helfte van die buit, die org werkRep en jou +1 rep; ’n mislukking kos hom 2 rep, en in die helfte van gevalle word hy gevang en sit hy **0–1 jaar** (smous) tot **6–12 jaar** (’n kontantroof). Wie gevang word, verklik jou met kans **(100 − trou)/2**, waar trou vir iemand wat jy ken die gemiddeld van sy lojaliteit en julle band is — ’n naby vriend verklik jou minder maklik. Die band skuif saam met hoe jy hom behandel: +2 per sukses, −8 as hy gevang word, −8 vir ’n loon wat jy nie betaal nie, +8 vir ’n bonus, +5 vir ’n bevordering. Die loon is **R15 000 / R30 000 / R60 000** per rang per jaar; sonder loon val sy lojaliteit met 25, en onder 15 loop hy. ’n Ou stoor met die ou lede-formaat (`{naam, vlak, lojaal, jare}`) word in `vulNuweVelde()` omgeskakel (`eieLidHerstel()`: vlak 1–5 word rep 5–53). **Gemeet** (`eie.js`, 300 lewens, 20 jaar): wie elke lid net **veilig** stuur, het ná 5/10/20 jaar 4,3 / 4,3 / 3,8 lede, ’n org-rep van sowat 22 en nooit ’n hofsaak nie — maar die lone (R1,3 m) kos meer as die buit (R0,3 m): dit bou rep, nie geld nie. Wie elke lid die beste job gee met **70%+ sukses** (anders die veilige een), groei na 4,7 / 5,2 / 5,6 lede en ’n org-rep van **36 / 47 / 60**, lede haal rep 70, 78% van die jobs slaag, R2,8 m buit teen R1,8 m lone, maar **81%** staan minstens een keer hof toe omdat iemand verklik het (1,3 hofsake, 1,6 tronkjare). Wie altyd die **beste** job stuur: 67% slaag, R2,0 m teen R1,1 m, 90% hof toe, 4,1 tronkjare. <br>**Die `?dev`-paneel** kry: +3 vreemdelinge (nuwe formaat), **+3 vriende met band 95**, **stel ’n lid se rep** (0–100), en **lede: nuwe jaar** (almal kan weer werk, tronk skoon, werwing herstel). <br>**0 foute** oor 300 passiewe lewens (gemiddelde ouderdom 59,9), 300 misdadiger-, 300 organisasie- (die ou Fase 8b-harnas), 300 kinder- en 300 ontsnap-lewens, 1 300 lewens op die veilige en riskante pad, 900 eie-organisasie-lewens, en ’n ou stoor met ’n ou `s.eieOrg`. In die blaaier gespeel (375 breed): vriende vra (op die organisasie-kaart en op ’n persoon se kaart), ’n lid se kaart, ’n job vir een lid (gevang, 1 jaar, nie verklik nie), die tronkstatus onder Mense, ’n jaar later terug by die organisasie, “Stuur almal”, en die Hawe-sindikaat se joblys met die veilige jobs, punte en die risiko ná beskerming. |
| N6 | **’n Gedeelde toets-harnas (28 Oktober 2026).** *“Elke session bou elke keer n harness. Kan ek nie een vooraf bou wat elkeen net kan gebruik?”* Drie sessies het elk hul eie harnas in ’n tydelike gids gebou (Fase 8, N3–N5 en afdeling O), en dit was ná elke sessie weg. | ✅ Nuwe gids **`toets/`** in die repo. **`harnas.js`** lees die `<script>`-lys uit `index.html` (sodat ’n nuwe lêer outomaties saamkom), laai dit in Node met ’n nep-`document` en -`localStorage`, laat die modale self antwoord (lukraak, of met ’n `kieser`), versamel elke stuk speler-teks, en gee elke lewe ’n **saad** — dieselfde saad speel presies dieselfde lewe. **`scenarios.js`** hou agt soorte spelers: passief, aktief (aktiwiteite, werk, liefde, bates, misdaad), tronk, dakloos, op die vlug, die onderwêreld, gesin plus die generasiespel, en skool los op 16. **`reels.js`** hou drie soorte reëls: **taal** (ontbrekende tweede *nie* in ’n sin met ’n werkwoord, *1 jare*, *dier(e)*, ’n punt as desimaal, diakritiese tekens wat weg is, *undefined*/*NaN* in teks, hakies binne hakies), **verbode teks per toestand** (huis-gebeure in die tronk of op straat, grootmens-goed vir ’n kind onder 13) en **invariante** ná elke jaar (geen NaN, statte 0–100, nie in die tronk én op die vlug nie, geen werk in die tronk of voltyds op skool nie, ’n verband net met ’n huis, lewende ouers ouer as jy, een eggenoot, die E9-ouderdomsgaping). **`toets.js`** is die opdrag: `node toets/toets.js` speel 150 lewens per scenario plus ’n Fase 1-stoorlêer en eindig met *✓ Alles skoon.* of ’n lys met sade; `--saad` speel een lewe met sy hele log na, `tekste` skryf elke unieke teks (name en getalle gelyk gemaak) uit om self te lees, en `bron` skandeer die bronkode se strings. ’n **`CLAUDE.md`** sê vir elke volgende sessie om dit te gebruik en uit te brei in plaas van ’n nuwe een te bou. **Gemeet:** 8 × 60 lewens, 0 crashes, 0 invariante, 0 verbode teks, 0 taal-sjablone; ’n kontrole met geplante foute (“Jy kan nie werk.”, “1 jare”, “dier(e)”, “5.5%”, “hoerskool”, “Daar is geen kos.”, `geld = NaN`, ’n werk in die tronk) vang al agt, en “Kontant, geen kontrak.” is nie ’n vals treffer nie. |

---

## O. Taal- en logikafoute — ✅ KLAAR (28 Oktober 2026)

Die gebruiker: *“Daars baie instansies waar die taal nie sin maak. Vind al
hierdie situasies en maak ’n oplossing vir elkeen. Daars ook baie logiese foute.
’n Hond kan my nie huistoe volg as ek in die tronk is nie. My broer sal my nie
inneem om by hom te bly as ons nie eers ’n verhouding het nie.”*

Hierdie afdeling is nie nuwe inhoud nie — dit is net foute. **47 items: 25 taal,
22 logika.** Twee ou oop items is in dieselfde slag afgehandel: **I1** (die
rugbyveld) en **E9** (die ouderdomsgaping), en **I5** is as ’n teksfout opgelos.

### Nuwe hulpmiddels

Die meeste taalfoute kom uit string-konkatenasie, en dieselfde fout het op
twintig plekke voorgekom. Daarom is daar vier nuwe helpers onderaan `hulp.js`
in plaas van twintig los lappies:

| Helper | Wat dit oplos |
|---|---|
| `meerv(n, enkel, meervoud)` | “1 jare”, “2 dier(e)”, “1 werker”, “1 verliesjare” |
| `lysTeks(lys)` | “Anna en Jan en Pieter” → “Anna, Jan en Pieter” |
| `rangTel(n)` | “sy 2e jaar” → “sy 1ste jaar” |
| `hoofletter(t)` | ’n frase wat voor in ’n sin ingeplak word |

Daarby in `lewe.js`: `siekteNaam(tt)` (die klein-letter-vorm van ’n siekte se
naam, met `lk` in `data.js`), `ouerWoord()`, `klasRusiePlek()`, `dierHy()` /
`dierHom()`, en die toestandhelpers onder **O26**.

### Taalfoute

| # | Probleem | Waar | Gedoen |
|---|---|---|---|
| O1 | **Ontbrekende diakritiese tekens** in speler-sigbare teks. Die kodebasis was inkonsekwent: dieselfde woord het soms met en soms sonder sy kappie of deelteken gestaan. | `gebeure.js`, `lewe.js`, `aksies.js`, `uitleg.js`, `skerm.js`, `data.js` | ✅ 44 plekke reggemaak: *geëet, beïndruk (3×), gesê (5×), gelê (2×), geërf (3×), belê (4×), opgesê (2×), Akne, Hoërskool (3 skoolname + 2 modale), annuïteit (4×), Lewensoriëntering (5×), Môrester, Wêreld, dokumentêr, onderwêreld (2×)*. ’n Nuwe toets (`diakrit.js` in die harnas) vang dit outomaties: dit groepeer elke woord in die bron volgens sy vorm sonder tekens en wys elke groep wat albei vorme bevat. |
| O2 | **Ontbrekende tweede `nie`.** Afrikaans verlang `nie … nie`; ’n sin wat uit fragmente gebou word, verloor maklik die tweede een. | `gebeure.js`, `lewe.js`, `aksies.js` | ✅ 5 plekke: “Niks het gebeur**.**” → “Niks het gebeur **nie**.”, “Doen niks daaraan” → “Doen niks daaraan **nie**” (twee plekke), “Een student doen niks **nie** en vra …”, “Jou ouers weet niks **nie**.”, “… en niks het gebeur **nie**. Dié keer.” |
| O3 | **Woordorde.** Gekonkateneerde bysinne kry die V2-/werkwoord-finale reël verkeerd. | `gebeure.js` | ✅ “Niemand het ’n lisensie nie behalwe die oudste” → “**Niemand behalwe die oudste** het ’n lisensie nie”; “iemand wat werk soek vir ’n mens” → “iemand wat **vir mense werk kry**”; “het jou voorgekeer en **vra** vir jou lekkergeld” → “en **vir jou lekkergeld gevra**” (tydsvorm). |
| O4 | **Lyste met “en … en … en”.** `name()` het met komma’s saamgevoeg (sonder “en”) en `sluitGroep()` met “ en ” tussen elke naam. | `lewe.js` | ✅ `lysTeks()`. “Heinrich en Suzanne en Elsabe en Juanita” → “Heinrich, Suzanne, Elsabe **en** Juanita”; “Andries, Lize, Elmarie ontmoet” → “Andries, Lize **en** Elmarie ontmoet”. Ook die grootouerreël en `lysEn()` in `aksies.js` loop nou deur dieselfde helper. |
| O5 | **Enkelvoud/meervoud.** | `lewe.js`, `uitleg.js` | ✅ `meerv()` oral: “Jy het 2 **dier(e)**” (die letterlike noodoplossing in `uitleg.js`), “kontak verloor met 1 ander **klasmaats**”, “Andries het jou **vriende** gebly” (een naam), “**Jou grootouers is** X” (een grootouer), “1 **werker**”, “1 **verliesjaar**”, “1 **chroniese toestand**”. |
| O6 | **Ranggetalle.** “is in sy **2e** jaar” — Afrikaans skryf 1ste, 2de, 3de; en dit was boonop een jaar voor. | `lewe.js` | ✅ `rangTel()` plus die af-by-een: ’n eerstejaar is nou “in **sy 1ste jaar**”, nie “sy 2e jaar” nie. |
| O7 | **Hakies binne hakies.** `rol()` gee self “Oupa (ma se kant)”, en twee plekke het dit weer in hakies gesit. | `lewe.js` | ✅ “Andries **(Oupa (ma se kant))** is oorlede” → “Andries, **oupa (ma se kant)**, is oorlede”; en dieselfde by die geboortereël oor jou grootouers. |
| O8 | **Ontbrekende lidwoorde.** `plek.n.toLowerCase()` en `tt.n.toLowerCase()` is sonder ’n lidwoord in ’n sin ingeplak. | `lewe.js`, `data.js` | ✅ “Huur vir **’n** agterkamer by ’n huis”, “Huur **’n** kamer in ’n kommune”; en ’n nuwe `lk`-veld per toestand: “jy het **’n gebreekte been**”, “**’n maagvirus**”, “**’n rugbesering**”, “**die nagevolge van ’n beroerte**”, en “**HIV**” in plaas van “hiv”. |
| O9 | **Geslagsooreenkoms.** Oral waar ’n hardgekodeerde manlike vorm gestaan het waar die persoon ’n vrou kan wees. | `lewe.js`, `aksies.js`, `gebeure.js`, `skerm.js` | ✅ Jou **eggenoot** (“uit **haar** pos getree”, “**haar** werk verloor” — ook as hy ’n man is), jou **kind** (“ek betaal **sy** klasgeld”, “**Hy** kry ’n beurs”, “**Sy** punte is goed genoeg”, “**sy** eerste rugbywedstryd” → netbal vir ’n dogter), die **klasmaat** (“**sy** kosblik gedeel”), die **familielid** (“het gesê **hulle** kan nie help nie” → hy/sy), die **kleinkind** en die **skooltoer-kind** (“hy” → “hy of sy”, en die naam self), die **vlagverhaal** van die nuwe kind (die vlag onthou nou ook die geslag), die **grafsteen** (“speel **sy** lewe verder”), en die **troeteldier** (nuwe `geslag`-veld plus `dierHy()`/`dierHom()`: “Die dierearts dink **sy** sal langer lewe”). |
| O10 | **I1 — “op die rugbyveld gestry”** ongeag geslag of skool. | `lewe.js` | ✅ `klasRusiePlek()`: twee meisies stry **op die netbalbaan**, en by tuisonderrig **oor die tafel**. |
| O11 | **“Bernard is swanger.”** Die spel het altyd die maat se naam gebruik — ook as die speler self die vrou is. | `lewe.js` | ✅ Is jy die vrou, staan daar “**Jy** is swanger”. |
| O12 | **“Pa was nie beïndruk nie”** vir ’n kind sonder ’n pa (die `geenPa`-vlag) of met ’n pa wat oorlede is. | `gebeure.js` | ✅ `ouerWoord()` gee “Pa”, “Ma” of “Die huis”, na wie ook al nog leef. |
| O13 | **“Jy nie”** op die Gesond-blad. `GEWOONTES.vlakke[0]` was net `'nie'`, en vier verskillende rame het dit anders probeer gebruik. | `data.js`, `uitleg.js`, `lewe.js`, `aksies.js` | ✅ `vlakke` is nou die stuk wat ná “jy” kom: “jy **drink nie**”, “jy **rook soms**”, “jy **is verslaaf aan drank**”. Al vier rame (die blad, die spiraal-log, “Dit is nou erger”, en die ophou-venster) is daarby aangepas; die statusreël maak “Verslaaf aan drank” daarvan. |
| O14 | **Hoofletter middel-in ’n sin.** “Jy kom uit ’n familie wat baie oud word — **J**ou ouma se ma het 97 geword.” | `uitleg.js` | ✅ Dit is nou twee sinne. |
| O15 | **Anglisismes** in speler-sigbare teks. | `aksies.js`, `uitleg.js` | ✅ “Gaan **gym** toe” en “Oefen in die **gym**” → **gimnasium**. |
| O16 | **ALL-CAPS as beklemtoning** pas nie by die res van die teks nie. | `gebeure.js` | ✅ “Die meubelwinkel het **JOU** gedagvaar” → “het **jóú** gedagvaar”. |
| O17 | **Twee getalle langs mekaar in plaas van hul som.** Die ophou-venster het “19 + 30% kans” gewys. | `aksies.js` | ✅ Dit wys nou die som: “**49%** kans”. |
| O18 | **Teks wat nie by die kode pas nie.** Die vraag sê “’n jaar se salaris”, maar die kode vat 20% van jou inkomste. | `gebeure.js` | ✅ “’n **deel van** ’n jaar se inkomste”. |
| O19 | **Dieselfde naam twee keer.** “In jou klas … Andries, Andries en Marko”, twee oumas wat albei Anel heet, en “Andries is getroud met **Andries** Swanepoel”. | `lewe.js` | ✅ `maakGroep()`, `maakGrootouer()` en `kindMaat()` probeer tot twaalf keer vir ’n naam wat nog nie in jou lewe is nie. |
| O20 | **“Andries (Jou baas) is oorlede.”** `rol()` het vir ’n baas “Jou baas” gegee, wat in hakies verkeerd lees. | `lewe.js` | ✅ `baas:'Baas'`. |
| O21 | **“Die baba is in ’n privaat kraamsaal, kontant gebore (R0).”** | `lewe.js` | ✅ “… **kontant betaal** gebore”, die bedrag val weg as dit nul is, en vir ’n tienerouer staan daar “**deur jou ouers betaal**” — want dit is wie regtig betaal het. |
| O22 | **’n Onvoltooide sin.** “Jy het karate te lank laat lê. Jy **kan dit skaars meer**.” | `lewe.js` | ✅ “… Jy kan dit skaars meer **doen**.” |
| O23 | **`na` waar `ná` hoort.** | `lewe.js`, `aksies.js` | ✅ “vriende gebly **ná** laerskool / ná skool / ná die werk / ná jou studies / ná jou uitsluiting”, “verdien (**ná** belasting)” (twee plekke), “**Ná** twee uitsluitings neem geen universiteit jou weer nie”. |
| O24 | **Klein leestekens en konsekwentheid.** | `data.js`, `minispel.js`, `onderwereld.js`, `ontsnap.js` | ✅ “taxi-staanplek” en “taxistaanplek” was albei in gebruik (nou een vorm); “Die bal rol **...**” → ’n egte ellips; en twee oorblywende drieledige uitdrukkings waarvan albei takke dieselfde was (`l.tronk===1 ? ' jaar' : ' jaar'`). |
| O25 | **I5 — “Iemand saamvat kos 80% meer”** sonder om te sê hoekom dit nie 100% is nie. | `aksies.js` | ✅ “80% meer — **julle deel ’n kamer** — maar is baie lekkerder”. |

### Logiese foute

| # | Probleem | Waar | Gedoen |
|---|---|---|---|
| O26 | **Gebeure wat vuur in ’n toestand waarin hulle onmoontlik is.** Dit is die gebruiker se hond-voorbeeld: ’n hond volg jou huis toe terwyl jy in die tronk sit, jou geyser bars terwyl jy op straat slaap, jou matriekafskeid is ’n groot sukses nadat jy die skool verlaat het. Van die 197 gebeure het **nul** na `s.tronk` of `s.vlug` gekyk en net vyf na `s.dakloos`. | `lewe.js`, `gebeure.js` | ✅ Elke gebeurtenis het nou ’n **`waar`-veld** langs `min`/`max`/`as`, en `lukrakeGebeure()` toets dit saam met die res. Vier waardes: **niks** = die gewone lewe buite (die verstek, want dit geld vir die meeste), **`'enige'`** = oral, ook toegesluit en op straat (die liggaam en die jare: griep, grys hare, ’n knie wat gaan staan — 11 gebeure), **`'tronk'`**, en **`'straat'`** (die vyf dakloosgebeure se `as:`-toets is hierheen verskuif). Die verstek keer dus voortaan **elke** gebeurtenis wat nie uitdruklik anders gemerk is nie uit die tronk en van die straat af. **Gemeet:** 400 tronklewens, 400 dakloos-lewens en 400 lewens wat die skool op 16 verlaat — **0 oortredings** teen ’n lys verbode reëls (`beweer.js`), teenoor honderde voorheen. |
| O27 | **Skoolgebeure sonder ’n skool.** Dieselfde probleem op ’n ander as: die boelie in die gang, die eksamenvraestel, die beroepsdag en die wiskunde-olimpiade het gevuur nadat jy die skool verlaat het. | `lewe.js`, `gebeure.js` | ✅ Drie helpers: **`opSkool()`** (jy kry werklik onderrig), **`opHoerskool()`** en **`inKlas()`** (daar is ’n egte klas — sien O30). 26 gebeure is daarmee gemerk. |
| O28 | **Gebeure wat iets aanneem wat jy nie het nie.** | `gebeure.js`, `lewe.js` | ✅ ’n `as:`-toets by elkeen: **’n motor** (“Jou motor se diens is agterstallig” het gevuur sonder ’n motor — `hetMotor()`), **’n huis** (“Die geyser, die dak of die pomp het gebreek”, “Jy het ’n bank in die tuin gesit” — `hetHuis()`), **’n eie dak** (die geyser wat bars en die yskas wat afskakel, by jou ouers se huis — `eieDak()`), **’n huurplek** (“Jou huisgenoot het getrek”), **’n werk** (“’n Werwer in Perth bel: dieselfde werk, drie keer die geld” terwyl jy werkloos is; “jou werkgewer wil jou verskuif”; die onderwyser se vergadering “in werksure”), **inkomste** (die SAID se brief, en ’n hele Saterdag met e-filing), **’n lewende ouer** (“Jou ouers vra wat jy nou gaan doen”, “die mense wat jou grootgemaak het is nou oud”, en die hengeltog wat altyd “jou pa” gesê het), **’n broer of suster** (die laaste stukkie melktert, waar die “Deel dit”-opsie niemand gehad het om mee te deel nie) en **kinders** (“jou lewensverhaal vir die kinders”). |
| O29 | **’n Matriekafskeid buite matriek.** Dit was `min:16, max:18` sonder enige toets, dus kon ’n Graad 10-leerling of iemand wat lankal weg is uit die skool een hê. | `gebeure.js` | ✅ Nou `opHoerskool() && s.skool.graad>=12`. |
| O30 | **Tuisonderrig het klasmaats gegee.** “In jou klas by **Tuisonderrig by die huis** het jy Andries, Lize en Elmarie ontmoet” — en daarna al die klasgebeure. | `data.js`, `lewe.js`, `gebeure.js` | ✅ ’n `tuis`-vlag op daardie skool; `maakKlasmaats()` skryf “Jy leer by die huis. Daar is geen klas om in te sit nie” en maak niemand nie; en `inKlas()` hou die elf klasgebonde gebeure (die klas se troeteldier, die spelbye, die ruit, die nuwe kind in die klas, die boelie in die gang …) weg. |
| O31 | **Familie wat jou intrek sonder dat daar ’n verhouding is.** Dit is die gebruiker se broer-voorbeeld: `familieHuis()` het net gevra of jou broer **leef** en **21+** is — nie of julle mekaar ken nie. | `data.js`, `lewe.js` | ✅ Twee nuwe konstantes in `data.js`: **`OUERHUIS_BAND = 25`** (’n ouer neem jou makliker terug in) en **`FAMILIEHUIS_BAND = 50`** (’n broer of suster se spaarkamer vra meer). `familieHuis()`, die nuwe `ouerHuis()`, `terugvalBlyplek()`, `huisMense()` en `familieHelpers()` gebruik hulle almal. `DAKLOOS_FAMILIE_BAND` (72) bly hoër, want dit is familie wat jou **self** op straat kom soek sonder dat jy gevra het. `sekwestrasie()` en `verkoopBateUit()` loop nou ook deur `terugvalBlyplek()` in plaas van hul eie kopie van die reël. |
| O32 | **E9 — ’n 16-jarige kon ’n 28-jarige uitvra.** `soekLief()` het ’n gaping van 12 jaar vanaf 15 toegelaat, en `vreemdeling()` het ’n vreemdeling van jou ouderdom ±4 gegee. | `aksies.js` | ✅ `liefOuderdomPas()`: onder 18 moet **albei** onder 18 wees en die gaping hoogstens **twee** jaar; van 18 af bly die 12 jaar. Dit geld vir die kenniselys, die “Vra op ’n date uit”-knoppie op ’n persoon se kaart, én vir die vreemdeling wat jy ontmoet. |
| O33 | **’n Grootmens sleep ’n kind in ’n roof in.** `misdaadMaat()` het enigiemand van 12 af gewys. | `misdaad.js` | ✅ Is jy 18+, moet jou maat 18+ wees; is jy ’n kind, moet dit ’n maat van jou eie ouderdom wees (±4 jaar). |
| O34 | **Toestand-oorgange wat nie kan nie.** Trou, ’n baba probeer, ’n motor of ’n huis koop en iemand uitvra — alles vanuit die tronk. | `aksies.js` | ✅ `!s.tronk` by “Vra ten huwelik”, “Probeer vir ’n baba”, `koopBate()` en `soekLief()`. (`doenMisdaad()` kry dieselfde wag, vir die geval iets dit buite die blad af roep.) |
| O35 | **“Waar gaan jy bly?”** is ook gevra terwyl jy toegesluit was of op straat geslaap het. | `lewe.js` | ✅ `vraBlyplek()` keer albei. |
| O36 | **Sakgeld op straat.** ’n Dakloos 16-jarige het elke jaar sakgeld van sy ouers gekry. | `lewe.js` | ✅ `sakgeldJaar()` toets nou ook `s.dakloos` (dit het al na `s.tronk` gekyk). |
| O37 | **Die aftreeoord het niks beteken nie.** Jy betaal R220 000 om in te trek, die `aftreeoord`-vlag word gestel — en dan vra `blyplekJaar()` die volgende jaar weer huur asof niks gebeur het nie. | `gebeure.js`, `lewe.js`, `uitleg.js` | ✅ Die keuse stel `s.blyplek = 'aftreeoord'`, `blyplekJaar()` lees die vlag en vra geen huur meer nie, en die Bates-blad wys ’n kaart in plaas van ’n lys huurplekke. |
| O38 | **`kies()` twee keer in een uitdrukking.** `kies(f).band = klem(kies(f).band + …)` lees die band van een mens en skryf dit by ’n **ander**. | `gebeure.js` | ✅ Twee plekke: die familielid wat vir ’n begrafnis geld leen, en die kleinkind wat ’n week kom bly. |
| O39 | **Dooie kode wat niks doen nie.** | `gebeure.js` | ✅ `Math.max(s.geld-v, s.geld-v)` (altyd dieselfde waarde — die foon se skerm het dus nooit niks gekos nie, maar die bedoeling was duidelik ’n gewone rekening), `s.geld += 0`, en `s.aansien = (s.aansien||0) + 0` en `s.aansien = (s.aansien||0)` by die sopkombuis en die handsak. |
| O40 | **Vlae wat gestel word maar nooit gelees word nie.** A13 se les, nog elf keer. | `gebeure.js`, `aksies.js`, `ontsnap.js` | ✅ `besigheidBegin`, `gapingsjaar`, `gesprekGehad`, `grootKliënt`, `groottoer`, `kopieGevang`, `olimpiade`, `tweedeKans`, `vennootIn`, `vlugVry` en `werkGeruil` is verwyder; `aftreeoord` word nou gelees (O37). Die oudit is ’n skrif in die harnas (`vlagoudit.sh`): dit stel elke `stelVlag`-skryf teenoor elke lees op. **Nou: 0 gestel-maar-nie-gelees, 0 gelees-maar-nie-gestel.** Wil ’n mens later ’n beloning vir een van hulle skryf, is dit nuwe inhoud en hoort dit in ’n nuwe fase. |
| O41 | **Ouers wat nie bestaan nie, tree op.** “**Jou ouers** het jou staatshospitaal toe gevat” en “**Jou ouers** het dit swaar gevat” het ook gestaan vir ’n kind wie se ouers albei dood is. | `lewe.js` | ✅ Albei noem nou die ouer by die naam, of laat die sin weg as daar niemand is nie. |
| O42 | **“Jy is nou ’n oupa!”** by elke kleinkind, nie net die eerste nie. | `lewe.js` | ✅ Net by die eerste. |
| O43 | **Die jaarmerk voor die toets.** `beginGewoonte()` het `gedoen` en `gewoonteLaas` gestel **voordat** dit getoets het of jy oud genoeg is — dus het ’n geweierde poging die gewoonte “lewendig” gehou en die verval-reël uitgestel. | `aksies.js` | ✅ Die ouderdomstoets staan nou eerste. |
| O44 | **Die verkeerde mens betaal.** Die yskas wat afskakel was `min:12` en het die kind laat betaal vir die kos in sy ouers se yskas. | `gebeure.js` | ✅ Nou `min:18` plus `eieDak()`. |
| O45 | **Alle ouderdomme in ’n lys.** `maakGroep()` kon dieselfde naam twee keer kies (sien O19) — dit is ’n logiese fout sowel as ’n taalfout, want twee broers of twee oumas met dieselfde naam is nie ’n gesin nie. | `lewe.js` | ✅ Sien O19. |
| O46 | **Die vlugteling se twee gebeure** is in Fase 9 met `GEBEURE.push()` bygevoeg en sou deur O26 se verstek uit die straat-toestand gehou gewees het. | `ontsnap.js` | ✅ Albei is `waar:'enige'` gemerk; hul eie `as:` keer steeds dat hulle in die tronk vuur. |
| O47 | **Die dorp word geïgnoreer.** “Jy het ’n pragtige sonsondergang **oor Tafelberg** gesien” terwyl jy in Vryburg woon, 1 200 km daarvandaan. | `gebeure.js` | ✅ Dit gebruik nou `s.dorp`. |

### Hoe dit getoets is

’n Headless harnas in die scratchpad (nie in die repo nie) laai die lêers in
`index.html` se volgorde met stubs vir `document`, `localStorage` en `window`,
en antwoord die modale self.

* **Crash-toets.** 2 000 passiewe lewens (net “+1 jaar”, gemiddelde ouderdom
  56,7) plus 300 lewens elk in die tronk, op straat, op die vlug, in die
  onderwêreld en met kinders — **0 foute**.
* **Bewerings.** `beweer.js` haak `noteer()` af, onthou in watter toestand elke
  log-reël geskryf is, en toets dit teen ’n lys reëls wat daar nie mag wees nie
  (die hond, die geyser, die yskas, die matriekafskeid, die sakgeld, die
  blyplekvraag, die klasrusie …). 400 tronklewens, 400 dakloos-lewens en 400
  lewens wat die skool op 16 verlaat: **0 oortredings**.
* **Taal-sif.** Elke log-reël, modaalteks, knoppie en wenk oor al daardie lewens
  word versamel (≈162 000 reëls), met plekhouers vir name en bedrae ontdubbel
  tot sowat 7 900 sjablone, en dan teen ’n lys regexe getoets (ontbrekende
  tweede `nie`, “1 jare”, `(e)`, ’n punt in ’n persentasie, dubbele spasies,
  ontbrekende diakritiese tekens, dubbele woorde, Engelse oorblyfsels). Dit loop
  ook oor elke string-literal in die bron. **Skoon**, buiten vals treffers
  (“Kontant, geen kontrak” is ’n geldige fragment; `hoerskool` is ’n interne
  sleutel, nie teks nie). ’n Paar honderd unieke reëls is ook self deurgelees —
  dit is waar O7, O11, O13, O19, O20 en O21 uitgekom het, wat geen regex sou
  vang nie.
* **Ou stoor-data.** ’n Lewe in die Fase 1-formaat (geen spaargeld, geen gene,
  geen vaardighede, geen dier-geslag) laai steeds en speel 40 jaar verder sonder
  ’n fout; ’n ou `eieOrg` met die ou lede-formaat skakel om; en die nuwe
  `aftreeoord`-blyplek breek niks. Elke nuwe veld (`d.geslag`, `lk` per toestand,
  `tuis` per skool, `s.blyplek==='aftreeoord'`) kry sy verstek in `vulNuweVelde()`.
* **In die blaaier**, 375 breed: geboorte, kleuterskool, die laerskoolkeuse
  (tuisonderrig — geen klasmaats), Graad 8 by Hoërskool Durbanville, agt jaar
  tronk (net liggaamsgebeure), die Aktiwiteite-, Mense-, Gesond- en Bates-blaaie,
  die aftreeoord-kaart en die dakloos-paneel. **Geen konsole-foute.**

### Wat oopgelaat is

* Die matriekpersentasies loop maklik teen 100% vas (Lewensoriëntering se +18 op
  ’n `klem(…, 0, 100)`). Dit is ’n **balans**-item, nie ’n taal- of logikafout
  nie, en dit hoort by C3 wanneer die drie NSC-slaagvlakke gedoen word.
* Die elf vlae van O40 is verwyder eerder as gelees. Elkeen ’n beloning gee
  (’n gapingsjaar wat later iets beteken, ’n besigheidsvennoot wat terugkom)
  is **nuwe inhoud**, nie ’n fout nie.
* ’n Afgetrede mens kan steeds vir ’n werk aansoek doen en sy pensioen bly
  aanhou. Dit is nie onmoontlik nie (pensioenarisse werk), maar die wisselwerking
  tussen `s.afgetree` en `s.beroep` is nog nooit ontwerp nie.

---

## J. Voorgestelde orde van werk

~~**Fase 1 — fixes (A1–A16).**~~ **✅ KLAAR (22 Oktober 2026).** Al 16 items is gedoen — sien die **Gedoen**-kolom in afdeling A. Die spel is nou eerliker: die fliek betaal reg, casino en Lotto verloor geld soos hulle moet, en die tronk breek nie meer jou skoolloopbaan nie.

~~**Fase 2 — geld reg kry (B1, B2, B5, B6, B13, B14, B17).**~~ **✅ KLAAR (22 Oktober 2026).** Al sewe items is gedoen — sien die **Gedoen**-kolom in afdeling B. Geld beteken nou iets: jy moet êrens bly en daarvoor betaal, 'n huis koop jy met 'n verband oor 20 of 30 jaar, spaargeld groei en skuld vreet. *Inflasie (B4) is doelbewus uitgelaat*, soos beplan.

~~**Fase 3 — skool en werk reg kry (C1, C2, C4, C9, D3, D6).**~~ **✅ KLAAR (23 Oktober 2026).** Al ses items is gedoen — sien die **Gedoen**-kolomme in afdelings C en D. Skool beteken nou iets: in Graad 10 kies jy vakke, en sonder Wiskunde is Ingenieurswese, Geneeskunde, Rekeningkunde en Rekenaarwetenskap vir altyd toe; matriek gee ’n APS uit 42 in plaas van een persentasie; ’n graad is so lank as wat hy regtig is; jy kan ’n jaar druip en uitgeskop word; daar is deeltydse werk vir wie nog op skool is; en ’n salaris groei nie meer verby sy pos se plafon nie.

~~**Fase 4 — gesin en gesondheid (E1, E4, E7, E12, F1, F2, F4, F9).**~~ **✅ KLAAR
(23 Oktober 2026).** Al agt items is gedoen — sien die **Gedoen**-kolomme in afdelings
E en F. ’n Mens word nou in ’n egte gesin gebore (grootouers wat jou kinderjare vul en
mettertyd sterf), ’n baba kan ook buite ’n huwelik kom en voorbehoeding is ’n keuse met
’n prys, jou kinders leef hul eie lewe tot by húlle kinders, en jou eggenoot verdien
self. Die liggaam het regte siektes, ’n mediese fonds teenoor die staatshospitaal
teenoor ’n privaat rekening wat jou kan ruïneer, en drank/sigarette/dwelms met ’n egte
greep — en die dood volg nou uit al daardie dinge plus die familiegeskiedenis waarmee
jy gebore is. *F9 was nie in die oorspronklike Fase 4-lysie nie, maar is bygevoeg: ’n
siekte sonder ’n doodsverband beteken niks.*

~~**Fase 6 — nuwe inhoud (H1, H13, H14, H3, H4).**~~ **✅ KLAAR (23 Oktober 2026).**
Al vyf items is gedoen — sien die **Gedoen**-kolom in afdeling H. Die spel is nou
herspeelbaar: as jy sterf, kies jy een van jou kinders en speel sy lewe verder, met sy
deel van die boedel, sy eie geskiedenis en ’n familie wat een plek opgeskuif het.
Langs ’n werk kan jy nou jou eie besigheid loop (11 soorte, wins word belas, verlies
kom uit jou sak), en veertien vaardighede bou oor jare op en maak geld, werk, gebeure
en ’n besigheid oop. Daar is 197 gebeure in plaas van 46, en ’n keuse wat jy op tien
maak, kan jou op dertig weer in die gesig kyk.

~~**Fase 7 — mini-spele, beleggings en hosting (K1–K4).**~~ **✅ KLAAR (24 Oktober
2026).** Sien afdeling K. Daar is nou ’n raamwerk vir mini-spele waarin jy self speel
of dit vinnig laat gebeur, en die casino is vier egte spele (blackjack, roulette,
slots, video poker) waarvan elkeen oor die lang termyn geld verloor. Die JSE is nou
die hoë-risiko-, hoë-opbrengs-belegging wat dit moet wees: oor 20 jaar klop dit die
spaarrekening in 83% van gevalle, maar oor een tot drie jaar verloor dit een keer uit
drie. Die spel is gereed vir GitHub Pages.

~~**Fase 8 — misdaad uitbrei (L1–L6, G1–G3, G8, G4 deels).**~~ **✅ KLAAR (24 Oktober
2026).** Sien afdeling L. Jou motor is nou jou beste ontsnapvoertuig (8–25% minder
risiko, en ’n jaagtog as dit skeef loop), hitte maak ’n misdaadreeks al riskanter,
goedere gaan teen 30–60% na die heler, en die hof is ’n proses: jeugreg vir kinders, en
vir grootmense ’n prokureur, borgtog, ’n pleit, en ’n vonnis van ’n waarskuwing tot
twintig jaar. Daar is tien misdade (met witboordjie- en kuberbedrog) en vyf
misdaad-mini-spele. Misdaad betaal per poging, maar oor ’n lewe kos dit dekades.
**Fase 8b** het die jaagtog oorgedoen (kanse per motor, foutloos is altyd weg, langer en
moeiliker met erns en hitte) en ’n onderwêreld bygevoeg: rep, vier organisasies met
range en jobs, en jou eie organisasie waar mense werf die moeilikste deel is.

~~**Fase 9 — tronk-ontsnapping en die lewe op die vlug (M1–M4, G5).**~~ **✅ KLAAR (25
Oktober 2026).** Sien afdeling M. ’n Ontsnapping is nou iets wat jy oor jare beplan —
’n tonnel, ’n tou, ’n uniform, die roete, ’n helper, ’n omgekoopte bewaarder, ’n kar —
en dan sluip jy self deur ’n stealth-mini-spel van bo af (foutloos is altyd uit). Daarna
is jy ’n vlugteling: elke jaar soek die polisie jou, ’n vals ID maak die gewone lewe
weer oop, en na 10 of 15 jaar is jy vry — of jy gee jouself oor.

**Klaar tot dusver:**

1. Die opdeel in aparte lêers (sien Lêerstruktuur bo), sodat die latere fases nie in
   een lêer van 2 000+ reëls hoef te werk nie.
2. **Fase 1 (A1–A16)** — al die P0-foute.
3. **Fase 2 (B1, B2, B5, B6, B13, B14, B17)** — huur, verband, rente, skuld,
   lewenskoste, sakgeld en pensioen.
4. **B18 + B19 (23 Okt 2026)** — die bodem van die ekonomie: die spel vra jou om te
   verkoop voordat die balju kom, en wie niks oor het nie, beland op straat met ’n egte
   pad terug. Sien die dakloosheid-blok in afdeling B.
5. **Fase 3 (C1, C2, C4, C9, D3, D6)** — vakkeuses in Graad 10, die APS uit 42,
   regte graadlengtes, druip en akademiese uitsluiting, deeltydse werk, en ’n
   plafon per pos op salarisse.

6. **Fase 4 (E1, E4, E7, E12, F1, F2, F4, F9)** — grootouers, ’n baba sonder ’n
   huwelik, kinders met ’n egte lewensloop, ’n eggenoot wat verdien, siektes, die
   mediese fonds teenoor die staatshospitaal, drank/rook/dwelms, en ’n dood wat
   uit alles daarvan volg.

7. **Fase 6 (H1, H3, H4, H13, H14)** — die generasiespel, vaardighede en
   stokperdjies, ’n eie besigheid, 197 gebeure, en vlae wat onthou. I13 (die oom se
   testament wat oor en oor kon vuur) is in dieselfde slag reggemaak.

8. **Fase 7 (K1–K4)** — die mini-spel-raamwerk, die casino as blackjack, roulette,
   slots en video poker, ’n JSE wat oor die lang termyn wen, en GitHub Pages.

9. **Fase 8 (L1–L9; G1–G3, G8, G4 deels)** — motors as ontsnapvoertuig, hitte, die
   heler, die hof en jeugreg, tien misdade met ’n vertraagde oudit, vyf
   misdaad-mini-spele, ’n jaagtog met kanse, rep en kriminele organisasies.

10. **Fase 9 (M1–M4; G5)** — ontsnapping oor jare beplan, ’n stealth-mini-spel met
   ’n foutlose-pad-waarborg, en die lewe op die vlug.

11. **Playtest N1–N5 (25 en 28 Okt 2026)** — die `?dev`-paneel, veilige
   organisasie-jobs, ’n betroubare pad na bo, werf uit vriende en familie, en
   elke lid apart.

12. **Afdeling O (28 Okt 2026)** — **al die taal- en logikafoute.** 47 items:
   25 taalfoute (diakritiese tekens, die tweede `nie`, woordorde, lyste,
   enkelvoud/meervoud, ranggetalle, lidwoorde, geslagsooreenkoms) en 22 logiese
   foute. Die grootste daarvan is die nuwe **`waar`-veld** op elke gebeurtenis:
   voorheen het al 197 gebeure oral gevuur, en nou volg ’n hond jou nie meer
   huis toe terwyl jy in die tronk sit nie. Familie neem jou ook net in as die
   band daar is, en ’n 16-jarige kan nie meer ’n 28-jarige uitvra nie (E9). Vier
   nuwe taalhelpers in `hulp.js` vat elke herhalende fout op een plek vas.

**Volgende aan die beurt:** Fase 10 (vaardigheid-mini-games) — afdeling O het die taal en die logika skoongemaak, so die volgende werk kan weer inhoud wees. Daarna: die drie wat die meeste sal
byvoeg, is waarskynlik **H2** (prestasies op die grafsteen — dit gee die
generasiespel ’n telling om voor te speel), **H9** (die motor as ’n volle stelsel:
lisensietoets, versekering, diens, ongeluk) en **H8** (eiendom om te verhuur, wat die
enigste groot gaping in die ekonomie is noudat ’n besigheid bestaan). Sien ook die
twee sterretjies hieronder wat Fase 3 en Fase 4 oopgelaat het.

⭐ **Twee dinge wat Fase 3 oopgelaat het en wat die moeite werd is om volgende te
doen.** Eerstens **C3** (die drie NSC-slaagvlakke): die APS is nou daar, maar ’n
universiteit vra in die werklikheid ook ’n *Bachelor's pass*, en `s.skool.uitslag`
hou al elke vak se vlak, so dit is ’n klein stuk werk met ’n groot effek op
akkuraatheid. Tweedens **C5** (Medies en Regte is nog Amerikaans gemodelleer): die
LLB en die MBChB staan nou as voorgraadse grade in `STUDIES`, maar die ou “Mediese
Skool” en “Regskool” staan nog langs hulle in `NAGRAADS`. Dit werk, en niks breek
nie, maar dit is twee paaie na dieselfde pos — C5 moet die ou een uithaal.

⭐ **Wat Fase 4 oopgelaat het.** **E5** (nege maande, tweelinge, miskrame) en **E6**
(aanneming, IVF, en dat geslag geïgnoreer word) staan nog: ’n baba is steeds oombliklik.
Die onbeplande swangerskap (E4) kyk wel al na geslag — twee mans kry nie per ongeluk ’n
baba nie — maar die “Probeer vir ’n baba”-knoppie nie, want dit is E6 se werk.
**F3** (geestesgesondheid) en **F6** (ongeskiktheid) pas nou netjies in die nuwe
`TOESTANDE`-lys in: depressie en angs is net nog twee chroniese toestande met ’n
behandelingspad, en dit sou `geluk` eindelik gevolge gee.

⚠ **Een ding om in die oog te hou:** `slim` groei elke skooljaar (skoolbonus plus
“Studeer harder” plus gebeure), so ’n speler wat net “Studeer harder” druk, sit op
matriek dikwels met slimheid 95+ en ’n APS van 42. Dit is nie nuut in Fase 3 nie —
die ou persentasie-gemiddeld het ook 100% gehaal — maar noudat die APS die regte
deure oopsluit, is dit die volgende plek waar die spel te maklik voel. ’n Plafon op
hoeveel slim ’n skooljaar kan gee, sou dit regmaak.
