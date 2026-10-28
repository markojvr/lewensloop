/* ==========================================================================
   14. ONTSNAPPING EN DIE LEWE OP DIE VLUG (Fase 9)
   In die tronk berei jy oor jare voor: een ding per jaar (ONTSNAP_ITEMS),
   elkeen met 'n risiko. Dan probeer jy uitkom in 'n stealth-mini-spel van
   bo af: jy tik om te beweeg, die bewaarders patrolleer en kyk in 'n
   kegel voor hulle uit. Elke voorbereiding maak dit merkbaar makliker.
   Word jy nooit gesien nie (foutloos), kom jy altyd uit.

   Wie uitkom, is 'n vlugteling (s.vlug): elke jaar 'n kans dat die
   polisie jou vind, en sonder 'n vals ID is werk, die bank, 'n verband en
   'n mediese fonds toe. Gevang: terug tronk toe met die res van jou
   vonnis plus ekstra. Die pad uit: jare sonder om gevang te word, of gee
   jouself oor.

   'n Jeugsorgsentrum het geen ontsnapping nie. Niemand word seergemaak
   nie: die bewaarders vang jou, hulle skiet nie.
   Die getalle staan in data.js onder "ONTSNAPPING EN DIE LEWE OP DIE VLUG".
   ========================================================================== */

/* ---------- Die enjin: die rooster ---------- */
/* 9 x 11 selle. Ry 0 is die heining met een hek; ry 4 en ry 8 is mure
   met deure; onder is jou sel. 'H' heining, 'G' hek, 'W' muur, 'B' krat
   (keer beweging en sig), '.' oop. */
/* Die oggendtelling: die kortste foutlose pad plus OS_SPELING skuiwe,
   maar nooit minder as OS_LIMIET nie — 'n tonnel of 'n tou gee jou dus
   nie minder tyd nie. */
var OS_W = 9, OS_H = 11, OS_SIG = 3, OS_SPELING = 10, OS_LIMIET = 36, OS_HEK_SLUIT = 5, OS_AFLEI = 5, OS_OPLOS_MAKS = 90;
/* Die twee bots. "goed" is 'n goeie speler: hy hou die patrollies dop
   tot hy hulle ken, kyk 6 skuiwe vooruit, en waag dit 3% van die tyd
   (1,5% as hy die roete op die skerm sien). "vinnig" is wat "Doen dit
   vinnig" speel: dieselfde, maar haastiger — hy kyk 5 skuiwe vooruit en
   waag dit 6% van die tyd (4% met die roete). */
var OS_GOED = {L:6, fout:0.03, foutRoete:0.015, ken:true}, OS_VINNIG = {L:5, fout:0.06, foutRoete:0.04, ken:true};
var OS_RIG = [[0,0],[1,0],[-1,0],[0,1],[0,-1]];

function osBinne(x, y){ return x>=0 && y>=0 && x<OS_W && y<OS_H; }
function osSel(st, x, y){ return osBinne(x, y) ? st.k[y][x] : 'W'; }
function osBlok(st, x, y){ var c = osSel(st, x, y); return c==='W' || c==='B'; }
function osUitgang(st, x, y){
  var c = osSel(st, x, y);
  return (c==='G' && !st.hekToe) || (st.laken && (c==='H' || c==='G'));
}
function osLoop(st, x, y){ return osSel(st, x, y)==='.' || osUitgang(st, x, y); }
function osWagOp(st, x, y, lys){
  lys = lys || st.wagte;
  for(var i=0;i<lys.length;i++) if(!lys[i].weg && lys[i].x===x && lys[i].y===y) return i;
  return -1;
}

/* Die kegel: reguit vorentoe tot OS_SIG selle, een sel breër vanaf die
   tweede; mure en kratte keer die sig. */
function osKegel(st, g){
  var uit = [], fx = g.fx, fy = g.fy, px = -fy, py = fx;
  for(var d=1; d<=OS_SIG; d++){
    var w = d===1 ? 0 : 1;
    for(var o=-w; o<=w; o++){
      var x = g.x + fx*d + px*o, y = g.y + fy*d + py*o;
      if(osSel(st, x, y)!=='.') continue;
      var ok = true;
      for(var e=1; e<d; e++){
        var oo = (o*e/d)|0;
        if(osBlok(st, g.x + fx*e + px*oo, g.y + fy*e + py*oo)){ ok = false; break; }
      }
      if(ok) uit.push(y*OS_W + x);
    }
  }
  return uit;
}
/* Wie sien (x, y)? Gee die bewaarder se indeks, of -1. */
function osSien(st, x, y, lys, blind){
  if(blind) return -1;
  lys = lys || st.wagte;
  var k = y*OS_W + x;
  for(var i=0;i<lys.length;i++){
    var g = lys[i];
    if(g.weg || st.gegroet[i]) continue;
    if((g.x===x && g.y===y) || osKegel(st, g).indexOf(k)>=0) return i;
  }
  return -1;
}
/* Een patrollie-stap: heen en weer op die pad. Aan die einde draai hy om
   (en kyk dan terug) in plaas van om te loop. */
function osPatrolleer(g){
  var ni = g.i + g.r;
  if(ni < 0 || ni >= g.pad.length){
    g.r = -g.r;
    var n = g.pad[g.i + g.r];
    g.fx = n[0] - g.x; g.fy = n[1] - g.y;
    return;
  }
  var p = g.pad[ni];
  g.fx = p[0] - g.x; g.fy = p[1] - g.y;
  g.i = ni; g.x = p[0]; g.y = p[1];
}
function osKloon(lys){
  return lys.map(function(g){ return {pad:g.pad, i:g.i, r:g.r, x:g.x, y:g.y, fx:g.fx, fy:g.fy, weg:g.weg, n:g.n}; });
}

