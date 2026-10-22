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

var HOERSKOLE=[
  {n:'Hoerskool Durbanville', t:'Openbare skool', koste:0, slim:2, gesondheid:1, geluk:2},
  {n:'Hoerskool Stellenberg', t:'Openbare skool', koste:0, slim:2, gesondheid:2, geluk:1},
  {n:'Paul Roos Gimnasium', t:'Sport- en akademieskool', koste:70000, slim:3, gesondheid:4, geluk:2},
  {n:'Die Akademie', t:'Privaat akademieskool', koste:98000, slim:5, gesondheid:0, geluk:-1, vereisSlim:58},
  {n:'Tegniese Hoerskool Bellville', t:'Tegniese skool', koste:0, slim:1, gesondheid:2, geluk:3}
];

var UNIES=[
  {n:'Universiteit Stellenbosch', koste:76000, punte:70, aansien:3},
  {n:'Universiteit van Kaapstad', koste:84000, punte:76, aansien:4},
  {n:'Universiteit van Pretoria', koste:68000, punte:64, aansien:3},
  {n:'Noordwes-Universiteit', koste:58000, punte:56, aansien:2},
  {n:'Universiteit van die Vrystaat', koste:52000, punte:52, aansien:2},
  {n:'UNISA (afstandsonderrig)', koste:30000, punte:42, aansien:1}
];

var RYKDOM=[
  {n:'baie arm', f:0.3}, {n:'arm', f:0.6}, {n:'werkersklas', f:1}, {n:'werkersklas', f:1},
  {n:'middelklas', f:1.6}, {n:'middelklas', f:1.6}, {n:'welgesteld', f:3}, {n:'ryk', f:6}
];

var STUDIES=[
  {n:'Rekeningkunde', slim:58}, {n:'Rekenaarwetenskap', slim:65}, {n:'Ingenieurswese', slim:72},
  {n:'Opvoedkunde', slim:45}, {n:'Besigheidsbestuur', slim:50}, {n:'Natuurwetenskap', slim:68},
  {n:'Kommunikasiekunde', slim:42}, {n:'Verpleegkunde', slim:55}, {n:'Sielkunde', slim:60},
  {n:'Regsgeleerdheid', slim:66}, {n:'Argitektuur', slim:64}, {n:'Kuns en Drama', slim:38}
];
var NAGRAADS=[
  {n:'Mediese Skool', jare:4, koste:220000, slim:78, vereis:['Natuurwetenskap','Verpleegkunde']},
  {n:'Regskool', jare:3, koste:180000, slim:72, vereis:null},
  {n:'Meestersgraad', jare:2, koste:95000, slim:66, vereis:null}
];

/* edu: 0 = geen matriek, 1 = matriek, 2 = graad, 3 = nagraads */
var BEROEPE=[
  {id:'petrol', t:'Petroljoggie',          s:66000,   edu:0, slim:0,  min:16, k:'Diens'},
  {id:'kelner', t:'Kelner',                s:78000,   edu:0, slim:15, min:16, k:'Diens'},
  {id:'plaas',  t:'Plaasarbeider',         s:72000,   edu:0, slim:0,  min:16, k:'Landbou'},
  {id:'kassier',t:'Kassier',               s:90000,   edu:0, slim:20, min:16, k:'Kleinhandel'},
  {id:'vullis', t:'Vullisverwyderaar',     s:102000,  edu:0, slim:0,  min:18, k:'Munisipaal'},
  {id:'bou',    t:'Bouwerker',             s:126000,  edu:0, slim:10, min:18, k:'Konstruksie'},
  {id:'verkoop',t:'Verkoopsassistent',     s:162000,  edu:1, slim:35, min:18, k:'Kleinhandel'},
  {id:'oproep', t:'Oproepsentrum-agent',   s:174000,  edu:1, slim:40, min:18, k:'Diens'},
  {id:'haar',   t:'Haarstilis',            s:156000,  edu:1, slim:30, min:18, k:'Skoonheid'},
  {id:'weermag',t:'Weermaglid',            s:204000,  edu:1, slim:40, min:18, k:'Veiligheid'},
  {id:'kok',    t:'Kok',                   s:216000,  edu:1, slim:42, min:19, k:'Kos'},
  {id:'bank',   t:'Bankteller',            s:198000,  edu:1, slim:50, min:18, k:'Finansies', skoon:true},
  {id:'polisie',t:'Polisiekonstabel',      s:222000,  edu:1, slim:45, min:19, k:'Veiligheid', skoon:true},
  {id:'vrag',   t:'Vragmotorbestuurder',   s:234000,  edu:1, slim:35, min:21, k:'Vervoer'},
  {id:'onderwys',t:'Onderwyser',           s:330000,  edu:2, slim:55, min:21, k:'Onderwys',
      gr:['Opvoedkunde','Kuns en Drama','Natuurwetenskap'], skoon:true},
  {id:'joernalis',t:'Joernalis',           s:294000,  edu:2, slim:58, min:21, k:'Media',
      gr:['Kommunikasiekunde','Kuns en Drama']},
  {id:'verpleeg',t:'Verpleegkundige',      s:348000,  edu:2, slim:62, min:21, k:'Mediese',
      gr:['Verpleegkunde','Natuurwetenskap']},
  {id:'bemark', t:'Bemarkingsbestuurder',  s:426000,  edu:2, slim:60, min:24, k:'Besigheid',
      gr:['Besigheidsbestuur','Kommunikasiekunde']},
  {id:'rekenmeester',t:'Rekenmeester',     s:462000,  edu:2, slim:65, min:22, k:'Finansies',
      gr:['Rekeningkunde','Besigheidsbestuur'], skoon:true},
  {id:'argitek',t:'Argitek',               s:474000,  edu:2, slim:68, min:23, k:'Ontwerp',
      gr:['Argitektuur','Ingenieurswese']},
  {id:'ingenieur',t:'Siviele Ingenieur',   s:546000,  edu:2, slim:72, min:22, k:'Ingenieurswese',
      gr:['Ingenieurswese']},
  {id:'ontwikkelaar',t:'Sagteware-ontwikkelaar',s:612000,edu:2,slim:70,min:21,k:'Tegnologie',
      gr:['Rekenaarwetenskap','Ingenieurswese']},
  {id:'sielkundige',t:'Sielkundige',       s:498000,  edu:3, slim:72, min:25, k:'Mediese',
      gr:['Sielkunde'], na:['Meestersgraad']},
  {id:'professor',t:'Professor',           s:678000,  edu:3, slim:82, min:30, k:'Onderwys',
      na:['Meestersgraad','Mediese Skool','Regskool']},
  {id:'prokureur',t:'Prokureur',           s:858000,  edu:3, slim:78, min:25, k:'Regte',
      na:['Regskool'], skoon:true},
  {id:'dokter', t:'Geneesheer',            s:972000,  edu:3, slim:80, min:26, k:'Mediese',
      na:['Mediese Skool'], skoon:true},
  {id:'chirurg',t:'Chirurg',               s:1560000, edu:3, slim:88, min:30, k:'Mediese',
      na:['Mediese Skool'], skoon:true, ervaring:4},
  {id:'uh',     t:'Uitvoerende Hoof',      s:1950000, edu:3, slim:75, min:35, k:'Besigheid',
      na:['Meestersgraad'], ervaring:10}
];
var VLAK_NAAM=['Junior ','','Senior ','Hoof-','Uitvoerende '];
var VLAK_X=[1, 1.32, 1.75, 2.3, 3.1];

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
