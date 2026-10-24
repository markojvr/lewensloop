/* ==========================================================================
   2. DATA
   Al die lyste waaruit die spel kies: name, skole, universiteite, beroepe,
   bates, misdade, boeke, flieks, vakansies, troeteldiere.
   Wil jy inhoud byvoeg, is dit meestal hier waar jy dit doen.
   ========================================================================== */

var MANSNAME=['Marko','Pieter','Johan','Dirk','Jaco','Werner','Hendrik','Francois','Wikus','Stefan',
  'Ruan','Dawid','Andries','Kobus','Thys','Gideon','Riaan','Louis','Bernard','Christiaan','Tiaan',
  'Ernst','Anton','Morne','Jannie','Heinrich','Cobus','Danie'];
var VROUENAME=['Anel','Marieke','Hanlie','Suzanne','Elmarie','Karien','Lize','Annika','Michelle',
  'Elsabe','Mariska','Nadia','Carike','Ilse','Riana','Juanita','Marlize','Sanet','Antoinette',
  'Danielle','Chanel','Zandri','Nicolene','Bianca','Retha','Leandri','Marelize'];
var VANNE=['van der Merwe','Botha','Pretorius','du Plessis','Kruger','Venter','Nel','Joubert','Steyn',
  'Coetzee','Fourie','Smit','Bezuidenhout','van Zyl','Labuschagne','Oosthuizen','Erasmus','Marais',
  'Visser','Swanepoel','Loubser','Jordaan','Theron','Malan','Rossouw','Burger','Olivier'];
var DORPE=['Durbanville','Kaapstad','Stellenbosch','Paarl','Worcester','George','Pretoria','Centurion',
  'Johannesburg','Bloemfontein','Durban','Gqeberha','Potchefstroom','Upington','Polokwane','Mbombela',
  'Kimberley','Oudtshoorn','Hermanus','Vryburg','Malmesbury'];
var LAERSKOLE=[
  {n:'Laerskool Eversdal', t:'Openbare skool', koste:0, slim:2, geluk:2},
  {n:'Laerskool Welgemoed', t:'Openbare skool', koste:0, slim:2, geluk:1},
  {n:'Laerskool Morester', t:'Klein plattelandse skool', koste:0, slim:1, geluk:3},
  {n:'Sint Michael Privaatskool', t:'Privaatskool', koste:44000, slim:4, geluk:0},
  {n:'Tuisonderrig by die huis', t:'Tuisskool', koste:0, slim:3, geluk:-2}
];

/* 'bied' is die keusevakke wat die skool in Graad 10 aanbied (C1).
   Nie elke skool bied alles nie: 'n tegniese skool het die werkswinkels
   en nie 'n kunsklas nie, 'n akademieskool die ander kant om. */
var SKOOL_BIED=['Fisiese Wetenskappe','Lewenswetenskappe','Rekeningkunde','Besigheidstudies',
  'Ekonomie','Geografie','Geskiedenis','Rekenaartoepassingstegnologie','Toerisme',
  'Verbruikerstudies','Visuele Kunste'];
var HOERSKOLE=[
  {n:'Hoerskool Durbanville', t:'Openbare skool', koste:0, slim:2, gesondheid:1, geluk:2,
    bied:SKOOL_BIED.concat(['Inligtingstegnologie','Dramatiese Kunste','Gasvryheidstudies'])},
  {n:'Hoerskool Stellenberg', t:'Openbare skool', koste:0, slim:2, gesondheid:2, geluk:1,
    bied:SKOOL_BIED.concat(['Inligtingstegnologie','Musiek','Landbouwetenskappe'])},
  {n:'Paul Roos Gimnasium', t:'Sport- en akademieskool', koste:70000, slim:3, gesondheid:4, geluk:2,
    bied:SKOOL_BIED.concat(['Inligtingstegnologie','Dramatiese Kunste','Musiek'])},
  {n:'Die Akademie', t:'Privaat akademieskool', koste:98000, slim:5, gesondheid:0, geluk:-1, vereisSlim:58,
    bied:['Fisiese Wetenskappe','Lewenswetenskappe','Rekeningkunde','Besigheidstudies','Ekonomie',
      'Geografie','Geskiedenis','Inligtingstegnologie','Musiek','Visuele Kunste']},
  {n:'Tegniese Hoerskool Bellville', t:'Tegniese skool', koste:0, slim:1, gesondheid:2, geluk:3,
    bied:['Fisiese Wetenskappe','Lewenswetenskappe','Ingenieursgrafika en Ontwerp',
      'Siviele Tegnologie','Elektriese Tegnologie','Meganiese Tegnologie',
      'Rekenaartoepassingstegnologie','Besigheidstudies','Geografie','Toerisme']}
];

/* C2 — 'n universiteit vra 'n APS, nie 'n persentasie nie. Elke program
   het sy eie APS (sien STUDIES); 'apsEkstra' is wat HIERDIE universiteit
   bo-op daardie getal vra. 'n Gesogte plek vra meer vir dieselfde graad.
   'nie' is die programme wat die plek nie aanbied nie. */
var UNIES=[
  {n:'Universiteit Stellenbosch', koste:76000, apsEkstra:2, aansien:3},
  {n:'Universiteit van Kaapstad', koste:84000, apsEkstra:4, aansien:4},
  {n:'Universiteit van Pretoria', koste:68000, apsEkstra:0, aansien:3},
  {n:'Noordwes-Universiteit', koste:58000, apsEkstra:-2, aansien:2},
  {n:'Universiteit van die Vrystaat', koste:52000, apsEkstra:-3, aansien:2,
    nie:['Geneeskunde','Argitektuur']},
  {n:'UNISA (afstandsonderrig)', koste:30000, apsEkstra:-5, aansien:1,
    nie:['Geneeskunde','Ingenieurswese','Argitektuur','Kuns en Drama']}
];

var RYKDOM=[
  {n:'baie arm', f:0.3}, {n:'arm', f:0.6}, {n:'werkersklas', f:1}, {n:'werkersklas', f:1},
  {n:'middelklas', f:1.6}, {n:'middelklas', f:1.6}, {n:'welgesteld', f:3}, {n:'ryk', f:6}
];

/* C2 en C4 — elke studierigting is nou 'n egte SA-graad met sy egte
   lengte en sy egte toelatingsvereistes:
     jare   = hoe lank die graad duur (BCom 3, BEng 4, LLB 4, MBChB 6, BEd 4)
     aps    = die APS uit 42 wat die program vra (die universiteit tel sy
              eie apsEkstra daarby — sien UNIES)
     vak    = vakke wat jy MOET gehad het, met die NSC-vlak (1-7) wat jy
              daarin moes kry. Vlak 5 = 60-69%, vlak 6 = 70-79%.
     ofVak  = een van hierdie vakke op die gegewe vlak is genoeg.
   C1 — dit is hier waar die vakkeuse van Graad 10 bybly: sonder Wiskunde
   is Geneeskunde, Ingenieurswese, Rekeningkunde en Rekenaarwetenskap toe,
   want jy kan nooit 'n vlak in 'n vak kry wat jy nie gehad het nie. */
var STUDIES=[
  {n:'Geneeskunde',       vol:'MBChB',                  jare:6, aps:38,
    vak:{'Wiskunde':5,'Fisiese Wetenskappe':5,'Lewenswetenskappe':5}},
  {n:'Ingenieurswese',    vol:'BIng (Siviel)',          jare:4, aps:33,
    vak:{'Wiskunde':6,'Fisiese Wetenskappe':5}},
  {n:'Rekeningkunde',     vol:'BRek',                   jare:3, aps:30,
    vak:{'Wiskunde':5}},
  {n:'Rekenaarwetenskap', vol:'BSc Rekenaarwetenskap',  jare:3, aps:30,
    vak:{'Wiskunde':5}},
  {n:'Regsgeleerdheid',   vol:'LLB',                    jare:4, aps:30},
  {n:'Argitektuur',       vol:'BSc Argitektuur',        jare:3, aps:30,
    vak:{'Wiskunde':4}},
  {n:'Natuurwetenskap',   vol:'BSc',                    jare:3, aps:28,
    vak:{'Wiskunde':4}, ofVak:{'Fisiese Wetenskappe':4,'Lewenswetenskappe':4}},
  {n:'Besigheidsbestuur', vol:'BCom',                   jare:3, aps:28,
    ofVak:{'Wiskunde':4,'Wiskundige Geletterdheid':6}},
  {n:'Verpleegkunde',     vol:'BVerpl',                 jare:4, aps:26,
    vak:{'Lewenswetenskappe':4}, ofVak:{'Wiskunde':3,'Wiskundige Geletterdheid':5}},
  {n:'Sielkunde',         vol:'BA Sielkunde',           jare:3, aps:26},
  {n:'Kommunikasiekunde', vol:'BA Kommunikasiekunde',   jare:3, aps:26},
  {n:'Opvoedkunde',       vol:'BEd',                    jare:4, aps:24},
  {n:'Kuns en Drama',     vol:'BA Drama',               jare:3, aps:24}
];
/* C5 sal die Mediese Skool en die Regskool later heeltemal uithaal — in
   SA is MBChB en LLB voorgraads, en hulle staan nou al in STUDIES bo.
   Hierdie twee bly voorlopig as 'n tweede pad staan sodat ou stoor-data
   en die bestaande beroepsvereistes nie breek nie. */
var NAGRAADS=[
  {n:'Mediese Skool', jare:4, koste:220000, slim:78, vereis:['Natuurwetenskap','Verpleegkunde']},
  {n:'Regskool', jare:3, koste:180000, slim:72, vereis:null},
  {n:'Meestersgraad', jare:2, koste:95000, slim:66, vereis:null}
];

/* ==========================================================================
   SKOOL EN STUDIE (Fase 3)
   Die vakke wat jy in Graad 10 kies (C1), hoe 'n persentasie 'n APS word
   (C2), en hoe swaar dit is om 'n jaar op universiteit te slaag (C9).
   ========================================================================== */

