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
var PENSIOEN_GROEI=[0,12];    /* 'n gebalanseerde fonds se opbrengs per jaar */
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
