const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));

export const PLAYER_HOME_PROFILES = Object.freeze({
  balanced: Object.freeze({
    districtId:"dongsu",
    districtName:"동수동",
    homeName:"동수동 작은 빌라방",
    background:"assets/backgrounds/home/BG_HOME_BASIC_VILLA_NIGHT_001.png",
    description:"단독주택과 저층 빌라가 보이는 소박한 방"
  }),
  handsome: Object.freeze({
    districtId:"dongsu",
    districtName:"동수동",
    homeName:"동수동 고급 오피스텔",
    background:"assets/backgrounds/home/BG_HOME_HANDSOME_NIGHT_001.png",
    description:"패션과 야경이 어우러진 세련된 오피스텔"
  }),
  wealthy: Object.freeze({
    districtId:"geumsu",
    districtName:"금수동",
    homeName:"금수동 한강 펜트하우스",
    background:"assets/backgrounds/home/BG_HOME_WEALTHY_RIVER_NIGHT_001.png",
    description:"한강이 한눈에 보이는 넓은 고급 거실"
  })
});

export const WORLD_MAPS = Object.freeze({
  dongsu:Object.freeze({
    id:"dongsu",cityId:"seoul",name:"동수동",subtitle:"생활과 사람이 가까운 서울의 오래된 동네",theme:"local",width:12,height:8,start:{x:6,y:6},
    locations:Object.freeze([
      {id:"dongsu-home",name:"나의 방",icon:"⌂",category:"home",x:6,y:6,description:"오늘 하루를 정리하는 익숙한 집"},
      {id:"gimbap-village",name:"김밥마을",icon:"🍙",category:"korean",x:2,y:2,description:"김밥·라면·떡볶이를 파는 동네 분식집"},
      {id:"sundae-house",name:"동수순댓국",icon:"🍲",category:"korean",x:5,y:1,description:"뜨끈한 순댓국과 국밥이 유명한 식당"},
      {id:"small-cafe",name:"카페 모퉁이",icon:"☕",category:"cafe",x:9,y:2,description:"연인과 조용히 대화하기 좋은 작은 카페"},
      {id:"alley-pub",name:"골목포차",icon:"🍺",category:"bar",x:10,y:5,description:"퇴근 후 사람들이 모이는 소박한 술집",adultOnly:true},
      {id:"ramen-shop",name:"하루라멘",icon:"🍜",category:"japanese",x:3,y:5,description:"돈코츠 라멘과 가라아게를 파는 일식집"},
      {id:"china-diner",name:"홍등반점",icon:"🥟",category:"chinese",x:1,y:6,description:"짜장면·짬뽕·딤섬을 파는 중식당"},
      {id:"fitness-food",name:"밸런스 키친",icon:"🥗",category:"diet",x:8,y:6,description:"샐러드·포케·단백질 식단 전문점"},
      {id:"dongsu-station",name:"동수역",icon:"🚇",category:"transport",x:6,y:3,description:"서울 곳곳으로 이어지는 지하철역"}
    ])
  }),
  geumsu:Object.freeze({
    id:"geumsu",cityId:"seoul",name:"금수동",subtitle:"한강과 고급 상권이 이어지는 서울의 부촌",theme:"premium",width:12,height:8,start:{x:3,y:6},
    locations:Object.freeze([
      {id:"geumsu-home",name:"한강 펜트하우스",icon:"⌂",category:"home",x:3,y:6,description:"한강을 내려다보는 넓은 집"},
      {id:"river-cafe",name:"리버뷰 카페",icon:"☕",category:"cafe",x:2,y:2,description:"한강 전망과 디저트가 유명한 카페"},
      {id:"fine-dining",name:"라 메종",icon:"🍽",category:"western",x:6,y:2,description:"기념일에 어울리는 고급 레스토랑"},
      {id:"premium-sushi",name:"스시 세이",icon:"🍣",category:"japanese",x:9,y:1,description:"예약제로 운영되는 고급 스시 다이닝"},
      {id:"department",name:"금수백화점",icon:"🛍",category:"shopping",x:9,y:5,description:"패션·선물·명품 매장이 모인 백화점"},
      {id:"rooftop",name:"루프탑 라운지",icon:"🍸",category:"bar",x:6,y:5,description:"야경을 보며 대화하는 성인 전용 라운지",adultOnly:true},
      {id:"gallery",name:"한강 갤러리",icon:"🖼",category:"culture",x:1,y:5,description:"전시와 사교 이벤트가 열리는 갤러리"},
      {id:"geumsu-station",name:"금수역",icon:"🚇",category:"transport",x:5,y:7,description:"서울 중심부와 연결되는 지하철역"}
    ])
  }),
  yeonhui:Object.freeze({
    id:"yeonhui",cityId:"seoul",name:"연희동",subtitle:"여자친구의 일상과 추억이 머무는 조용한 서울 동네",theme:"romantic",width:12,height:8,start:{x:6,y:6},
    locations:Object.freeze([
      {id:"yeonhui-station",name:"연희역",icon:"🚇",category:"transport",x:6,y:6,description:"여자친구의 동네로 이어지는 지하철역"},
      {id:"girlfriend-home",name:"여자친구의 집",icon:"🏡",category:"girlfriend-home",x:2,y:2,description:"여자친구가 생활하는 익숙하고 따뜻한 공간"},
      {id:"flower-cafe",name:"플로라 카페",icon:"🌷",category:"cafe",x:5,y:1,description:"꽃과 디저트가 가득한 여자친구의 단골 카페"},
      {id:"yeonhui-bakery",name:"연희 베이커리",icon:"🥐",category:"cafe",x:9,y:2,description:"갓 구운 빵 냄새가 골목까지 퍼지는 작은 빵집"},
      {id:"memory-park",name:"기억의 공원",icon:"🌸",category:"date",x:9,y:5,description:"둘이 천천히 산책하며 이야기하기 좋은 공원"},
      {id:"vinyl-store",name:"오후의 레코드",icon:"🎵",category:"culture",x:3,y:5,description:"여자친구가 좋아하는 음악을 발견할 수 있는 가게"},
      {id:"rose-bistro",name:"로즈 비스트로",icon:"🍝",category:"western",x:1,y:6,description:"따뜻한 조명 아래 저녁 데이트를 즐기는 식당"}
    ])
  }),
  hongdae:Object.freeze({
    id:"hongdae",cityId:"seoul",name:"홍대거리",subtitle:"음악과 클럽의 네온이 밤새 이어지는 번화가",theme:"nightlife",width:12,height:8,start:{x:6,y:6},
    locations:Object.freeze([
      {id:"hongdae-station",name:"홍대입구역",icon:"🚇",category:"transport",x:6,y:6,description:"홍대 번화가로 이어지는 지하철역"},
      {id:"neon-club",name:"클럽 네온",icon:"🪩",category:"club",x:2,y:2,description:"DJ 공연과 화려한 조명이 이어지는 성인 클럽",adultOnly:true},
      {id:"live-house",name:"라이브 하우스",icon:"🎸",category:"culture",x:5,y:1,description:"인디 밴드의 공연을 가까이서 즐기는 무대"},
      {id:"rooftop-pub",name:"문라이트 루프탑",icon:"🍸",category:"bar",x:9,y:2,description:"홍대 야경이 펼쳐지는 루프탑 바",adultOnly:true},
      {id:"street-fashion",name:"스트리트 편집숍",icon:"👟",category:"shopping",x:9,y:5,description:"개성 있는 패션과 액세서리를 고르는 편집숍"},
      {id:"night-food",name:"심야 포차거리",icon:"🍢",category:"korean",x:3,y:5,description:"밤늦게까지 길거리 음식을 즐기는 골목",lateNightOpen:true}
    ])
  }),
  seongsu:Object.freeze({
    id:"seongsu",cityId:"seoul",name:"성수 피트니스 거리",subtitle:"운동과 라이프스타일 공간이 모인 활기찬 거리",theme:"fitness",width:12,height:8,start:{x:6,y:6},
    locations:Object.freeze([
      {id:"seongsu-station",name:"성수역",icon:"🚇",category:"transport",x:6,y:6,description:"피트니스 거리로 연결되는 지하철역"},
      {id:"prime-gym",name:"프라임 짐",icon:"🏋️",category:"gym",x:2,y:2,description:"웨이트와 퍼스널 트레이닝을 제공하는 대형 체육관"},
      {id:"boxing-studio",name:"어반 복싱",icon:"🥊",category:"gym",x:5,y:1,description:"복싱과 유산소 운동을 배우는 스튜디오"},
      {id:"climbing-lab",name:"클라이밍 랩",icon:"🧗",category:"gym",x:9,y:2,description:"높은 실내 암벽을 함께 오르는 스포츠 공간"},
      {id:"running-park",name:"서울숲 러닝코스",icon:"🏃",category:"date",x:9,y:5,description:"가볍게 달리거나 산책하기 좋은 공원 코스"},
      {id:"protein-cafe",name:"프로틴 카페",icon:"🥤",category:"diet",x:3,y:5,description:"운동 후 건강한 음료와 식사를 즐기는 카페"}
    ])
  }),
  jamsil:Object.freeze({
    id:"jamsil",cityId:"seoul",name:"잠실 드림랜드",subtitle:"놀이기구와 호수의 불빛이 가득한 데이트 명소",theme:"amusement",width:12,height:8,start:{x:6,y:6},
    locations:Object.freeze([
      {id:"jamsil-station",name:"잠실역",icon:"🚇",category:"transport",x:6,y:6,description:"드림랜드 정문으로 이어지는 지하철역"},
      {id:"dream-castle",name:"드림 캐슬",icon:"🏰",category:"amusement",x:2,y:2,description:"퍼레이드와 사진 촬영을 즐기는 놀이동산의 상징"},
      {id:"roller-coaster",name:"스카이 코스터",icon:"🎢",category:"amusement",x:5,y:1,description:"호수 위를 빠르게 달리는 인기 롤러코스터"},
      {id:"ferris-wheel",name:"별빛 관람차",icon:"🎡",category:"amusement",x:9,y:2,description:"서울 야경을 둘이 감상하는 대관람차"},
      {id:"carousel",name:"문라이트 회전목마",icon:"🎠",category:"amusement",x:9,y:5,description:"따뜻한 조명 아래 추억을 남기는 회전목마"},
      {id:"lake-promenade",name:"호수 산책로",icon:"🌙",category:"date",x:3,y:5,description:"축제 조명과 호수를 따라 걷는 데이트 코스"}
    ])
  }),
  myeongdong:Object.freeze({
    id:"myeongdong",cityId:"seoul",name:"명동 쇼핑거리",subtitle:"백화점과 패션 매장이 빛나는 서울 중심 상권",theme:"shopping",width:12,height:8,start:{x:6,y:6},
    locations:Object.freeze([
      {id:"myeongdong-station",name:"명동역",icon:"🚇",category:"transport",x:6,y:6,description:"명동 쇼핑거리 중심으로 이어지는 지하철역"},
      {id:"central-department",name:"센트럴 백화점",icon:"🏬",category:"shopping",x:2,y:2,description:"패션·식품·명품 매장이 모인 대형 백화점"},
      {id:"fashion-mall",name:"스타일 몰",icon:"👗",category:"shopping",x:5,y:1,description:"유행하는 옷과 액세서리를 고르는 패션몰"},
      {id:"beauty-street",name:"뷰티 스트리트",icon:"💄",category:"shopping",x:9,y:2,description:"화장품과 향수를 체험하는 쇼핑 거리"},
      {id:"city-cinema",name:"시티 시네마",icon:"🎬",category:"culture",x:9,y:5,description:"쇼핑 후 영화를 함께 보는 대형 영화관"},
      {id:"department-food",name:"백화점 푸드홀",icon:"🍰",category:"cafe",x:3,y:5,description:"다양한 디저트와 식사를 즐기는 프리미엄 푸드홀"}
    ])
  }),
  namsan:Object.freeze({
    id:"namsan",cityId:"seoul",name:"남산 K타워",subtitle:"서울의 야경이 한눈에 펼쳐지는 산 위의 랜드마크",theme:"landmark",width:12,height:8,start:{x:6,y:6},
    locations:Object.freeze([
      {id:"namsan-station",name:"남산 케이블카역",icon:"🚠",category:"transport",x:6,y:6,description:"남산 정상으로 오르는 케이블카 승강장"},
      {id:"k-tower",name:"남산 K타워",icon:"🗼",category:"landmark",x:2,y:2,description:"서울 전경을 360도로 감상하는 전망 타워"},
      {id:"sky-observatory",name:"스카이 전망대",icon:"🔭",category:"landmark",x:5,y:1,description:"도시의 불빛과 별을 함께 바라보는 전망대"},
      {id:"tower-restaurant",name:"클라우드 다이닝",icon:"🍽",category:"western",x:9,y:2,description:"서울 야경을 바라보며 식사하는 레스토랑"},
      {id:"love-terrace",name:"연인의 테라스",icon:"💞",category:"date",x:9,y:5,description:"둘만의 사진과 추억을 남기는 야외 테라스"},
      {id:"mountain-trail",name:"남산 산책길",icon:"🌲",category:"date",x:3,y:5,description:"숲과 야경 사이를 천천히 걷는 산책로"}
    ])
  }),
  busan:Object.freeze({
    id:"busan",cityId:"busan",name:"해운동",subtitle:"바다와 여행의 설렘이 이어지는 부산 해안 지구",theme:"coast",width:12,height:8,start:{x:5,y:6},
    locations:Object.freeze([
      {id:"busan-station",name:"부산역",icon:"🚄",category:"transport",x:5,y:6,description:"서울과 부산을 잇는 장거리 교통 거점"},
      {id:"haeundae-beach",name:"해운대 해변",icon:"🌊",category:"travel",x:2,y:2,description:"연인과 바다를 걸을 수 있는 대표 여행지"},
      {id:"marine-cafe",name:"마린뷰 카페",icon:"☕",category:"cafe",x:5,y:2,description:"푸른 바다를 바라보는 창가 카페"},
      {id:"milmyun-house",name:"부산 밀면집",icon:"🍜",category:"korean",x:8,y:2,description:"시원한 밀면과 만두를 파는 부산 맛집"},
      {id:"gwangalli",name:"광안리 야경",icon:"🌉",category:"travel",x:9,y:5,description:"다리 불빛과 바다를 함께 보는 밤 산책길"},
      {id:"jagalchi",name:"자갈치 시장",icon:"🐟",category:"shopping",x:2,y:5,description:"활기찬 시장과 해산물 식당이 모인 곳"},
      {id:"seomyeon",name:"서면 거리",icon:"🎵",category:"culture",x:6,y:4,description:"쇼핑과 공연, 젊은 분위기가 이어지는 거리"}
    ])
  })
});

