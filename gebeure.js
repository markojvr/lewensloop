/* ==========================================================================
   3. GEBEURE
   Lukrake dinge wat met jou gebeur. Elke gebeurtenis het min/max ouderdom
   en opsioneel 'n as()-voorwaarde.
   Outomaties: doen() gee 'n teks terug.  Keuse: vraag + opsies[].
   ========================================================================== */

var GEBEURE=[
  /* --- Kleintyd --- */
  {min:1,max:3,doen:function(){ s.geluk=klem(s.geluk+4);
    return ['Jy het jou eerste treetjies gegee. Jou ouers het gehuil.','goed']; }},
  {waar:'enige',min:1,max:4,doen:function(){ s.gesondheid=klem(s.gesondheid-4);
    return ['Jy het van die bank afgeval en jou kop gestamp.','sleg']; }},
  {min:2,max:5,doen:function(){ s.geluk=klem(s.geluk+6);
    return ['Jou ouers het jou see toe geneem. Jy het sand geëet.','goed']; }},
  {min:2,max:6,doen:function(){ s.slim=klem(s.slim+3);
    return ['Jy het leer tel tot tien. Almal was beïndruk.','skool']; }},
  {min:3,max:8,doen:function(){ s.geluk=klem(s.geluk+7);
    return ['Die gesin het ’n hond gekry. Hy slaap op jou bed.','goed']; }},
  /* --- Laerskool --- */
  {min:6,max:12,as:function(){ return inKlas(); },
   doen:function(){ s.slim=klem(s.slim+4);
    return ['Jy het ’n goue sterretjie gekry vir lees in die klas.','skool']; }},
  {min:6,max:13,as:function(){ return inKlas(); },
   doen:function(){ s.gesondheid=klem(s.gesondheid+5); s.geluk=klem(s.geluk+3);
    return ['Jy het by die skool se atletiekspan aangesluit.','goed']; }},
  {min:6,max:12,doen:function(){ var v=Math.round(tussen(20,60)*s.rykf); s.geld+=v;
    return ['Jy het ’n tand verloor en '+geld(v)+' van die tandfeetjie gekry.','geld']; }},
  {min:6,max:14,doen:function(){ s.geluk=klem(s.geluk-9);
    return ['Beurtkrag het jou gunsteling program afgesny net voor die einde.','sleg']; }},
  {min:7,max:13,as:function(){ return inKlas(); },
   doen:function(){ s.geluk=klem(s.geluk-12); s.voorkoms=klem(s.voorkoms-2);
    return ['Iemand het jou op die skoolterrein geboelie.','sleg']; }},
  {min:8,max:14,doen:function(){ s.geluk=klem(s.geluk+9);
    return ['Jy het ’n nuwe fiets vir Kersfees gekry.','goed']; }},
  {min:6,max:13,as:function(){ return opSkool(); },
   doen:function(){ s.slim=klem(s.slim-3);
    return ['Jy het jou huiswerk by die huis vergeet. Twee keer.','skool']; }},
  /* --- Hoërskool --- */
  {min:13,max:18,as:function(){ return opSkool(); },
   doen:function(){ s.geluk=klem(s.geluk+8); s.gesondheid=klem(s.gesondheid+4);
    return ['Jy het in die eerste ' + (s.geslag==='v' ? 'netbalspan' : 'rugbyspan') +
      ' gekom.','goed']; }},
  {waar:'enige',min:13,max:18,doen:function(){ s.voorkoms=klem(s.voorkoms-7);
    return ['Akne het jou gesig oorgeneem. Dis ’n moeilike jaar.','sleg']; }},
  /* D3 — die los vakansiewerk-gebeurtenis geld net as jy nie klaar 'n
     deeltydse werk het nie; anders is dit die DEELTYDS-stelsel se werk. */
  {min:14,max:18, as:function(){ return !s.deeltyds; },
   doen:function(){ var v=tussen(2000,9000); s.geld+=v;
    return ['Jy het vakansiewerk by ’n kafee gedoen en '+geld(v)+' gemaak.','geld']; }},
  /* C1 — noem die vak wat jy werklik neem. */
  {min:15,max:18,as:function(){ return opHoerskool(); },
   doen:function(){ s.slim=klem(s.slim-5); s.geluk=klem(s.geluk-6);
    var vak = s.skool.vakke ? (s.skool.wiskunde?'Wiskunde':'Wiskundige Geletterdheid') : 'wiskunde';
    return ['Jy het ’n toets in ' + vak + ' gedruip. ' + ouerWoord() + ' was nie beïndruk nie.','skool']; }},
  {min:17,max:18,doen:function(){ s.geluk=klem(s.geluk+5);
    return ['Jy het jou leerlinglisensie gekry met een poging.','goed']; }},
  /* 'n Matriekafskeid is net vir wie in matriek is — nie vir wie die
     skool verlaat het of nog in Graad 10 sit nie. */
  {min:16,max:20,as:function(){ return opHoerskool() && s.skool.graad>=12; },
   doen:function(){ s.geluk=klem(s.geluk+11);
    return ['Jou matriekafskeid was ’n groot sukses.','goed']; }},
  /* --- Jong grootmens --- */
  {min:19,max:32,doen:function(){ s.gesondheid=klem(s.gesondheid+7);
    return ['Jy het die Twee Oseane-halfmarathon klaargemaak.','goed']; }},
  {min:18,max:40,doen:function(){ s.geluk=klem(s.geluk-7);
    return ['’n Taxi het jou amper omgery by die verkeerslig.','sleg']; }},
  {min:18,max:45,doen:function(){ var v=tussen(300,2500); s.geld+=v;
    return ['Jy het '+geld(v)+' in ’n ou baadjie se sak gevind.','geld']; }},
  {min:18,max:60,as:function(){ return s.bates.some(function(b){return b.t==='motor';}); },
    doen:function(){ var v=tussen(3000,25000); s.geld-=v;
    return ['Jou motor het gebreek. Die herstelwerk was '+geld(v)+'.','geld']; }},
  {min:20,max:55,doen:function(){ s.geluk=klem(s.geluk+6);
    return ['’n Braai by vriende het tot vieruur die oggend gehou.','goed']; }},
  /* --- Middeljare --- */
  {min:30,max:60,doen:function(){ s.gesondheid=klem(s.gesondheid-8);
    return ['Jou rug het uitgegaan terwyl jy die braai gepak het.','sleg']; }},
  {waar:'enige',min:30,max:70,doen:function(){ s.voorkoms=klem(s.voorkoms-4);
    return ['Jy het jou eerste grys hare raakgesien.','sleg']; }},
  {min:35,max:75,doen:function(){ s.geluk=klem(s.geluk+5);
    return ['Jy het begin tuinmaak en dit is onverwags bevredigend.','goed']; }},
  {waar:'enige',min:40,max:80,doen:function(){ s.gesondheid=klem(s.gesondheid-6);
    return ['Die dokter het gesê jou cholesterol is te hoog.','sleg']; }},
  /* --- Oud --- */
  {min:62,max:120,doen:function(){ s.geluk=klem(s.geluk+6);
    return ['Jy het die hele middag op die stoep na die voels gekyk.','goed']; }},
  {waar:'enige',min:65,max:120,doen:function(){ s.gesondheid=klem(s.gesondheid-7);
    return ['Jou knie het gaan staan terwyl jy opgestaan het.','sleg']; }},
  {min:60,max:120,as:function(){ return s.kinders>0; },
    doen:function(){ s.geluk=klem(s.geluk+12);
    return ['Jou kleinkinders het die naweek kom kuier.','goed']; }},
  /* --- Enige ouderdom --- */
  {waar:'enige',min:5,max:120,doen:function(){ s.gesondheid=klem(s.gesondheid-5);
    return ['Jy het griep gekry en ’n week in die bed gelê.','sleg']; }},
  {min:5,max:120,doen:function(){ s.geluk=klem(s.geluk+5);
    return ['Jy het ’n pragtige sonsondergang oor ' + s.dorp + ' gesien.','goed']; }},
  {min:18,max:120,as:function(){ return eieDak(); },
   doen:function(){ var v=tussen(400,3000); s.geld-=v;
    return ['Beurtkrag (fase 6) het al die kos in die yskas laat vrot: '+geld(v)+' weg.','geld']; }},
  {min:16,max:120,as:function(){ return !!s.beroep; },
    doen:function(){ s.beroep.prestasie=klem(s.beroep.prestasie+9);
    return ['Jou baas het jou voor die hele span geprys.','werk']; }},
  {min:16,max:120,as:function(){ return !!s.beroep; },
    doen:function(){ s.geluk=klem(s.geluk-8);
    return ['’n Kollega het jou idee in ’n vergadering gesteel.','werk']; }},
  {min:18,max:120,as:function(){ return eieDak(); },
   doen:function(){ s.geluk=klem(s.geluk-6);
    return ['Jou geyser het gebars. Die plafon is ’n gemors.','sleg']; }},

  /* --- Keuse-gebeure --- */
  /* H14 — hierdie keuse word onthou. Die boelie kom jare later weer
     voor (sien die vlagverhale onderaan hierdie lêer). */
  {min:7,max:13,as:function(){ return inKlas(); },
   vraag:'’n Boelie het jou in die gang voorgekeer en vir jou lekkergeld gevra.',
   opsies:[
    {t:'Gee dit vir hom', doen:function(){ s.geluk=klem(s.geluk-10);
      stelVlag('boelie', {naam:kies(MANSNAME), wat:'betaal'});
      noteer('Jy het die geld oorhandig en die hele dag sleg gevoel.','sleg'); }},
    {t:'Slaan terug', doen:function(){
      var naam = kies(MANSNAME);
      if(kans(45 + vaardigVlak('karate')*12)){ s.geluk=klem(s.geluk+12);
        stelVlag('boelie', {naam:naam, wat:'geslaan'});
        noteer('Jy het teruggeveg en ' + naam + ' het jou nooit weer gepla nie.','goed'); }
      else { s.gesondheid=klem(s.gesondheid-12); s.geluk=klem(s.geluk-8);
        stelVlag('boelie', {naam:naam, wat:'verloor'});
        noteer('Jy het teruggeveg en ’n blou oog gekry.','sleg'); } }},
    {t:'Sê vir die onderwyser', doen:function(){ s.geluk=klem(s.geluk+4);
      stelVlag('boelie', {naam:kies(MANSNAME), wat:'aangegee'});
      noteer('Die onderwyser het ingegryp. Die boelie kry detensie.','skool'); }}
   ]},
  {min:14,max:18,as:function(){ return lewendeOuers().length>0 && s.blyplek==='ouers'; },
   vraag:'Jou vriende wil Vrydagaand uitsluip na ’n partytjie. Jou ouers weet niks nie.',
   opsies:[
    /* Is jy al voorheen gevang, hou jou ouers jou dop — daarom lees ons
       s.vlagge.gevang hier, en dit tref ook jou band met hulle. */
    {t:'Gaan saam', doen:function(){ if(kans(s.vlagge.gevang ? 34 : 60)){ s.geluk=klem(s.geluk+14);
        noteer('Die beste aand van die jaar. Niemand het uitgevind nie.','goed'); }
      else { s.geluk=klem(s.geluk-12); s.vlagge.gevang=(s.vlagge.gevang||0)+1;
        lewendeOuers().forEach(function(p){ p.band = klem(p.band - tussen(3,9)); });
        noteer('Jou ma het by die voordeur gewag. Jy is twee weke gegrond.','sleg'); } }},
    {t:'Bly by die huis en studeer', doen:function(){ s.slim=klem(s.slim+6); s.geluk=klem(s.geluk-4);
      noteer('Jy het gestudeer terwyl hulle gekuier het. Jou punte wys dit.','skool'); }}
   ]},
  {min:12,max:120,vraag:'Iemand se foon val uit haar sak by die winkelsentrum. Niemand het gesien nie.',
   opsies:[
    {t:'Gee dit terug', doen:function(){ s.geluk=klem(s.geluk+9);
      stelVlag('foon', {naam:kies(VROUENAME), wat:'terug'});
      noteer('Sy was so dankbaar dat sy jou ’n koffie gekoop het.','goed'); }},
    {t:'Hou dit', doen:function(){ var v=tussen(1500,9000); s.geld+=v;
      stelVlag('foon', {naam:kies(VROUENAME), wat:'gehou'});
      noteer('Jy het die foon vir '+geld(v)+' verkoop. Jou gewete pla ’n bietjie.','misdaad'); }}
   ]},
  {min:18,max:120,vraag:'’n Ou skoolvriend bel oor ’n "waarborg" belegging wat 40% per jaar betaal.',
   opsies:[
    {t:'Belê R50 000', doen:function(){ if(s.geld<50000){ noteer('Jy het nie die R50 000 gehad nie. Dalk ’n geluk.','neutraal'); return; }
      s.geld-=50000;
      var wie = kies(MANSNAME);
      if(kans(22 + vaardigVlak('aandele')*6)){ s.geld+=120000;
        stelVlag('skema', {naam:wie, wat:'gewen'});
        noteer('Dit het gewerk! Jy het R70 000 wins gemaak.','geld'); }
      else { stelVlag('skema', {naam:wie, wat:'verloor'});
        noteer('Dit was ’n piramideskema. Jou R50 000 is weg.','sleg'); s.geluk=klem(s.geluk-14); } }},
    {t:'Loop weg', doen:function(){ s.slim=klem(s.slim+3);
      stelVlag('skema', {naam:kies(MANSNAME), wat:'weggeloop'});
      noteer('Jy het nee gesê. Ses maande later was hy in die koerant.','goed'); }}
   ]},
  {min:18,max:120,vraag:'Jy sien ’n beursie met R2 000 kontant op die sypaadjie lê.',
   opsies:[
    {t:'Hou die geld', doen:function(){ s.geld+=2000; s.geluk=klem(s.geluk-4);
      noteer('Jy het die R2 000 gehou en die beursie weggegooi.','misdaad'); }},
    {t:'Soek die eienaar', doen:function(){ s.geluk=klem(s.geluk+10);
      if(kans(40)){ s.geld+=500; noteer('Die eienaar het jou R500 as dankie gegee.','geld'); }
      else noteer('Jy het die beursie by die polisie ingehandig.','goed'); }}
   ]},
  /* H14 — leen jy dit uit en hy betaal nie terug nie, duik hy later
     weer op (sien die vlagverhale onderaan). */
  {min:21,max:120,as:function(){ return !hetVlag('leningUit'); },
   vraag:'’n Vriend vra of hy R20 000 kan leen vir sy nuwe besigheid.',
   opsies:[
    {t:'Leen dit uit', doen:function(){ if(s.geld<20000){ noteer('Jy kon dit nie bekostig nie.','neutraal'); return; }
      s.geld-=20000;
      var wie = kies(MANSNAME);
      if(kans(45)){ s.geld+=32000; stelVlag('leningUit', {naam:wie, wat:'betaal'});
        noteer(wie + ' het alles met rente terugbetaal. Mooi so.','geld'); }
      else { s.geluk=klem(s.geluk-10);
        stelVlag('leningUit', {naam:wie, wat:'skuld', bedrag:20000});
        noteer(wie + ' het nooit terugbetaal nie. Julle praat nie meer nie.','sleg'); } }},
    {t:'Weier', doen:function(){ s.geluk=klem(s.geluk-5);
      noteer('Jy het nee gesê. Dit was ongemaklik by die volgende braai.','neutraal'); }}
   ]},
  {min:18,max:120,as:function(){ return !!s.beroep; },
   vraag:'Jou baas vra of jy die hele naweek kan oorwerk. Daar is geen oortyd nie.',
   opsies:[
    {t:'Doen dit', doen:function(){ if(!s.beroep) return;
      s.beroep.prestasie=klem(s.beroep.prestasie+14); s.geluk=klem(s.geluk-9);
      noteer('Jy het die naweek gewerk. Jou baas het dit onthou.','werk'); }},
    {t:'Weier hoflik', doen:function(){ if(!s.beroep) return;
      s.beroep.prestasie=klem(s.beroep.prestasie-11); s.geluk=klem(s.geluk+5);
      noteer('Jy het grense gestel. Jou baas was nie beïndruk nie.','werk'); }}
   ]},
  /* I13 — dit mag net EEN keer gebeur; voorheen kon dit oor 'n lang
     lewe 'n paar keer tref en jou netto waarde met miljoene opblaas. */
  {min:25,max:120,as:function(){ return !hetVlag('erfOom'); },
   vraag:'’n Oom wat jy skaars geken het, het jou in sy testament gelaat.',
   opsies:[
    {t:'Neem die kontant', doen:function(){ var v=tussen(40000,400000); s.geld+=v;
      stelVlag('erfOom');
      noteer('Jy het '+geld(v)+' geërf.','geld'); }},
    {t:'Neem sy ou plot', doen:function(){ var w=tussen(300000,1400000); stelVlag('erfOom');
      s.bates.push({id:'plot'+R(9999), n:'Oom se plot buite '+kies(DORPE), t:'huis', waarde:w, e:'\u{1F333}'});
      noteer('Jy het sy plot geërf (' + geld(w) + ').','geld'); }}
   ]},
  {min:16,max:120,vraag:'’n Hond volg jou huis toe. Hy het geen halsband nie.',
   opsies:[
    /* Hou jy hom, kry jy 'n regte dier in s.diere — met sy jaarlikse
       koste en al — nie net 'n vlaggie wat niemand ooit lees nie. */
    {t:'Hou hom', sub:'’n Hond kos R9 500 per jaar', doen:function(){
      if((s.diere||[]).length>=6){ s.geluk=klem(s.geluk+3);
        noteer('Jy het al ses diere. Jy het hom by die SPCA gelaat.','neutraal'); return; }
      var ras=null; TROETELDIERE.forEach(function(x){ if(x.id==='hond') ras=x; });
      var naam = (s.diere||[]).some(function(x){ return x.naam==='Bliksem'; })
        ? kies(TROETELNAME) : 'Bliksem';
      voegDierBy(ras, naam, tussen(1,4));
      noteer('Jy het hom ' + naam + ' genoem. Beste besluit van die jaar.','goed'); }},
    {t:'Neem hom SPCA toe', doen:function(){ s.geluk=klem(s.geluk+3);
      noteer('Jy het hom by die SPCA gelaat. Hy het ’n huis gekry.','neutraal'); }}
   ]},
  {min:18,max:120,as:function(){ return s.totaalVerdien>0; },
   vraag:'Die SAID stuur ’n brief: jy het ’n belastingfout gemaak en skuld geld.',
   opsies:[
    {t:'Betaal dit', doen:function(){ var v=tussen(5000,60000); s.geld-=v;
      noteer('Jy het '+geld(v)+' aan die SAID betaal.','geld'); }},
    {t:'Ignoreer die brief', doen:function(){ if(kans(55)){ s.geluk=klem(s.geluk+4);
        noteer('Niks het gebeur nie. Jy het die brief weggegooi.','neutraal'); }
      else { var v=tussen(30000,180000); s.geld-=v; s.geluk=klem(s.geluk-12);
        noteer('Die SAID het boetes bygevoeg: '+geld(v)+'.','sleg'); } }}
   ]}
];


