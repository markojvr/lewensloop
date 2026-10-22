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
  {min:1,max:4,doen:function(){ s.gesondheid=klem(s.gesondheid-4);
    return ['Jy het van die bank afgeval en jou kop gestamp.','sleg']; }},
  {min:2,max:5,doen:function(){ s.geluk=klem(s.geluk+6);
    return ['Jou ouers het jou see toe geneem. Jy het sand geeet.','goed']; }},
  {min:2,max:6,doen:function(){ s.slim=klem(s.slim+3);
    return ['Jy het leer tel tot tien. Almal was beindruk.','skool']; }},
  {min:3,max:8,doen:function(){ s.geluk=klem(s.geluk+7);
    return ['Die gesin het ’n hond gekry. Hy slaap op jou bed.','goed']; }},
  /* --- Laerskool --- */
  {min:6,max:12,doen:function(){ s.slim=klem(s.slim+4);
    return ['Jy het ’n goue sterretjie gekry vir lees in die klas.','skool']; }},
  {min:6,max:13,doen:function(){ s.gesondheid=klem(s.gesondheid+5); s.geluk=klem(s.geluk+3);
    return ['Jy het by die skool se atletiekspan aangesluit.','goed']; }},
  {min:6,max:12,doen:function(){ var v=Math.round(tussen(20,60)*s.rykf); s.geld+=v;
    return ['Jy het ’n tand verloor en '+geld(v)+' van die tandfeetjie gekry.','geld']; }},
  {min:6,max:14,doen:function(){ s.geluk=klem(s.geluk-9);
    return ['Beurtkrag het jou gunsteling program afgesny net voor die einde.','sleg']; }},
  {min:7,max:13,doen:function(){ s.geluk=klem(s.geluk-12); s.voorkoms=klem(s.voorkoms-2);
    return ['Iemand het jou op die skoolterrein geboelie.','sleg']; }},
  {min:8,max:14,doen:function(){ s.geluk=klem(s.geluk+9);
    return ['Jy het ’n nuwe fiets vir Kersfees gekry.','goed']; }},
  {min:6,max:13,doen:function(){ s.slim=klem(s.slim-3);
    return ['Jy het jou huiswerk by die huis vergeet. Twee keer.','skool']; }},
  /* --- Hoerskool --- */
  {min:13,max:18,doen:function(){ s.geluk=klem(s.geluk+8); s.gesondheid=klem(s.gesondheid+4);
    return ['Jy het in die eerste rugby-/netbalspan gekom.','goed']; }},
  {min:13,max:18,doen:function(){ s.voorkoms=klem(s.voorkoms-7);
    return ['Aknee het jou gesig oorgeneem. Dis ’n moeilike jaar.','sleg']; }},
  {min:14,max:18,doen:function(){ var v=tussen(2000,9000); s.geld+=v;
    return ['Jy het vakansiewerk by ’n kafee gedoen en '+geld(v)+' gemaak.','geld']; }},
  {min:15,max:18,doen:function(){ s.slim=klem(s.slim-5); s.geluk=klem(s.geluk-6);
    return ['Jy het ’n wiskundetoets gedruip. Pa was nie beindruk nie.','skool']; }},
  {min:17,max:18,doen:function(){ s.geluk=klem(s.geluk+5);
    return ['Jy het jou leerlinglisensie gekry met een poging.','goed']; }},
  {min:16,max:18,doen:function(){ s.geluk=klem(s.geluk+11);
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
  {min:30,max:70,doen:function(){ s.voorkoms=klem(s.voorkoms-4);
    return ['Jy het jou eerste grys hare raakgesien.','sleg']; }},
  {min:35,max:75,doen:function(){ s.geluk=klem(s.geluk+5);
    return ['Jy het begin tuinmaak en dit is onverwags bevredigend.','goed']; }},
  {min:40,max:80,doen:function(){ s.gesondheid=klem(s.gesondheid-6);
    return ['Die dokter het gese jou cholesterol is te hoog.','sleg']; }},
  /* --- Oud --- */
  {min:62,max:120,doen:function(){ s.geluk=klem(s.geluk+6);
    return ['Jy het die hele middag op die stoep na die voels gekyk.','goed']; }},
  {min:65,max:120,doen:function(){ s.gesondheid=klem(s.gesondheid-7);
    return ['Jou knie het gaan staan terwyl jy opgestaan het.','sleg']; }},
  {min:60,max:120,as:function(){ return s.kinders>0; },
    doen:function(){ s.geluk=klem(s.geluk+12);
    return ['Jou kleinkinders het die naweek kom kuier.','goed']; }},
  /* --- Enige ouderdom --- */
  {min:5,max:120,doen:function(){ s.gesondheid=klem(s.gesondheid-5);
    return ['Jy het griep gekry en ’n week in die bed gele.','sleg']; }},
  {min:5,max:120,doen:function(){ s.geluk=klem(s.geluk+5);
    return ['Jy het ’n pragtige sonsondergang oor Tafelberg gesien.','goed']; }},
  {min:12,max:120,doen:function(){ var v=tussen(400,3000); s.geld=Math.max(0,s.geld-v);
    return ['Beurtkrag (fase 6) het al die kos in die yskas laat vrot: '+geld(v)+' weg.','geld']; }},
  {min:16,max:120,as:function(){ return !!s.beroep; },
    doen:function(){ s.beroep.prestasie=klem(s.beroep.prestasie+9);
    return ['Jou baas het jou voor die hele span geprys.','werk']; }},
  {min:16,max:120,as:function(){ return !!s.beroep; },
    doen:function(){ s.geluk=klem(s.geluk-8);
    return ['’n Kollega het jou idee in ’n vergadering gesteel.','werk']; }},
  {min:18,max:120,doen:function(){ s.geluk=klem(s.geluk-6);
    return ['Jou geyser het gebars. Die plafon is ’n gemors.','sleg']; }},

  /* --- Keuse-gebeure --- */
  {min:7,max:13,vraag:'’n Boelie het jou in die gang voorgekeer en vra vir jou lekkergeld.',
   opsies:[
    {t:'Gee dit vir hom', doen:function(){ s.geluk=klem(s.geluk-10);
      noteer('Jy het die geld oorhandig en die hele dag sleg gevoel.','sleg'); }},
    {t:'Slaan terug', doen:function(){ if(kans(45)){ s.geluk=klem(s.geluk+12);
        noteer('Jy het teruggeveg en hy het jou nooit weer gepla nie.','goed'); }
      else { s.gesondheid=klem(s.gesondheid-12); s.geluk=klem(s.geluk-8);
        noteer('Jy het teruggeveg en ’n blou oog gekry.','sleg'); } }},
    {t:'Se vir die onderwyser', doen:function(){ s.geluk=klem(s.geluk+4);
      noteer('Die onderwyser het ingegryp. Die boelie kry detensie.','skool'); }}
   ]},
  {min:14,max:18,vraag:'Jou vriende wil Vrydagaand uitsluip na ’n partytjie. Jou ouers weet niks.',
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
      noteer('Sy was so dankbaar dat sy jou ’n koffie gekoop het.','goed'); }},
    {t:'Hou dit', doen:function(){ var v=tussen(1500,9000); s.geld+=v;
      noteer('Jy het die foon vir '+geld(v)+' verkoop. Jou gewete pla ’n bietjie.','misdaad'); }}
   ]},
  {min:18,max:120,vraag:'’n Ou skoolvriend bel oor ’n "waarborg" belegging wat 40% per jaar betaal.',
   opsies:[
    {t:'Bele R50 000', doen:function(){ if(s.geld<50000){ noteer('Jy het nie die R50 000 gehad nie. Dalk ’n geluk.','neutraal'); return; }
      s.geld-=50000;
      if(kans(22)){ s.geld+=120000; noteer('Dit het gewerk! Jy het R70 000 wins gemaak.','geld'); }
      else { noteer('Dit was ’n piramideskema. Jou R50 000 is weg.','sleg'); s.geluk=klem(s.geluk-14); } }},
    {t:'Loop weg', doen:function(){ s.slim=klem(s.slim+3);
      noteer('Jy het nee gese. Ses maande later was hy in die koerant.','goed'); }}
   ]},
  {min:18,max:120,vraag:'Jy sien ’n beursie met R2 000 kontant op die sypaadjie le.',
   opsies:[
    {t:'Hou die geld', doen:function(){ s.geld+=2000; s.geluk=klem(s.geluk-4);
      noteer('Jy het die R2 000 gehou en die beursie weggegooi.','misdaad'); }},
    {t:'Soek die eienaar', doen:function(){ s.geluk=klem(s.geluk+10);
      if(kans(40)){ s.geld+=500; noteer('Die eienaar het jou R500 as dankie gegee.','geld'); }
      else noteer('Jy het die beursie by die polisie ingehandig.','goed'); }}
   ]},
  {min:21,max:120,vraag:'’n Vriend vra of hy R20 000 kan leen vir sy nuwe besigheid.',
   opsies:[
    {t:'Leen dit uit', doen:function(){ if(s.geld<20000){ noteer('Jy kon dit nie bekostig nie.','neutraal'); return; }
      s.geld-=20000;
      if(kans(45)){ s.geld+=32000; noteer('Hy het alles met rente terugbetaal. Mooi so.','geld'); }
      else { s.geluk=klem(s.geluk-10); noteer('Hy het nooit terugbetaal nie. Julle praat nie meer nie.','sleg'); } }},
    {t:'Weier', doen:function(){ s.geluk=klem(s.geluk-5);
      noteer('Jy het nee gese. Dit was ongemaklik by die volgende braai.','neutraal'); }}
   ]},
  {min:18,max:120,as:function(){ return !!s.beroep; },
   vraag:'Jou baas vra of jy die hele naweek kan oorwerk. Daar is geen oortyd nie.',
   opsies:[
    {t:'Doen dit', doen:function(){ if(!s.beroep) return;
      s.beroep.prestasie=klem(s.beroep.prestasie+14); s.geluk=klem(s.geluk-9);
      noteer('Jy het die naweek gewerk. Jou baas het dit onthou.','werk'); }},
    {t:'Weier hoflik', doen:function(){ if(!s.beroep) return;
      s.beroep.prestasie=klem(s.beroep.prestasie-11); s.geluk=klem(s.geluk+5);
      noteer('Jy het grense gestel. Jou baas was nie beindruk nie.','werk'); }}
   ]},
  {min:25,max:120,vraag:'’n Oom wat jy skaars geken het, het jou in sy testament gelaat.',
   opsies:[
    {t:'Neem die kontant', doen:function(){ var v=tussen(40000,400000); s.geld+=v;
      noteer('Jy het '+geld(v)+' geerf.','geld'); }},
    {t:'Neem sy ou plot', doen:function(){ var w=tussen(300000,1400000);
      s.bates.push({id:'plot'+R(9999), n:'Oom se plot buite '+kies(DORPE), t:'huis', waarde:w, e:'\u{1F333}'});
      noteer('Jy het sy plot geerf (' + geld(w) + ').','geld'); }}
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
  {min:18,max:120,vraag:'Die SAID stuur ’n brief: jy het ’n belastingfout gemaak en skuld geld.',
   opsies:[
    {t:'Betaal dit', doen:function(){ var v=tussen(5000,60000); s.geld-=v;
      noteer('Jy het '+geld(v)+' aan die SAID betaal.','geld'); }},
    {t:'Ignoreer die brief', doen:function(){ if(kans(55)){ s.geluk=klem(s.geluk+4);
        noteer('Niks het gebeur. Jy het die brief weggegooi.','neutraal'); }
      else { var v=tussen(30000,180000); s.geld-=v; s.geluk=klem(s.geluk-12);
        noteer('Die SAID het boetes bygevoeg: '+geld(v)+'.','sleg'); } }}
   ]}
];