/* C1 — die NSC vra sewe vakke: twee tale, Lewensorientering, Wiskunde OF
   Wiskundige Geletterdheid, en drie keusevakke.
   'moeilik' is wat die vak aan jou punt doen teenoor jou algemene vlak.
   Dit is die hart van die Wiskunde-keuse: Wiskunde kos jou agt punte,
   Wiskundige Geletterdheid gee jou nege — maar sonder Wiskunde is die
   helfte van die universiteitsprogramme toe. Lewensorientering se +18 is
   nie 'n fout nie; daarom tel dit ook nie vir toelating nie.
   'wisk' merk die vakke wat 'n skool net vir Wiskunde-leerlinge oopmaak. */
var VAKKE=[
  {n:'Afrikaans Huistaal', moeilik:4, verplig:true},
  {n:'Engels Eerste Addisionele Taal', moeilik:2, verplig:true},
  {n:'Lewensorientering', moeilik:18, verplig:true, nieAps:true},
  {n:'Wiskunde', moeilik:-8, kern:true},
  {n:'Wiskundige Geletterdheid', moeilik:9, kern:true},
  {n:'Fisiese Wetenskappe', moeilik:-9, wisk:true,
    sub:'Nodig vir Ingenieurswese en Geneeskunde'},
  {n:'Lewenswetenskappe', moeilik:-2, sub:'Nodig vir Geneeskunde en Verpleegkunde'},
  {n:'Rekeningkunde', moeilik:-5, sub:'Help met BRek, maar Wiskunde is wat tel'},
  {n:'Inligtingstegnologie', moeilik:-7, wisk:true, slim:2, sub:'Jy leer regtig programmeer'},
  {n:'Elektriese Tegnologie', moeilik:-5, wisk:true, sub:'Die pad na ’n elektrisien se ambag'},
  {n:'Meganiese Tegnologie', moeilik:-3, sub:'Draaibanke, sweis en enjins'},
  {n:'Ingenieursgrafika en Ontwerp', moeilik:-3, sub:'Tekenwerk; help met Argitektuur'},
  {n:'Siviele Tegnologie', moeilik:-2, sub:'Bou, messelwerk en loodgieterswerk'},
  {n:'Ekonomie', moeilik:-1},
  {n:'Geskiedenis', moeilik:0, slim:1},
  {n:'Musiek', moeilik:0},
  {n:'Geografie', moeilik:1},
  {n:'Landbouwetenskappe', moeilik:1},
  {n:'Besigheidstudies', moeilik:3},
  {n:'Visuele Kunste', moeilik:4},
  {n:'Dramatiese Kunste', moeilik:4},
  {n:'Rekenaartoepassingstegnologie', moeilik:5, sub:'Word en Excel, nie programmering nie'},
  {n:'Gasvryheidstudies', moeilik:5},
  {n:'Toerisme', moeilik:6},
  {n:'Verbruikerstudies', moeilik:6}
];
var VAKKE_VERPLIG=['Afrikaans Huistaal','Engels Eerste Addisionele Taal','Lewensorientering'];
var KEUSEVAKKE=3;              /* hoeveel keusevakke jy bo die verpligte vier kies */
var VAKKEUSE_GRAAD=10;         /* in watter graad jy kies */

/* C2 — die NSC se sewe vlakke. 'n Vlak is wat 'n persentasie werd is, en
   jou APS is die som van jou ses beste vakke sonder Lewensorientering:
   7 vlakke x 6 vakke = 42. */
var APS_VLAKKE=[
  {vanaf:80, vlak:7, n:'Uitstekende prestasie'},
  {vanaf:70, vlak:6, n:'Verdienstelike prestasie'},
  {vanaf:60, vlak:5, n:'Wesenlike prestasie'},
  {vanaf:50, vlak:4, n:'Gemiddelde prestasie'},
  {vanaf:40, vlak:3, n:'Matige prestasie'},
  {vanaf:30, vlak:2, n:'Basiese prestasie'},
  {vanaf:0,  vlak:1, n:'Ontoereikende prestasie'}
];
var APS_VAKKE=6;               /* hoeveel vakke vir die APS tel */
var APS_MAKS=42;

/* C9 — die kans om 'n universiteitsjaar te slaag. Slim help, hard
   studeer help meer, 'n swaar graad maak dit moeiliker, en die eerste
   jaar is die een waar die meeste mense val. */
var SLAAG_BASIS=64;            /* iemand met slimheid 50 wat niks doen nie */
var SLAAG_SLIM=0.8;            /* elke punt slimheid bo 50 */
var SLAAG_YWER=16;             /* jy het die jaar "Studeer harder" gedoen */
var SLAAG_EERSTEJAAR=-8;       /* die eerste jaar is die moeilikste */
var SLAAG_DEELTYDS=-7;         /* jy werk deeltyds langs jou klasse (D3) */
var SLAAG_SIEK=-8;             /* gesondheid onder 40 */
var SLAAG_SWAAR=1.2;           /* elke APS-punt wat die graad bo 28 vra */
var SLAAG_MAKS=97;             /* niemand is ooit heeltemal seker nie */
var SLAAG_MIN=12;
var DRUIP_MAKS=3;              /* so baie mislukte jare, dan akademiese uitsluiting */
var DRUIP_BEURS=2;             /* en so baie, dan is jou beurs weg */
var UITSLUIT_MAKS=2;           /* twee uitsluitings en geen universiteit neem jou weer */

/* edu: 0 = geen matriek, 1 = matriek, 2 = graad, 3 = nagraads */
var BEROEPE=[
  {id:'petrol', t:'Petroljoggie',          s:66000,   plafon:110000,   edu:0, slim:0,  min:16, k:'Diens'},
  {id:'kelner', t:'Kelner',                s:78000,   plafon:190000,   edu:0, slim:15, min:16, k:'Diens'},
  {id:'plaas',  t:'Plaasarbeider',         s:72000,   plafon:155000,   edu:0, slim:0,  min:16, k:'Landbou'},
  {id:'kassier',t:'Kassier',               s:90000,   plafon:185000,   edu:0, slim:20, min:16, k:'Kleinhandel'},
  {id:'vullis', t:'Vullisverwyderaar',     s:102000,  plafon:245000,   edu:0, slim:0,  min:18, k:'Munisipaal'},
  {id:'bou',    t:'Bouwerker',             s:126000,  plafon:330000,   edu:0, slim:10, min:18, k:'Konstruksie'},
  {id:'verkoop',t:'Verkoopsassistent',     s:162000,  plafon:420000,   edu:1, slim:35, min:18, k:'Kleinhandel'},
  {id:'oproep', t:'Oproepsentrum-agent',   s:174000,  plafon:400000,   edu:1, slim:40, min:18, k:'Diens'},
  {id:'haar',   t:'Haarstilis',            s:156000,  plafon:450000,   edu:1, slim:30, min:18, k:'Skoonheid'},
  {id:'weermag',t:'Weermaglid',            s:204000,  plafon:600000,   edu:1, slim:40, min:18, k:'Veiligheid'},
  {id:'kok',    t:'Kok',                   s:216000,  plafon:650000,   edu:1, slim:42, min:19, k:'Kos'},
  {id:'bank',   t:'Bankteller',            s:198000,  plafon:520000,   edu:1, slim:50, min:18, k:'Finansies', skoon:true},
  {id:'polisie',t:'Polisiekonstabel',      s:222000,  plafon:640000,   edu:1, slim:45, min:19, k:'Veiligheid', skoon:true},
  {id:'vrag',   t:'Vragmotorbestuurder',   s:234000,  plafon:480000,   edu:1, slim:35, min:21, k:'Vervoer'},
  {id:'onderwys',t:'Onderwyser',           s:330000,  plafon:820000,   edu:2, slim:55, min:21, k:'Onderwys',
      gr:['Opvoedkunde','Kuns en Drama','Natuurwetenskap'], skoon:true},
  {id:'joernalis',t:'Joernalis',           s:294000,  plafon:700000,   edu:2, slim:58, min:21, k:'Media',
      gr:['Kommunikasiekunde','Kuns en Drama']},
  {id:'verpleeg',t:'Verpleegkundige',      s:348000,  plafon:850000,   edu:2, slim:62, min:21, k:'Mediese',
      gr:['Verpleegkunde','Natuurwetenskap']},
  {id:'bemark', t:'Bemarkingsbestuurder',  s:426000,  plafon:1300000,  edu:2, slim:60, min:24, k:'Besigheid',
      gr:['Besigheidsbestuur','Kommunikasiekunde']},
  {id:'rekenmeester',t:'Rekenmeester',     s:462000,  plafon:1600000,  edu:2, slim:65, min:22, k:'Finansies',
      gr:['Rekeningkunde','Besigheidsbestuur'], skoon:true},
  {id:'argitek',t:'Argitek',               s:474000,  plafon:1400000,  edu:2, slim:68, min:23, k:'Ontwerp',
      gr:['Argitektuur','Ingenieurswese']},
  {id:'ingenieur',t:'Siviele Ingenieur',   s:546000,  plafon:1800000,  edu:2, slim:72, min:22, k:'Ingenieurswese',
      gr:['Ingenieurswese']},
  {id:'ontwikkelaar',t:'Sagteware-ontwikkelaar',s:612000,plafon:2200000,edu:2,slim:70,min:21,k:'Tegnologie',
      gr:['Rekenaarwetenskap','Ingenieurswese']},
  {id:'sielkundige',t:'Sielkundige',       s:498000,  plafon:1300000,  edu:3, slim:72, min:25, k:'Mediese',
      gr:['Sielkunde'], na:['Meestersgraad']},
  {id:'professor',t:'Professor',           s:678000,  plafon:1600000,  edu:3, slim:82, min:30, k:'Onderwys',
      na:['Meestersgraad','Mediese Skool','Regskool']},
  /* C4/C5 — die LLB en die MBChB is nou voorgraads (sien STUDIES), maar
     die ou nagraadse pad bly ook geld, daarom staan albei kwalifikasies
     in 'gr'. werkVereis() soek in jou grade EN jou nagraadse studies. */
  {id:'prokureur',t:'Prokureur',           s:858000,  plafon:3500000,  edu:2, slim:78, min:25, k:'Regte',
      gr:['Regsgeleerdheid','Regskool'], skoon:true},
  {id:'dokter', t:'Geneesheer',            s:972000,  plafon:2800000,  edu:2, slim:80, min:26, k:'Mediese',
      gr:['Geneeskunde','Mediese Skool'], skoon:true},
  {id:'chirurg',t:'Chirurg',               s:1560000, plafon:6000000,  edu:2, slim:88, min:30, k:'Mediese',
      gr:['Geneeskunde','Mediese Skool'], skoon:true, ervaring:4},
  {id:'uh',     t:'Uitvoerende Hoof',      s:1950000, plafon:12000000, edu:3, slim:75, min:35, k:'Besigheid',
      na:['Meestersgraad'], ervaring:10}
];
/* D6 — 'plafon' is die meeste wat hierdie pos ooit kan betaal, in vandag
   se rande. Sonder dit groei 'n salaris 4,5% per jaar sonder einde, en
   'n UH wat op 35 begin verdien op 95 sowat R27 miljoen per jaar. Die
   spel het geen inflasie nie (B4 is uitgelaat), so hierdie getalle bly
   vir altyd in 2026-rande sinvol: dit is wat die heel beste mens in
   daardie pos vandag in Suid-Afrika verdien, bonus ingesluit. */