/* ==========================================================================
   H13 + H14 — MEER GEBEURE, EN GEBEURE WAT ONTHOU (Fase 6)
   Die spel het voorheen 46 gebeure vir 'n lewe van 80 jaar gehad, dus
   het 'n mens dieselfde dinge oor en oor gesien. Hieronder kom die res,
   in blokke per lewensfase en per stelsel (siektes, gewoontes, die
   straat, jou besigheid, jou vaardighede, jou kinders).

   H14 — party van hulle stel 'n vlag met stelVlag(), en 'n ander een
   lees dit later met vlagRyp()/hetVlag(). Die boelie wat jy op tien
   geslaan het, kom op dertig weer voor; die vriend wat jou geld geskuld
   het, duik weer op. Die "...Klaar"-vlag (sluitVlag) keer dat dieselfde
   verhaal twee keer afspeel.
   ========================================================================== */

/* ---------- Kleintyd (0-5) ---------- */
GEBEURE = GEBEURE.concat([
  {min:1,max:4,doen:function(){ s.geluk=klem(s.geluk+5);
    return ['Jy het ’n gunsteling kombers gehad wat nêrens sonder jou gegaan het nie.','goed']; }},
  {waar:'enige',min:1,max:5,doen:function(){ s.gesondheid=klem(s.gesondheid-3); s.geluk=klem(s.geluk-4);
    return ['Jy het waterpokkies gekry en twee weke by die huis gebly.','sleg']; }},
  {min:2,max:5,doen:function(){ s.slim=klem(s.slim+4);
    return ['Jy het al die diere in die boek by die naam geken.','skool']; }},
  {min:2,max:6,doen:function(){ s.geluk=klem(s.geluk-6);
    return ['Jy het by Shoprite in die verkeerde gang verdwaal. Dit was ’n lang vyf minute.','sleg']; }},
  {min:3,max:6,doen:function(){ s.voorkoms=klem(s.voorkoms-5); s.geluk=klem(s.geluk-3);
    return ['Jy het jou eie hare met ’n skêr geknip.','sleg']; }},
  {min:3,max:6,as:function(){ return lewendeOuers().length>0; },
   doen:function(){ var p=kies(lewendeOuers()); p.band=klem(p.band+tussen(3,8)); s.geluk=klem(s.geluk+6);
    return [p.naam + ' het elke aand vir jou ’n storie gelees.','goed']; }},
  {min:2,max:5,doen:function(){ s.geluk=klem(s.geluk+7);
    return ['Jy het in ’n plas gespring tot al jou klere nat was.','goed']; }},
  {min:4,max:7,doen:function(){ s.slim=klem(s.slim+3); s.geluk=klem(s.geluk+3);
    return ['Jy het geleer hoe om jou eie skoenveters te strik.','goed']; }},
  /* Sonder 'n broer of suster is daar niemand om mee te deel nie. */
  {min:3,max:7,as:function(){ return lewendeBroersSusters().length>0; },
   vraag:'Daar is een laaste stukkie melktert in die yskas, en jou boetie of sussie slaap nog.',
   opsies:[
    {t:'Eet dit', doen:function(){ s.geluk=klem(s.geluk+6);
      noteer('Jy het dit geëet. Niemand kon dit bewys nie.','neutraal'); }},
    {t:'Deel dit', doen:function(){ s.geluk=klem(s.geluk+3);
      var b=lewendeBroersSusters()[0];
      if(b) b.band=klem(b.band+tussen(4,10));
      noteer('Jy het dit met ' + (b ? b.naam : 'hom') +
        ' in die helfte gedeel. ’n Mens onthou sulke dinge.','goed'); }}
   ]},

  /* ---------- Laerskool (6-12) ---------- */
  {min:6,max:12,as:function(){ return inKlas(); },
   doen:function(){ s.geluk=klem(s.geluk+8);
    return ['Dit was jou beurt om die klas se troeteldier vir die vakansie huis toe te neem.','goed']; }},
  {min:6,max:12,as:function(){ return inKlas(); },
   doen:function(){ s.slim=klem(s.slim+5);
    return ['Jy het die klas se spelbye gewen.','skool']; }},
  {min:6,max:12,as:function(){ return inKlas(); },
   doen:function(){ s.geluk=klem(s.geluk-7);
    return ['Jy was die laaste een wat vir die span gekies is.','sleg']; }},
  {min:6,max:12,doen:function(){ s.gesondheid=klem(s.gesondheid-6); s.geluk=klem(s.geluk-4);
    return ['Jy het van die klimraam afgeval en jou arm in ’n gips gehad.','sleg']; }},
  {min:6,max:12,as:function(){ return inKlas(); },
   doen:function(){ s.geluk=klem(s.geluk+6); s.gesondheid=klem(s.gesondheid+3);
    return ['Die hele klas het op ’n uitstappie Kirstenbosch toe gegaan.','goed']; }},
  {min:7,max:12,as:function(){ return opSkool(); },
   doen:function(){ s.slim=klem(s.slim+4); s.geluk=klem(s.geluk+4);
    return ['Jy het ’n vulkaan vir die wetenskapuitstalling gebou. Hy het regtig uitgebars.','skool']; }},
  {min:7,max:13,doen:function(){ s.geluk=klem(s.geluk-9);
    return ['Jou beste vriend het na ’n ander dorp getrek.','sleg']; }},
  {min:6,max:12,as:function(){ return inKlas(); },
   doen:function(){ s.voorkoms=klem(s.voorkoms-4); s.geluk=klem(s.geluk-5);
    return ['Jy het jou twee voortande gelyk verloor. Die skoolfoto is vanjaar geneem.','sleg']; }},
  {min:8,max:13,doen:function(){ s.gesondheid=klem(s.gesondheid+5); s.geluk=klem(s.geluk+5);
    return ['Jy het leer fiets ry sonder hande. Jou ma weet nie daarvan nie.','goed']; }},
  {min:6,max:12,as:function(){ return opSkool(); },
   doen:function(){ s.slim=klem(s.slim+3);
    return ['Jy het die hele biblioteek se dinosourusboeke uitgelees.','skool']; }},
  {min:9,max:13,doen:function(){ s.geluk=klem(s.geluk+9);
    return ['Jy het by ’n maat gaan oorslaap en julle het tot drie-uur gesels.','goed']; }},
  {min:6,max:13,as:function(){ return (s.diere||[]).length>0; },
   doen:function(){ var d=kies(s.diere); d.band=klem(d.band+tussen(6,14)); s.geluk=klem(s.geluk+6);
    return [d.naam + ' het die hele middag langs jou gelê terwyl jy huiswerk doen.','goed']; }},
  {min:8,max:13,as:function(){ return inKlas(); },
   vraag:'Die onderwyser vra wie die ruit gebreek het. Jy weet dit was Jaco.',
   opsies:[
    {t:'Sê niks', doen:function(){ s.geluk=klem(s.geluk-5);
      stelVlag('stilgebly');
      noteer('Jy het stilgebly. Die hele klas moes naweek skoonmaak.','neutraal'); }},
    {t:'Sê dit was Jaco', doen:function(){ s.geluk=klem(s.geluk-8);
      stelVlag('verklik', {naam:'Jaco'});
      noteer('Jy het hom verklik. Niemand het ’n week met jou gepraat nie.','sleg'); }},
    {t:'Vat die skuld', doen:function(){ s.geluk=klem(s.geluk-10); s.slim=klem(s.slim+2);
      stelVlag('skuldGevat', {naam:'Jaco'});
      noteer('Jy het die skuld gevat. Jaco het dit nooit vergeet nie.','neutraal'); }}
   ]},
  /* Dit was altyd "jou pa", ook vir 'n kind sonder 'n pa (die
     geenPa-vlag) of met 'n pa wat oorlede is. */
  {min:7,max:13,as:function(){ return lewendeOuers().length>0; },
   vraag:'Jou ouer vra of jy wil saamgaan hengel. Jou maats speel vanmiddag sokker.',
   opsies:[
    {t:'Gaan hengel', doen:function(){ s.geluk=klem(s.geluk+7);
      var p=lewendeOuers()[0]; if(p) p.band=klem(p.band+tussen(5,12));
      if(!s.vaardighede) s.vaardighede={};
      if(!s.vaardighede.visvang) s.vaardighede.visvang={vlak:0,punte:0,jare:0,laas:s.ouderdom};
      s.vaardighede.visvang.punte += tussen(3,7);
      s.vaardighede.visvang.vlak = vlakVanPunte(s.vaardighede.visvang.punte);
      s.vaardighede.visvang.laas = s.ouderdom;
      noteer('Julle het niks gevang nie, maar dit was ’n goeie dag by die water.','goed'); }},
    {t:'Speel sokker', doen:function(){ s.gesondheid=klem(s.gesondheid+5); s.geluk=klem(s.geluk+5);
      noteer('Julle het tot dit donker was gespeel.','goed'); }}
   ]},
  {min:8,max:13,as:function(){ return inKlas(); },
   vraag:'Daar is ’n nuwe kind in die klas wat nog met niemand gepraat het nie.',
   opsies:[
    {t:'Gaan sit by hom', doen:function(){ s.geluk=klem(s.geluk+8);
      var nuut = nuweMens(null, s.ouderdom, null);
      nuut.tipe='vriend'; nuut.band=tussen(60,88);
      s.verhoudings.push(nuut);
      stelVlag('nuweKind', {naam:nuut.naam, geslag:nuut.geslag});
      noteer('Jy het by ' + nuut.naam + ' gaan sit. Julle is nou vriende.','goed'); }},
    {t:'Los hom uit', doen:function(){ s.geluk=klem(s.geluk-3);
      noteer('Jy het by jou eie maats gebly.','neutraal'); }}
   ]},

  /* ---------- Hoërskool (13-18) ---------- */
  {min:13,max:18,doen:function(){ s.geluk=klem(s.geluk+7); s.voorkoms=klem(s.voorkoms+3);
    return ['Jy het jou eerste paar regte tekkies gekry. Jy het hulle elke dag gedra.','goed']; }},
  {min:13,max:18,as:function(){ return opSkool(); },
   doen:function(){ s.slim=klem(s.slim+6);
    return ['Jy het in die skool se kwiskompetisie gespeel en die laaste ronde gehaal.','skool']; }},
  {min:13,max:18,as:function(){ return opSkool(); },
   doen:function(){ s.geluk=klem(s.geluk-10);
    return ['Iemand het ’n skermskoot van jou boodskappe gedeel. Die hele graad het dit gesien.','sleg']; }},
  {min:14,max:18,as:function(){ return opSkool(); },
   doen:function(){ s.gesondheid=klem(s.gesondheid-7);
    return ['Jy het jou enkel verstuit by die interskole-atletiek.','sleg']; }},
  {min:13,max:18,as:function(){ return opSkool(); },
   doen:function(){ s.geluk=klem(s.geluk+6);
    return ['Die skool se toer na die Drakensberge was die hoogtepunt van die jaar.','goed']; }},
  {min:15,max:18,as:function(){ return opSkool(); },
   doen:function(){ s.slim=klem(s.slim+4); s.geluk=klem(s.geluk-3);
    return ['Jy het vir die eerste keer ’n vraestel van vorige jaar deurgewerk. Dit het gehelp.','skool']; }},
  {min:14,max:18,as:function(){ return opSkool(); },
   doen:function(){ s.geluk=klem(s.geluk-8); s.voorkoms=klem(s.voorkoms-3);
    return ['Jou skoolbroek het in die middel van pouse geskeur.','sleg']; }},
  {min:16,max:18,as:function(){ return !s.beroep; },
   doen:function(){ var v=tussen(800,3200); s.geld+=v;
    return ['Jy het ’n naweek lank by ’n mark gehelp en ' + geld(v) + ' verdien.','geld']; }},
  {min:13,max:18,as:function(){ return opSkool(); },
   doen:function(){ s.geluk=klem(s.geluk+5); s.slim=klem(s.slim+2);
    return ['Jy het by die skool se debatspan aangesluit en jou eerste ronde gewen.','skool']; }},
  {min:15,max:18,as:function(){ return opSkool(); },
   doen:function(){ s.geluk=klem(s.geluk-6);
    return ['Jou aansoek vir ’n leiersposisie is afgekeur.','sleg']; }},
  {min:13,max:17,as:function(){ return opSkool(); },
   vraag:'Iemand bied jou ’n sigaret aan agter die kleedkamers.',
   opsies:[
    {t:'Probeer dit', doen:function(){
      s.gewoontes.rook = Math.max(s.gewoontes.rook, 1);
      s.gewoonteLaas.rook = s.ouderdom;
      s.geluk=klem(s.geluk+2); s.gesondheid=klem(s.gesondheid-2);
      stelVlag('eersteSigaret');
      noteer('Jy het gehoes tot jou oë water staan, en toe nog een gevat.','sleg');
      if(s.ouderdom<18) teJonkGevang(gewoonteVan('rook')); }},
    {t:'Sê nee dankie', doen:function(){ s.geluk=klem(s.geluk-2); s.slim=klem(s.slim+1);
      stelVlag('sigaretGeweier');
      noteer('Jy het nee gesê. Hulle het jou ’n week lank daarmee gespot.','neutraal'); }}
   ]},
  {min:15,max:18,as:function(){ return opHoerskool(); },
   vraag:'Die eksamenvraestel se foto is in die graadgroep gedeel, die aand voor die tyd.',
   opsies:[
    {t:'Kyk daarna', doen:function(){
      if(kans(28)){ s.geluk=klem(s.geluk-20); s.slim=klem(s.slim-4);
        s.skool.ywer=0;
        noteer('Hulle het uitgevind. Jou punt vir daardie vak is nul en jou ouers is geroep.','sleg'); }
      else { s.slim=klem(s.slim+3); stelVlag('gekopieer');
        noteer('Jy het goed gevaar in daardie vraestel. Dit voel nie so lekker soos jy gedink het nie.','neutraal'); } }},
    {t:'Skuif die foon weg', doen:function(){ s.slim=klem(s.slim+2); s.geluk=klem(s.geluk+3);
      stelVlag('eerlikEksamen');
      noteer('Jy het dit nie gekyk nie en jou eie punt gekry.','goed'); }}
   ]},
  {min:16,max:18,vraag:'Jou vriende ry Hartenbos toe vir die langnaweek. Niemand behalwe die oudste het ’n lisensie nie.',
   opsies:[
    {t:'Gaan saam', doen:function(){
      if(kans(22)){ s.gesondheid=klem(s.gesondheid-tussen(8,20)); s.geluk=klem(s.geluk-10);
        stelVlag('padongeluk');
        noteer('Hulle het van die pad af geraak. Niemand is dood nie, maar jy ry nie sommer weer saam nie.','sleg'); }
      else { s.geluk=klem(s.geluk+16);
        noteer('Dit was die beste naweek van jou skoolloopbaan.','goed'); } }},
    {t:'Bly tuis', doen:function(){ s.geluk=klem(s.geluk-6); s.slim=klem(s.slim+3);
      noteer('Jy het tuis gebly en gestudeer. Jy het elke storie daarna gehoor.','neutraal'); }}
   ]},
  {min:16,max:18,as:function(){ return opHoerskool(); },
   vraag:'Die skool bied ’n beroepsdag aan. Jy kan by een tafel gaan sit.',
   opsies:[
    {t:'Die universiteit se tafel', doen:function(){ s.slim=klem(s.slim+4);
      stelVlag('universiteitGedroom');
      noteer('Jy het met ’n student gepraat wat jou vertel het hoe dit werklik werk.','skool'); }},
    {t:'Die weermag en polisie', doen:function(){ s.gesondheid=klem(s.gesondheid+3); s.geluk=klem(s.geluk+2);
      noteer('Hulle het jou vertel van die keuringsweek. Jy het die pamflet gehou.','neutraal'); }},
    {t:'Die man met sy eie besigheid', doen:function(){ s.slim=klem(s.slim+2); s.geluk=klem(s.geluk+4);
      stelVlag('besigheidGedroom');
      noteer('Hy het gesê die eerste drie jaar is die moeilikste. Jy het dit onthou.','neutraal'); }}
   ]}
]);