export const WORLD_ATLAS = Object.freeze({
  nationwide:Object.freeze({id:"nationwide",name:"전국",subtitle:"서울과 부산을 잇는 여행 지도",destinations:["seoul","busan"]}),
  seoul:Object.freeze({id:"seoul",name:"서울",subtitle:"생활권·여자친구 동네·다섯 개의 번화가",districts:["dongsu","geumsu","yeonhui","hongdae","seongsu","jamsil","myeongdong","namsan"]}),
  busan:Object.freeze({id:"busan",name:"부산",subtitle:"해운대·광안리·서면 여행 생활권",districts:["busan"]})
});

export const TRANSPORT_OPTIONS = Object.freeze([
  Object.freeze({id:"walk",name:"도보",icon:"🚶",cost:0,minutes:10,steps:1,effects:{energy:-1,fatigue:1},description:"1칸 · 10분 · 에너지 -1"}),
  Object.freeze({id:"bus",name:"버스",icon:"🚌",cost:1500,minutes:5,steps:1,effects:{},description:"1칸 · 5분 · 승차 ₩1,500"}),
  Object.freeze({id:"subway",name:"지하철",icon:"🚇",cost:1400,minutes:5,steps:0,effects:{},fastTravel:"station",description:"역을 선택해 5분 만에 이동"}),
  Object.freeze({id:"taxi",name:"택시",icon:"🚕",cost:8000,minutes:3,steps:0,effects:{},fastTravel:"location",description:"장소 바로 이동 · 거리별 요금"}),
  Object.freeze({id:"car",name:"고급 자가용",icon:"🚘",cost:2500,minutes:4,steps:1,effects:{},requiresVehicle:true,description:"1칸 · 4분 · 주유·주차 ₩2,500"})
]);