/* ---------- Die kaart bou ---------- */
function osRuns(st, y){
  var runs = [], a = -1;
  for(var x=0; x<=OS_W; x++){
    var oop = x<OS_W && st.k[y][x]==='.';
    if(oop && a<0) a = x;
    if(!oop && a>=0){ if(x-a >= 3) runs.push([a, x-1]); a = -1; }
  }
  return runs;
}
function osHorisontaal(st, y, n){
  var runs = osRuns(st, y); if(!runs.length) return null;
  var r = kies(runs), len = Math.min(r[1]-r[0]+1, 4 + R(4)), a = r[0] + R(r[1]-r[0]+2-len), pad = [];
  for(var x=a; x<a+len; x++) pad.push([x, y]);
  return osWag(pad, n);
}
function osVertikaal(st, y0, y1, n){
  var kol = [];
  for(var x=0; x<OS_W; x++){
    var ok = true;
    for(var y=y0; y<=y1; y++) if(st.k[y][x]!=='.') ok = false;
    if(ok) kol.push(x);
  }
  if(!kol.length) return null;
  var x2 = kies(kol), pad = [];
  for(var y2=y0; y2<=y1; y2++) pad.push([x2, y2]);
  return osWag(pad, n);
}
function osWag(pad, n){
  var i = R(pad.length), r = kans(50) ? 1 : -1;
  if(i + r < 0 || i + r >= pad.length) r = -r;
  var nx = pad[i + r];
  return {pad:pad, i:i, r:r, x:pad[i][0], y:pad[i][1], fx:nx[0]-pad[i][0], fy:nx[1]-pad[i][1], weg:false, n:n};
}
function osKrat(st, y0, y1, n){
  for(var t=0; t<n*4 && n>0; t++){
    var x = R(OS_W), y = y0 + R(y1-y0+1);
    if(st.k[y][x]!=='.' || osVoorDeur(st, x, y)) continue;
    st.k[y][x] = 'B'; n--;
  }
}
/* 'n Krat mag nie 'n deur of die hek toestaan nie. */
function osVoorDeur(st, x, y){
  return [y-1, y+1].some(function(yy){
    return (yy===0 && st.k[0][x]==='G') || ((yy===4 || yy===8) && st.k[yy][x]==='.'); });
}
/* prep: {tonnel 0-3, laken, uniform, roete, helper, bewaarder} */
function osBou(prep){
  var st = {k:[], wagte:[], ek:null, skuif:0, limiet:0, alarm:false, alarmSkuif:0, hekToe:false,
    gegroet:{}, gesien:0, vergewe:0, afgelei:0, klaar:null,
    laken:!!prep.laken, uniform:!!prep.uniform, roete:!!prep.roete, afleiding:prep.helper ? 2 : 0, prep:prep};
  for(var y=0; y<OS_H; y++){ st.k.push([]); for(var x=0; x<OS_W; x++) st.k[y].push('.'); }
  for(x=0; x<OS_W; x++){ st.k[0][x] = 'H'; st.k[4][x] = 'W'; st.k[8][x] = 'W'; st.k[10][x] = x%2 ? '.' : 'W'; }
  st.k[0][1 + R(OS_W-2)] = 'G';
  var d1 = R(OS_W), d2; do { d2 = R(OS_W); } while(Math.abs(d1-d2) < 3);
  st.k[4][d1] = '.'; st.k[4][d2] = '.';
  st.k[8][R(OS_W)] = '.'; if(kans(50)) st.k[8][R(OS_W)] = '.';
  osKrat(st, 1, 3, 3); osKrat(st, 5, 7, 2);
  /* Die bewaarders: een in die selgang, twee op die binneplaas, twee op
     die buitewerf — hulle kyk weg as jy die nagskof omkoop. */
  var lys = [osHorisontaal(st, 9, 'die selgang'), osHorisontaal(st, 5 + R(3), 'die binneplaas'),
    osVertikaal(st, 5, 7, 'die binneplaas'), osHorisontaal(st, 1, 'die heining'), osVertikaal(st, 1, 3, 'die buitewerf')];
  lys.forEach(function(g, i){
    if(!g) return;
    if(i>=3 && prep.bewaarder) g.weg = true;
    st.wagte.push(g);
  });
  /* Waar jy begin: jou sel, of waar die tonnel uitkom. */
  var ry = [10, 5, 3, 1][Math.min(3, prep.tonnel||0)], kand = [];
  var volg = osKloon(st.wagte); volg.forEach(function(g){ if(!g.weg) osPatrolleer(g); });
  for(x=0; x<OS_W; x++) if(st.k[ry][x]==='.' && osWagOp(st, x, ry) < 0 && osSien(st, x, ry) < 0 && osSien(st, x, ry, volg) < 0) kand.push(x);
  if(!kand.length) return null;
  st.ek = {x:kies(kand), y:ry};
  st.begin = {x:st.ek.x, y:ry};
  return st;
}
/* Die kortste foutlose pad (BFS deur tyd), of -1 as daar nie een is nie.
   Elke kaart wat die spel gee, het een: foutloos kom jy altyd uit. */
function osOplos(st, maks, metPad){
  /* Per tydstap: watter selle 'n bewaarder sien of op staan. */
  var lys = osKloon(st.wagte), gevaar = [osGevaar(st, lys)];
  for(var t=1; t<=maks; t++){ lys.forEach(function(g){ if(!g.weg) osPatrolleer(g); }); gevaar.push(osGevaar(st, lys)); }
  var gesien = {}, laag = [[st.ek.x, st.ek.y, null]];
  for(t=0; t<maks; t++){
    var volg = [], nou = gevaar[t], dan = gevaar[t+1];
    for(var i=0; i<laag.length; i++){
      for(var m=0; m<5; m++){
        var x = laag[i][0] + OS_RIG[m][0], y = laag[i][1] + OS_RIG[m][1];
        if(!osLoop(st, x, y)) continue;
        if(osUitgang(st, x, y)){
          if(!metPad) return t + 1;
          var pad = [OS_RIG[m]], n = laag[i];
          while(n[2]){ pad.unshift(n[3]); n = n[2]; }
          return pad;
        }
        var k = y*OS_W + x;
        if(nou[k] || dan[k] || gesien[k*200 + t+1]) continue;
        gesien[k*200 + t+1] = 1; volg.push([x, y, laag[i], OS_RIG[m]]);
      }
    }
    if(!volg.length) return -1;
    laag = volg;
  }
  return -1;
}
function osGevaar(st, lys){
  var d = new Array(OS_W*OS_H);
  lys.forEach(function(g, i){
    if(g.weg) return;
    d[g.y*OS_W + g.x] = 1;
    osKegel(st, g).forEach(function(k){ d[k] = 1; });
  });
  return d;
}
function osNuut(prep){
  for(var p=0; p<80; p++){
    var st = osBou(prep);
    if(!st) continue;
    var opt = osOplos(st, OS_OPLOS_MAKS);
    if(opt < 0) continue;
    st.opt = opt; st.limiet = Math.max(opt + OS_SPELING, OS_LIMIET);
    return st;
  }
  /* Byna onmoontlik — maar dan is die nag maar stil. */
  st = null;
  while(!st) st = osBou(prep);
  st.wagte.forEach(function(g){ g.weg = true; });
  st.opt = osOplos(st, OS_OPLOS_MAKS); st.limiet = Math.max(st.opt, 1) + OS_SPELING;
  return st;
}

