/* ==========================================================================
   DIE HARNAS
   Laai die spel in Node, sonder 'n blaaier, sodat 'n script duisende
   lewens kan speel. Elke sessie het voorheen sy eie harnas gebou; dit is
   die een wat almal nou deel. Gebruik dit deur toets.js, of self:

     var H = require('./toets/harnas.js');
     var sp = H.maakSpel();            // een spel, hergebruik vir baie lewens
     sp.speelLewe({saad:7, elke:function(c){ ... }});
     sp.c.s                             // die status ná die lewe

   Die lêers word uit index.html gelees, in dieselfde orde as die blaaier,
   sodat 'n nuwe lêer outomaties saamkom. begin.js en dev.js bly uit.

   Die skerm is weg: wysModaal() kies self 'n antwoord (lukraak, of via
   opts.kieser), en wenk(), renderAlles() en die grafsteen doen niks.
   Elke stuk teks wat 'n speler sou sien, word versamel in sp.tekste.
   ========================================================================== */
var fs = require('fs');
var vm = require('vm');
var path = require('path');

var REPO = path.join(__dirname, '..');
var UIT  = ['begin.js', 'dev.js'];

function skripte(){
  var html = fs.readFileSync(path.join(REPO, 'index.html'), 'utf8');
  var lys = [], re = /<script src="([^"]+)"/g, m;
  while((m = re.exec(html))) if(UIT.indexOf(m[1]) < 0) lys.push(m[1]);
  return lys;
}

/* 'n Saad maak 'n lewe herhaalbaar: dieselfde saad, dieselfde lewe.
   (mulberry32 — klein en goed genoeg vir 'n spel.) */