export const LATE_NIGHT_START_MINUTES = 22 * 60;
const LATE_NIGHT_OPEN_CATEGORIES = new Set(["bar","club","home","girlfriend-home","transport","date","travel"]);

export function isWorldLocationOpen(location, minutes, {hasSpecialEvent=false} = {}) {
  if (!location) return false;
  if (Number(minutes) < LATE_NIGHT_START_MINUTES) return true;
  return Boolean(hasSpecialEvent || location.lateNightOpen || LATE_NIGHT_OPEN_CATEGORIES.has(location.category));
}

export function getRoadCells(mapOrId) {
  const map=typeof mapOrId==="string"?WORLD_MAPS[mapOrId]:mapOrId;
  if(!map)return [];
  const cells=new Map();
  const add=(x,y)=>cells.set(`${x},${y}`,Object.freeze({x,y}));
  add(map.start.x,map.start.y);
  map.locations.forEach((location,index)=>{
    let x=map.start.x,y=map.start.y;
    const horizontalFirst=index%2===0;
    const walkX=()=>{while(x!==location.x){x+=Math.sign(location.x-x);add(x,y);}};
    const walkY=()=>{while(y!==location.y){y+=Math.sign(location.y-y);add(x,y);}};
    if(horizontalFirst){walkX();walkY();}else{walkY();walkX();}
  });
  return [...cells.values()];
}