/* ---------- Die enjin: 'n skuif ---------- */
function osAlarm(st){ st.alarm = true; st.alarmSkuif = 0; }
function osGegryp(st){
  return st.wagte.some(function(g){ return !g.weg && Math.abs(g.x-st.ek.x) + Math.abs(g.y-st.ek.y) <= 1; });
}
function osKyk(st){
  if(st.afgelei) return '';
  var i = osSien(st, st.ek.x, st.ek.y);
  if(i < 0) return '';
  if(st.uniform){
    st.uniform = false; st.gegroet[i] = true; st.vergewe++;
    return 'Die bewaarder by ' + st.wagte[i].n + ' knik net: in die uniform dink hy jy is een van hulle.';
  }
  st.gesien++; osAlarm(st);
  return 'Die bewaarder by ' + st.wagte[i].n + ' het jou gesien! Die alarm gaan af — hardloop!';
}
/* Die afstand van elke sel na die naaste uitgang (vir die jaag en die bots). */
function osAfstand(st){
  var d = [], ry = [];
  for(var y=0; y<OS_H; y++) for(var x=0; x<OS_W; x++){
    d.push(osUitgang(st, x, y) ? 0 : 1e9);
    if(osUitgang(st, x, y)) ry.push([x, y]);
  }
  while(ry.length){
    var p = ry.shift();
    for(var m=1; m<5; m++){
      var nx = p[0] + OS_RIG[m][0], ny = p[1] + OS_RIG[m][1];
      if(!osBinne(nx, ny) || osSel(st, nx, ny)!=='.' || d[ny*OS_W+nx] <= d[p[1]*OS_W+p[0]] + 1) continue;
      d[ny*OS_W+nx] = d[p[1]*OS_W+p[0]] + 1; ry.push([nx, ny]);
    }
  }
  return d;
}
/* Ná die alarm: elke bewaarder loop een sel nader aan jou. */
function osJaag(st, lys){
  var d = [], ry = [[st.ek.x, st.ek.y]];
  for(var i=0; i<OS_W*OS_H; i++) d.push(1e9);
  d[st.ek.y*OS_W + st.ek.x] = 0;
  while(ry.length){
    var p = ry.shift();
    for(var m=1; m<5; m++){
      var nx = p[0] + OS_RIG[m][0], ny = p[1] + OS_RIG[m][1];
      if(osSel(st, nx, ny)!=='.' || d[ny*OS_W+nx] < 1e9) continue;
      d[ny*OS_W+nx] = d[p[1]*OS_W+p[0]] + 1; ry.push([nx, ny]);
    }
  }
  lys.forEach(function(g){
    if(g.weg) return;
    var beste = null, bd = d[g.y*OS_W + g.x];
    for(var m=1; m<5; m++){
      var nx = g.x + OS_RIG[m][0], ny = g.y + OS_RIG[m][1];
      if(!osBinne(nx, ny) || d[ny*OS_W+nx] >= bd || osWagOp(st, nx, ny, lys) >= 0) continue;
      bd = d[ny*OS_W+nx]; beste = OS_RIG[m];
    }
    if(beste){ g.x += beste[0]; g.y += beste[1]; g.fx = beste[0]; g.fy = beste[1]; }
  });
}
function osWagteStap(st){
  if(st.alarm){ osJaag(st, st.wagte); return; }
  if(st.afgelei) return;
  st.wagte.forEach(function(g){ if(!g.weg) osPatrolleer(g); });
}
/* Een skuif van die speler (0,0 = wag). Gee die boodskap terug. */
function osSkuif(st, dx, dy){
  if(st.klaar) return '';
  var nx = st.ek.x + dx, ny = st.ek.y + dy;
  if(!osLoop(st, nx, ny)) return 'Daar kan jy nie deur nie.';
  if((dx || dy) && osWagOp(st, nx, ny) >= 0) return 'Daar staan ’n bewaarder!';
  st.ek.x = nx; st.ek.y = ny; st.skuif++;
  if(osUitgang(st, nx, ny)){ st.klaar = 'uit'; return st.alarm ? 'Oor die heining — met die sirenes agter jou!' : 'Oor die heining. Niemand het iets gesien nie.'; }
  var b = '';
  if(st.alarm){ if(osGegryp(st)){ st.klaar = 'gevang'; return 'Die bewaarders het jou vasgedruk.'; } }
  else b = osKyk(st);
  osWagteStap(st);
  if(st.alarm){ if(osGegryp(st)){ st.klaar = 'gevang'; return 'Die bewaarders het jou vasgedruk.'; } }
  else b = osKyk(st) || b;
  if(!st.alarm && st.skuif >= st.limiet){ osAlarm(st); b = 'Die oggendtelling — jou bed is leeg! Die alarm gaan af.'; }
  if(st.alarm){
    st.alarmSkuif++;
    if(!st.hekToe && st.alarmSkuif >= OS_HEK_SLUIT){ st.hekToe = true; b = (b ? b + ' ' : '') + 'Die hek is toegesluit' + (st.laken ? ' — klim oor die heining!' : '.'); }
  }
  if(st.afgelei) st.afgelei--;
  return b;
}
function osAfleiding(st){
  if(!st.afleiding || st.alarm || st.klaar) return false;
  st.afleiding--; st.afgelei = OS_AFLEI;
  return true;
}
function osUitslag(st){
  var uit = st.klaar==='uit';
  return {ontsnap:uit, alarm:st.alarm, gesien:st.gesien, vergewe:st.vergewe, skuif:st.skuif,
    q: uit ? (st.alarm ? 0.6 : 1) : Math.max(0, 0.5 - 0.05*(st.ek.y)), teruggekeer:st.klaar==='terug'};
}

/* ---------- Die bots: 'n goeie speler, en "doen dit vinnig" ---------- */
/* Wat die bot dink die bewaarders gaan doen. Met die roete weet hy dit;
   sonder dit raai hy dat elkeen aanhou stap in die rigting waarin hy kyk. */
function osVoorspel(st, n, ken){
  var G = [osKloon(st.wagte)];
  for(var t=1; t<=n; t++){
    var g2 = osKloon(G[t-1]);
    if(st.afgelei < t) g2.forEach(function(g){
      if(g.weg) return;
      if(st.roete || ken){ osPatrolleer(g); return; }
      var nx = g.x + g.fx, ny = g.y + g.fy;
      if(osSel(st, nx, ny)==='.'){ g.x = nx; g.y = ny; }
    });
    G.push(g2);
  }
  return G;
}
/* Hoeveel skuiwe (tot maks) kan jy van (x, y) af veilig bly? */
function osDiepte(st, G, x, y, k, maks, memo){
  if(osUitgang(st, x, y)) return maks;
  var sl = x + ',' + y + ',' + k;
  if(memo[sl]!==undefined) return memo[sl];
  var blind = st.afgelei >= k, d = k - 1;
  if(osWagOp(st, x, y, G[k-1]) < 0 && osWagOp(st, x, y, G[k]) < 0 &&
     osSien(st, x, y, G[k-1], blind) < 0 && osSien(st, x, y, G[k], blind) < 0){
    d = k;
    if(k < maks) for(var m=0; m<5 && d<maks; m++){
      var nx = x + OS_RIG[m][0], ny = y + OS_RIG[m][1];
      if(osLoop(st, nx, ny)) d = Math.max(d, osDiepte(st, G, nx, ny, k+1, maks, memo));
    }
  }
  memo[sl] = d;
  return d;
}
function osBotKies(st, vlak){
  var d = osAfstand(st), moontlik = [];
  OS_RIG.forEach(function(m){
    var x = st.ek.x + m[0], y = st.ek.y + m[1];
    if(osLoop(st, x, y) && ((!m[0] && !m[1]) || osWagOp(st, x, y) < 0)) moontlik.push(m);
  });
  function naaste(lys){
    var b = 1e9, kies2 = [];
    lys.forEach(function(m){
      var v = d[(st.ek.y+m[1])*OS_W + st.ek.x+m[0]];
      if(v < b){ b = v; kies2 = [m]; } else if(v===b) kies2.push(m);
    });
    return kies(kies2);
  }
  if(st.alarm){
    var veilig = moontlik.filter(function(m){
      var x = st.ek.x + m[0], y = st.ek.y + m[1];
      if(osUitgang(st, x, y)) return true;
      var ou = st.ek, lys = osKloon(st.wagte);
      st.ek = {x:x, y:y};
      var ok = !osGegryp(st); if(ok){ osJaag(st, lys); ok = !lys.some(function(g){ return !g.weg && Math.abs(g.x-x)+Math.abs(g.y-y)<=1; }); }
      st.ek = ou; return ok;
    });
    return naaste(veilig.length ? veilig : moontlik);
  }
  var hier = d[st.ek.y*OS_W + st.ek.x];
  if(Math.random() < (st.roete ? vlak.foutRoete : vlak.fout) || st.limiet - st.skuif <= hier) return naaste(moontlik);
  /* Hoe ver vooruit kan elke skuif veilig bly? Net dié wat L haal, tel. */
  var G = osVoorspel(st, vlak.L + 1, vlak.ken), memo = {}, diep = {}, bd = -1;
  moontlik.forEach(function(m){ var v = osDiepte(st, G, st.ek.x+m[0], st.ek.y+m[1], 1, vlak.L, memo); diep[m] = v; bd = Math.max(bd, v); });
  var goed = moontlik.filter(function(m){ return diep[m] >= vlak.L; });
  if(!goed.length){
    if(st.afleiding && !st.afgelei) return 'afleiding';
    /* Vas: kies die skuif wat die langste veilig bly. */
    goed = moontlik.filter(function(m){ return diep[m]===bd; });
  }
  return naaste(goed);
}
function osBot(st, vlak){
  var lus = 0;
  while(!st.klaar && lus++ < 300){
    var m = osBotKies(st, vlak);
    if(m==='afleiding'){ osAfleiding(st); continue; }
    osSkuif(st, m[0], m[1]);
  }
  if(!st.klaar) st.klaar = 'gevang';
  return osUitslag(st);
}
/* Die kans met "Doen dit vinnig" vir hierdie voorbereiding, gesimuleer. */
function osVinnigKans(prep, n){
  var uit = 0;
  for(var i=0; i<n; i++) if(osBot(osNuut(prep), OS_VINNIG).ontsnap) uit++;
  return Math.round(uit/n*100);
}