var VLAK_NAAM=['Junior ','','Senior ','Hoof-','Uitvoerende '];
var VLAK_X=[1, 1.32, 1.75, 2.3, 3.1];

/* ==========================================================================
   D3 — DEELTYDSE WERK EN VAKANSIEWERK
   Fase 1 het voltydse werk geblokkeer terwyl jy op skool is (A15). Dit is
   die ander kant daarvan: min ure, lae betaling, en jy mag dit doen
   terwyl jy op skool of op universiteit is.
     s      = wat jy in 'n jaar verdien. Dit bly onder SARS se drempel
              (R95 750), daarom word dit nie belas nie.
     ure    = wat die werk van jou week vat, net om te lees
     wenke  = die bedrag wissel, want wenke wissel
     Die geluk-, slim- en gesondheidskoste is per jaar wat jy dit doen.
   Jy mag net een deeltydse werk op 'n keer hê, en dit val weg sodra jy
   voltyds begin werk.
   ========================================================================== */
var DEELTYDS=[
  {id:'pakhulp', t:'Pakhulp by die supermark', s:24000, min:16, ure:'Saterdae en skoolvakansies',
    geluk:-3, sub:'Rakke pak en trollies stoot'},
  {id:'vakansie', t:'Desember-vakansiewerk by die sentrum', s:12000, min:16, ure:'Net Desember en Januarie',
    geluk:-1, sub:'Ses weke se werk, en dan is jy klaar'},
  {id:'tutor', t:'Tutor vir laerskoolkinders', s:26000, min:17, vereisSlim:62, ure:'Twee middae per week',
    geluk:-1, slim:2, sub:'Jy leer dit self beter terwyl jy verduidelik'},
  {id:'barista', t:'Barista by ’n koffiewinkel', s:34000, min:17, ure:'Drie middae per week',
    geluk:-1, slim:-1, sub:'Jy ruik die hele dag na koffie'},
  {id:'kelner', t:'Kelner oor naweke', s:44000, min:16, ure:'Vrydag- en Saterdagaande', wenke:true,
    geluk:-2, slim:-2, gesondheid:-1, sub:'Die wenke maak die verskil'},
  {id:'nagskof', t:'Nagskof by die vulstasie', s:58000, min:18, ure:'Drie nagte per week',
    geluk:-5, slim:-4, gesondheid:-5, sub:'Die beste geld, en jy slaap in die klas'}
];
var DEELTYDS_POGINGS=3;        /* hoeveel plekke jy per jaar kan probeer */

var TE_KOOP=[
  {id:'woonstel', n:'Woonstel in Durbanville',   t:'huis', p:950000,   e:'\u{1F3E2}'},
  {id:'meent',    n:'Meenthuis in Bellville',    t:'huis', p:1650000,  e:'\u{1F3D8}'},
  {id:'gesin',    n:'Gesinshuis in Stellenbosch',t:'huis', p:3400000,  e:'\u{1F3E1}'},
  {id:'plaas',    n:'Wynplaas in die Boland',    t:'huis', p:14000000, e:'\u{1F347}'},
  {id:'strand',   n:'Strandhuis in Camps Bay',   t:'huis', p:28000000, e:'\u{1F30A}'},
  {id:'tazz',     n:'1998 Toyota Tazz',          t:'motor',p:38000,    e:'\u{1F697}'},
  {id:'polo',     n:'VW Polo Vivo',              t:'motor',p:285000,   e:'\u{1F699}'},
  {id:'ranger',   n:'Ford Ranger Wildtrak',      t:'motor',p:780000,   e:'\u{1F6FB}'},
  {id:'bmw',      n:'BMW 330i',                  t:'motor',p:1050000,  e:'\u{1F3CE}'},
  {id:'porsche',  n:'Porsche 911 Carrera',       t:'motor',p:2900000,  e:'\u{1F3CE}'},
  {id:'rolex',    n:'Rolex Submariner',          t:'luuks',p:420000,   e:'\u{231A}'},
  {id:'jag',      n:'Seiljag',                   t:'luuks',p:4800000,  e:'\u{26F5}'},
  {id:'vliegtuig',n:'Privaat Vliegtuig',         t:'luuks',p:85000000, e:'\u{2708}'}
];

/* ==========================================================================
   EKONOMIE (Fase 2)
   Alles wat geld duur maak of laat groei: hoe duur elke dorp is, wat
   huur kos, hoe 'n verband werk, en teen watter koers geld groei of
   skuld opbou. Verander 'n getal hier en die hele spel se balans skuif.
   ========================================================================== */

/* B13 — hoe duur is dit om in elke dorp te bly? 1 = die landsgemiddeld.
   Dit skaal huur, lewenskoste en wat 'n kind jou kos. Staan 'n dorp nie
   in die lys nie, is sy faktor 1. */
var DORP_KOSTE={
  Kaapstad:1.38, Stellenbosch:1.30, Johannesburg:1.26, Durbanville:1.22,
  Centurion:1.18, Pretoria:1.14, Hermanus:1.12, Durban:1.10, Paarl:1.06,
  George:1.04, Mbombela:1.00, Gqeberha:0.98, Potchefstroom:0.96,
  Bloemfontein:0.95, Polokwane:0.95, Malmesbury:0.94, Worcester:0.90,
  Upington:0.90, Kimberley:0.88, Oudtshoorn:0.86, Vryburg:0.84
};

/* B1 — waar jy kan bly as jy nie 'n huis besit nie. 'maand' is die huur
   per maand in 'n dorp met faktor 1,0; 'geluk' is hoe die plek elke jaar
   aan jou gemoed doen. */
var HUURPLEKKE=[
  {id:'informeel',  n:'Informele woning', maand:350, geluk:-14,
    sub:'Sink en hout op iemand anders se erf — dis al wat oorbly'},
  {id:'agterkamer', n:'Agterkamer by ’n huis', maand:1600, geluk:-5,
    sub:'Een vertrek, gedeelde badkamer, jou goed pas in een kas'},
  {id:'kommune',    n:'Kamer in ’n kommune', maand:3400, geluk:0,
    sub:'Jou eie kamer; die kombuis en die rekeninge word gedeel'},
  {id:'woonstel',   n:'Eenslaapkamer-woonstel', maand:7400, geluk:6,
    sub:'Jou eie plek, met ’n balkon en ’n parkeerplek'},
  {id:'meenthuis',  n:'Meenthuis in ’n kompleks', maand:12500, geluk:10,
    sub:'Twee slaapkamers, ’n tuintjie en ’n hek met ’n kode'},
  {id:'huurhuis',   n:'Huis in ’n goeie buurt', maand:21000, geluk:15,
    sub:'Drie slaapkamers, ’n swembad en plek vir ’n braai'}
];
/* Bly jy by jou ouers, dra jy net by tot die rekeninge — en net as jy
   self 'n inkomste het. */
var OUERHUIS_MAAND=950;

/* B2 — 'n verband (huislening). Die koers is prima plus 'n bietjie,
   soos 'n gewone SA-verband in 2026. */
var BOND_KOERS=0.1175;        /* rente per jaar */
var BOND_TERMYNE=[20,30];     /* hoeveel jaar jy kan kies om af te betaal */
var BOND_DEPOSITOS=[0.10,0.20];
var BOND_AFFORDEERBAAR=0.33;  /* die bank leen tot 33% van jou bruto inkomste */
var BOND_AGTER_MAKS=3;        /* so baie jaar agter, dan vat hulle die huis */
var VEILING_F=0.80;           /* 'n huis op 'n bankveiling kry net 80% van sy waarde */

/* B5 — 'n spaarrekening groei; die tjekrekening doen niks. */
var SPAAR_KOERS=[5,7];        /* persent per jaar */

/* Fase 7 — die JSE-indeksfonds. Hoë risiko, hoër opbrengs: die jaar se
   opbrengs kom uit een van drie emmers. Meeste jare is goed, 'n kwart is
   plat, en sowat een uit tien is 'n swak jaar of 'n crash (nooit erger as
   -25%). Gemeet oor 20 000 lopies: gemiddeld ± 9,6% per jaar, en die JSE
   klop die spaarrekening oor 20 jaar in ± 84% van gevalle — maar oor een
   tot drie jaar verloor dit ± een keer uit drie. */
var JSE_JARE=[
  {kans:9,  r:[-25,-10], n:'crash'},
  {kans:26, r:[-6,6],    n:'plat'},
  {kans:65, r:[8,26],    n:'goed'}
];
var RENTE_VRY=23800;          /* SARS se rentevrystelling per jaar */

/* B6 — skuld. Jou oortrokke rekening en kredietkaart loop teen 19%, en
   die bank laat jou net tot 'n punt sak voor hulle goed kom vat. */
