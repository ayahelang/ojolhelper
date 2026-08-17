const $ = id => document.getElementById(id);

const state = {
  watchId: null,
  marker: null,
  accuracyCircle: null,
  map: null,
  lastPos: null,
  currentRoad: null,
  roadStart: null,
  roadLength: null,
  roadEndPoint: null,
  roadGeometry: null,
  eventDone: [false, false, false],
  voiceOn: true,
  lastReverseAt: 0,
  lastRoadQuery: '',
  intersectionCache: null
};

const NOMINATIM = 'https://nominatim.openstreetmap.org/reverse';
const OVERPASS = 'https://overpass-api.de/api/interpreter';

function log(msg){
  const d = document.createElement('div');
  d.textContent = new Date().toLocaleTimeString('id-ID') + ' — ' + msg;
  $('log').prepend(d);
}

function speak(text){
  if(!state.voiceOn || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'id-ID';
  u.rate = Number($('speechRate').value);
  u.pitch = 1;
  speechSynthesis.speak(u);
  log('🔊 ' + text);
}

function resetEvents(){
  state.eventDone = [false,false,false];
  ['event1','event2','event3'].forEach((id,i)=>{
    $(id).classList.remove('done');
    $(id).querySelector('small').textContent='Belum terdengar';
  });
}

function markEvent(n){
  state.eventDone[n-1] = true;
  const el = $('event'+n);
  el.classList.add('done');
  el.querySelector('small').textContent='Sudah terdengar';
}

function haversine(a,b){
  const R=6371000, p1=a.lat*Math.PI/180, p2=b.lat*Math.PI/180;
  const dp=(b.lat-a.lat)*Math.PI/180, dl=(b.lon-a.lon)*Math.PI/180;
  const x=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
  return 2*R*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}

function bearing(a,b){
  const p1=a.lat*Math.PI/180,p2=b.lat*Math.PI/180,dl=(b.lon-a.lon)*Math.PI/180;
  const y=Math.sin(dl)*Math.cos(p2);
  const x=Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl);
  return (Math.atan2(y,x)*180/Math.PI+360)%360;
}

function angleDiff(a,b){
  let d=Math.abs(((a-b+540)%360)-180);
  return d;
}

function pointAlongLine(geometry, percent){
  if(!geometry || geometry.length<2) return null;
  let segs=[], total=0;
  for(let i=1;i<geometry.length;i++){
    const a={lat:geometry[i-1][1],lon:geometry[i-1][0]};
    const b={lat:geometry[i][1],lon:geometry[i][0]};
    const len=haversine(a,b); segs.push({a,b,len}); total+=len;
  }
  if(!total) return null;
  let target=total*percent, acc=0;
  for(const s of segs){
    if(acc+s.len>=target){
      const t=(target-acc)/s.len;
      return {lat:s.a.lat+(s.b.lat-s.a.lat)*t,lon:s.a.lon+(s.b.lon-s.a.lon)*t};
    }
    acc+=s.len;
  }
  return segs.at(-1).b;
}

function nearestPointOnSegment(p,a,b){
  const latScale=111320, lonScale=111320*Math.cos(p.lat*Math.PI/180);
  const px=p.lon*lonScale, py=p.lat*latScale, ax=a.lon*lonScale, ay=a.lat*latScale, bx=b.lon*lonScale, by=b.lat*latScale;
  const dx=bx-ax,dy=by-ay;
  const t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy||1)));
  return {lat:(ay+dy*t)/latScale,lon:(ax+dx*t)/lonScale};
}

function nearestOnGeometry(p, geometry){
  let best=null, bestDist=Infinity, bestIndex=0;
  for(let i=1;i<geometry.length;i++){
    const a={lat:geometry[i-1][1],lon:geometry[i-1][0]},b={lat:geometry[i][1],lon:geometry[i][0]};
    const q=nearestPointOnSegment(p,a,b), d=haversine(p,q);
    if(d<bestDist){best=q;bestDist=d;bestIndex=i-1}
  }
  return {point:best,distance:bestDist,index:bestIndex};
}

async function reverseGeocode(lat,lon){
  const now=Date.now();
  if(now-state.lastReverseAt<3500) return null;
  state.lastReverseAt=now;
  const url=`${NOMINATIM}?lat=${lat}&lon=${lon}&format=jsonv2&zoom=18&addressdetails=1`;
  try{
    const r=await fetch(url,{headers:{'Accept':'application/json'}});
    if(!r.ok) throw new Error('Reverse geocoding gagal');
    return await r.json();
  }catch(e){ log('⚠️ Tidak dapat membaca nama jalan: '+e.message); return null; }
}