/* ---------- Die mini-spel op die skerm ---------- */
var ONTSNAP_SPEL = {
  id:'ontsnap', n:'Die ontsnapping', e:'\u{1F526}', prep:null,
  uitleg:'Jy sien die tronk van bo af. Tik ’n sel langs jou om te beweeg, of tik op jouself om te wag. ' +
    'Die rooi selle is waar die bewaarders kyk: word jy gesien, gaan die alarm af en jaag hulle jou. ' +
    'Haal die hek (\u{1F6AA}) voor die oggendtelling.',
  selfSub:'Jy sluip self · word jy nooit gesien nie, kom jy altyd uit',
  vinnigSub:'Jy waag dit op jou voorbereiding · effens swakker as goeie self-spel',
  begin:function(o){
    var st = osNuut(ONTSNAP_SPEL.prep);
    md = {klaar:o.klaar, st:st};
    o.paneel.innerHTML = mdRaam(ONTSNAP_SPEL, '<div class="os-rooster" id="os-rooster"></div>', 'Skuiwe');
    osTeken(st.prep.tonnel ? 'Jy kruip uit die tonnel. Stil nou…' : 'Die selle is donker. Jy glip uit jou sel.');
  },
  stapWeg:function(){
    if(!md || !md.st || md.st.klaar) return;
    var st = md.st;
    if(st.alarm){ st.klaar = 'gevang'; osEinde('Jy gee jou oor.'); return; }
    st.klaar = 'terug'; osEinde('Jy sluip terug na jou sel. Niemand weet niks nie.');
  },
  vinnig:function(){
    var u = osBot(osNuut(ONTSNAP_SPEL.prep), OS_VINNIG);
    u.teks = u.ontsnap ? (u.alarm ? 'Jy het gehardloop en dit oor die heining gemaak.' : 'Jy het stil-stil oor die heining gekom.') :
      'Die bewaarders het jou gevang voor jy by die heining was.';
    return u;
  }
};
function osTik(x, y){
  if(!md || !md.st || md.st.klaar) return;
  var st = md.st, dx = x - st.ek.x, dy = y - st.ek.y;
  if(Math.abs(dx) + Math.abs(dy) > 1){
    /* 'n Sel verder weg: een tree in daardie rigting. */
    if(Math.abs(dx) >= Math.abs(dy)){ dx = dx > 0 ? 1 : -1; dy = 0; } else { dy = dy > 0 ? 1 : -1; dx = 0; }
    if(!osLoop(st, st.ek.x+dx, st.ek.y+dy)){ msBoods('Daar kan jy nie reguit heen nie.','sleg'); return; }
  }
  osDoen(osSkuif(st, dx, dy));
}
function osWagKnop(){ if(md && md.st && !md.st.klaar) osDoen(osSkuif(md.st, 0, 0)); }
function osAfleidKnop(){
  if(!md || !md.st) return;
  if(osAfleiding(md.st)) osTeken('Jou helper begin ’n bakleiery in die eetsaal. Die bewaarders hardloop soontoe!');
}
function osDoen(b){
  var st = md.st;
  if(st.klaar){ osEinde(b); return; }
  osTeken(b);
}
function osEinde(b){
  var st = md.st;
  osTeken(b, true);
  var u = osUitslag(st);
  setTimeout(function(){ mdKlaar(u.q, u); }, 1100);
}
function osTeken(b, klaar){
  var st = md.st, kegel = {}, spook = {}, pad = {};
  if(!st.afgelei) st.wagte.forEach(function(g, i){ if(!g.weg && !st.gegroet[i]) osKegel(st, g).forEach(function(k){ kegel[k] = 1; }); });
  if(st.roete && !st.alarm){
    var G = osVoorspel(st, 1)[1];
    if(st.afgelei <= 1) G.forEach(function(g, i){ if(!g.weg && !st.gegroet[i]) osKegel(st, g).forEach(function(k){ spook[k] = 1; }); });
    st.wagte.forEach(function(g){ if(!g.weg) g.pad.forEach(function(p){ pad[p[1]*OS_W+p[0]] = 1; }); });
  }
  var h = '', pyl = {'1,0':'→','-1,0':'←','0,1':'↓','0,-1':'↑'};
  for(var y=0; y<OS_H; y++) for(var x=0; x<OS_W; x++){
    var c = st.k[y][x], k = y*OS_W + x, kl = 'os-sel', inh = '';
    if(c==='W') kl += ' muur';
    else if(c==='B'){ kl += ' krat'; inh = '\u{1F4E6}'; }
    else if(c==='H') kl += ' heining' + (st.laken ? ' uit' : '');
    else if(c==='G'){ kl += st.hekToe && !st.laken ? ' heining' : ' hek uit'; inh = st.hekToe && !st.laken ? '\u{1F512}' : '\u{1F6AA}'; }
    if(kegel[k]) kl += ' kegel'; else if(spook[k]) kl += ' spook';
    if(pad[k]) kl += ' pad';
    if(st.begin.x===x && st.begin.y===y && st.prep.tonnel) inh = '\u{1F573}';
    var w = osWagOp(st, x, y);
    if(w >= 0){ var g = st.wagte[w]; inh = '\u{1F46E}<i>' + (pyl[g.fx+','+g.fy]||'') + '</i>'; kl += ' wag'; }
    if(st.ek.x===x && st.ek.y===y){ inh = st.klaar==='gevang' ? '\u{1F6A8}' : '\u{1F9CD}'; kl += ' ek'; }
    h += '<div class="' + kl + '" onclick="osTik(' + x + ',' + y + ')">' + inh + '</div>';
  }
  el('os-rooster').innerHTML = h;
  el('ms-chips').textContent = st.alarm ? 'ALARM' : st.skuif + ' / ' + st.limiet;
  msBoods(b || (st.alarm ? 'Hardloop na die heining!' : st.afgelei ? 'Die afleiding hou nog ' + st.afgelei + (st.afgelei===1 ? ' skuif.' : ' skuiwe.') :
    'Nog ' + (st.limiet - st.skuif) + ' skuiwe tot die oggendtelling.'),
    st.klaar==='uit' ? 'goed' : (st.alarm || st.klaar==='gevang') ? 'sleg' : '');
  el('ms-beheer').innerHTML = klaar ? '' : '<div class="ms-ry"><button class="knop grys md-groot" onclick="osWagKnop()">Wag<small>bly stil staan</small></button>' +
    (st.afleiding && !st.alarm ? '<button class="knop pienk md-groot" onclick="osAfleidKnop()">Afleiding<small>jou helper · nog ' + st.afleiding + '</small></button>' : '') + '</div>';
}