var SKULD_KOERS=0.19;
var SKULD_MIN_PERK=25000;     /* die kleinste skuld wat hulle sal toelaat */
var SKULD_INKOMSTE_PERK=0.35; /* of 35% van jou bruto inkomste, wat ook al meer is */
var GEDWONGE_F=0.75;          /* 'n bate wat gevat word, bring net 75% in */
var SEKWESTRASIE_MIN=120000;  /* onder hierdie skuld is 'n boedelbevel die moeite nie werd nie */

/* B13 — lewenskoste. 'basis' is kos, klere, vervoer, selfoon en
   rekeninge vir een volwassene in 'n gemiddelde dorp. */
var KOSTE_BASIS=34000;
var KOSTE_MINIMUM=11000;      /* so karig kan jy leef as daar niks is nie */
var KOSTE_STUDENT=0.62;       /* 'n student leef op twee-minuut-noedels */
var KOSTE_MAAT=0.60;          /* 'n maat kos 60% van 'n volwassene se basis */
var KOSTE_KIND=30000;         /* per kind onder 18, voor die dorpsfaktor */
var LEEFSTYL_VANAF=220000;    /* elke rand netto bo hierdie punt ... */
var LEEFSTYL_F=0.18;          /* ... laat jou 18c meer spandeer */

/* B17 — pensioen. Jy en jou werkgewer betaal elke jaar in, die fonds
   groei, en by aftrede koop dit 'n inkomste. */
var PENSIOEN_KEUSES=[0, 0.05, 0.075, 0.15];
var PENSIOEN_WERKGEWER=0.075; /* jou werkgewer pas jou bydrae tot hier */
/* Fase 7 — 'n gebalanseerde fonds se opbrengs per jaar. Meestal 4–12%,
   maar een jaar uit tien verloor dit ook (2–12%), sodat dit nie 'n
   risikolose beter JSE is nie. Dieselfde vorm as JSE_JARE hieronder. */
var PENSIOEN_GROEI=[
  {kans:10, r:[-12,-2]},
  {kans:90, r:[4,12]}
];
var ANNUITEIT_TREK=0.055;     /* hoeveel 'n lewende annuiteit per jaar uitbetaal */
var AFTREE_OUDERDOM=60;
var VROEG_AFTREE=55;
var KONTANT_DERDE_VRY=550000; /* die eerste R550 000 van 'n uittreebedrag is vry */
var KONTANT_DERDE_KOERS=0.27;
var UITTREE_VRY=27500;        /* trek jy die fonds vroeg uit, is net dit vry ... */
var UITTREE_KOERS=0.36;       /* ... en die res word swaar belas */

/* B14 — sakgeld per week, maal jou ouderdom min vier en die gesin se
   rykdomfaktor. 'n Fliekkaartjie kos R180, so dit moet sin maak. */
var SAKGELD_WEEK=7;

/* B18 — dakloosheid. Kan jy jou blyplek nie betaal nie, is daar niks
   verkoopbaars oor nie en is daar geen familiehuis om na terug te gaan
   nie, dan beland jy op die straat. Terwyl jy daar is, val jou
   lewenskoste heeltemal weg — dit is die ekonomiese ontlaaiklep wat
   B18 oplos. Die prys is jou gesondheid en jou gemoed, en werk kry word
   baie swaar. Dit moet moeilik wees, maar daar moet 'n pad terug wees:
   die meeste mense is binne 'n paar jaar weer onder 'n dak. */
var DAKLOOS_GESONDHEID=[3,9];   /* gesondheid wat 'n jaar op straat kos */
var DAKLOOS_GELUK=[6,14];       /* geluk wat 'n jaar op straat kos */
var DAKLOOS_WERKKANS=0.20;      /* sonder adres en skoon klere: 'n vyfde van die normale kans */
var DAKLOOS_NGO_KANS=0.55;      /* met 'n NGO se adres en 'n ID agter jou naam gaan dit beter */
var DAKLOOS_TRAP='agterkamer';  /* die goedkoopste plek waar 'n verhuurder jou sal inneem */
var DEPOSITO_MAANDE=2;          /* 'n verhuurder vra die eerste maand plus twee maande deposito */
var DAKLOOS_HULP_KANS=8;        /* kans per jaar dat 'n maatskaplike werker jou by 'n plek kry ... */
var DAKLOOS_HULP_GROEI=7;       /* ... plus so baie persent vir elke jaar wat jy al op straat is */
var DAKLOOS_FAMILIE_BAND=72;    /* met 'n band hier bo sal familie jou intrek */
var BEDEL_DAG=[25,90];          /* wat 'n dag by die verkeerslig inbring */
var BEDEL_DAE=[40,95];          /* hoeveel dae jy dit uithou voor hulle jou wegjaag */
var LOSWERK_DAG=[180,420];      /* 'n dag se los werk: tuinwerk, karwag, 'n vragmotor aflaai */
var LOSWERK_DAE=[18,45];        /* hoeveel dae se werk jy in 'n jaar kan optel */
var DAKLOOS_WERKE=['petrol','plaas','vullis','bou','kelner'];  /* wat 'n skuiling vir jou kan kry */
/* Wat 'n jaar op straat met jou maak — een hiervan word party jare gelog. */
var DAKLOOS_NAGTE=[
  'Iemand het jou skoene gesteel terwyl jy geslaap het.',
  'Die reën het drie nagte lank nie opgehou nie. Jy was deurnat.',
  'Die sekuriteitswagte het julle voor dagbreek onder die afdak weggejaag.',
  'Jy het twee dae lank niks geëet nie.',
  'Jou hoes wil nie weggaan nie, en daar is geen geld vir ’n dokter nie.',
  'Iemand wat jy nie ken nie, het jou ’n bord kos en ’n kombers gegee.',
  'Die winter het jou tot in jou bene gevat.',
  'Jy het die hele dag by die taxistaanplek gesit en wag dat iets gebeur.',
  'Die munisipaliteit het julle goed op ’n vragmotor gelaai en weggevat.'
];

var ONTSNAPVOERTUIE=[
  {n:'Te voet', mod:14, sub:'Jy sal moet hardloop'},
  {n:'Op ’n fiets', mod:9, sub:'Stil, maar stadig'},
  {n:'Met ’n taxi', mod:3, sub:'Die drywer weet van niks'},
  {n:'’n Gesteelde bakkie', mod:-13, sub:'Niemand kan dit aan jou koppel nie'},
  {n:'Jou eie motor', mod:17, sub:'Hulle kan jou nommerplaat naspoor', vereisMotor:true}
];
var MISDADE=[
  {id:'winkel', n:'Winkeldiefstal', e:'\u{1F6D2}', maat:true, voertuig:false, jare:[1,2], teikens:[
    {n:'’n Sak lekkers', buit:[40,300], risiko:9},
    {n:'’n Selfoonlaaier', buit:[200,900], risiko:18},
    {n:'’n Duur hoodie', buit:[400,1800], risiko:27},
    {n:'’n Selfoon uit die glaskas', buit:[3000,16000], risiko:44}
  ]},
  {id:'sak', n:'Sakkerollery', e:'\u{1F91A}', maat:true, voertuig:false, jare:[1,3], teikens:[
    {n:'’n Toeris by die Waterfront', buit:[400,6000], risiko:23},
    {n:'’n Besigheidsman se beursie', buit:[800,12000], risiko:33},
    {n:'’n Ou tannie se handsak', buit:[200,3000], risiko:17, geluk:-12},
    {n:'’n Polisieman se foon', buit:[1500,9000], risiko:62}
  ]},
  {id:'inbreek', n:'Huisinbraak', e:'\u{1F3DA}', maat:true, voertuig:true, jare:[2,6], teikens:[
    {n:'’n Woonstel in die dorp', buit:[3000,30000], risiko:28},
    {n:'’n Huis in ’n gewone buurt', buit:[8000,90000], risiko:38},
    {n:'’n Landgoed met sekuriteit', buit:[60000,420000], risiko:56},
    {n:'’n Juwelierswinkel na-ure', buit:[150000,900000], risiko:64}
  ]},
  {id:'motor', n:'Motordiefstal', e:'\u{1F697}', maat:true, voertuig:false, jare:[3,8], teikens:[
    {n:'’n Ou Tazz by die stasie', buit:[12000,40000], risiko:26},
    {n:'’n Polo by die winkelsentrum', buit:[80000,240000], risiko:44},
    {n:'’n Bakkie by ’n bouperseel', buit:[150000,500000], risiko:52},
    {n:'’n Porsche voor ’n restaurant', buit:[900000,2600000], risiko:70}
  ]},
  {id:'bank', n:'Bankroof', e:'\u{1F3E6}', maat:true, voertuig:true, jare:[8,20], teikens:[
    {n:'’n Klein tak op die platteland', buit:[120000,700000], risiko:54},
    {n:'’n Geldwa by ’n winkelsentrum', buit:[600000,2400000], risiko:68},
    {n:'Die hoofkantoor se kluis', buit:[2000000,9000000], risiko:80}
  ]}
];
var BOEKE=[
  {n:'Fiela se Kind', a:'Dalene Matthee', slim:5, geluk:4},
  {n:'Kringe in ’n Bos', a:'Dalene Matthee', slim:5, geluk:3},
  {n:'Die Hobbit', a:'J.R.R. Tolkien', slim:4, geluk:7},
  {n:'Harry Potter en die Towenaar se Steen', a:'J.K. Rowling', slim:3, geluk:8},
  {n:'Spud', a:'John van de Ruit', slim:2, geluk:9},
  {n:'Die Sneeubal', a:'Alice Schroeder oor Warren Buffett', slim:8, geluk:1},
  {n:'’n Wiskunde-studiegids', a:'400 oefeninge, geen prentjies', slim:9, geluk:-5},
  {n:'Die Hele Wereld se Geskiedenis', a:'E.H. Gombrich', slim:7, geluk:2},
  {n:'’n Asteriks-strokiesprent', a:'Goscinny en Uderzo', slim:1, geluk:6},
  {n:'Die Ongelooflike Avonture van Hanna Hoekom', a:'Marita van der Vyver', slim:4, geluk:6}
];
/* koste = vol kaartjie, kinderPrys = kinders onder 13 en pensioenarisse
   (± 60% van vol prys, soos by SA-bioskope).
   ouderdomsbeperking = die ouderdomsgradering; 0 beteken alle ouderdomme. */