/* ---------- Jong grootmens (18-35) ---------- */
GEBEURE = GEBEURE.concat([
  {min:18,max:30,doen:function(){ s.geluk=klem(s.geluk+8);
    return ['Jy het vir die eerste keer jou eie kos gekoop en self gekook.','goed']; }},
  {min:18,max:32,doen:function(){ var v=tussen(1200,6500); s.geld-=v;
    return ['Jou foon het geval en die skerm is stukkend: ' + geld(v) + '.','geld']; }},
  {min:19,max:35,doen:function(){ s.geluk=klem(s.geluk+7); s.slim=klem(s.slim+2);
    return ['Jy het ’n fees in die Karoo bygewoon en met vreemdelinge om ’n vuur gesit.','goed']; }},
  {min:18,max:35,as:function(){ return s.blyplek==='huur'; },
   doen:function(){ s.geluk=klem(s.geluk-8);
    return ['Jou huisgenoot het sonder ’n woord getrek en die helfte van die huur geskuld.','sleg']; }},
  {min:20,max:40,as:function(){ return !!s.beroep; },
   doen:function(){ s.geluk=klem(s.geluk+6);
    return ['Die span het ná werk gaan kuier en jy het die aand regtig geniet.','goed']; }},
  {min:18,max:35,doen:function(){ s.gesondheid=klem(s.gesondheid+6); s.geluk=klem(s.geluk+4);
    return ['Jy het Tafelberg te voet uitgeklim en die son bo die wolke gesien.','goed']; }},
  {waar:'enige',min:21,max:40,doen:function(){ s.geluk=klem(s.geluk-7); s.gesondheid=klem(s.gesondheid-3);
    return ['Jy het ’n week lank skaars geslaap. Alles voel swaarder as wat dit is.','sleg']; }},
  {waar:'enige',min:19,max:36,doen:function(){ s.voorkoms=klem(s.voorkoms+tussen(2,7)); s.geluk=klem(s.geluk+4);
    return ['Jy het ’n haarsnit gekry wat werklik by jou pas.','goed']; }},
  {min:18,max:34,as:function(){ return !maat(); },
   doen:function(){ s.geluk=klem(s.geluk-6);
    return ['Nog ’n troue waar jy alleen by die tafel vir enkellopendes sit.','sleg']; }},
  {min:22,max:45,as:function(){ return !!maat(); },
   doen:function(){ var m=maat(); m.band=klem(m.band+tussen(4,11)); s.geluk=klem(s.geluk+7);
    return ['Jy en ' + m.naam + ' het ’n naweek weggebreek sonder fone.','goed']; }},
  {min:18,max:30,vraag:'’n Vriend vra of jy vir hom kan "borg staan" vir ’n meubelrekening.',
   opsies:[
    {t:'Teken as borg', doen:function(){
      stelVlag('borgGestaan', {naam:kies(MANSNAME)});
      noteer('Jy het geteken. Hopelik betaal hy.','neutraal'); }},
    {t:'Weier', doen:function(){ s.geluk=klem(s.geluk-4);
      noteer('Jy het geweier. Hy was kwaad, maar jou naam is skoon.','neutraal'); }}
   ]},
  {min:20,max:40,vraag:'Jy kan R15 000 aan ’n kortkursus bestee wat jou werkkanse kan verbeter.',
   opsies:[
    {t:'Doen die kursus', doen:function(){
      if(s.geld<15000){ noteer('Jy het nie die R15 000 gehad nie.','neutraal'); return; }
      s.geld-=15000; s.slim=klem(s.slim+tussen(4,9));
      stelVlag('kortkursus');
      noteer('Jy het die kursus klaargemaak en ’n sertifikaat gekry.','skool'); }},
    {t:'Hou die geld', doen:function(){
      noteer('Jy het besluit die geld is beter in jou sak.','neutraal'); }}
   ]},
  {min:21,max:45,as:function(){ return hetMotor(); },
   vraag:'Jou motor se diens is agterstallig en daar is ’n vreemde geluid.',
   opsies:[
    {t:'Vat hom werkswinkel toe', sub:'± R6 500', doen:function(){
      var v=tussen(4000,9000);
      if(s.geld<v){ noteer('Jy kon nie die diens bekostig nie.','neutraal'); return; }
      s.geld-=v; stelVlag('motorGedien');
      noteer('Jy het ' + geld(v) + ' aan ’n diens bestee. Die geluid is weg.','geld'); }},
    {t:'Ry maar so aan', doen:function(){
      if(kans(vaardigVlak('motorwerk')>=2 ? 18 : 42)){
        var v=tussen(12000,45000); s.geld-=v; s.geluk=klem(s.geluk-9);
        noteer('Die enjin het gaan staan op die N1. Die herstel was ' + geld(v) + '.','sleg'); }
      else noteer('Niks het gebeur nie. Die geluid is nou net deel van die motor.','neutraal'); }}
   ]},
  {min:22,max:40,as:function(){ return !!s.beroep; },
   vraag:'Jou werkgewer bied aan om jou te verskuif na ’n ander dorp, met 12% meer.',
   opsies:[
    {t:'Gaan', doen:function(){
      if(!s.beroep){ noteer('Die aanbod het verval.','neutraal'); return; }
      s.dorp = kies(DORPE.filter(function(d){ return d!==s.dorp; }));
      s.beroep.salaris = Math.round(s.beroep.salaris*1.12);
      pasPlafonToe();
      sluitGroep('vriend','toe jy getrek het');
      s.geluk=klem(s.geluk-8);
      stelVlag('getrekVirWerk', {dorp:s.dorp});
      noteer('Jy het ' + s.dorp + ' toe getrek. Meer geld, minder mense wat jy ken.','werk'); }},
    {t:'Bly waar jy is', doen:function(){ s.geluk=klem(s.geluk+4);
      noteer('Jy het gebly. Jou mense is hier.','neutraal'); }}
   ]},

  /* ---------- Middeljare (35-60) ---------- */
  {min:35,max:60,as:function(){ return brutoInkomste()>0; },
   doen:function(){ s.geluk=klem(s.geluk-7); s.slim=klem(s.slim+2);
    return ['Jy het ’n hele Saterdag met SARS se e-filing geworstel.','neutraal']; }},
  {waar:'enige',min:35,max:60,doen:function(){ s.gesondheid=klem(s.gesondheid-5);
    return ['Jy het begin sukkel om klein skrif te lees. Jy het ’n leesbril gekry.','sleg']; }},
  {min:38,max:62,doen:function(){ s.geluk=klem(s.geluk+6);
    return ['Jy het ’n ou skoolvriend by Checkers raakgeloop en ’n uur lank in die gang gestaan.','goed']; }},
  {min:36,max:60,as:function(){ return !!s.beroep; },
   doen:function(){ s.beroep.prestasie=klem(s.beroep.prestasie-tussen(5,12)); s.geluk=klem(s.geluk-6);
    return ['’n Nuwe bestuurder het alles verander. Niks werk meer soos jy dit ken nie.','werk']; }},
  {min:40,max:65,doen:function(){ s.geluk=klem(s.geluk+5); s.gesondheid=klem(s.gesondheid+3);
    return ['Jy het begin stap in die oggende, net om buite te wees.','goed']; }},
  {min:35,max:60,as:function(){ return hetHuis(); },
   doen:function(){ var v=tussen(8000,45000); s.geld-=v;
    return ['Die geyser, die dak of die pomp — iets het gebreek en ' + geld(v) + ' gekos.','geld']; }},
  {min:42,max:70,as:function(){ return lewendeOuers().length>0; },
   doen:function(){ s.geluk=klem(s.geluk-9);
    return ['Jy het besef dat die mense wat jou grootgemaak het nou oud is.','sleg']; }},
  {min:38,max:64,as:function(){ return s.kinders>0; },
   doen:function(){ s.geluk=klem(s.geluk+8);
    return ['Jy het by ’n skoolkonsert gesit en besef jy sou nêrens anders wou wees nie.','goed']; }},
  {min:40,max:62,vraag:'Jy kan ’n deel van ’n jaar se inkomste in ’n spaarproduk sit wat jou ná vyf jaar meer gee.',
   opsies:[
    {t:'Doen dit', doen:function(){
      var som = Math.min(s.geld, Math.max(50000, Math.round(brutoInkomste()*0.2)));
      if(som<10000){ noteer('Jy het nie genoeg kontant gehad nie.','neutraal'); return; }
      s.geld-=som; s.spaar=(s.spaar||0)+som;
      noteer('Jy het ' + geld(som) + ' na jou spaarrekening geskuif.','geld'); }},
    {t:'Los dit', doen:function(){
      noteer('Jy het dit in die tjekrekening gelos, waar dit niks verdien nie.','neutraal'); }}
   ]},
  {min:45,max:68,vraag:'Jou liggaam vra vir ’n volledige mediese ondersoek. Dit kos R3 200.',
   opsies:[
    {t:'Gaan vir die ondersoek', doen:function(){
      if(s.geld<3200 && !s.mediesefonds){ noteer('Jy kon dit nie bekostig nie.','neutraal'); return; }
      if(!s.mediesefonds) s.geld-=3200;
      var kan = TOESTANDE.filter(function(x){ return x.soort==='chronies' && toestandGewig(x)>0; });
      var vind = kiesGeweeg(kan, toestandGewig);
      if(vind && kans(32)){ kryToestand(vind.id, '— die ondersoek het dit vroeg gevang');
        noteer('Hulle het iets gevind terwyl dit nog klein is.','sleg'); }
      else { s.gesondheid=klem(s.gesondheid+tussen(2,6));
        noteer('Alles lyk goed. Dit is ’n verligting.','goed'); } }},
    {t:'Later', doen:function(){ s.geluk=klem(s.geluk-2);
      noteer('Jy het dit uitgestel. Soos verlede jaar.','neutraal'); }}
   ]},

  /* ---------- Oud (60+) ---------- */
  {min:60,max:120,as:function(){ return hetHuis(); },
   doen:function(){ s.geluk=klem(s.geluk+7);
    return ['Jy het ’n bank in die tuin gesit en elke oggend daar koffie gedrink.','goed']; }},
  {waar:'enige',min:62,max:120,doen:function(){ s.gesondheid=klem(s.gesondheid-6);
    return ['Jy het ’n nag in die hospitaal deurgebring vir waarnemings.','sleg']; }},
  {min:60,max:120,as:function(){ return s.kinders>0; },
   doen:function(){ s.slim=klem(s.slim+3); s.geluk=klem(s.geluk+4);
    return ['Jy het begin om jou lewensverhaal vir die kinders neer te skryf.','goed']; }},
  {min:65,max:120,doen:function(){ s.geluk=klem(s.geluk-10);
    return ['Nog ’n begrafnis van iemand uit jou skooljare.','sleg']; }},
  {min:63,max:120,as:function(){ return (s.diere||[]).length>0; },
   doen:function(){ s.geluk=klem(s.geluk+8); s.gesondheid=klem(s.gesondheid+2);
    return [kies(s.diere).naam + ' kry jou elke oggend by die deur. Dit maak die dag.','goed']; }},
  {min:66,max:120,doen:function(){ s.geluk=klem(s.geluk-6); s.gesondheid=klem(s.gesondheid-4);
    return ['Jy het ’n val in die badkamer gehad. Niks gebreek nie, maar die skrik bly.','sleg']; }},
  {min:68,max:120,as:function(){ return (s.kleinkinders||0)>0; },
   doen:function(){ s.geluk=klem(s.geluk+11);
    return ['Een van jou kleinkinders het jou leer hoe om ’n video-oproep te maak.','goed']; }},
  {min:60,max:120,vraag:'Die gemeenskapsentrum soek vrywilligers vir die sopkombuis.',
   opsies:[
    {t:'Gaan help', doen:function(){ s.geluk=klem(s.geluk+tussen(6,14));
      stelVlag('vrywilliger');
      noteer('Jy help nou elke Donderdag by die sopkombuis.','goed'); }},
    {t:'Nie vanjaar nie', doen:function(){
      noteer('Jy het gesê jy sal dink daaroor.','neutraal'); }}
   ]},
  {min:70,max:120,vraag:'Jou familie vra of jy nie liewer in ’n aftreeoord moet trek nie.',
   opsies:[
    {t:'Trek soontoe', doen:function(){
      var k = Math.round(220000 * dorpFaktor());
      if(s.geld + (s.spaar||0) < k){ noteer('Julle kon dit nie bekostig nie.','neutraal'); return; }
      if(s.geld<k) dekUitSpaar(k - s.geld);
      s.geld-=k; s.gesondheid=klem(s.gesondheid+tussen(2,8)); s.geluk=klem(s.geluk-tussen(0,8));
      stelVlag('aftreeoord');
      /* Jy bly nou daar: blyplekJaar() lees die vlag en vra nie weer
         huur nie, en die balju trek jou nie daar uit nie. */
      s.blyplek = 'aftreeoord';
      noteer('Jy het in ’n aftreeoord ingetrek. Daar is altyd iemand naby.','neutraal'); }},
    {t:'Bly in jou eie huis', doen:function(){ s.geluk=klem(s.geluk+6); s.gesondheid=klem(s.gesondheid-2);
      noteer('Jy het gesê jy gaan nêrens heen nie.','goed'); }}
   ]}
]);