async function queryRoads(lat,lon){
  const q=`[out:json][timeout:12];
way(around:80,${lat},${lon})["highway"];
out tags geom;`;
  try{
    const r=await fetch(OVERPASS,{method:'POST',body:q});
    if(!r.ok) throw new Error('Overpass '+r.status);
    const data=await r.json();
    return data.elements || [];
  }catch(e){ log('⚠️ Data persimpangan belum tersedia: '+e.message); return []; }
}

function classifyBranches(currentBearing, currentRoad, ways){
  const candidates=[];
  for(const w of ways){
    const name=(w.tags||{}).name;
    if(!name || name===currentRoad || !w.geometry || w.geometry.length<2) continue;
    const mid=Math.floor(w.geometry.length/2);
    const a={lat:w.geometry[Math.max(0,mid-1)][1],lon:w.geometry[Math.max(0,mid-1)][0]};
    const b={lat:w.geometry[mid][1],lon:w.geometry[mid][0]};
    const br=bearing(a,b);
    let diff=angleDiff(currentBearing,br);
    // Road direction has two possible orientations.
    diff=Math.min(diff,180-diff);
    let side=(br-currentBearing+360)%360;
    candidates.push({name,diff,side});
  }
  candidates.sort((a,b)=>a.diff-b.diff);
  const result={left:null,right:null,straight:null};
  for(const c of candidates){
    if(c.diff<25 && !result.straight) result.straight=c.name;
    else if(c.side>25 && c.side<155 && !result.right) result.right=c.name;
    else if(c.side>205 && c.side<335 && !result.left) result.left=c.name;
  }
  return result;
}

async function updateIntersection(lat,lon,heading,currentRoad){
  const ways=await queryRoads(lat,lon);
  if(!ways.length) return;
  const branches=classifyBranches(heading,currentRoad,ways);
  state.intersectionCache=branches;
  const parts=[];
  if(branches.right) parts.push(`ke kanan ${branches.right}`);
  if(branches.left) parts.push(`ke kiri ${branches.left}`);
  if(branches.straight) parts.push(`jika lurus ${branches.straight}`);
  const text=parts.length ? `Setelah ${currentRoad} berakhir, ${parts.join(', ')}.` : 'Nama jalan pada persimpangan berikutnya belum lengkap.';
  $('nextRoad').innerHTML=`<h2>🧭 Informasi persimpangan</h2><p>${text}</p>`;
}

async function startNewRoad(pos, reverseData){
  const name=reverseData?.address?.road || reverseData?.address?.pedestrian || reverseData?.display_name?.split(',')[0] || 'Jalan tanpa nama';
  state.currentRoad=name;
  state.roadStart={lat:pos.coords.latitude,lon:pos.coords.longitude};
  state.roadLength=null;
  state.roadGeometry=null;
  state.intersectionCache=null;
  resetEvents();

  $('roadName').textContent=name;
  $('roadMeta').textContent='Ruas jalan baru terdeteksi.';
  speak(`Anda memasuki ${name}.`);
  markEvent(1);

  const ways=await queryRoads(pos.coords.latitude,pos.coords.longitude);
  const matching=ways.filter(w=>(w.tags||{}).name===name && w.geometry?.length>1);
  if(matching.length){
    const w=matching.sort((a,b)=>a.geometry.length-b.geometry.length)[0];
    state.roadGeometry=w.geometry.map(p=>[p.lon,p.lat]);
    let len=0;
    for(let i=1;i<state.roadGeometry.length;i++){
      len+=haversine(
        {lat:state.roadGeometry[i-1][1],lon:state.roadGeometry[i-1][0]},
        {lat:state.roadGeometry[i][1],lon:state.roadGeometry[i][0]}
      );
    }
    state.roadLength=len;
    state.roadEndPoint=pointAlongLine(state.roadGeometry,1);
  }
}