var FLIEKS=[
  {n:'Die nuwe superheld-fliek', koste:180, kinderPrys:110, ouderdomsbeperking:10, geluk:8},
  {n:'’n Afrikaanse romantiese komedie', koste:160, kinderPrys:95, ouderdomsbeperking:13, geluk:6},
  {n:'’n Grillerprent', koste:170, kinderPrys:100, ouderdomsbeperking:18, geluk:5, gesondheid:-2},
  {n:'’n Natuurdokumenter', koste:150, kinderPrys:90, ouderdomsbeperking:0, geluk:4, slim:4},
  {n:'’n Ou klassieke fliek by die Labia', koste:120, kinderPrys:70, ouderdomsbeperking:7, geluk:7, slim:2}
];
var VAKANSIES=[
  {n:'Kampeer in die Cederberg', koste:4500, geluk:9, gesondheid:4},
  {n:'Naweek in die Kruger', koste:12000, geluk:13, gesondheid:2},
  {n:'Durban se strande', koste:18000, geluk:14, gesondheid:2},
  {n:'Mauritius', koste:42000, geluk:22, gesondheid:3, voorkoms:2},
  {n:'Backpack deur Europa', koste:95000, geluk:26, slim:6},
  {n:'Japan vir twee weke', koste:145000, geluk:30, slim:9}
];
var TROETELDIERE=[
  {id:'goudvis', n:'Goudvis', e:'\u{1F420}', p:80, onderhoud:400, jare:[3,8]},
  {id:'hamster', n:'Hamster', e:'\u{1F439}', p:280, onderhoud:700, jare:[2,4]},
  {id:'skilpad', n:'Skilpad', e:'\u{1F422}', p:950, onderhoud:900, jare:[25,60]},
  {id:'kat', n:'Kat', e:'\u{1F431}', p:1500, onderhoud:4500, jare:[12,20]},
  {id:'slang', n:'Balpiton', e:'\u{1F40D}', p:1900, onderhoud:2600, jare:[15,28]},
  {id:'hond', n:'Hond', e:'\u{1F436}', p:3500, onderhoud:9500, jare:[9,16]},
  {id:'papegaai', n:'Papegaai', e:'\u{1F99C}', p:4800, onderhoud:3200, jare:[25,50]},
  {id:'perd', n:'Perd', e:'\u{1F434}', p:46000, onderhoud:62000, jare:[20,30]}
];
var TROETELNAME=['Bliksem','Skollie','Bokkie','Simba','Pluto','Boetie','Jakkals','Storm','Kaptein',
  'Brakkie','Mielie','Koekie','Rambo','Pixie','Sersant','Biltong','Rooies','Tier','Spikkels'];

/* ==========================================================================
   GESIN EN GESONDHEID (Fase 5 — E1, E4, E7, E12, F1, F2, F4, F9)
   Vier gesinstelsels en vier gesondheidstelsels wat in mekaar inhaak:
   grootouers wat jou kinderjare vul, 'n baba wat ook buite 'n huwelik kan
   kom, kinders met 'n egte lewensloop, 'n eggenoot wat self verdien, en
   dan die liggaam: siektes, 'n mediese fonds, drank/rook/dwelms, en 'n
   dood wat uit al daardie dinge volg.
   ========================================================================== */

/* ---------- E1: grootouers ---------- */
/* Hoeveel ouer as jou ouer sy eie ma of pa is. 'n Ouma van 'n 25-jarige
   ma is self dikwels in haar laat veertigs; by 'n ouer ma is sy 70. */
var OUMA_OUER=[20,38];
/* Kans dat 'n grootouer al dood is wanneer jy gebore word. Elke
   grootouer word apart gerol, dus het die meeste kinders twee of drie. */
var GROOTOUER_DOOD=18;
/* Die dinge wat grootouers met 'n kind doen. 'min'/'maks' is jou eie
   ouderdom; 'band' is hoe sterk die band moet wees. */
var GROOTOUER_DADE=[
  {t:'het jou ’n note in die hand gestop toe niemand kyk nie', min:4, maks:17, band:40,
   geld:[50,400], geluk:[2,6]},
  {t:'het jou leer brood bak', min:5, maks:16, band:55, slim:[1,3], geluk:[3,7]},
  {t:'het die hele middag stories van die ou dae vertel', min:4, maks:18, band:45,
   slim:[1,4], geluk:[2,6]},
  {t:'het jou die hele vakansie op die plaas laat bly', min:6, maks:17, band:60,
   gesondheid:[2,5], geluk:[5,11]},
  {t:'het jou kom haal ná skool, elke dag van die jaar', min:6, maks:13, band:50,
   geluk:[3,8]},
  {t:'het jou leer hoe om ’n hoek te gooi', min:7, maks:17, band:55, geluk:[3,8]},
  {t:'het vir jou ’n trui gestrik wat twee nommers te groot is', min:1, maks:14, band:45,
   geluk:[2,5]},
  {t:'het jou kerk toe gesleep en daarna pannekoek gekoop', min:5, maks:16, band:40,
   geluk:[1,5]},
  {t:'het jou leer tjek skryf en jou eerste spaarboekie oopgemaak', min:10, maks:18, band:55,
   slim:[2,5], geld:[200,1200], geluk:[2,5]}
];
/* Erflating van 'n grootouer: minder as 'n ouer, en net as daar was. */
var GROOTOUER_ERF=[0,90000];

/* ---------- E4: baba, swangerskap en voorbehoeding ---------- */
/* Kans per poging om swanger te raak, volgens ouderdom. Dit is die
   bestaande getalle, net op een plek. */
var BABA_KANS=[[38,55],[44,30],[99,12]];
/* En elke kind wat jy al het, maak die volgende minder waarskynlik. */
var BABA_AFNAME=0.72;
/* Voorbehoeding: 'f' is hoeveel van 'n onbeplande swangerskap dit keer
   (0,97 = 97% effektief), 'koste' is wat dit jou per jaar kos. */
var VOORBEHOEDING=[
  {id:'geen',   n:'Niks',                 f:0,     koste:0,
   sub:'Wat gebeur, gebeur'},
  {id:'kondoom',n:'Kondome',              f:0.86,  koste:900,
   sub:'By die kliniek gratis, by Clicks nie — en nie elke keer nie'},
  {id:'pil',    n:'Die pil of ’n inspuiting', f:0.95, koste:2400,
   sub:'Elke dag of elke drie maande, by die kliniek of die apteek'},
  {id:'implant',n:'’n Implant of ’n lus',  f:0.99,  koste:1800,
   sub:'Een keer ingesit, dan vir jare reg'},
  {id:'steriel',n:'Gesteriliseer',         f:0.999, koste:0,
   sub:'Permanent. Daar is nie ’n pad terug nie'}
];
var STERILISASIE_KOSTE=18000;
/* Kans per jaar op 'n onbeplande swangerskap in 'n lief-verhouding, voor
   voorbehoeding afgetrek word. 'n Tiener is minder gereeld saam, maar
   gebruik ook minder gereeld iets. */
var ONBEPLAN_TIENER=11;
var ONBEPLAN_JONK=16;      /* 18 tot 29 */
var ONBEPLAN_OUER=9;       /* 30 tot 42 */
var KRAAM_KOSTE=[4500,38000];   /* staatshospitaal tot privaat kraamsaal */

/* ---------- E7: 'n kind se eie lewe ---------- */
/* Hoe 'n kind se matriekuitslag lyk: sy eie slimheid, plus wat jy as
   ouer bygedra het (huiswerk help, 'n goeie skool, genoeg geld). */
var KIND_APS_BASIS=14;
var KIND_APS_SLIM=0.26;        /* elke punt slimheid bo 0 */
var KIND_APS_OUER=0.11;        /* elke punt in die band met jou */
var KIND_UNI_APS=26;           /* hieronder kom hy nie in 'n graad nie */
var KIND_STUDIE_KOSTE=[38000,72000];  /* per jaar, as jy daarvoor betaal */
/* Wat 'n kind ná skool word, as hy nie studeer nie. Gewone poste met
   edu 0 of 1 — die lys word uit BEROEPE gevul, so dit bly in een plek. */
var KIND_TROU_OUDERDOM=[23,36];
var KIND_KIND_OUDERDOM=[24,39];
var KIND_KINDERS_MAKS=3;
var KIND_KIND_KANS=28;         /* kans per jaar op 'n kleinkind terwyl die venster oop is */

/* ---------- E12: wat 'n eggenoot verdien ---------- */
/* Jou maat se opleiding word by die troue gerol: hoe hoër jou eie
   opleiding, hoe meer waarskynlik dat sy ook 'n graad het (mense trou
   met mense soos hulself). Dan kry sy 'n pos uit BEROEPE wat daarby pas. */
var MAAT_SALARIS_F=[72,118];   /* persent van die pos se basissalaris */
var MAAT_GROEI=[2,6];          /* persent verhoging per jaar */
var MAAT_WERKLOOS_KANS=3;      /* kans per jaar dat sy haar werk verloor */
var MAAT_WERK_KANS=45;         /* kans per jaar dat sy weer een kry */
var MAAT_AFTREE=62;
var MAAT_HUISVROU=22;          /* kans dat sy by die kinders bly in plaas van werk */

/* ---------- F1: siektes ---------- */
/* 'soort' is 'akuut' (dit kom en gaan) of 'chronies' (dit bly by jou).
   'gewig' is hoe algemeen die toestand is — hoë bloeddruk en diabetes
   is in SA baie meer algemeen as lewersiekte, en 'n roker se weegskaal
   word boonop deur ROOK_TOESTANDE geskuif.
   'erns' is hoeveel dit jou kans op 'n dood vermeerder (1 = verdubbel).
   'gesond' is wat dit elke jaar aan jou gesondheid doen, 'koste' wat die
   behandeling 'n jaar kos, en 'behandelF' hoeveel van die skade die
   behandeling wegneem. 'min' is die jongste ouderdom waarop dit kom. */