/* ==========================================================================
   DIE BEPLANNING IN DIE TRONK
   s.tronk.plan = {tonnel 0-3, laken, uniform, roete, helper, bewaarder, kar}.
   Een voorbereiding per jaar; die ontsnapping self een keer per jaar.
   ========================================================================== */
function nuwePlan(){ return {tonnel:0, laken:false, uniform:false, roete:false, helper:false, bewaarder:false, kar:false}; }
function tronkPlan(){ if(!s.tronk.plan) s.tronk.plan = nuwePlan(); return s.tronk.plan; }
function planItem(id){ var r = null; ONTSNAP_ITEMS.forEach(function(x){ if(x.id===id) r = x; }); return r; }
function planTel(p){
  var n = 0; ONTSNAP_ITEMS.forEach(function(x){ if(x.id==='tonnel' ? p.tonnel>=x.jare : p[x.id]) n++; });
  return n;
}
/* Wie help met die bewaarder en die kar, en wat dit kos. null = niemand. */
function planHulp(id){
  var o = myOrg(), eie = s.eieOrg && s.eieOrg.lede.length;
  if(id==='bewaarder'){
    if(o && s.bende.rang >= 1) return {koste:0, risiko:10, wie:o.n + ' betaal hom'};
    if(eie) return {koste:15000, risiko:10, wie:'Jou mense reël dit'};
    return {koste:planItem('bewaarder').koste, risiko:planItem('bewaarder').risiko, wie:'Jy betaal self'};
  }
  if(id==='kar'){
    if(o) return {koste:s.bende.rang >= 2 ? 0 : 20000, risiko:0, wie:o.n};
    if(eie) return {koste:0, risiko:0, wie:s.eieOrg.naam};
    if((s.straatRep||0) >= 30) return {koste:40000, risiko:0, wie:'’n Kontak in die onderwêreld'};
    return null;
  }
  return null;
}
function ontsnapMenu(){
  if(!s.tronk) return;
  if(s.tronk.jeug){
    wysModaal('\u{1F3EB} Jeugsorgsentrum', 'Uit ’n jeugsorgsentrum ontsnap jy nie: daar is nie tralies nie, net mense wat ' +
      'jou elke keer terugbring. Jy is hier oor ' + (s.tronk.jare - s.tronk.gedien) + ' jaar uit — en dit kom nie op ’n ' +
      'grootmens se rekord nie.', [{t:'OK', doen:sluitModaal}]);
    return;
  }
  var p = tronkPlan(), klaar = s.gedoen.t_plan;
  var opsies = ONTSNAP_ITEMS.map(function(x){
    var gedoen = x.id==='tonnel' ? p.tonnel >= x.jare : p[x.id];
    if(gedoen) return {t:'✓ ' + x.n, klas:'groen', sub:x.sub, doen:function(){ wenk('Dit is klaar.'); }};
    var sub = x.sub, hulp = planHulp(x.id);
    if(x.id==='tonnel') sub += ' · ' + p.tonnel + '/' + x.jare + ' jaar gegrawe';
    if(x.id==='roete') sub += ' · ' + roeteKans() + '% kans dat dit vanjaar lukt';
    else if(x.id==='helper') sub += ' · ' + helperKans() + '% kans dat iemand saamstaan';
    else if(x.id==='kar') sub += hulp ? ' · ' + hulp.wie + (hulp.koste ? ' · ' + geld(hulp.koste) : ' · gratis') : ' · jy ken niemand buite nie (organisasie of rep 30+)';
    else if(x.id==='bewaarder') sub += ' · ' + hulp.wie + (hulp.koste ? ' · ' + geld(hulp.koste) : '') + ' · ' + hulp.risiko + '% kans hy is eerlik';
    else sub += ' · ' + x.risiko + '% kans om gevang te word';
    return {t:x.e + ' ' + x.n, klas:klaar ? 'grys' : '', sub:sub, doen:function(){
      if(s.gedoen.t_plan){ wenk('Een voorbereiding per jaar.'); return; }
      planDoen(x); }};
  });
  opsies.push({t:'\u{1F526} Ontsnap nou', klas:'rooi', sub:s.gedoen.t_ontsnap ? 'Een poging per jaar' :
    planTel(p) + ' van ' + ONTSNAP_ITEMS.length + ' voorbereidings klaar', doen:function(){
      if(s.gedoen.t_ontsnap){ wenk('Een poging per jaar.'); return; }
      ontsnapPoging(); }});
  kiesLys('\u{1F526} Beplan jou ontsnapping', 'Een voorbereiding per jaar' + (klaar ? ' (vanjaar klaar)' : '') +
    '. Wat jy in jou sel wegsteek, kan by ’n deursoeking gevind word — dan kry jy ’n jaar by en verloor jy jou parool. ' +
    'Jy het ' + geld(s.geld) + '.', opsies);
}
function roeteKans(){ return klem(30 + Math.round(s.slim/2), 5, 95); }
function helperKans(){ return klem(35 + Math.round(s.geluk/3) + (s.gedoen.t_vriende ? 20 : 0), 5, 95); }
/* Gevang met die goed: 'n dissiplinêre verhoor gee 'n jaar by (wat ook
   parool kos, want die vonnis is nie meer die oorspronklike nie). */