/* ---------- Die liggaam (F1/F2) ---------- */
GEBEURE = GEBEURE.concat([
  {min:20,max:120,as:function(){ return chronies().length>0; },
   doen:function(){ s.geluk=klem(s.geluk-7);
    return ['Jy het ’n hele oggend in ’n wagkamer deurgebring vir ’n herhaalvoorskrif.','sleg']; }},
  {min:20,max:120,as:function(){ return chronies().length>0 && !!s.mediesefonds; },
   doen:function(){ var v=tussen(1200,9000); s.geld-=v;
    return ['Jou fonds het die eerste deel betaal; jy moes ' + geld(v) + ' self byvoeg.','geld']; }},
  {min:18,max:120,as:function(){ return chronies().length>0 && !s.mediesefonds; },
   doen:function(){ s.gesondheid=klem(s.gesondheid-tussen(2,6));
    return ['Die staatskliniek se medisyne was weer uit voorraad.','sleg']; }},
  {min:25,max:120,as:function(){ return hetToestand('bloeddruk') || hetToestand('diabetes'); },
   vraag:'Die dokter sê jy moet jou eetgewoontes verander. Dit beteken regtig verander.',
   opsies:[
    {t:'Doen dit behoorlik', doen:function(){ s.gesondheid=klem(s.gesondheid+tussen(5,12));
      s.geluk=klem(s.geluk-4); stelVlag('dieetGehou');
      noteer('Jy het die kos verander en dit voel in alles.','goed'); }},
    {t:'Probeer ’n bietjie', doen:function(){ s.gesondheid=klem(s.gesondheid+tussen(0,3));
      noteer('Jy het ’n paar dinge verander en die res gelos.','neutraal'); }}
   ]},
  {min:16,max:120,as:function(){ return s.gesondheid<45; },
   doen:function(){ s.geluk=klem(s.geluk-8);
    return ['Jy was te moeg om ’n hele dag deur te kom sonder om te gaan lê.','sleg']; }},
  {min:18,max:120,as:function(){ return !s.mediesefonds && s.ouderdom>=30; },
   doen:function(){ s.geluk=klem(s.geluk-4);
    return ['’n Mediese fonds se agent het gebel. Jy het gesê jy sal later terugkom daarop.','neutraal']; }},

  /* ---------- Drank, rook en dwelms (F4) ---------- */
  {min:18,max:120,as:function(){ return gewoonteVlak('drink')>=2; },
   doen:function(){ s.geluk=klem(s.geluk-6); s.gesondheid=klem(s.gesondheid-3);
    return ['Jy kan nie onthou hoe die aand geëindig het nie.','sleg']; }},
  {min:18,max:120,as:function(){ return gewoonteVlak('drink')>=2 && !!maat(); },
   doen:function(){ var m=maat(); m.band=klem(m.band-tussen(5,14)); s.geluk=klem(s.geluk-7);
    return [m.naam + ' het gesê julle moet oor jou drinkery praat.','sleg']; }},
  {min:16,max:120,as:function(){ return gewoonteVlak('rook')>=2; },
   doen:function(){ s.gesondheid=klem(s.gesondheid-tussen(2,6));
    return ['Jou hoes het die hele winter aangehou.','sleg']; }},
  {min:18,max:120,as:function(){ return gewoonteVlak('dwelms')>=2; },
   doen:function(){ var v=tussen(3000,25000); s.geld-=v; s.geluk=klem(s.geluk-6);
    return ['Geld het verdwyn en jy weet presies waarheen: ' + geld(v) + '.','sleg']; }},
  {min:18,max:120,as:function(){ return s.opgehou && (s.opgehou.drink||s.opgehou.rook||s.opgehou.dwelms); },
   doen:function(){ s.geluk=klem(s.geluk+6); s.gesondheid=klem(s.gesondheid+3);
    return ['Nog ’n jaar sonder. Dit raak makliker.','goed']; }},
  {min:18,max:120,as:function(){ return gewoonteVlak('drink')>=1 || gewoonteVlak('rook')>=1; },
   vraag:'Januarie. Almal praat van ’n maand sonder. Jy ook?',
   opsies:[
    {t:'Probeer dit', doen:function(){
      if(kans(50 + (s.slim-50)/3)){
        var g = gewoonteVlak('drink')>=1 ? 'drink' : 'rook';
        if(s.gewoontes[g]>0) s.gewoontes[g]--;
        s.gesondheid=klem(s.gesondheid+tussen(3,8)); s.geluk=klem(s.geluk+5);
        stelVlag('maandSonder');
        noteer('Jy het die hele maand uitgehou, en toe nog ’n maand.','goed'); }
      else { s.geluk=klem(s.geluk-3);
        noteer('Jy het dit tot die tiende gemaak.','neutraal'); } }},
    {t:'Nee', doen:function(){
      noteer('Jy het gesê Januarie is lank genoeg sonder dit ook.','neutraal'); }}
   ]},

  /* ---------- Op straat (B18) ---------- */
  {waar:'straat',min:16,max:120,
   doen:function(){ s.gesondheid=klem(s.gesondheid-tussen(3,9));
    return ['Dit het drie nagte agtermekaar gereën.','sleg']; }},
  {waar:'straat',min:16,max:120,
   doen:function(){ s.geluk=klem(s.geluk+tussen(4,10));
    return ['Iemand het by die robot afgedraai en vir jou ’n bord kos gebring.','goed']; }},
  {waar:'straat',min:16,max:120,
   doen:function(){ var v=Math.min(Math.max(0,s.geld), tussen(100,900)); s.geld-=v; s.geluk=klem(s.geluk-8);
    return ['Jou goed is gesteel terwyl jy geslaap het' + (v? ' — ' + geld(v) + ' ook' : '') + '.','sleg']; }},
  {waar:'straat',min:16,max:120,
   vraag:'’n Man in ’n bakkie vra of jy vir drie dae op ’n bouperseel wil kom werk. Kontant, geen kontrak.',
   opsies:[
    {t:'Klim op', doen:function(){
      if(kans(72)){ var v=tussen(600,1800); s.geld+=v; s.totaalVerdien+=v;
        noteer('Drie dae se werk, ' + geld(v) + ' in jou hand.','geld'); }
      else { s.geluk=klem(s.geluk-10); s.gesondheid=klem(s.gesondheid-4);
        noteer('Hy het jou aan die einde van die derde dag nie betaal nie.','sleg'); } }},
    {t:'Bly weg', doen:function(){
      noteer('Jy het die bakkie laat ry. ’n Mens weet nooit nie.','neutraal'); }}
   ]},

  /* ---------- Jou besigheid (H4) ---------- */
  {min:16,max:120,as:function(){ return !!s.besigheid; },
   doen:function(){ var b=s.besigheid; b.kliente=(b.kliente||0)+tussen(1,3); s.geluk=klem(s.geluk+5);
    return ['’n Kliënt het ' + b.naam + ' by sy hele netwerk aanbeveel.','werk']; }},
  {min:16,max:120,as:function(){ return !!s.besigheid; },
   doen:function(){ var b=s.besigheid; b.kliente=Math.max(0,(b.kliente||0)-tussen(1,3)); s.geluk=klem(s.geluk-6);
    return ['Iemand het ’n slegte resensie oor ' + b.naam + ' aanlyn geplaas.','sleg']; }},
  {min:16,max:120,as:function(){ return !!s.besigheid && (s.besigheid.werkers||0)>0; },
   doen:function(){ var b=s.besigheid, p=kies(b.span);
    s.geluk=klem(s.geluk+4);
    return [p.naam + ' het ’n probleem by ' + b.naam + ' opgelos sonder dat jy eers geweet het.','werk']; }},
  {min:18,max:120,as:function(){ return !!s.besigheid; },
   vraag:'’n Groot kliënt bied ’n kontrak aan wat jou besigheid kan verdubbel — maar hy betaal eers oor ses maande.',
   opsies:[
    {t:'Neem die kontrak', doen:function(){
      var b=s.besigheid, x=besigheidSoort(b.id);
      if(kans(66)){ b.kliente=(b.kliente||0) + Math.max(1, Math.round(besigheidKapasiteit()*0.3));
        noteer('Hulle het betaal, en ' + b.naam + ' is nie meer dieselfde besigheid nie.','geld'); }
      else { var v=Math.round(x.vaste*0.6); s.geld-=v; s.geluk=klem(s.geluk-12);
        noteer('Hulle het nooit betaal nie. Jy sit met ' + geld(v) + ' se koste.','sleg'); } }},
    {t:'Vra vooruitbetaling', doen:function(){
      if(kans(45)){ var b=s.besigheid; b.kliente=(b.kliente||0)+tussen(1,4);
        noteer('Hulle het ingestem om die helfte vooruit te betaal.','geld'); }
      else { s.geluk=klem(s.geluk-4);
        noteer('Hulle het by iemand anders gaan koop.','neutraal'); } }}
   ]},
  {min:18,max:120,as:function(){ return !!s.besigheid && (s.besigheid.jare||0)>=3; },
   vraag:'Iemand wil ’n aandeel in jou besigheid koop.',
   opsies:[
    {t:'Verkoop ’n derde', doen:function(){
      var b=s.besigheid, prys=Math.round(besigheidWaarde()/3);
      if(prys<5000){ noteer('Hulle het die syfers gesien en teruggetrek.','neutraal'); return; }
      s.geld+=prys; b.toerusting=Math.round((b.toerusting||0)*0.7);
      noteer('Jy het ’n derde van ' + b.naam + ' vir ' + geld(prys) + ' verkoop.','geld'); }},
    {t:'Hou alles self', doen:function(){ s.geluk=klem(s.geluk+3);
      noteer('Jy het gesê dit is joune.','neutraal'); }}
   ]},

  /* ---------- Jou vaardighede (H3) ---------- */
  {min:10,max:120,as:function(){ return vaardigVlak('kodeer')>=2; },
   doen:function(){ var v=tussen(2000,18000); s.geld+=v; s.totaalVerdien+=v;
    return ['Iemand het gevra of jy ’n klein stelseltjie vir hulle kan bou: ' + geld(v) + '.','geld']; }},
  {min:12,max:120,as:function(){ return vaardigVlak('kook')>=3; },
   doen:function(){ s.geluk=klem(s.geluk+7);
    return ['Die hele familie het Sondag by jou kom eet. Niemand wou huis toe gaan nie.','goed']; }},
  {min:10,max:120,as:function(){ return vaardigVlak('karate')>=2; },
   doen:function(){ s.gesondheid=klem(s.gesondheid+4); s.geluk=klem(s.geluk+5);
    return ['Jy het jou volgende gordel in die dojo gekry.','goed']; }},
  {min:12,max:120,as:function(){ return vaardigVlak('klavier')>=3 || vaardigVlak('kitaar')>=3; },
   doen:function(){ s.geluk=klem(s.geluk+8);
    return ['Jy het by ’n familiefunksie gespeel en almal het stilgeword.','goed']; }},
  {min:14,max:120,as:function(){ return vaardigVlak('tuinmaak')>=2; },
   doen:function(){ s.geluk=klem(s.geluk+5); s.gesondheid=klem(s.gesondheid+3);
    return ['Jou tuin het soveel gelewer dat jy by die bure moes uitdeel.','goed']; }},
  {min:12,max:120,as:function(){ return vaardigVlak('karate')>=2 || vaardigVlak('sport')>=3; },
   vraag:'Twee mans pluk aan ’n vrou se handsak by die parkeerterrein.',
   opsies:[
    {t:'Gryp in', doen:function(){
      if(kans(40 + vaardigVlak('karate')*14 + vaardigVlak('sport')*6)){
        s.geluk=klem(s.geluk+tussen(10,20));
        stelVlag('heldGewees');
        noteer('Hulle het gehardloop. Sy het gehuil en jou vasgehou.','goed'); }
      else { s.gesondheid=klem(s.gesondheid-tussen(10,25)); s.geluk=klem(s.geluk-6);
        noteer('Jy het ’n stewel teen die ribbes gekry. Hulle is weg met die sak.','sleg'); } }},
    {t:'Bel die polisie', doen:function(){ s.geluk=klem(s.geluk-3);
      noteer('Jy het gebel. Hulle was lankal weg toe die van opdaag.','neutraal'); }}
   ]},

  /* ---------- Jou kinders (E7) ---------- */
  {min:20,max:120,as:function(){ return kindersTuis()>0; },
   doen:function(){ s.geluk=klem(s.geluk-6); s.gesondheid=klem(s.gesondheid-3);
    return ['Een van die kinders was die hele nag siek. Niemand het geslaap nie.','sleg']; }},
  {min:20,max:120,as:function(){ return kindersTuis()>0; },
   doen:function(){ var v=Math.round(tussen(1500,9000)*dorpFaktor()); s.geld-=v;
    return ['Skooluniforms, skoene en boeke vir die jaar: ' + geld(v) + '.','geld']; }},
  {min:22,max:120,as:function(){ return s.kinders>0; },
   doen:function(){ var k=s.verhoudings.filter(function(v){ return v.lewe &&
      (v.tipe==='seun'||v.tipe==='dogter'); }); if(!k.length) return null;
    var v=kies(k); v.band=klem(v.band+tussen(4,11)); s.geluk=klem(s.geluk+7);
    return ['Jy en ' + v.naam + ' het ’n hele middag saam in die motor gery en gesels.','goed']; }},
  /* Dit was altyd "hy", ook vir 'n dogter, en die kind wie se band
     geskuif het, was nie noodwendig die een wat gevra het nie. */
  {min:24,max:120,as:function(){ return kindersTuis()>0; },
   vraag:'Jou kind vra of hy of sy by ’n duur skooltoer kan gaan. Dit kos R12 000.',
   opsies:[
    {t:'Betaal daarvoor', doen:function(){
      var k=kindTuisKies();
      if(s.geld<12000){ noteer('Jy moes sê daar is nie geld nie. Dit was swaar.','sleg');
        s.geluk=klem(s.geluk-8); return; }
      s.geld-=12000;
      if(k) k.band=klem(k.band+tussen(6,14));
      s.geluk=klem(s.geluk+5);
      noteer('Jy het die R12 000 betaal. ' + (k ? k.naam : 'Jou kind') +
        ' het elke dag gebel.','geld'); }},
    {t:'Sê nee', doen:function(){ s.geluk=klem(s.geluk-6);
      var k=kindTuisKies();
      if(k) k.band=klem(k.band-tussen(3,9));
      noteer('Jy het verduidelik hoekom nie. ' + (k ? k.naam : 'Jou kind') +
        ' het gesê ' + (k ? besit(k) : 'hy') + ' verstaan.','neutraal'); }}
   ]}
]);