var TOESTANDE=[
  /* --- akuut --- */
  {id:'griep', n:'Griep', e:'\u{1F912}', gewig:30, soort:'akuut', min:0, erns:0.10,
   gesond:[3,8], koste:950, behandelF:0.7, jare:[1,1],
   sub:'Drie weke hoes en ’n week in die bed'},
  {id:'maag', n:'Maagvirus', e:'\u{1F922}', gewig:22, soort:'akuut', min:0, erns:0.08,
   gesond:[2,6], koste:800, behandelF:0.7, jare:[1,1],
   sub:'Niks bly binne nie. Jy het vyf kilogram verloor'},
  {id:'been', n:'Gebreekte been', e:'\u{1FAFC}', gewig:9, soort:'akuut', min:3, erns:0.12,
   gesond:[6,14], koste:14000, behandelF:0.8, jare:[1,2],
   sub:'Ses weke in gips, en daarna fisioterapie'},
  {id:'blinde', n:'Blindedermontsteking', e:'\u{1F52A}', gewig:3, soort:'akuut', min:5, erns:1.6,
   gesond:[10,22], koste:46000, behandelF:0.92, jare:[1,1], dringend:true,
   sub:'Dit moet vanaand nog uitkom, anders bars dit'},
  {id:'longontsteking', n:'Longontsteking', e:'\u{1FAC1}', gewig:5, soort:'akuut', min:0, erns:1.1,
   gesond:[8,18], koste:28000, behandelF:0.85, jare:[1,2], dringend:true,
   sub:'Jou een long staan half vol water'},
  {id:'tb', n:'Tuberkulose', e:'\u{1F9A0}', gewig:3, soort:'akuut', min:8, erns:1.4,
   gesond:[10,20], koste:0, behandelF:0.88, jare:[1,2], staatGratis:true,
   sub:'Ses maande se pille, elke dag, sonder om een oor te slaan'},
  {id:'rug', n:'Rugbesering', e:'\u{1F6CF}', gewig:8, soort:'akuut', min:16, erns:0.10,
   gesond:[4,10], koste:9500, behandelF:0.7, jare:[1,3],
   sub:'Jy het verkeerd gelig en iets het geskeur'},
  /* --- chronies --- */
  {id:'asma', n:'Asma', e:'\u{1F32C}', gewig:6, soort:'chronies', min:2, erns:0.25,
   gesond:[0,2], koste:5200, behandelF:0.8,
   sub:'’n Pomp in elke sak, en ’n slegte winter elke jaar'},
  {id:'bloeddruk', n:'Hoë bloeddruk', e:'\u{1FA78}', gewig:15, soort:'chronies', min:30, erns:0.55,
   gesond:[0,2], koste:4800, behandelF:0.82,
   sub:'Een pil per dag, vir die res van jou lewe'},
  {id:'diabetes', n:'Diabetes tipe 2', e:'\u{1F36C}', gewig:12, soort:'chronies', min:28, erns:0.85,
   gesond:[1,3], koste:16000, behandelF:0.78,
   sub:'Jou bloedsuiker, jou voete en jou oë moet nou dopgehou word'},
  {id:'artritis', n:'Artritis', e:'\u{1F9B4}', gewig:10, soort:'chronies', min:45, erns:0.20,
   gesond:[0,2], koste:7800, behandelF:0.6,
   sub:'Jou hande is soggens stywer as gister'},
  {id:'hart', n:'Hartsiekte', e:'\u{1FAC0}', gewig:7, soort:'chronies', min:40, erns:1.5,
   gesond:[1,4], koste:34000, behandelF:0.7,
   sub:'Jou are is besig om toe te slaan'},
  {id:'hiv', n:'HIV', e:'\u{1F397}', gewig:3, soort:'chronies', min:14, erns:2.2,
   gesond:[1,4], koste:0, behandelF:0.9, staatGratis:true,
   sub:'Met ARV’s elke dag leef jy ’n volle lewe; sonder hulle nie'},
  {id:'kanker', n:'Kanker', e:'\u{1F380}', gewig:6, soort:'chronies', min:18, erns:4.5,
   gesond:[4,10], koste:280000, behandelF:0.72, dringend:true,
   sub:'Chemo, bestraling, en ’n jaar wat jou lewe in twee breek'},
  {id:'lewer', n:'Lewersiekte', e:'\u{1F7E4}', gewig:3, soort:'chronies', min:30, erns:2.4,
   gesond:[2,6], koste:62000, behandelF:0.55,
   sub:'Die jare se drank het die rekening gebring'},
  {id:'longe', n:'Chroniese longsiekte', e:'\u{1F6AD}', gewig:3, soort:'chronies', min:38, erns:2.0,
   gesond:[2,5], koste:38000, behandelF:0.6,
   sub:'Elke trap is nou ’n berg. Dit is die sigarette'},
  {id:'beroerte', n:'Nagevolge van ’n beroerte', e:'\u{1F9E0}', gewig:4, soort:'chronies', min:45, erns:2.6,
   gesond:[2,5], koste:52000, behandelF:0.62,
   sub:'Jou een hand werk nie meer soos hy moet nie'}
];
/* Kans per jaar om énige nuwe toestand te kry: 'n basis plus 'n bietjie
   vir elke jaar bo 30, en meer as jou gesondheid swak is. */
var SIEK_BASIS=4.5;
var SIEK_OUDERDOM=0.26;        /* per jaar bo 30 */
var SIEK_SWAK=0.11;            /* per punt gesondheid onder 65 */
var SIEK_ROOK=[0,6,13,20];     /* per rookvlak */
var SIEK_DRINK=[0,3,9,17];
var SIEK_DWELMS=[0,5,13,24];
var SIEK_DAKLOOS=16;           /* op straat word jy baie makliker siek */
var SIEK_TRONK=7;
var SIEK_MAKS=42;              /* nooit meer as dit per jaar nie */
/* Watter toestande watter gewoonte oopsluit. Sonder die gewoonte kan dit
   steeds gebeur, net baie minder gereeld. */
var ROOK_TOESTANDE=['longe','kanker','hart'];
var DRINK_TOESTANDE=['lewer','hart'];
var DWELM_TOESTANDE=['hiv','lewer','hart'];

/* ---------- F2: mediese fonds, staat of privaat ---------- */
/* 'premie' is per maand vir een grootmens; 'n maat kos 80% daarvan en
   elke kind 40%. 'dek' is hoeveel van 'n rekening die fonds betaal. */
var MEDIESE_FONDSE=[
  {id:'hospitaal', n:'Hospitaalplan', premie:1450, dek:0.62, wag:0,
   sub:'Net hospitaal. ’n Doktersbesoek betaal jy self'},
  {id:'middel', n:'Middelopsie met spaarrekening', premie:3300, dek:0.82, wag:0,
   sub:'Hospitaal plus ’n dagtoe-spaarrekening vir dokters en pille'},
  {id:'omvattend', n:'Omvattende plan', premie:6800, dek:0.93, wag:0,
   sub:'Alles gedek, by enige spesialis, met min uit jou eie sak'}
];
var FONDS_MAAT_F=0.80;
var FONDS_KIND_F=0.40;
var FONDS_WAGPERIODE=1;        /* jaar voor 'n bestaande toestand gedek word */
var FONDS_SIEK_PREMIE=1.35;    /* het jy al 'n chroniese toestand, vra hulle meer */
/* Die staatshospitaal: gratis, maar die waglys is lank en die uitkoms
   slegter. 'wag' is die kans dat die behandeling eers volgende jaar kom. */
var STAAT_WAG=46;
var STAAT_UITKOMS=0.58;        /* die behandeling werk net so goed as dit */
var STAAT_DRINGEND=0.78;       /* 'n noodgeval kry darem aandag */
var PRIVAAT_F=1.0;             /* die volle rekening, uit jou eie sak */

/* ---------- F4: drank, sigarette en dwelms ---------- */
/* Vlak 0 = niks, 1 = soms, 2 = gereeld, 3 = verslaaf. 'spiraal' is die
   kans per jaar om 'n vlak op te skuif as jy aanhou. */
var GEWOONTES=[
  {id:'drink', n:'Drank', e:'\u{1F37B}', min:18,
   vlakke:['nie','soms ’n dop','gereeld','verslaaf aan drank'],
   koste:[0,4800,19000,46000], gesond:[0,0,2,6], geluk:[0,2,0,-6],
   spiraal:[0,11,7,0], werk:[0,0,4,14], band:[0,0,3,9],
   sub:'Die wettige ouderdom in SA is 18'},
  {id:'rook', n:'Sigarette', e:'\u{1F6AC}', min:14,
   vlakke:['nie','soms','’n pakkie ’n dag','twee pakkies ’n dag'],
   koste:[0,3600,19000,38000], gesond:[0,1,3,6], geluk:[0,1,0,-3],
   spiraal:[0,24,9,0], werk:[0,0,1,3], band:[0,0,2,4],
   sub:'’n Pakkie kos vandag ongeveer R52'},
  {id:'dwelms', n:'Dwelms', e:'\u{1F48A}', min:15,
   vlakke:['nie','het dit al probeer','gebruik gereeld','verslaaf'],
   koste:[0,6000,48000,120000], gesond:[0,2,6,12], geluk:[0,3,-4,-16],
   spiraal:[0,28,16,0], werk:[0,2,14,38], band:[0,2,10,22],
   sub:'Dit begin by ’n partytjie en eindig nie daar nie'}
];
var ONTNUGTER_KOSTE=46000;     /* 'n private rehabilitasiesentrum */
var ONTNUGTER_KANS=52;         /* kans dat rehab werk */
var ONTNUGTER_SELF=19;         /* kans dat jy dit op jou eie regkry */
var TERUGVAL_KANS=26;          /* kans per jaar om terug te val ná jy opgehou het */
/* 'n Gewoonte wat jy nie meer opsoek nie, verdwyn weer — maar net op die
   onderste vlakke. Van vlak 3 af laat dit jou nie los sonder dat jy
   regtig ophou nie: dit is die "egte greep" van F4. */