function planStraf(jare, teks){
  s.tronk.jare += jare; s.geluk = klem(s.geluk - 6);
  noteer(teks + ' ’n Dissiplinêre verhoor het ' + jare + (jare===1 ? ' jaar' : ' jaar') + ' by jou vonnis gesit.','sleg');
  return teks + ' Jy kry ' + jare + ' jaar by — en parool is nou van die baan af.';
}
function planDoen(x){
  var p = tronkPlan(), teks, hulp = planHulp(x.id);
  if(hulp && hulp.koste > s.geld){ wenk('Dit kos ' + geld(hulp.koste) + '.'); return; }
  if(x.id==='kar' && !hulp){ wenk('Jy ken niemand buite wat dit sal doen nie.'); return; }
  s.gedoen.t_plan = 1;
  if(hulp && hulp.koste){ s.geld -= hulp.koste; misdaadTel().koste += hulp.koste; }
  var risiko = hulp ? hulp.risiko : x.risiko;
  if(x.id==='roete'){
    if(kans(roeteKans())){ p.roete = true; teks = 'Jy het ’n jaar lank elke skofwisseling en elke patrollie in jou kop afgemerk. Jy ken nou hul roetes.'; }
    else teks = 'Jy het die skofte dopgehou, maar die patroon wil nog nie sin maak nie. Volgende jaar weer.';
  } else if(x.id==='helper'){
    if(!kans(helperKans())) teks = 'Niemand in jou blok wil hul nek vir jou uitsteek nie. Nog nie.';
    else if(kans(x.risiko)){
      var fisies = ['laken','uniform'].filter(function(k){ return p[k]; });
      if(p.tonnel) fisies.push('tonnel');
      var weg = fisies.length ? kies(fisies) : null;
      if(weg==='tonnel') p.tonnel = 0; else if(weg) p[weg] = false;
      teks = planStraf(1, 'Die man wat jy gevra het, het jou by die bewaarders verklik' +
        (weg ? ', en hulle het jou ' + {tonnel:'tonnel', laken:'tou van lakens', uniform:'uniform'}[weg] + ' gekry.' : '.'));
    } else { p.helper = true; teks = 'Jy het iemand gekry wat ’n afleiding sal begin as jy die teken gee.'; }
  } else if(kans(risiko)){
    if(x.id==='tonnel'){ p.tonnel = 0; teks = planStraf(1, 'Die bewaarders het die gat agter jou bed gekry. Die tonnel is toegegooi.'); }
    else if(x.id==='bewaarder') teks = planStraf(2, 'Die bewaarder was eerlik en het jou vir omkopery aangemeld.');
    else teks = planStraf(1, 'Jy is gevang met ' + (x.id==='laken' ? 'die lakens wat jy geknoop het.' : 'die uniform onder jou matras.'));
  } else {
    if(x.id==='tonnel'){
      p.tonnel++;
      teks = p.tonnel >= x.jare ? 'Die tonnel is klaar: dit kom by die heining uit.' :
        'Jy het nog ’n stuk gegrawe en die grond in jou broeksakke uitgedra (' + p.tonnel + '/' + x.jare + ').';
    } else {
      p[x.id] = true;
      teks = x.id==='laken' ? 'Die tou van lakens lê onder jou matras.' :
        x.id==='uniform' ? 'Die uniform uit die wassery pas amper.' :
        x.id==='bewaarder' ? 'Die nagskof op die buitewerf sal die nag van jou keuse wegkyk. (' + hulp.wie + '.)' :
        hulp.wie + ' sal ’n kar buite laat wag.';
    }
  }
  noteer(teks,'misdaad');
  stoor(); renderAlles();
  wysModaal(x.e + ' ' + x.n, teks, [{t:'OK', doen:function(){ sluitModaal(); stoor(); renderAlles(); }}]);
}
/* Die jaar in die sel: 'n deursoeking kan wegsteekgoed vind. */
function tronkPlanJaar(){
  var p = s.tronk && s.tronk.plan; if(!p || s.tronk.jeug) return;
  var fisies = ['laken','uniform'].filter(function(k){ return p[k]; });
  if(p.tonnel) fisies.push('tonnel');
  if(!fisies.length || !kans(DEURSOEK_BASIS + DEURSOEK_PER_ITEM*fisies.length)) return;
  var weg = kies(fisies);
  if(weg==='tonnel') p.tonnel = 0; else p[weg] = false;
  planStraf(1, 'By ’n deursoeking het die bewaarders jou ' + {tonnel:'tonnel agter die bed', laken:'tou van lakens',
    uniform:'gesteelde uniform'}[weg] + ' gekry.');
}

/* ---------- Die poging ---------- */
function ontsnapPoging(){
  var p = tronkPlan();
  ONTSNAP_SPEL.prep = {tonnel:p.tonnel, laken:p.laken, uniform:p.uniform, roete:p.roete, helper:p.helper, bewaarder:p.bewaarder};
  var k = osVinnigKans(ONTSNAP_SPEL.prep, 30);
  minispelIngang(ONTSNAP_SPEL, {
    teks: ONTSNAP_SPEL.uitleg + '\n\nJou voorbereiding: ' + planTel(p) + ' van ' + ONTSNAP_ITEMS.length +
      '. Met “Doen dit vinnig” is jou kans sowat ' + k + '%. Misluk dit, kry jy jare by en verloor jy alles wat jy versamel het.',
    voor:function(){ s.gedoen.t_ontsnap = 1; },
    klaar:function(u){ ontsnapKlaar(u); },
    los:function(){ wenk('Nie vannag nie.'); }});
}
function ontsnapKlaar(u){
  var p = tronkPlan();
  if(u.teruggekeer){
    noteer('Jy het jou ontsnapping halfpad afgeblaas en teruggesluip na jou sel.','misdaad');
    sluitModaal(); stoor(); renderAlles(); return;
  }
  if(!u.ontsnap){ ontsnapMisluk('Die bewaarders het jou gevang voordat jy by die heining was.'); return; }
  if(p.kar && u.alarm){
    wysModaal('\u{1F697} Die kar wag', 'Jy is oor die heining, maar die sirenes loei al. Die kar staan met die enjin aan.', [
      {t:'Trap die petrol', klas:'rooi', sub:'’n Jaagtog met 3 kanse · foutloos is jy weg', doen:function(){ sluitModaal(); ontsnapJaag(); }},
      {t:'Los die kar, hardloop', sub:'Te voet deur die nag · die polisie soek hard', doen:function(){
        vlugBegin(VLUG_HITTE_ALARM, 'Jy het die kar gelos en te voet in die donker verdwyn.'); }}
    ]);
    return;
  }
  if(p.kar) vlugBegin(VLUG_HITTE_KAR, 'Die kar het buite gewag. Teen die oggendtelling was jy al drie dorpe verder.');
  else vlugBegin(u.alarm ? VLUG_HITTE_ALARM : VLUG_HITTE_STIL, u.alarm ? 'Jy het oor die heining gekom met die honde agter jou.' :
    'Jy het oor die heining gekom sonder dat iemand iets gesien het.');
}
function ontsnapJaag(){
  /* Die padblokkades is nog nie oral op nie: 'n korter jaagtog as ná 'n bankroof. */
  s.hitte = Math.max(s.hitte||0, 30);
  var op = jaagOpstel(175, 3, 2);
  JAAGTOG.op = op;
  minispelIngang(JAAGTOG, {
    teks: JAAGTOG.uitleg + '\n\n' + op.lengte + ' hindernisse, 3 kanse. Foutloos is jy altyd weg.',
    klaar:function(j){
      if(j.ontsnap){ repBy(REP_JAAG); vlugBegin(VLUG_HITTE_JAAG, 'Jy het die polisie in ’n jaagtog afgeskud.'); }
      else ontsnapMisluk('Die polisie het die kar by ’n padblokkade voorgekeer.');
    },
    los:function(){ vlugBegin(VLUG_HITTE_ALARM, 'Jy het die kar gelos en te voet in die donker verdwyn.'); }});
}
function ontsnapMisluk(teks){
  var jare = tussen(ONTSNAP_STRAF[0], ONTSNAP_STRAF[1]);
  s.tronk.jare += jare; s.tronk.plan = nuwePlan();
  s.hitte = klem((s.hitte||0) + ONTSNAP_HITTE); s.geluk = klem(s.geluk - 12);
  s.rekord.push('ontsnappoging');
  var t = teks + ' Jou vonnis is met ' + jare + ' jaar verleng, parool is van die baan af, en alles wat jy versamel het, is weg.';
  noteer(t,'sleg');
  stoor(); renderAlles();
  wysModaal('\u{1F6A8} Gevang', t, [{t:'OK', doen:function(){ sluitModaal(); stoor(); renderAlles(); }}]);
}

/* ==========================================================================
   DIE LEWE OP DIE VLUG (G5)
   s.vlug = {oor, ekstra, sedert, jare, vals, laag, getrek}: hoeveel jaar
   van die vonnis nog oop is, die jare wat die ontsnapping self sal kos,
   en wat jy gedoen het om weg te bly.
   ========================================================================== */