export function isRoadCell(mapOrId,x,y) {
  return getRoadCells(mapOrId).some(cell=>cell.x===x&&cell.y===y);
}

export function getPlayerHomeProfile(archetypeId="balanced") {
  return PLAYER_HOME_PROFILES[archetypeId] ?? PLAYER_HOME_PROFILES.balanced;
}

export function createWorldState(player={}) {
  const home=getPlayerHomeProfile(player.archetypeId);
  const map=WORLD_MAPS[home.districtId];
  return {
    version:1,mode:"home",cityId:"seoul",districtId:home.districtId,
    x:map.start.x,y:map.start.y,unlockedCities:["seoul"],
    discoveredLocations:[map.locations.find(location=>location.category==="home")?.id].filter(Boolean),
    visitHistory:[],travelHistory:[],atlasView:"nationwide",
    transport:player.archetypeId==="wealthy"?"car":"walk",
    transportConfirmed:player.archetypeId==="wealthy",
    ownedVehicleId:player.archetypeId==="wealthy"?"wealthy-sedan":null
  };
}

export function migrateWorldState(value,player={}) {
  const initial=createWorldState(player);
  const source=value&&typeof value==="object"?value:{};
  const merged={...initial,...source};
  if(!WORLD_MAPS[merged.districtId])merged.districtId=initial.districtId;
  const map=WORLD_MAPS[merged.districtId];
  merged.x=clamp(merged.x,0,map.width-1);
  merged.y=clamp(merged.y,0,map.height-1);
  merged.unlockedCities=Array.isArray(merged.unlockedCities)?merged.unlockedCities:["seoul"];
  merged.discoveredLocations=Array.isArray(merged.discoveredLocations)?merged.discoveredLocations:[];
  merged.visitHistory=Array.isArray(merged.visitHistory)?merged.visitHistory:[];
  merged.travelHistory=Array.isArray(merged.travelHistory)?merged.travelHistory:[];
  merged.atlasView=WORLD_ATLAS[merged.atlasView]?merged.atlasView:"nationwide";
  if(source.transportConfirmed==null&&player.archetypeId==="wealthy"&&merged.ownedVehicleId){merged.transport="car";merged.transportConfirmed=true;}
  else merged.transportConfirmed=Boolean(merged.transportConfirmed);
  if(!TRANSPORT_OPTIONS.some(option=>option.id===merged.transport))merged.transport="walk";
  if(merged.transport==="car"&&!merged.ownedVehicleId)merged.transport="walk";
  if(!isRoadCell(map,merged.x,merged.y)){merged.x=map.start.x;merged.y=map.start.y;}
  return merged;
}