var GEWOONTE_LOS=[0, 45, 11, 0];   /* kans per jaar om 'n vlak terug te sak */
var GEWOONTE_STIL=2;               /* ná so baie jare sonder om dit op te soek */
var ONDERDERTIEN_VANG=55;      /* kans dat jou ouers jou vang as jy te jonk is */
var DRONKBESTUUR_VANG=24;      /* kans om by 'n sperwyer gevang te word */
var DRONKBESTUUR_ONGELUK=11;   /* kans op 'n ongeluk */
var DRONKBESTUUR_BOETE=[6000,24000];
var LISENSIE_TERUG=[1,3];      /* hoeveel jaar jou lisensie weg is */

/* ---------- F9: hoe die dood werk ---------- */
/* 'n Gompertz-kromme: die kans om in 'n jaar dood te gaan verdubbel
   ongeveer elke agt jaar ná twintig. Daarbo kom 'n hele paar
   vermenigvuldigers: jou gene, jou gesondheid, jou siektes, of jy
   rook/drink/dwelms gebruik, en of jy mediese sorg kan bekostig. */
var DOOD_BASIS=0.043;          /* persent per jaar op ouderdom 20 */
var DOOD_KROM=0.0855;          /* hoe vinnig dit styg */
var DOOD_KIND=[0.42,0.10];     /* kans in jaar 0, en van 1 tot 5 */
var DOOD_GESOND_F=58;          /* elke punt gesondheid onder 70 maak dit erger */
var DOOD_GESOND_MIN=0.40;      /* en perfekte gesondheid kan dit nie laer as dit druk nie */
var DOOD_ONGELUK=0.10;         /* gewone ongelukke per jaar */
var DOOD_JONKMAN=[18,34];      /* in SA is dit die gevaarlikste jare vir 'n jong man */
var DOOD_JONKMAN_M=0.30;
var DOOD_JONKMAN_V=0.11;
var DOOD_TRONK=0.34;
var DOOD_DAKLOOS=0.95;
var DOOD_ROOK=[1,1.22,1.72,2.25];
var DOOD_DRINK=[1,1.05,1.32,1.85];
var DOOD_DWELMS=[1,1.12,1.70,2.60];
var DOOD_ONBEHANDEL=1.0;       /* 'n onbehandelde toestand se volle erns tel */
var DOOD_BEHANDEL=0.28;        /* 'n behandelde toestand net 28% daarvan */
var DOOD_GEEN_SORG=1.22;       /* geen fonds en geen geld vir 'n dokter nie */
var DOOD_GOEIE_SORG=0.88;      /* 'n goeie plan hou jou langer */
/* F9 — jou familiegeskiedenis, by geboorte gerol. 'f' vermenigvuldig jou
   hele lewe se doodskans: 0,62 is 'n familie waar almal 90 word. */
var GENE=[
  {n:'’n familie wat baie oud word', f:0.62, kans:14,
   sub:'Jou ouma se ma het 97 geword'},
  {n:'’n taai familie', f:0.80, kans:22, sub:'Niemand by julle is ooit siek nie'},
  {n:'’n gewone familiegeskiedenis', f:1.0, kans:34, sub:''},
  {n:'hartsiekte in die familie', f:1.30, kans:16,
   sub:'Jou pa se pa is op 58 aan ’n hartaanval dood', neig:'hart'},
  {n:'kanker in die familie', f:1.34, kans:9,
   sub:'Dit het twee van jou ouma se susters gevat', neig:'kanker'},
  {n:'diabetes in die familie', f:1.22, kans:5,
   sub:'Byna almal aan jou ma se kant het dit gekry', neig:'diabetes'}
];
var GENE_NEIG=3.2;             /* 'n familietoestand kom so baie keer makliker */

/* ==========================================================================
   H3 — VAARDIGHEDE EN STOKPERDJIES (Fase 6)
   Elke vaardigheid het vyf vlakke. Jy oefen dit onder Aktiwiteite; elke
   jaar se oefening gee punte, en by die drempels in VAARDIG_PUNTE klim
   jy 'n vlak. 'n Vlak maak iets oop:

     inkomste  — van 'vanaf' se vlak af verdien die vaardigheid self geld
     kos       — dit sny jou lewenskoste (jy kook, plant of vang jou kos)
     bele      — dit lig jou opbrengs op die JSE (jy verstaan waardasie)
     werk      — dit help met 'n aansoek vir hierdie beroepe
     besigheid — dit is die vaardigheid agter hierdie soort besigheid (H4)

   'laas' hou by wanneer jy dit laas geoefen het: 'n vaardigheid wat jy
   jare lank laat lê, roes (sien vaardigJaar in lewe.js).
   ========================================================================== */
var VAARDIGHEDE=[
  /* --- Kuns --- */
  {id:'klavier', n:'Klavier', e:'\u{1F3B9}', g:'Kuns', min:6, koste:9600,
   sub:'R800 per maand vir klasse',
   vlakke:['','kan toonlere speel','kan ’n liedjie speel','speel by troues',
     'speel in ’n orkes','konsertpianis'],
   stat:{slim:2, geluk:3}, inkomste:{vanaf:3, bedrag:[9000,70000]}},
  {id:'kitaar', n:'Kitaar', e:'\u{1F3B8}', g:'Kuns', min:10, koste:3200,
   sub:'’n Tweedehandse kitaar en YouTube',
   vlakke:['','ken drie akkoorde','kan om die kampvuur speel','speel by ’n pub',
     'speel in ’n band','tref by elke fees'],
   stat:{geluk:4}, inkomste:{vanaf:3, bedrag:[6000,90000]}},
  {id:'fotografie', n:'Fotografie', e:'\u{1F4F8}', g:'Kuns', min:12, koste:14000,
   sub:'’n Kamera en lense kos geld',
   vlakke:['','weet wat ’n sluiterspoed is','neem mooi foto’s','doen troue-foto’s',
     'word in tydskrifte gepubliseer','bekende fotograaf'],
   stat:{slim:2, geluk:2}, inkomste:{vanaf:3, bedrag:[14000,180000]},
   besigheid:'foto'},
  {id:'skryf', n:'Skryf', e:'\u{270D}', g:'Kuns', min:8, koste:600,
   sub:'Net ’n notaboek en tyd',
   vlakke:['','hou ’n dagboek','skryf kortverhale','word in ’n blad gepubliseer',
     'het ’n boek uit','bekende skrywer'],
   stat:{slim:4}, inkomste:{vanaf:4, bedrag:[12000,320000]},
   werk:['joernalis']},
  /* --- Kop --- */
  {id:'kodeer', n:'Kodeer', e:'\u{1F4BB}', g:'Kop', min:10, koste:2400,
   sub:'Data en ’n aanlynkursus',
   vlakke:['','kan ’n bladsy opmaak','bou klein programme','bou ’n werkende webwerf',
     'bou stelsels wat ander gebruik','senior ontwikkelaar'],
   stat:{slim:5}, inkomste:{vanaf:3, bedrag:[18000,260000]},
   werk:['ontwikkelaar','argitek','ingenieur'], besigheid:'webwerf'},
  {id:'aandele', n:'Aandele en waardasie', e:'\u{1F4C8}', g:'Kop', min:14, koste:1200,
   sub:'Jaarverslae lees kos niks behalwe tyd',
   vlakke:['','weet wat ’n aandeel is','lees ’n jaarverslag','kan ’n besigheid waardeer',
     'beleg met ’n plan','jou opbrengs klop die indeks'],
   stat:{slim:4}, bele:{vanaf:3, bonus:[2,7]},
   werk:['rekenmeester','uh']},
  /* --- Liggaam --- */
  {id:'karate', n:'Karate', e:'\u{1F94B}', g:'Liggaam', min:6, koste:7200,
   sub:'Twee aande per week in die dojo',
   vlakke:['','wit gordel','groen gordel','bruin gordel','swart gordel','sensei'],
   stat:{gesondheid:4, geluk:1}},
  {id:'sport', n:'Rugby of netbal', e:'\u{1F3C9}', g:'Liggaam', min:8, koste:2200,
   sub:'Klubfooie en ’n paar stewels',
   vlakke:['','speel in die derde span','eerste span','klubspeler','provinsiaal',
     'byna beroepsvlak'],
   stat:{gesondheid:4, geluk:2}},
  /* --- Hande --- */
  {id:'kook', n:'Kook', e:'\u{1F373}', g:'Hande', min:8, koste:1800,
   sub:'Bestanddele om mee te oefen',
   vlakke:['','kan ’n eier bak','kook ’n ete vir vier','almal wil by jou kom eet',
     'kook soos ’n sjef','sou ’n restaurant kon loop'],
   stat:{geluk:2, slim:1}, kos:{vanaf:2, sny:[0.05,0.14]},
   werk:['kok'], besigheid:'spyseniering'},
  {id:'braai', n:'Braai', e:'\u{1F356}', g:'Hande', min:14, koste:3600,
   sub:'Hout, vleis en ’n Saterdagmiddag',
   vlakke:['','maak die vuur','braai ’n goeie tjop','jou braai is ’n instelling',
     'mense vra jou om te kom braai','kompetisievlak'],
   stat:{geluk:4}},
  {id:'motorwerk', n:'Motorwerktuigkunde', e:'\u{1F527}', g:'Hande', min:14, koste:4200,
   sub:'Gereedskap en ’n ou enjin om op te oefen',
   vlakke:['','kan ’n wiel omruil','kan ’n diens self doen','kan ’n enjin oopmaak',
     'bou ’n motor op','meganikus sonder ’n winkel'],
   stat:{slim:3}, besigheid:'werkswinkel'},
  {id:'houtwerk', n:'Houtwerk', e:'\u{1FA91}', g:'Hande', min:12, koste:5200,
   sub:'Hout, skroewe en ’n sirkelsaag',
   vlakke:['','kan ’n rak opsit','bou ’n boekrak','bou ’n tafel wat hou',
     'maak meubels op aanvraag','meubelmaker'],
   stat:{slim:2, geluk:2}, inkomste:{vanaf:4, bedrag:[10000,120000]},
   besigheid:'meubels'},
  /* --- Buite --- */
  {id:'visvang', n:'Visvang', e:'\u{1F3A3}', g:'Buite', min:6, koste:2600,
   sub:'’n Stok, kuns en ’n permit',
   vlakke:['','sit by die water','vang soms iets','weet waar hulle byt',
     'vang altyd iets','kan van die see leef'],
   stat:{geluk:3, gesondheid:1}, kos:{vanaf:3, sny:[0.03,0.08]}},
  {id:'tuinmaak', n:'Tuinmaak', e:'\u{1F331}', g:'Buite', min:8, koste:1400,
   sub:'Saad, kompos en ’n graaf',
   vlakke:['','het ’n potplant','kweek kruie','’n hele groentetuin',
     'die hele straat kom koop by jou','jy leef uit jou tuin'],
   stat:{geluk:2, gesondheid:2}, kos:{vanaf:2, sny:[0.04,0.11]},
   besigheid:'tuindienste'}
];
/* Hoeveel punte elke vlak vra. Oefen jy elke jaar, is vlak 5 sowat
   sestien jaar se werk — dit is doelbewus 'n leeftyd se stokperdjie. */