/* ==========================================================================
   H14 — DIE VLAGVERHALE
   Elkeen hiervan lees 'n vlag wat 'n vroeëre keuse gestel het. vlagRyp()
   sê dat die vlag daar is, dat genoeg jare verby is, en dat die verhaal
   nie al klaar afgespeel het nie; sluitVlag() maak dit dan toe sodat dit
   nie oor en oor gebeur nie.
   ========================================================================== */
GEBEURE = GEBEURE.concat([
  /* --- Die boelie, twintig jaar later --- */
  {min:25,max:55,as:function(){ return vlagRyp('boelie', 14); },
   vraag:'Jy loop ’n man raak wat jou dophou — ’n gesig uit die laerskool se gang.',
   opsies:[
    {t:'Gaan praat met hom', doen:function(){
      var d = vlagData('boelie') || {}, naam = d.naam || kies(MANSNAME);
      sluitVlag('boelie');
      if(d.wat==='geslaan'){ s.geluk=klem(s.geluk+tussen(8,16));
        noteer(naam + ' het verskoning gevra vir wat hy op skool gedoen het. Julle het lank gestaan en gesels.','goed'); }
      else if(d.wat==='betaal'){ s.geluk=klem(s.geluk+tussen(4,10));
        noteer(naam + ' het nie eens onthou wie jy is nie. Dit het die ding kleiner gemaak.','neutraal'); }
      else if(d.wat==='aangegee'){ s.geluk=klem(s.geluk-tussen(2,8));
        noteer(naam + ' het gesê die detensie was die begin van ’n lang slegte jaar vir hom.','neutraal'); }
      else { s.geluk=klem(s.geluk+tussen(5,12));
        noteer(naam + ' het gesê hy onthou dat jy teruggeveg het. Hy het dit met respek gesê.','goed'); } }},
    {t:'Draai om', doen:function(){ s.geluk=klem(s.geluk-5); sluitVlag('boelie');
      noteer('Jy het omgedraai. Dertig jaar later vat dit nog ’n hap uit jou dag.','sleg'); }}
   ]},
  {min:28,max:60,as:function(){ return vlagRyp('boelie', 18) && !!s.beroep; },
   doen:function(){ var d=vlagData('boelie')||{}; sluitVlag('boelie');
    s.geluk=klem(s.geluk + (d.wat==='geslaan' ? 6 : -4));
    return [(d.naam||'Die ou boelie') + ' van die laerskool het by jou werk aansoek gedoen. Jy sit in die paneel.','werk']; }},

  /* --- Die vriend wat jou geld geskuld het --- */
  {min:28,max:120,as:function(){ return vlagRyp('leningUit', 7) &&
     (vlagData('leningUit')||{}).wat==='skuld'; },
   doen:function(){
     var d = vlagData('leningUit') || {};
     sluitVlag('leningUit');
     if(kans(55)){ var terug = Math.round((d.bedrag||20000) * tussen(100,180)/100);
       s.geld += terug; s.geluk = klem(s.geluk+tussen(6,14));
       return [(d.naam||'Die ou vriend') + ' het na al die jare opgedaag en ' + geld(terug) +
         ' kontant op die tafel gesit.','geld']; }
     s.geluk = klem(s.geluk-6);
     return [(d.naam||'Die ou vriend') + ' het jou by ’n winkelsentrum gesien en in die ander rigting geloop.','sleg']; }},
  {min:30,max:120,as:function(){ return vlagRyp('leningUit', 10) &&
     (vlagData('leningUit')||{}).wat==='betaal'; },
   vraag:'Die vriend aan wie jy jare gelede R20 000 geleen het, bel weer. Sy besigheid loop nou goed.',
   opsies:[
    {t:'Luister na sy voorstel', doen:function(){
      var d=vlagData('leningUit')||{}; sluitVlag('leningUit');
      if(kans(58)){ var v=tussen(60000,400000); s.geld+=v;
        noteer((d.naam||'Hy') + ' het jou ’n aandeel in sy besigheid gegee: ' + geld(v) + ' werd.','geld');
        s.geluk=klem(s.geluk+12); }
      else { s.geluk=klem(s.geluk-5);
        noteer('Dit was ’n lang middagete en niks het daarvan gekom nie.','neutraal'); } }},
    {t:'Sê jy is besig', doen:function(){ sluitVlag('leningUit');
      noteer('Jy het gesê jy sal hom terugbel.','neutraal'); }}
   ]},

  /* --- Die borgskap wat jy geteken het --- */
  {min:24,max:120,as:function(){ return vlagRyp('borgGestaan', 3); },
   doen:function(){
     var d = vlagData('borgGestaan') || {};
     sluitVlag('borgGestaan');
     if(kans(45)){
       var v = tussen(12000,60000);
       betaalWatJyKan(v, 'die borgskap wat jy geteken het');
       s.geluk = klem(s.geluk-tussen(8,16));
       return ['Die meubelwinkel het jóú gedagvaar: ' + (d.naam||'jou vriend') +
         ' het opgehou betaal. Jy skuld ' + geld(v) + '.','sleg']; }
     s.geluk = klem(s.geluk+5);
     return [(d.naam||'Jou vriend') + ' het die rekening klaar betaal. Jou handtekening het niks gekos nie.','goed']; }},

  /* --- Die kind by wie jy gaan sit het --- */
  {min:25,max:120,as:function(){ return vlagRyp('nuweKind', 15); },
   doen:function(){
     var d = vlagData('nuweKind') || {};
     sluitVlag('nuweKind');
     s.geluk = klem(s.geluk+tussen(8,15));
     if(s.beroep && kans(45)){ s.beroep.prestasie = klem(s.beroep.prestasie+tussen(6,14));
       return [(d.naam||'Die nuwe kind van destyds') + ' — die een by wie jy in Graad 5 gaan sit het — ' +
         'het jou by die werk aanbeveel.','werk']; }
     /* Die vlag onthou nou ook die geslag: dit het "by hom kom sit" gesê,
        ook as sy 'n meisie was. */
     return [(d.naam||'Die nuwe kind van destyds') + ' het jou opgespoor net om dankie te sê ' +
       'vir die dag toe jy by ' + (d.geslag==='v' ? 'haar' : 'hom') + ' kom sit het.','goed']; }},

  /* --- Die eksamenvraestel --- */
  {min:22,max:60,as:function(){ return vlagRyp('gekopieer', 6) && !!s.beroep; },
   doen:function(){ sluitVlag('gekopieer'); s.geluk=klem(s.geluk-7);
    return ['Iemand by die werk het ’n storie oor matriek se vraestel opgehaal. Jy het niks gesê nie.','sleg']; }},
  {min:20,max:60,as:function(){ return vlagRyp('eerlikEksamen', 4); },
   doen:function(){ sluitVlag('eerlikEksamen'); s.geluk=klem(s.geluk+6); s.slim=klem(s.slim+2);
    return ['Jy het besef dat elke punt op jou naam werklik joune is. Dit dra ’n mens ver.','goed']; }},

  /* --- Die sigaret agter die kleedkamers --- */
  {min:30,max:120,as:function(){ return vlagRyp('eersteSigaret', 15) && gewoonteVlak('rook')>=2; },
   doen:function(){ sluitVlag('eersteSigaret'); s.geluk=klem(s.geluk-6);
    return ['Jy het onthou hoe dit begin het: een sigaret agter die kleedkamers op skool.','sleg']; }},
  {min:30,max:120,as:function(){ return vlagRyp('sigaretGeweier', 15) && gewoonteVlak('rook')===0; },
   doen:function(){ sluitVlag('sigaretGeweier'); s.geluk=klem(s.geluk+7); s.gesondheid=klem(s.gesondheid+3);
    return ['Jy het ’n ou skoolmaat met ’n suurstoftenk gesien en gedink aan die dag toe jy nee gesê het.','goed']; }},

  /* --- Die piramideskema-vriend --- */
  {min:28,max:120,as:function(){ return vlagRyp('skema', 8); },
   vraag:'Dieselfde ou vriend is terug met ’n "nuwe geleentheid" — hierdie keer kripto.',
   opsies:[
    {t:'Sit R80 000 in', doen:function(){
      var d=vlagData('skema')||{}; sluitVlag('skema');
      if(s.geld<80000){ noteer('Jy het nie die geld gehad nie.','neutraal'); return; }
      s.geld-=80000;
      if(kans(18 + vaardigVlak('aandele')*7)){ s.geld+=260000;
        noteer('Hierdie keer het dit gewerk. Moenie dit weer doen nie.','geld'); }
      else { s.geluk=klem(s.geluk-16);
        noteer((d.naam||'Hy') + ' se "geleentheid" was weer niks. R80 000 weg.','sleg'); } }},
    {t:'Blok sy nommer', doen:function(){ sluitVlag('skema'); s.slim=klem(s.slim+3); s.geluk=klem(s.geluk+4);
      noteer('Jy het sy nommer geblok. Dit was die maklikste besluit van die jaar.','goed'); }}
   ]},

  /* --- Die foon by die winkelsentrum --- */
  {min:20,max:120,as:function(){ return vlagRyp('foon', 9); },
   doen:function(){
     var d = vlagData('foon') || {};
     sluitVlag('foon');
     if(d.wat==='terug'){
       if(kans(40) && !s.beroep){ s.geluk=klem(s.geluk+10);
         return [(d.naam||'Die vrou') + ' wie se foon jy teruggegee het, het jou aan iemand voorgestel wat vir mense werk kry.','werk']; }
       s.geluk=klem(s.geluk+8);
       return [(d.naam||'Die vrou') + ' wie se foon jy jare gelede teruggegee het, het jou raakgeloop en haar hele familie van jou vertel.','goed']; }
     s.geluk=klem(s.geluk-6);
     return ['Jy het ’n vrou by die winkelsentrum sien soek na haar foon en gedink aan die een wat jy gehou het.','sleg']; }},

  /* --- Die dag toe jy ingegryp het --- */
  {min:22,max:120,as:function(){ return vlagRyp('heldGewees', 5); },
   doen:function(){ sluitVlag('heldGewees'); s.geluk=klem(s.geluk+tussen(6,14));
    s.aansien=(s.aansien||0)+1;
    return ['Die vrou wie se handsak jy gered het, het jou storie by die gemeenskapsblad vertel.','goed']; }},

  /* --- Die bankrot besigheid --- */
  {min:24,max:120,as:function(){ return vlagRyp('bankrot', 4) && !s.besigheid; },
   vraag:'Iemand wat jou ou besigheid geken het, vra of jy nie weer wil probeer nie — hy sit die kapitaal in.',
   opsies:[
    {t:'Probeer weer', doen:function(){ sluitVlag('bankrot');
      var v = tussen(40000,180000); s.geld += v; s.geluk=klem(s.geluk+10);
      noteer('Hy het ' + geld(v) + ' ingesit om jou weer op die been te kry. Begin dit onder Werk.','geld'); }},
    {t:'Een keer was genoeg', doen:function(){ sluitVlag('bankrot'); s.geluk=klem(s.geluk-4);
      noteer('Jy het gesê jy het genoeg geleer om dit nie weer te doen nie.','neutraal'); }}
   ]},

  /* --- Die beroepsdag se tafel --- */
  {min:22,max:45,as:function(){ return vlagRyp('besigheidGedroom', 5) && !s.besigheid; },
   doen:function(){ sluitVlag('besigheidGedroom'); s.geluk=klem(s.geluk-3); s.slim=klem(s.slim+2);
    return ['Jy dink nog aan die man by die beroepsdag wat sy eie ding gedoen het. Dit laat jou nie los nie.','neutraal']; }},

  /* --- Die trek vir werk --- */
  {min:26,max:120,as:function(){ return vlagRyp('getrekVirWerk', 6); },
   doen:function(){ sluitVlag('getrekVirWerk'); s.geluk=klem(s.geluk-5);
    return ['Jy het ’n foto van jou ou dorp gesien en ’n hele aand daaroor gesit.','sleg']; }},

  /* --- Die kar wat jy nie laat diens het nie --- */
  {min:24,max:120,as:function(){ return vlagRyp('padongeluk', 8); },
   doen:function(){ sluitVlag('padongeluk'); s.geluk=klem(s.geluk-4);
    return ['Jy ry nog steeds stadiger as almal anders op daardie stuk pad.','neutraal']; }},

  /* --- Wie die ruit gebreek het --- */
  {min:25,max:120,as:function(){ return vlagRyp('skuldGevat', 14); },
   doen:function(){ var d=vlagData('skuldGevat')||{}; sluitVlag('skuldGevat');
    s.geluk=klem(s.geluk+tussen(6,13));
    return [(d.naam||'Jaco') + ' — die een vir wie jy op skool die skuld gevat het — het jou gebel ' +
      'net om te sê hy het dit nooit vergeet nie.','goed']; }},
  {min:25,max:120,as:function(){ return vlagRyp('verklik', 14); },
   doen:function(){ var d=vlagData('verklik')||{}; sluitVlag('verklik'); s.geluk=klem(s.geluk-5);
    return ['Jy het ' + (d.naam||'Jaco') + ' by ’n begrafnis gesien. Hy het geknik en verder geloop.','neutraal']; }},

  /* --- Die generasie voor jou --- */
  {min:18,max:120,as:function(){ return hetVlag('generasiespeler') && !hetVlag('ouerVergelyk') &&
     (s.familielyn||[]).length>0; },
   doen:function(){ stelVlag('ouerVergelyk');
     var vorige = s.familielyn[s.familielyn.length-1];
     if(netoWaarde() > vorige.netto){ s.geluk=klem(s.geluk+tussen(6,12));
       return ['Jy het besef jy staan vandag beter as waar ' + vorige.naam + ' ooit gestaan het.','goed']; }
     s.geluk=klem(s.geluk-tussen(3,9));
     return ['Mense vergelyk jou nog met ' + vorige.naam + '. Dit sit swaarder as wat jy sou dink.','sleg']; }},
  {min:30,max:120,as:function(){ return (s.familielyn||[]).length>=2 && !hetVlag('familieNaam'); },
   doen:function(){ stelVlag('familieNaam'); s.geluk=klem(s.geluk+tussen(5,11));
    return ['Iemand het jou van herken en gevra of jy familie is van die ' + s.van + 's van ' +
      (s.familielyn[0].naam.split(' ')[0]) + ' se tyd.','goed']; }},

  /* --- Die vrywilliger en die dieet --- */
  {min:62,max:120,as:function(){ return vlagRyp('vrywilliger', 4); },
   doen:function(){ sluitVlag('vrywilliger'); s.geluk=klem(s.geluk+tussen(7,14));
    return ['Die sopkombuis het jou met ’n sertifikaat bedank. Jy het dit opgehang.','goed']; }},
  {min:30,max:120,as:function(){ return vlagRyp('dieetGehou', 5); },
   doen:function(){ sluitVlag('dieetGehou'); s.gesondheid=klem(s.gesondheid+tussen(3,8));
    return ['Die dokter het gesê jou syfers lyk beter as vyf jaar gelede. Dit gebeur nie dikwels nie.','goed']; }},
  {min:20,max:120,as:function(){ return vlagRyp('kortkursus', 3) && !s.beroep; },
   doen:function(){ sluitVlag('kortkursus'); s.slim=klem(s.slim+3);
    return ['Die sertifikaat van daardie kortkursus het jou CV bo op die hoop gesit.','werk']; }},
  {min:20,max:120,as:function(){ return vlagRyp('maandSonder', 3) && !verslaaf(); },
   doen:function(){ sluitVlag('maandSonder'); s.gesondheid=klem(s.gesondheid+tussen(2,6));
    return ['Die maand sonder het ’n gewoonte geword. Jy voel dit in alles.','goed']; }}
]);