export function moveWorldPlayer(world,dx,dy,maxSteps=1) {
  const map=WORLD_MAPS[world.districtId]??WORLD_MAPS.dongsu;
  const stepX=Math.sign(Number(dx)||0),stepY=stepX?0:Math.sign(Number(dy)||0);
  let movedSteps=0;
  for(let step=0;step<Math.max(1,Math.round(maxSteps));step+=1){
    const nextX=clamp(world.x+stepX,0,map.width-1),nextY=clamp(world.y+stepY,0,map.height-1);
    if((nextX===world.x&&nextY===world.y)||!isRoadCell(map,nextX,nextY))break;
    world.x=nextX;world.y=nextY;movedSteps+=1;
  }
  return {x:world.x,y:world.y,moved:movedSteps>0,movedSteps};
}

export function selectWorldTransport(world,transportId) {
  const option=TRANSPORT_OPTIONS.find(item=>item.id===transportId);
  if(!option)return {ok:false,reason:"지원하지 않는 이동수단입니다."};
  if(option.requiresVehicle&&!world.ownedVehicleId)return {ok:false,reason:"보유한 자동차가 없습니다."};
  world.transport=option.id;world.transportConfirmed=true;
  return {ok:true,option};
}

export function travelToCity(world,cityId,homeDistrictId="dongsu") {
  const districtId=cityId==="busan"?"busan":homeDistrictId;
  const map=WORLD_MAPS[districtId];
  if(!map)return {ok:false,reason:"아직 이동할 수 없는 지역입니다."};
  world.cityId=map.cityId;world.districtId=map.id;world.x=map.start.x;world.y=map.start.y;
  world.travelHistory.push({cityId:map.cityId,districtId:map.id,transport:world.transport});
  if(world.travelHistory.length>40)world.travelHistory.shift();
  return {ok:true,map};
}

export function getNearbyLocation(world,maxDistance=1.15) {
  const map=WORLD_MAPS[world.districtId]??WORLD_MAPS.dongsu;
  return map.locations
    .map(location=>({...location,distance:Math.hypot(location.x-world.x,location.y-world.y)}))
    .filter(location=>location.distance<=maxDistance)
    .sort((a,b)=>a.distance-b.distance)[0]??null;
}

export function discoverLocation(world,locationId,day=1) {
  if(!world.discoveredLocations.includes(locationId))world.discoveredLocations.push(locationId);
  world.visitHistory.push({locationId,day});
  if(world.visitHistory.length>80)world.visitHistory.shift();
  return world;
}

export function validateWorldState(world) {
  return Boolean(world&&world.version===1&&["home","district"].includes(world.mode)&&WORLD_MAPS[world.districtId]
    &&Number.isFinite(world.x)&&Number.isFinite(world.y)&&Array.isArray(world.unlockedCities)
    &&Array.isArray(world.discoveredLocations)&&Array.isArray(world.visitHistory)&&Array.isArray(world.travelHistory)
    &&typeof world.transport==="string"&&typeof world.transportConfirmed==="boolean"&&isRoadCell(world.districtId,world.x,world.y));
}