var VAARDIG_PUNTE=[0, 10, 28, 58, 102, 160];
var VAARDIG_PER_JAAR=2;        /* hoeveel vaardighede jy per jaar kan oefen */
var VAARDIG_JAAR=[5,9];        /* punte wat een jaar se oefening gee */
var VAARDIG_SLIM=0.06;         /* plus hierdie per punt slimheid */
var VAARDIG_KIND=1.35;         /* 'n kind leer vinniger as 'n grootmens */
var VAARDIG_KIND_TOT=16;
var VAARDIG_ROES_NA=8;         /* jare sonder oefening voor dit begin roes */
var VAARDIG_ROES=[1,3];        /* punte wat jy dan per jaar verloor */
var VAARDIG_WERK_BONUS=7;      /* elke vlak help so baie met 'n aansoek */

/* ==========================================================================
   H4 — JOU EIE BESIGHEID (Fase 6)
   'n Besigheid is 'n egte alternatief vir 'n werk, met egte risiko. Dit
   werk met kliënte: elke kliënt bring 'waarde' per jaar in, jy kan net
   soveel kliënte hanteer as wat jou kapasiteit toelaat, en jou vaste
   koste loop of jy kliënte het of nie.

     kapitaal  — wat dit kos om te begin
     vaste     — koste per jaar wat loop al verdien jy niks
     waarde    — wat een kliënt per jaar inbring
     basis     — hoeveel kliënte jy alleen kan hanteer
     perWerker — hoeveel kliënte elke werker bo-op dit hanteer
     loon      — wat een werker per jaar kos
     groei     — kliënte wat 'n goeie jaar bring (voor al die faktore)
     risiko    — kans per jaar op 'n slegte jaar
     vaardig   — die vaardigheid (H3) wat hierdie besigheid dra
     plaaslik  — die dorp se koste-faktor skaal die omset en die koste

   Die wins loop deur brutoInkomste() en word dus net soos 'n salaris
   belas; 'n verlies kom uit jou sak en kan jou in die skuld sit.
   ========================================================================== */
var BESIGHEDE=[
  {id:'smous', n:'Straatstalletjie', e:'\u{1F34E}', min:16, kapitaal:9000, vaste:14000,
   waarde:[2200,4200], basis:30, perWerker:26, loon:62000, groei:[4,11], risiko:22,
   plaaslik:true, sub:'Vrugte, lekkers en koeldrank by die taxi-staanplek',
   wat:'kliënte per week'},
  {id:'webwerf', n:'Webwerwe vir klein besighede', e:'\u{1F4BB}', min:16, kapitaal:12000,
   vaste:22000, waarde:[9000,21000], basis:14, perWerker:20, loon:240000,
   groei:[2,5], risiko:12, vaardig:'kodeer',
   sub:'R50–R100 per maand per klant, vir ’n kafee of ’n loodgieter',
   wat:'klante op maandelikse kontrak'},
  {id:'tuindienste', n:'Tuindienste', e:'\u{1F331}', min:18, kapitaal:28000, vaste:38000,
   waarde:[7800,13000], basis:8, perWerker:12, loon:78000, groei:[2,6], risiko:14,
   plaaslik:true, vaardig:'tuinmaak', sub:'’n Bakkie, ’n snyer en twee paar hande',
   wat:'tuine elke twee weke'},
  {id:'skoonmaak', n:'Skoonmaakdienste', e:'\u{1F9F9}', min:18, kapitaal:34000, vaste:46000,
   waarde:[9500,16000], basis:6, perWerker:10, loon:84000, groei:[2,6], risiko:15,
   plaaslik:true, sub:'Kantore en huise, kontrak vir kontrak',
   wat:'kontrakte'},
  {id:'spyseniering', n:'Spyseniering', e:'\u{1F372}', min:20, kapitaal:95000, vaste:72000,
   waarde:[16000,34000], basis:9, perWerker:7, loon:96000, groei:[1,4], risiko:18,
   plaaslik:true, vaardig:'kook', sub:'Troues, begrafnisse en kantoorfunksies',
   wat:'funksies per jaar'},
  {id:'foto', n:'Fotografiestudio', e:'\u{1F4F8}', min:20, kapitaal:140000, vaste:86000,
   waarde:[12000,26000], basis:12, perWerker:12, loon:180000, groei:[1,5], risiko:17,
   vaardig:'fotografie', sub:'Troues, matriekafskeide en besighede',
   wat:'opdragte per jaar'},
  {id:'meubels', n:'Meubelwerkswinkel', e:'\u{1FA91}', min:20, kapitaal:180000, vaste:104000,
   waarde:[24000,52000], basis:7, perWerker:5, loon:132000, groei:[1,3], risiko:16,
   vaardig:'houtwerk', sub:'Tafels en kaste wat ’n leeftyd hou',
   wat:'opdragte per jaar'},
  {id:'werkswinkel', n:'Motorwerkswinkel', e:'\u{1F527}', min:21, kapitaal:380000,
   vaste:220000, waarde:[9000,17000], basis:22, perWerker:16, loon:168000,
   groei:[3,9], risiko:16, plaaslik:true, vaardig:'motorwerk',
   sub:'Dienste, remme en ’n hyser wat betaal moet word', wat:'motors per jaar'},
  {id:'kafee', n:'Koffiewinkel', e:'\u{2615}', min:21, kapitaal:620000, vaste:240000,
   waarde:[3200,6000], basis:90, perWerker:70, loon:92000, groei:[25,70], risiko:24,
   plaaslik:true, vaardig:'kook', sub:'Huur in ’n goeie straat, en ’n masjien van R180 000',
   wat:'gereelde kliënte'},
  {id:'bou', n:'Klein bouaannemer', e:'\u{1F3D7}', min:24, kapitaal:450000, vaste:280000,
   waarde:[120000,340000], basis:2, perWerker:1.2, loon:150000, groei:[0.6,2], risiko:26,
   plaaslik:true, sub:'Aanbouings en dakke — een slegte kontrak kan jou breek',
   wat:'projekte per jaar'},
  {id:'boerdery', n:'Kleinboerdery', e:'\u{1F69C}', min:24, kapitaal:850000, vaste:320000,
   waarde:[52000,120000], basis:5, perWerker:3, loon:72000, groei:[0.5,2], risiko:30,
   plaaslik:true, vaardig:'tuinmaak', sub:'Grond, ’n trekker en die weer wat besluit',
   wat:'hektaar onder kontrak'}
];
var BESIG_BEMARK=[0, 6000, 25000, 90000];   /* wat jy per jaar aan bemarking kan gee */
var BESIG_BEMARK_F=0.9;        /* kliënte wat elke R10 000 bemarking bring */
var BESIG_VAARDIG_F=0.22;      /* elke vlak van die vaardigheid lig die groei so baie */
var BESIG_SLIM=0.008;          /* per punt slimheid bo 50 */
var BESIG_AANSIEN=0.12;        /* per punt aansien */
var BESIG_WERK_AANDAG=0.55;    /* het jy ook ’n voltydse werk, groei dit stadiger */
var BESIG_TOERUSTING=0.12;     /* elke R100 000 toerusting gee so baie kapasiteit by */
var BESIG_VERLOOP=[4,14];      /* persent van jou kliënte wat elke jaar wegval */
var BESIG_SLEG=[0.35,0.72];    /* ’n slegte jaar hou net so baie van die omset oor */
var BESIG_GOED=12;             /* kans per jaar op ’n uitstekende jaar */
var BESIG_GOED_F=[1.2,1.6];
var BESIG_VERLIES_MAKS=3;      /* so baie verliesjare agtermekaar, dan is dit klaar */
var BESIG_VERKOOP=2.6;         /* ’n winsgewende besigheid verkoop vir 2,6 × die wins */
var BESIG_TOE_F=0.35;          /* maak jy toe, kry jy net 35% van die toerusting terug */
var BESIG_KAPASITEIT_MIN=0.75; /* onder hierdie vol-persentasie vra werkers te veel */

/* ==========================================================================
   H1 — DIE BOEDEL (Fase 6)
   Wat 'n generasie vir die volgende oorhou. SARS vat boedelbelasting op
   alles bo die vrystelling, en dit is die rede waarom 'n familie se geld
   nie oor vyf geslagte eindeloos aangroei nie.
   ========================================================================== */
var BOEDEL_VRYSTELLING=3500000;   /* SA se abatement */
var BOEDEL_BELASTING=0.20;        /* 20% op alles daarbo */