function maakRandom(saad){
  var a = saad >>> 0;
  return function(){
    a = (a + 0x6D2B79F5) >>> 0;
    var t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function nepElement(id){
  var klasse = {};
  return {
    id:id, innerHTML:'', value:'', textContent:'', scrollTop:0, scrollHeight:0,
    style:{}, dataset:{}, children:[],
    classList:{ add:function(k){ klasse[k]=1; }, remove:function(k){ delete klasse[k]; },
      toggle:function(k){ if(klasse[k]) delete klasse[k]; else klasse[k]=1; },
      contains:function(k){ return !!klasse[k]; } },
    appendChild:function(c){ this.children.push(c); return c; }, removeChild:function(c){ return c; },
    addEventListener:function(){}, removeEventListener:function(){},
    querySelector:function(){ return nepElement('q'); }, querySelectorAll:function(){ return []; },
    getBoundingClientRect:function(){ return {top:0, left:0, width:375, height:812, bottom:812, right:375}; },
    focus:function(){}, blur:function(){}, click:function(){}, remove:function(){},
    setAttribute:function(){}, getAttribute:function(){ return null; }, insertAdjacentHTML:function(){}
  };
}

function maakKonteks(){
  var stoorPlek = {}, elemente = {};
  var wiskunde = Object.create(Math);
  wiskunde.random = Math.random;
  var c = {
    console:console, JSON:JSON, Date:Date, Math:wiskunde,
    document:{
      getElementById:function(id){ return elemente[id] || (elemente[id] = nepElement(id)); },
      createElement:function(t){ return nepElement(t); },
      querySelector:function(){ return nepElement('q'); }, querySelectorAll:function(){ return []; },
      addEventListener:function(){}, body:nepElement('body'), documentElement:nepElement('html')
    },
    localStorage:{
      getItem:function(k){ return Object.prototype.hasOwnProperty.call(stoorPlek, k) ? stoorPlek[k] : null; },
      setItem:function(k, v){ stoorPlek[k] = String(v); },
      removeItem:function(k){ delete stoorPlek[k]; }, clear:function(){ stoorPlek = {}; }
    },
    location:{search:'', hash:'', href:'http://localhost/index.html'},
    navigator:{userAgent:'node', clipboard:{writeText:function(){ return Promise.resolve(); }}},
    /* Timers loop dadelik: 'n animasie of vertraging maak nie saak sonder 'n skerm nie. */
    setTimeout:function(f){ if(typeof f==='function') f(); return 0; }, clearTimeout:function(){},
    setInterval:function(){ return 0; }, clearInterval:function(){},
    requestAnimationFrame:function(f){ if(typeof f==='function') f(); return 0; },
    alert:function(){}, confirm:function(){ return true; }, prompt:function(){ return ''; }
  };
  c.window = c; c.globalThis = c;
  vm.createContext(c);
  skripte().forEach(function(f){
    vm.runInContext(fs.readFileSync(path.join(REPO, f), 'utf8'), c, {filename:f});
  });
  return c;
}

/* opts.kieser(titel, opsies, teks) -> indeks in opsies, of null vir lukraak.
   opts.vang(teks, bron) word geroep vir elke stuk teks (bo-op sp.tekste). */
function maakSpel(opts){
  opts = opts || {};
  var c = maakKonteks();
  var sp = {c:c, tekste:new Map(), foute:[], kieser:opts.kieser || null, saad:null};

  function vat(t, bron){
    if(t===undefined || t===null) return;
    t = String(t);
    if(!t.trim()) return;
    var x = sp.tekste.get(t);
    if(!x){ x = {bron:bron, keer:0, saad:sp.saad, o:c.s ? c.s.ouderdom : 0}; sp.tekste.set(t, x); }
    x.keer++;
    if(opts.vang) opts.vang(t, bron);
  }
  sp.vat = vat;

  var ouNoteer = c.noteer;
  c.noteer = function(teks, soort){ vat(teks, 'log'); return ouNoteer(teks, soort); };
  c.wenk = function(teks){ vat(teks, 'wenk'); };

  /* Die modaal antwoord homself. "Speel self" maak 'n mini-spel se
     paneel oop, so ons kies altyd "Doen dit vinnig". Ná 25 vlakke diep
     kies ons die laaste opsie (gewoonlik "Los dit") om 'n lus te breek. */
  var diep = 0;
  c.wysModaal = function(titel, teks, opsies){
    vat(titel, 'modaal-titel'); vat(teks, 'modaal-teks');
    var o = (opsies && opsies.length) ? opsies : [{t:'OK'}];
    o.forEach(function(x){ vat(x.t, 'knop'); vat(x.sub, 'knop-sub'); });
    var kand = o.filter(function(x){ return x.t !== 'Speel self' && !x.af; });
    if(!kand.length) kand = o;
    diep++;
    try{
      var keuse = null;
      if(diep > 25) keuse = kand[kand.length-1];
      else if(sp.kieser){ var i = sp.kieser(titel, kand, teks); if(i!==null && i!==undefined) keuse = kand[i]; }
      if(!keuse) keuse = kand[Math.floor(c.Math.random()*kand.length)];
      if(keuse.doen) keuse.doen(); else c.sluitModaal();
    } finally { diep--; }
  };
  ['wysGrafskrif','wysBeginskerm','renderAlles','renderKop','naOnder'].forEach(function(f){
    c[f] = function(){};
  });

  /* Speel een lewe van geboorte tot die dood (of opts.tot).
     opts.saad    — maak die lewe herhaalbaar
     opts.voor(c) — net ná geboorte
     opts.elke(c) — ná elke jaar: doen hier wat 'n speler sou doen
     opts.tot     — stop op hierdie ouderdom (verstek 130)
     opts.erfgenaam — speel ná die dood voort as 'n kind (een generasie)
     Gooi nooit nie: 'n fout gaan in sp.foute met die saad by. */
  sp.speelLewe = function(lo){
    lo = lo || {};
    sp.saad = lo.saad===undefined ? Math.floor(Math.random()*1e9) : lo.saad;
    c.Math.random = maakRandom(sp.saad);
    var waar = 'geboorte';
    try{
      c.nuweLewe(lo.naam || null, lo.van || null, lo.geslag || null);
      if(lo.voor){ waar = 'voor'; lo.voor(c); }
      var tot = lo.tot || 130, generasies = lo.erfgenaam ? 2 : 1;
      for(var g=0; g<generasies; g++){
        if(g>0){
          /* H1 — die generasiespel: gaan voort as die eerste lewende kind. */
          var kind = c.s.verhoudings.filter(function(v){
            return v.lewe && (v.tipe==='seun' || v.tipe==='dogter'); })[0];
          if(!kind) break;
          waar = 'gaanVoortAsKind';
          if(!c.gaanVoortAsKind(kind.id)) break;
        }
        while(c.s && c.s.lewe && c.s.ouderdom < tot){
          waar = 'wordOuer'; c.wordOuer();
          if(lo.elke && c.s.lewe){ waar = 'elke'; lo.elke(c); }
          if(lo.naJaar){ waar = 'naJaar'; lo.naJaar(c); }
        }
      }
    } catch(e){
      sp.foute.push({saad:sp.saad, ouderdom:c.s ? c.s.ouderdom : -1, waar:waar,
        fout:String(e && e.stack || e)});
    }
    return c.s;
  };
  return sp;
}

module.exports = {maakSpel:maakSpel, maakKonteks:maakKonteks, maakRandom:maakRandom,
  skripte:skripte, REPO:REPO};