function vlugBegin(hitte, teks){
  var t = s.tronk, oor = Math.max(1, t.jare - t.gedien);
  s.vlug = {oor:oor, ekstra:tussen(VLUG_EKSTRA[0], VLUG_EKSTRA[1]), sedert:s.ouderdom, jare:0, vals:false, laag:-9, getrek:-9};
  s.tronk = null;
  s.hitte = klem(Math.max(s.hitte||0, hitte));
  s.geluk = klem(s.geluk + 20);
  s.rekord.push('ontsnapping uit die tronk');
  repBy(VLUG_REP);
  var tt = teks + ' Jy is nou ’n vlugteling: ' + oor + ' jaar van jou vonnis staan nog oop.';
  noteer(tt,'misdaad');
  wenk('Jy is uit!');
  stoor(); renderAlles();
  wysModaal('\u{1F3C3} Jy is uit!', tt + '\n\nElke jaar kan die polisie jou kry. Lê laag, trek weg, kry ’n vals ID — ' +
    'of gee jouself oor vir ’n ligter straf.', [{t:'OK', doen:function(){ sluitModaal(); stoor(); renderAlles(); }}]);
}
/* Die kans om gevang te word. 'o' is die jaar waarin jou keuses tel:
   wat jy vanjaar doen, beskerm jou by volgende jaar se soektog. */
function vlugKans(o, hitte){
  var v = s.vlug; if(!v) return 0;
  var p = VLUG_BASIS + (hitte===undefined ? s.hitte||0 : hitte)*VLUG_PER_HITTE;
  if(s.blyplek==='ouers' || s.blyplek==='familie') p += VLUG_OUERS;
  if(hetHuis()) p += VLUG_HUIS;
  if(s.dakloos) p -= VLUG_STRAAT;
  if(v.laag===o) p -= VLUG_LAAG;
  if(v.getrek===o) p -= VLUG_TREK; else if(v.getrek===o-1) p -= VLUG_TREK/2;
  if(v.vals) p -= VLUG_VALS;
  if(s.bende) p -= VLUG_ORG;
  p -= Math.min(v.jare, VLUG_KOUD);
  return klem(Math.round(p), 2, 85);
}
function vlugJaar(){
  if(!s.vlug || s.tronk) return;
  var v = s.vlug;
  v.jare++; s.vlugJare = (s.vlugJare||0) + 1;
  if(kans(vlugKans(s.ouderdom - 1))){
    var t = 'Ná ' + v.jare + ' jaar op die vlug het die polisie jou in ' + s.dorp + ' opgespoor.';
    misdaadTel().gevang++;
    s.hitte = klem((s.hitte||0) + HITTE_GEVANG); s.geluk = klem(s.geluk - 14);
    noteer(t,'misdaad');
    tronkToe(0, 'ontsnapping uit die tronk');
    wagry.push({titel:'\u{1F694} Gevang', teks:t + ' Jy is terug in die tronk vir ' + s.tronk.jare + ' jaar, sonder parool.'});
    return;
  }
  var vry = v.vals ? VLUG_VRY_VALS : VLUG_VRY;
  if(v.jare >= vry){
    s.vlug = null;
    noteer(v.vals ? 'Ná ' + v.jare + ' jaar sit jou nuwe identiteit vas. Niemand soek meer na jou nie.' :
      'Ná ' + v.jare + ' jaar het die saak koud geword: die polisie het opgehou soek.','goed');
    return;
  }
  noteer('Jaar ' + v.jare + ' op die vlug. Niemand het jou gevind nie.','misdaad');
}
/* Vir tronkToe(): 'n vlugteling sit die res van sy vonnis uit, plus die
   ontsnapping (net een jaar as hy homself oorgee). */
function vlugNaTronk(opts){
  var v = s.vlug, oorgee = opts && opts.oorgee;
  var ekstra = oorgee ? VLUG_OORGEE_EKSTRA : v.ekstra;
  s.vlug = null;
  noteer('Jy sit die oorblywende ' + v.oor + ' jaar van jou vonnis uit, plus ' + ekstra + ' vir die ontsnapping.','misdaad');
  return v.oor + ekstra;
}
/* Wat sonder 'n vals ID toe is. Gee die rede, of ''. */
function vlugToe(){ return s.vlug && !s.vlug.vals ? 'Op die vlug sonder ’n vals ID' : ''; }
function vlugBank(){
  if(!vlugToe()) return false;
  wenk('Die polisie hou jou rekeninge dop. Jy het ’n vals ID nodig.');
  return true;
}
function vlugAksie(wat){
  var v = s.vlug; if(!v || s.tronk) return;
  if(wat==='laag'){ laagLe(); return; }
  if(wat==='trek'){
    if(s.gedoen.trek){ wenk('Jy het vanjaar al getrek.'); return; }
    var koste = s.dakloos ? 0 : VLUG_TREK_KOSTE;
    if(s.geld < koste){ wenk('Trek kos ' + geld(koste) + '.'); return; }
    var oud = s.dorp, nuut = kies(DORPE.filter(function(d){ return d!==oud; }));
    s.geld -= koste; s.dorp = nuut; v.getrek = s.ouderdom; s.gedoen.trek = 1;
    if(s.blyplek==='ouers' || s.blyplek==='familie'){ s.blyplek = 'huur'; s.huurPlek = 'kommune'; }
    noteer('Jy het in die nag van ' + oud + ' na ' + nuut + ' getrek' + (koste ? ' (' + geld(koste) + ')' : ', met ’n vragmotor saamgery') +
      '. Niemand hier ken jou gesig nie.','misdaad');
    wenk('Nou in ' + nuut + '.');
    stoor(); renderAlles(); return;
  }
  if(wat==='vals'){ vlugVals(); return; }
  if(wat==='loswerk'){
    /* Kontant in die hand: geen vorms, geen ID. Op straat is dit die
       gewone "Soek los werk"-knoppie. */
    if((s.gedoen.vLos||0) >= 2){ wenk('Twee keer per jaar is al wat jy kan kry.'); return; }
    s.gedoen.vLos = (s.gedoen.vLos||0) + 1;
    var dae = tussen(LOSWERK_DAE[0], LOSWERK_DAE[1]), in1 = Math.round(dae * tussen(LOSWERK_DAG[0], LOSWERK_DAG[1]));
    s.geld += in1; s.totaalVerdien += in1;
    s.gesondheid = klem(s.gesondheid - tussen(1,4));
    noteer('Jy het ' + dae + ' dae kontant gewerk — bouwerk, ’n verhuising, karwag — en ' + geld(in1) + ' verdien. Niemand het na ’n ID gevra nie.','geld');
    wenk('Los werk: ' + geld(in1));
    stoor(); renderAlles(); return;
  }
  if(wat==='oorgee'){
    wysModaal('\u{1F64B} Gee jouself oor?', 'Stap by ’n polisiekantoor in. Jy sit die oorblywende ' + v.oor +
      ' jaar uit plus net ' + VLUG_OORGEE_EKSTRA + ' vir die ontsnapping (gevang: ' + v.ekstra + '), en parool bly moontlik.', [
      {t:'Gee jou oor', klas:'rooi', doen:function(){
        sluitModaal();
        noteer('Jy het by die polisiekantoor in ' + s.dorp + ' ingestap en jouself oorgegee.','misdaad');
        s.hitte = Math.round((s.hitte||0)/2);
        tronkToe(0, 'ontsnapping uit die tronk (oorgegee)', {oorgee:true});
        wenk('Terug in die tronk: ' + s.tronk.jare + ' jaar.');
        stoor(); renderAlles(); }},
      {t:'Bly op die vlug', klas:'grys', doen:sluitModaal}
    ]);
  }
}
function valsAanbod(){
  var o = myOrg(), eie = s.eieOrg && s.eieOrg.lede.length;
  if(o || eie) return {koste:VALS_ID[0].koste, risiko:VALS_ID[0].risiko, wie:o ? o.n : s.eieOrg.naam};
  if((s.straatRep||0) >= VALS_ID[1].rep) return {koste:VALS_ID[1].koste, risiko:VALS_ID[1].risiko, wie:'’n Vervalser wat jou naam ken'};
  return {koste:VALS_ID[2].koste, risiko:VALS_ID[2].risiko, wie:'’n Man in ’n kroeg wat “iemand ken”'};
}
function vlugVals(){
  var v = s.vlug; if(v.vals){ wenk('Jy het al ’n vals ID.'); return; }
  var a = valsAanbod();
  wysModaal('\u{1FAAA} ’n Vals ID', a.wie + ' kan vir ' + geld(a.koste) + ' ’n ID, ’n bestuurslisensie en ’n bankkaart in ’n nuwe naam ' +
    'kry. Dan kan jy weer werk, bank en ’n mediese fonds hê, en die polisie kry jou minder maklik.', [
    {t:'Koop dit', klas:'groen', sub:geld(a.koste) + ' · ' + a.risiko + '% kans dit is ’n polisie-lokval', doen:function(){
      if(s.geld < a.koste){ wenk('Jy kort ' + geld(a.koste - s.geld) + '.'); return; }
      sluitModaal();
      s.geld -= a.koste; misdaadTel().koste += a.koste;
      if(kans(a.risiko)){
        var t = 'Die “vervalser” was ’n polisie-informant. Hulle het jou by die oorhandiging gearresteer.';
        noteer(t,'misdaad'); misdaadTel().gevang++;
        tronkToe(0, 'ontsnapping uit die tronk');
        stoor(); renderAlles();
        wysModaal('\u{1F694} ’n Lokval', t + ' Jy sit nou ' + s.tronk.jare + ' jaar, sonder parool.', [{t:'OK', doen:sluitModaal}]);
        return;
      }
      v.vals = true;
      noteer('Jy het ’n vals ID gekoop. Op papier is jy nou iemand anders.','misdaad');
      wenk('Jy het ’n nuwe naam.');
      stoor(); renderAlles(); }},
    {t:'Los dit', klas:'grys', doen:sluitModaal}
  ]);
}