/* Nog drie vlae wat nie sonder 'n antwoord mag bly nie (A13 se les: 'n
   vlag wat gestel word maar nooit gelees word nie, is dooie kode). */
GEBEURE = GEBEURE.concat([
  {min:20,max:120,as:function(){ return vlagRyp('stilgebly', 12); },
   doen:function(){ sluitVlag('stilgebly'); s.slim=klem(s.slim+2); s.geluk=klem(s.geluk+4);
    return ['Jy onthou die dag toe die hele klas vir een ou se ruit moes boet, en dat jy stilgebly het.','neutraal']; }},
  {min:19,max:40,as:function(){ return vlagRyp('universiteitGedroom', 2) &&
     (s.skool.grade||[]).length>0; },
   doen:function(){ sluitVlag('universiteitGedroom'); s.geluk=klem(s.geluk+tussen(6,12));
    return ['Jy het aan die student by die beroepsdag gedink. Jy het dit gemaak.','goed']; }},
  {min:22,max:120,as:function(){ return vlagRyp('motorGedien', 2) &&
     s.bates.some(function(b){ return b.t==='motor'; }); },
   doen:function(){ sluitVlag('motorGedien'); s.geluk=klem(s.geluk+4);
    return ['Jou motor het deur die padwaardigheidstoets gegaan sonder ’n enkele probleem. Dit betaal om hom te laat diens.','goed']; }}
]);