async function updateRoadProgress(pos){
  if(!state.currentRoad || !state.roadStart) return;
  const p={lat:pos.coords.latitude,lon:pos.coords.longitude};
  let progress=0, remaining=null;

  if(state.roadGeometry && state.roadLength){
    const near=nearestOnGeometry(p,state.roadGeometry);
    let traveled=0;
    for(let i=1;i<=near.index;i++){
      traveled+=haversine(
        {lat:state.roadGeometry[i-1][1],lon:state.roadGeometry[i-1][0]},
        {lat:state.roadGeometry[i][1],lon:state.roadGeometry[i][0]}
      );
    }
    progress=Math.max(0,Math.min(1,traveled/state.roadLength));
    remaining=state.roadLength-traveled;
  }else{
    const d=haversine(state.roadStart,p);
    progress=Math.min(0.9,d/700);
  }

  const pct=Math.round(progress*100);
  $('progressBar').style.width=pct+'%';
  $('progressText').textContent=pct+'%';

  if(!state.eventDone[1] && progress>=0.4){
    speak(`Saat ini Anda berada di ${state.currentRoad}.`);
    markEvent(2);
  }

  const announceDist=Number($('announceDistance').value);
  if(!state.eventDone[2] && remaining!==null && remaining<=announceDist){
    speak(`${state.currentRoad} akan segera berakhir.`);
    markEvent(3);
    await updateIntersection(p.lat,p.lon,pos.coords.heading ?? bearing(state.roadStart,p),state.currentRoad);
  }

  if(remaining!==null && remaining<=70){
    // Query reverse geocoding after crossing the end zone, so the next road can be detected.
    const data=await reverseGeocode(p.lat,p.lon);
    const nextName=data?.address?.road;
    if(nextName && nextName!==state.currentRoad){
      await startNewRoad(pos,data);
    }
  }
}

async function onPosition(pos){
  const lat=pos.coords.latitude,lon=pos.coords.longitude;
  const p={lat,lon};
  $('gpsStatus').textContent=`GPS aktif • ±${Math.round(pos.coords.accuracy||0)} m`;

  if(!state.marker){
    state.marker=L.marker([lat,lon]).addTo(state.map).bindPopup('Posisi kendaraan');
    state.map.setView([lat,lon],17);
  }else{
    state.marker.setLatLng([lat,lon]);
  }
  if(state.accuracyCircle) state.accuracyCircle.setLatLng([lat,lon]).setRadius(pos.coords.accuracy||20);
  else state.accuracyCircle=L.circle([lat,lon],{radius:pos.coords.accuracy||20,color:'#2563eb',fillOpacity:.08}).addTo(state.map);

  const now=Date.now();
  if(!state.currentRoad || now-state.lastReverseAt>5000){
    const data=await reverseGeocode(lat,lon);
    if(data){
      const name=data.address?.road || data.address?.pedestrian;
      if(name && name!==state.currentRoad) await startNewRoad(pos,data);
    }
  }

  if(state.currentRoad) await updateRoadProgress(pos);
  state.lastPos=pos;
}

function startGPS(){
  if(!navigator.geolocation){ alert('Browser tidak mendukung GPS.'); return; }
  if(state.watchId!==null) return;
  state.map.locate({setView:true,maxZoom:17});
  state.watchId=navigator.geolocation.watchPosition(onPosition,err=>{
    $('gpsStatus').textContent='GPS error: '+err.message;
    log('❌ GPS: '+err.message);
  },{enableHighAccuracy:true,maximumAge:2000,timeout:15000});
  $('startBtn').textContent='📍 GPS Aktif';
  log('GPS dimulai.');
}

function stopGPS(){
  if(state.watchId!==null) navigator.geolocation.clearWatch(state.watchId);
  state.watchId=null;
  $('startBtn').textContent='📍 Mulai GPS';
  $('gpsStatus').textContent='GPS dihentikan';
  log('GPS dihentikan.');
}

state.map=L.map('map').setView([-6.914744,107.609810],13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  maxZoom:19,
  attribution:'&copy; OpenStreetMap contributors'
}).addTo(state.map);

$('startBtn').onclick=startGPS;
$('stopBtn').onclick=stopGPS;
$('repeatBtn').onclick=()=>state.currentRoad ? speak(`Anda sedang berada di ${state.currentRoad}.`) : speak('Nama jalan belum terdeteksi.');
$('voiceToggle').onclick=()=>{
  state.voiceOn=!state.voiceOn;
  $('voiceToggle').classList.toggle('active',state.voiceOn);
  $('voiceToggle').textContent=state.voiceOn?'🔊 SUARA ON':'🔇 SUARA OFF';
  if(!state.voiceOn && 'speechSynthesis' in window) speechSynthesis.cancel();
};

log('Aplikasi siap. Tekan "Mulai GPS".');