/* ---------- Die blad ---------- */
function renderVlug(){
  var v = s.vlug; if(!v || s.tronk) return '';
  /* Die soektog kom ná volgende jaar se hitteverval (sien misdaadJaar). */
  var k = vlugKans(s.ouderdom, Math.max(0, Math.round((s.hitte||0)*(1-HITTE_VERVAL)) - HITTE_VERVAL_VAS)), vry = (v.vals ? VLUG_VRY_VALS : VLUG_VRY) - v.jare;
  return '<div class="titel">Op die vlug</div><div class="kaart"><div class="ry"><div class="emo">\u{1F3C3}</div><div class="groei">'+
    '<div class="hoof">' + (v.jare ? 'Jaar ' + v.jare + ' op die vlug' : 'Jou eerste maande op die vlug') + '</div>'+
    '<div class="klein">' + v.oor + ' jaar van jou vonnis staan oop. Kans dat hulle jou volgende jaar kry: <b>' + k + '%</b>. ' +
      'Nog ' + vry + ' jaar sonder om gevang te word, en jy is vry.' +
      (v.vals ? ' Jy het ’n vals ID.' : ' Sonder ’n vals ID is werk, die bank, ’n verband en ’n mediese fonds toe; los werk en misdaad nie.') +
      (s.blyplek==='ouers' || s.blyplek==='familie' ? ' Jou familie se huis is die eerste plek waar hulle soek.' : '') + '</div></div></div>'+
    '<div class="ms-ry"><button class="knop grys" onclick="vlugAksie(\'laag\')">Lê laag<small>' + (v.laag===s.ouderdom ? 'vanjaar klaar' : '−' + VLUG_LAAG + '% · geen misdaad') + '</small></button>'+
    '<button class="knop grys" onclick="vlugAksie(\'trek\')">Trek weg<small>' + (s.gedoen.trek ? 'vanjaar klaar' : '−' + VLUG_TREK + '% · ' +
      (s.dakloos ? 'gratis' : geld(VLUG_TREK_KOSTE))) + '</small></button></div>'+
    (v.vals || s.dakloos ? '' : '<button class="knop grys" onclick="vlugAksie(\'loswerk\')">Los werk vir kontant<small>' +
      (2 - (s.gedoen.vLos||0)) + ' keer oor vanjaar · geen ID nodig</small></button>') +
    '<div class="ms-ry">' + (v.vals ? '' : '<button class="knop groen" onclick="vlugAksie(\'vals\')">Koop ’n vals ID<small>' +
      geld(valsAanbod().koste) + ' · −' + VLUG_VALS + '%</small></button>') +
    '<button class="knop rooi" onclick="vlugAksie(\'oorgee\')">Gee jou oor<small>' + v.oor + ' + ' + VLUG_OORGEE_EKSTRA + ' jaar</small></button></div></div>';
}
function renderOntsnapKnop(){
  if(s.tronk.jeug) return '<div class="klein" style="margin-top:8px">Uit ’n jeugsorgsentrum ontsnap jy nie — jy is binnekort uit, en ’n skoon blad is meer werd.</div>';
  var p = tronkPlan();
  return '<button class="knop rooi" onclick="tronkAksie(\'ontsnap\')">Beplan ’n ontsnapping<small>' + planTel(p) + ' van ' +
    ONTSNAP_ITEMS.length + ' voorbereidings' + (p.tonnel && p.tonnel < 3 ? ' · tonnel ' + p.tonnel + '/3' : '') + '</small></button>';
}

/* ---------- Gebeure vir 'n vlugteling ---------- */
GEBEURE.push(
  {waar:'enige', min:16, max:120, as:function(){ return !!s.vlug && !s.tronk; },
   vraag:'Iemand in die ry by die winkel kyk jou te lank aan. Dan haal hy sy foon uit.',
   opsies:[
    {t:'Los jou trollie en loop', doen:function(){ s.geluk = klem(s.geluk - 4);
      noteer('Jy het jou trollie gelos en by die agterdeur uitgeglip. Jy sal nie weer daar inkoop nie.','misdaad'); }},
    {t:'Bly kalm en betaal', doen:function(){
      if(kans(65)) noteer('Hy het net ’n boodskap gelees. Jou hart het eers by die huis bedaar.','misdaad');
      else { s.hitte = klem((s.hitte||0) + 15);
        noteer('Hy het die polisie gebel. Jy was weg voor hulle daar was, maar hulle weet nou waar om te soek.','sleg'); } }}
   ]},
  {waar:'enige', min:16, max:120, as:function(){ return !!s.vlug && !s.tronk && lewendeOuers().length > 0; },
   doen:function(){ s.geluk = klem(s.geluk - tussen(4,9));
     return ['Jy kon nie eers jou ouers met Kersfees bel nie: die polisie luister hul foon af.','sleg']; }}
);