/* ---------- Nog keuses, oor al die lewensfases heen ---------- */
GEBEURE = GEBEURE.concat([
  {min:9,max:14,as:function(){ return opSkool(); },
   vraag:'Die skool kies ’n span vir die landswye wiskunde-olimpiade. Jy moet self aanmeld.',
   opsies:[
    {t:'Meld aan', doen:function(){
      if(kans(30 + s.slim/2)){ s.slim=klem(s.slim+tussen(5,11)); s.geluk=klem(s.geluk+8);
        noteer('Jy het die tweede ronde gehaal. Die onderwyser het jou ouers gebel.','skool'); }
      else { s.slim=klem(s.slim+2); s.geluk=klem(s.geluk-4);
        noteer('Jy het in die eerste ronde uitgeval, maar jy het dit darem probeer.','skool'); } }},
    {t:'Los dit', doen:function(){ noteer('Jy het nie aangemeld nie.','neutraal'); }}
   ]},
  {min:13,max:18,as:function(){ return opSkool(); },
   vraag:'Jy kan ná skool óf by die skoolkoerant óf by die eerste span se oefeninge aansluit.',
   opsies:[
    {t:'Skoolkoerant', doen:function(){ s.slim=klem(s.slim+tussen(3,8)); s.geluk=klem(s.geluk+4);
      if(!s.vaardighede) s.vaardighede={};
      var d = s.vaardighede.skryf || (s.vaardighede.skryf={vlak:0,punte:0,jare:0,laas:s.ouderdom});
      d.punte += tussen(4,9); d.vlak = vlakVanPunte(d.punte); d.laas = s.ouderdom;
      noteer('Jy het by die skoolkoerant aangesluit en elke maand ’n stuk geskryf.','skool'); }},
    {t:'Die eerste span', doen:function(){ s.gesondheid=klem(s.gesondheid+tussen(4,9)); s.geluk=klem(s.geluk+5);
      if(!s.vaardighede) s.vaardighede={};
      var d2 = s.vaardighede.sport || (s.vaardighede.sport={vlak:0,punte:0,jare:0,laas:s.ouderdom});
      d2.punte += tussen(4,9); d2.vlak = vlakVanPunte(d2.punte); d2.laas = s.ouderdom;
      noteer('Jy het elke middag geoefen en dit het gewys.','goed'); }}
   ]},
  {min:17,max:19,as:function(){ return s.skool.matriek && s.skool.vlak!=='universiteit' &&
     lewendeOuers().length>0; },
   vraag:'Jou ouers vra wat jy nou gaan doen.',
   opsies:[
    {t:'’n Gapingsjaar', doen:function(){ s.geluk=klem(s.geluk+tussen(6,14)); s.slim=klem(s.slim-2);
      noteer('Jy het ’n jaar gevat om te werk en te reis.','neutraal'); }},
    {t:'So gou moontlik begin werk', doen:function(){ s.geluk=klem(s.geluk-3);
      noteer('Jy het gesê jy soek dadelik werk.','werk'); }},
    {t:'Universiteit, as jy inkom', doen:function(){ s.slim=klem(s.slim+3);
      noteer('Jy het aansoek gedoen en wag vir antwoord. Kyk onder Werk → Opleiding.','skool'); }}
   ]},
  {min:19,max:30,as:function(){ return studeerTans(); },
   vraag:'Die klas skryf saam aan ’n opdrag. Een student doen niks nie en vra dat sy naam ook op die blad kom.',
   opsies:[
    {t:'Sit sy naam op', doen:function(){ s.geluk=klem(s.geluk-4);
      noteer('Jy het sy naam opgesit. Hy het nie eens dankie gesê nie.','neutraal'); }},
    {t:'Weier', doen:function(){ s.geluk=klem(s.geluk+3); s.slim=klem(s.slim+1);
      noteer('Jy het geweier. Die dosent het dit opgemerk.','skool'); }}
   ]},
  {min:20,max:62,as:function(){ return !!s.beroep; },
   vraag:'Jy het ’n fout gemaak wat die maatskappy geld gaan kos, en niemand weet nog nie.',
   opsies:[
    {t:'Sê dit dadelik vir jou baas', doen:function(){
      if(!s.beroep) return;
      if(kans(62)){ s.beroep.prestasie=klem(s.beroep.prestasie+tussen(2,8)); s.geluk=klem(s.geluk+4);
        noteer('Jou baas het gesê dit is hoekom hy jou vertrou. Julle het dit saam reggemaak.','werk'); }
      else { s.beroep.prestasie=klem(s.beroep.prestasie-tussen(6,14)); s.geluk=klem(s.geluk-6);
        noteer('Hy was woedend. Dit staan nou in jou lêer.','sleg'); } }},
    {t:'Probeer dit self regmaak', doen:function(){
      if(!s.beroep) return;
      if(kans(48)){ s.geluk=klem(s.geluk-3);
        noteer('Jy het dit stilweg reggemaak. Niemand het ooit geweet nie.','neutraal'); }
      else { s.beroep.prestasie=klem(s.beroep.prestasie-tussen(10,22)); s.geluk=klem(s.geluk-12);
        noteer('Hulle het dit ontdek — en dat jy dit weggesteek het.','sleg'); } }}
   ]},
  {min:22,max:62,as:function(){ return !!s.beroep && s.beroep.prestasie>=60; },
   vraag:'’n Ander maatskappy bied jou 20% meer, maar jy begin weer onder aan die leer.',
   opsies:[
    {t:'Vat dit', doen:function(){
      if(!s.beroep) return;
      var b=s.beroep;
      b.salaris=Math.round(b.salaris*1.20); b.vlak=Math.max(0,b.vlak-1);
      b.jare=0; b.prestasie=klem(b.prestasie-10);
      pasPlafonToe(); losWerkMense(); maakKollegas();
      noteer('Jy het by ’n nuwe maatskappy begin teen ' + geld(b.salaris) + ' per jaar.','werk'); }},
    {t:'Bly waar jy is', doen:function(){
      if(!s.beroep) return;
      s.beroep.prestasie=klem(s.beroep.prestasie+4);
      noteer('Jy het gebly. Jou baas het gehoor van die aanbod.','werk'); }}
   ]},
  {min:25,max:120,as:function(){ return s.geld>150000; },
   vraag:'’n Familielid vra om geld te leen vir ’n begrafnis. Dit is nie ’n klein bedrag nie.',
   opsies:[
    {t:'Gee dit sonder om te vra', doen:function(){
      var v=tussen(15000,45000); s.geld-=v; s.geluk=klem(s.geluk+tussen(2,8));
      var f=s.verhoudings.filter(function(x){ return x.lewe &&
        ['broer','suster','oom','tante','ma','pa'].indexOf(x.tipe)>=0; });
      if(f.length){ var fw=kies(f); fw.band=klem(fw.band+tussen(5,12)); }
      noteer('Jy het ' + geld(v) + ' gegee en niks daaroor gesê nie.','geld'); }},
    {t:'Leen dit, met ’n datum', doen:function(){
      var v=tussen(15000,45000); s.geld-=v;
      stelVlag('begrafnisLening', {bedrag:v});
      noteer('Jy het ' + geld(v) + ' geleen en gesê wanneer jy dit terugwil hê.','geld'); }},
    {t:'Sê jy kan nie', doen:function(){ s.geluk=klem(s.geluk-7);
      noteer('Jy het nee gesê. Dit was stil by die volgende familiebyeenkoms.','sleg'); }}
   ]},
  {min:28,max:120,as:function(){ return vlagRyp('begrafnisLening', 2); },
   doen:function(){ var d=vlagData('begrafnisLening')||{}; sluitVlag('begrafnisLening');
     if(kans(50)){ s.geld += (d.bedrag||20000); s.geluk=klem(s.geluk+6);
       return ['Hulle het die ' + geld(d.bedrag||20000) + ' tot op die dag terugbetaal.','geld']; }
     s.geluk=klem(s.geluk-6);
     return ['Die geld wat jy vir die begrafnis geleen het, kom nie terug nie. Niemand praat daaroor nie.','sleg']; }},
  {min:25,max:120,as:function(){ return hetHuis(); },
   vraag:'Jou buurman se boom hang oor jou muur en sy takke breek jou dakteëls.',
   opsies:[
    {t:'Gaan praat met hom', doen:function(){
      if(kans(64)){ s.geluk=klem(s.geluk+4);
        noteer('Hy het die tak laat afsaag en ’n sak lemoene gebring.','goed'); }
      else { s.geluk=klem(s.geluk-6); stelVlag('buurmanRusie');
        noteer('Hy het gesê die boom staan daar sedert 1994. Julle groet nie meer nie.','sleg'); } }},
    {t:'Saag dit self af', doen:function(){ s.geluk=klem(s.geluk-4); stelVlag('buurmanRusie');
      noteer('Jy het dit afgesaag. Hy het die oorblyfsels oor die muur teruggegooi.','sleg'); }}
   ]},
  {min:27,max:120,as:function(){ return vlagRyp('buurmanRusie', 4); },
   doen:function(){ sluitVlag('buurmanRusie');
     if(kans(45)){ s.geluk=klem(s.geluk+7);
       return ['Jou buurman het met ’n bottel wyn by die hek gestaan. Die boom-ding is verby.','goed']; }
     s.geluk=klem(s.geluk-4);
     return ['Jou buurman het ’n klag by die munisipaliteit oor jou muur ingedien.','sleg']; }},
  {min:30,max:120,as:function(){ return s.geld>400000 || (s.spaar||0)>400000; },
   vraag:'Jy het genoeg opsy gesit om iets groots te doen.',
   opsies:[
    {t:'Sit dit in die JSE', doen:function(){
      var som=Math.min(400000, Math.max(s.geld,0));
      if(som<50000){ noteer('Die kontant was nie so vry soos jy gedink het nie.','neutraal'); return; }
      s.geld-=som; s.belegging+=som;
      noteer('Jy het ' + geld(som) + ' in die indeksfonds gesit.','geld'); }},
    {t:'Vat die hele gesin oorsee', doen:function(){
      var k=Math.round(tussen(90000,260000)*(1+kindersTuis()*0.4));
      if(s.geld<k){ noteer('Dit was buite bereik.','neutraal'); return; }
      s.geld-=k; s.geluk=klem(s.geluk+tussen(14,26));
      noteer('Julle het ' + geld(k) + ' aan ’n reis bestee wat niemand ooit vergeet nie.','goed'); }},
    {t:'Hou dit waar dit is', doen:function(){ s.geluk=klem(s.geluk-2);
      noteer('Jy het dit gelos. ’n Mens weet nooit nie.','neutraal'); }}
   ]},
  {min:18,max:120,as:function(){ return s.geld < -20000; },
   vraag:'’n Skuldinvorderaar bel elke dag. Daar is ’n "skuldberader" wat sê hy kan help.',
   opsies:[
    {t:'Gaan sien die skuldberader', doen:function(){
      var fooi=tussen(1500,6000);
      if(kans(58)){ s.geld = Math.round(s.geld*0.78) - fooi; s.swartlys=Math.max(s.swartlys,3);
        noteer('Hulle het ’n deel van die skuld afgeskryf. Jy is wel drie jaar gelys.','geld'); }
      else { s.geld-=fooi; s.geluk=klem(s.geluk-6);
        noteer('Die "berader" het ' + geld(fooi) + ' gevat en niks gedoen nie.','sleg'); } }},
    {t:'Praat self met die bank', doen:function(){
      if(kans(42 + s.slim/4)){ s.geld = Math.round(s.geld*0.9);
        noteer('Die bank het ingestem om die rente te sny as jy betaal soos afgespreek.','geld'); }
      else { s.geluk=klem(s.geluk-5);
        noteer('Hulle het gesê jy moet die volle bedrag betaal.','sleg'); } }}
   ]},
  {min:18,max:120,as:function(){ return verslaaf(); },
   vraag:'Iemand wat jy liefhet het gevra of julle kan praat. Hulle het ’n nommer van ’n kliniek saamgebring.',
   opsies:[
    {t:'Luister', doen:function(){ s.geluk=klem(s.geluk-4);
      noteer('Jy het geluister. Jy het die nommer gehou — kyk onder Gesond.','neutraal'); }},
    {t:'Loop uit', doen:function(){ s.geluk=klem(s.geluk-10);
      var m2=maat(); if(m2) m2.band=klem(m2.band-tussen(8,18));
      noteer('Jy het opgestaan en geloop. Die deur het hard toegegaan.','sleg'); }}
   ]},
  {waar:'straat',min:16,max:120,
   vraag:'’n Maatskaplike werker by die skuiling vra of sy jou by ’n program kan inskryf.',
   opsies:[
    {t:'Skryf my in', doen:function(){
      if(s.dakloos) s.dakloos.ngo = 1;
      s.geluk=klem(s.geluk+tussen(5,12));
      stelVlag('maatskaplikeWerker');
      noteer('Jy het ’n adres, ’n ID-afskrif en iemand wat jou naam ken.','goed'); }},
    {t:'Nee dankie', doen:function(){ s.geluk=klem(s.geluk-3);
      noteer('Jy het gesê jy kom reg.','neutraal'); }}
   ]},
  {min:18,max:120,as:function(){ return vlagRyp('maatskaplikeWerker', 3) && !s.dakloos; },
   doen:function(){ sluitVlag('maatskaplikeWerker'); s.geluk=klem(s.geluk+tussen(8,16));
    return ['Die maatskaplike werker van die skuiling het gehoor dit gaan goed met jou. Sy het kom kuier.','goed']; }},
  {min:24,max:120,as:function(){ return kindersTuis()>0 && !!s.beroep; },
   vraag:'Jou kind se onderwyser vra vir ’n vergadering. Dit is in werksure.',
   opsies:[
    {t:'Vat verlof en gaan', doen:function(){
      var k=s.verhoudings.filter(function(v){ return v.lewe && (v.tipe==='seun'||v.tipe==='dogter'); });
      if(k.length){ var v=kies(k); v.band=klem(v.band+tussen(5,12));
        if(v.kl) v.kl.slim=klem(v.kl.slim+tussen(1,4)); }
      if(s.beroep) s.beroep.prestasie=klem(s.beroep.prestasie-3);
      s.geluk=klem(s.geluk+5);
      noteer('Jy was daar. Dit het vir jou kind meer beteken as wat jy besef het.','goed'); }},
    {t:'Vra of dit kan wag', doen:function(){ s.geluk=klem(s.geluk-4);
      noteer('Die vergadering is uitgestel tot niemand meer daaroor gepraat het nie.','neutraal'); }}
   ]},
  {min:45,max:120,as:function(){ return (s.kleinkinders||0)>0; },
   vraag:'Jou kleinkind vra of hy of sy ’n week in die vakansie by jou kan kom bly.',
   opsies:[
    {t:'Natuurlik', doen:function(){ s.geluk=klem(s.geluk+tussen(10,20)); s.gesondheid=klem(s.gesondheid-2);
      var kk=kleinkinderLys().filter(function(v){ return v.lewe; });
      if(kk.length){ var kw=kies(kk); kw.band=klem(kw.band+tussen(6,15)); }
      noteer('Die week het jou uitgeput en jou tien jaar jonger laat voel.','goed'); }},
    {t:'Dit is nie nou ’n goeie tyd nie', doen:function(){ s.geluk=klem(s.geluk-6);
      noteer('Jy het gesê volgende keer.','sleg'); }}
   ]},
  {min:30,max:65,as:function(){ return !!s.beroep; },
   vraag:'’n Werwer in Perth bel: dieselfde werk, drie keer die geld, maar ’n ander land.',
   opsies:[
    {t:'Begin die papierwerk', doen:function(){
      s.geluk=klem(s.geluk-6); s.slim=klem(s.slim+2);
      stelVlag('emigrasie');
      noteer('Jy het die visumaansoek begin. Dit gaan jare neem (en die spel laat jou nog nie gaan nie).','neutraal'); }},
    {t:'Sê jy bly hier', doen:function(){ s.geluk=klem(s.geluk+5);
      stelVlag('blyInSA');
      noteer('Jy het gesê jou mense is hier en jy gaan nêrens nie.','goed'); }}
   ]},
  {min:34,max:120,as:function(){ return vlagRyp('emigrasie', 3); },
   doen:function(){ sluitVlag('emigrasie');
     if(kans(50)){ s.geluk=klem(s.geluk-8);
       return ['Die visum is afgekeur. Al daardie papierwerk vir niks.','sleg']; }
     s.geluk=klem(s.geluk+4);
     return ['Die visum is goedgekeur, en toe kon jy dit nie oor jou hart kry om te gaan nie.','neutraal']; }},
  {min:34,max:120,as:function(){ return vlagRyp('blyInSA', 6); },
   doen:function(){ sluitVlag('blyInSA'); s.geluk=klem(s.geluk+tussen(4,10));
    return ['Jou vriende wat geëmigreer het, sê hulle mis die son en die mense. Jy het niks gesê nie.','goed']; }},
  {min:60,max:120,as:function(){ return !s.afgetree && !!s.beroep; },
   vraag:'Die maatskappy bied ’n pakket aan as jy vroeg uittree.',
   opsies:[
    {t:'Vat die pakket', doen:function(){
      if(!s.beroep) return;
      var pak=Math.round(s.beroep.salaris * tussen(60,180)/100);
      s.geld+=pak;
      noteer('Jy het ’n pakket van ' + geld(pak) + ' gevat en jou pos neergelê.','geld');
      s.beroep=null; losWerkMense(); s.geluk=klem(s.geluk+6); }},
    {t:'Werk aan', doen:function(){ s.geluk=klem(s.geluk-3);
      noteer('Jy het gesê jy is nog nie klaar nie.','werk'); }}
   ]}
]);
