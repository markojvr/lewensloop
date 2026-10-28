/* ==========================================================================
   SCENARIO'S
   Elke scenario is 'n soort speler. 'passief' druk net "+1 jaar"; die res
   dwing die lewe in 'n spesiale toestand in, of speel aktief, sodat die
   seldsame takke van die kode ook loop. Voeg 'n nuwe een by as jy 'n nuwe
   stelsel bou — dan toets elke latere sessie dit outomaties saam.

   voor(c) loop net ná geboorte, elke(c) ná elke jaar. c is die spel se
   globale konteks: c.s is die status, en elke spel-funksie is c.naam().
   ========================================================================== */

function lukraak(c, lys){ return lys[Math.floor(c.Math.random()*lys.length)]; }
function kans(c, p){ return c.Math.random()*100 < p; }

/* Wat 'n speler in 'n gewone jaar sou druk. */
function speelJaar(c){
  var s = c.s;
  if(s.tronk){ c.tronkAksie(lukraak(c, ['oefen','lees','vriende','ontsnap'])); return; }
  if(s.dakloos){ c.dakloosAksie(lukraak(c, ['bedel','loswerk','skuiling','ngo','familie'])); return; }
  if(s.vlug && kans(c, 60)) c.vlugAksie(lukraak(c, ['laag','loswerk','trek','vals','oorgee']));
  for(var i=0; i<3; i++){
    var a = lukraak(c, c.AKTIWITEITE);
    if(s.ouderdom >= a.min) c.doenAkt(a.id);
    if(!s.lewe || s.tronk) return;
  }
  if(s.ouderdom >= 16 && !s.beroep && kans(c, 50)) c.doenAansoek(lukraak(c, c.BEROEPE).id);
  if(s.ouderdom >= 15 && kans(c, 25)) c.soekLief();
  if(s.ouderdom >= 18 && kans(c, 10)) c.koopBate(lukraak(c, c.TE_KOOP).id);
  if(s.ouderdom >= 12 && kans(c, 8)) c.doenMisdaad(lukraak(c, c.MISDADE).id);
}

var SCENARIOS = {
  passief: {
    beskrywing:'druk net "+1 jaar" — die modale kies lukraak'
  },
  aktief: {
    beskrywing:'elke jaar aktiwiteite, werk, liefde, bates en soms misdaad',
    elke:speelJaar
  },
  tronk: {
    beskrywing:'gereeld tronk toe van 10 tot 70 (ook jeugsorg)',
    elke:function(c){
      var s = c.s;
      if(s.ouderdom>=10 && s.ouderdom<70 && !s.tronk && kans(c, 33))
        c.tronkToe(c.tussen(2, 10), 'huisinbraak');
      if(s.tronk && kans(c, 50)) c.tronkAksie(lukraak(c, ['oefen','lees','vriende','ontsnap']));
    }
  },
  dakloos: {
    beskrywing:'raak gereeld dakloos van 16 af en probeer uitkom',
    elke:function(c){
      var s = c.s;
      if(s.ouderdom>=16 && !s.dakloos && !s.tronk && kans(c, 25))
        c.raakDakloos('Die verhuurder het jou uitgesit');
      if(s.dakloos) c.dakloosAksie(lukraak(c, ['bedel','loswerk','skuiling','ngo','familie']));
    }
  },
  vlug: {
    beskrywing:'tronk toe en dan ontsnap — die lewe op die vlug',
    elke:function(c){
      var s = c.s;
      if(s.ouderdom>=20 && !s.tronk && !s.vlug && kans(c, 20)) c.tronkToe(c.tussen(5, 14), 'gewapende roof');
      if(s.tronk && !s.tronk.jeug && s.tronk.gedien>=1 && kans(c, 50)) c.vlugBegin(55, 'Jy het oor die heining geklim.');
      if(s.vlug && kans(c, 70)) c.vlugAksie(lukraak(c, ['laag','loswerk','trek','vals','oorgee']));
    }
  },
  onderwereld: {
    beskrywing:'sluit by organisasies aan, doen misdaad, begin jou eie organisasie',
    elke:function(c){
      var s = c.s;
      if(s.tronk || s.ouderdom < 14) return;
      if(s.ouderdom===16 && (s.straatRep||0) < 60) s.straatRep = 60;
      if(!s.bende && !s.eieOrg) c.sluitAan(lukraak(c, c.ORGANISASIES).id);
      if(s.ouderdom>=12) c.doenMisdaad(lukraak(c, c.MISDADE).id);
      if(s.ouderdom>=25 && !s.eieOrg && kans(c, 30)){ s.geld = Math.max(s.geld, 500000); c.beginEieOrg(); }
      if(s.eieOrg){ c.eieWerf(); if(s.eieOrg && s.eieOrg.lede.length) c.eieStuurAlmal(); }
    }
  },
  gesin: {
    beskrywing:'trou en kry kinders — en speel voort as ’n kind (generasiespel)',
    elke:function(c){
      var s = c.s;
      if(s.tronk) return;
      var m = c.maat();
      if(!m && s.ouderdom>=20 && s.ouderdom<45 && kans(c, 35)) c.vreemdeling();
      m = c.maat();
      if(m && m.tipe==='lief' && s.ouderdom>=22){ m.band = Math.max(m.band, 85); c.raak(m, 'trou'); }
      if(m && s.ouderdom>=22 && s.ouderdom<42 && kans(c, 40)){ s.gedoen = {}; c.raak(m, 'baba'); }
    },
    /* Die eerste lewe se kind speel ook: as daar 'n lewende kind is,
       gaan voort as hy en speel sy lewe tot die einde. */
    erfgenaam:true
  },
  skoolverlaat: {
    beskrywing:'los skool op 16 — die pad sonder matriek',
    elke:function(c){
      var s = c.s;
      if(s.ouderdom===16 && s.skool.vlak==='hoerskool'){ s.skool.uit = true; s.skool.vlak = 'klaar'; }
    }
  }
};

module.exports = {SCENARIOS:SCENARIOS, speelJaar:speelJaar};
