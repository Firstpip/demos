// Unsplash photo IDs (Unsplash License: 상업 사용 OK, attribution 자율).
// 카테고리별 풀. ID 형식은 long format(photo-{14자리}-{12자리 hex}). fetch-images.js가 이 파일을
// 읽어 https://images.unsplash.com/{id}?w=800&q=80&fm=jpg에서 다운로드 후 public/images/{id}.jpg에 저장.

export const sofa = [
  '1555041469-a586c61ea9bc','1634712282287-14ed57b9cc89','1567016432779-094069958ea5',
  '1493663284031-b7e3aefcae8e','1512212621149-107ffe572d2f','1573866926487-a1865558a9cf',
  '1550581190-9c1c48d21d6c','1684165610413-2401399e0e59','1630585308572-f53438fc684f',
  '1698936061086-2bf99c7b9fc5','1519961655809-34fa156820ff','1506898667547-42e22a46e125',
  '1484101403633-562f891dc89a','1691480152351-4b3f2c89ccff','1590251024078-8a6d9f90b02d',
] as const

export const dining = [
  '1604578762246-41134e37f9cc','1657524398377-567034729507','1600623050499-84929aad17c9',
  '1505409628601-edc9af17fda6','1602872030490-4a484a7b3ba6','1615066390971-03e4e1c36ddf',
  '1583845112239-97ef1341b271','1636138388621-258a72ecb07e','1616486886892-ff366aa67ba4',
  '1617806118233-18e1de247200',
] as const

export const bed = [
  '1635594202056-9ea3b497e5c0','1532344214108-1b6d425db572','1560184897-502a475f7a0d',
  '1698517486200-e89403ea2738','1631048501786-4e97f20eac71','1517862774645-dd398fbfaffa',
  '1644057501622-dfa7dd26dbfb','1560185128-e173042f79dd','1560448205-4d9b3e6bb6db',
  '1505692952047-1a78307da8f2','1623944431758-e856760d7b65','1635321349302-f91724057317',
  '1678978866819-306ed8608e7f','1718894071528-1108a094cc78','1743748978909-169017ab0720',
] as const

export const wardrobe = [
  '1558997519-83ea9252edf8','1600422086908-72be2c8f5f3f',
  '1722942626414-5775702d7a08','1739293122621-b7ac3358856b',
  '1599703678443-4fdafa9e1d0a','1760623665223-18c771249e11','1775595224305-cf7d4487123d','1769690398694-9c5d5ca4b4ea','1565348395196-6472cb6c052b',
  '1721044169106-44c1f9db892d','1722942116259-3da41d2f7afc','1544691560-fc2053d97726',
  '1747497057134-98da149e5c30','1613377739958-76c13ca6bff3','1738606408361-cccefd8aed01',
  ] as const

export const bookshelf = [
  '1699443817739-cf2f7cbcd18d','1543248939-4296e1fea89b','1593430980369-68efc5a5eb34',
  '1521587760476-6c12a4b040da','1545696648-86c761bc5410','1603058817990-2b9a9abbce86',
] as const

export const desk = [
  '1506968430777-bf7784a87f23','1519219788971-8d9797e0928e',
  '1495195129352-aeb325a55b65','1611269154421-4e27233ac5c7',
  '1437419764061-2473afe69fc2','1499750310107-5fef28a66643','1597072689227-8882273e8f6a',
  '1517757910079-f57fd7f49a91','1598016677484-ad34c3fd766e',
  '1594580701468-e5678582b8ce','1736281512973-d17ef05f9709',
  '1620275765334-4ed948bb4502','1596025591889-5e1e35729485',
  '1693391399801-c20ffcb149c9','1679309981674-cef0e23a7864',
] as const

export const interior = [
  '1618221195710-dd6b41faaea6','1586023492125-27b2c045efd7',
  '1618220179428-22790b461013','1606744837616-56c9a5c6a6eb',
  '1616046229478-9901c5536a45','1564078516393-cf04bd966897','1606744824163-985d376605aa',
  '1606744888344-493238951221','1567016376408-0226e4d0c1ea',
  '1618219908412-a29a1bb7b86e','1622372738946-62e02505feb3','1664711942326-2c3351e215e6','1583847268964-b28dc8f51f92','1502005097973-6a7082348e28',
  '1503174971373-b1f69850bded',] as const

export const decor = [
  '1572048572872-2394404cf1f3','1615873968403-89e068629265','1615874694520-474822394e73',
  '1582131503261-fca1d1c0589f','1616486338812-3dadae4b4ace','1628152371231-936cf45eb8f3',
  '1667312939978-64cf31718a6e','1617103996702-96ff29b1c467','1615876234886-fd9a39fda97f',
  '1534349762230-e0cadf78f5da','1617806265182-7b3f847f0b75','1623244307563-f9ade3df13c0',
] as const

export const rug = [
  '1745905308908-25f35bacd146','1644977624606-4f7dc0093e7e','1752568583323-92145f90e6a8',
  '1765802536365-e2267a489a2c','1766405831946-2b7f1653ed8f','1608724552874-cd6b9b751f92',
  '1646092646509-ae149674f158','1608724552908-e1c141f631ac','1761639502675-442d396c516f',
  '1561578428-5d58d0d965ec','1608724553456-89e963624dbb','1768218983339-0415a4ca932d',
  '1608724553030-3987f116039e','1762012751357-c3eba1d494e8','1608724553307-9c0dddb3100a',
] as const

export const lamp = [
  '1673939859210-23d8444237ff','1675767528117-963ce219b52a','1675767528183-628d7e46ae59',
  '1607809714110-e34f71c7b2ed','1606425288528-4cebbfc69de7','1688918511009-0b3992e6b020',
  '1646107543597-e95b90ba4081','1638189311070-d4e5dcc86902','1718049720099-a035f05e539a',
  '1560448204-603b3fc33ddc','1685302874389-ed7790984a2e','1513694203232-719a280e022f',
  '1566386429501-fe1523f35f40','1743578666060-49a1747d61df',
] as const

export const bench = [
  '1640480462673-c7c330cfcee9','1571339797354-88c2cdaa5b32','1691927825312-10a278001100',
  '1585206031665-6717320858ff','1559930906-99235d1818eb','1715085961714-46ef18eb0776',
  '1573493334464-21388936965a','1536531107343-511c36068c0e','1643323151268-f6887cfeffb0',
  '1735559523880-ba9ee28c4b03','1632491277096-e1dd41e5a298','1669375716110-c24d162b2384',
  '1669375716091-469a857491fd','1599710244595-dbd9e4f82f74','1723444535388-8c4682a9cef3',
] as const

export const plant = [
  '1599009944474-5bc0ff20db85','1599009944997-3544a939813c','1575805501150-e064fbd815dd',
  '1656274769090-da61a871beb5','1536057734857-b8b41f2027bc','1778472259927-74bab16a5a71',
  '1592248108455-973f0c81750d','1597672583947-535985083fbc','1632154451420-4692c397a6b5',
  '1746487836248-c35a923b43a5','1771795638782-1f79110b7aba','1766751447949-e33036ab09d6',
  '1760175763630-2fc98d66510d','1629189575569-dfcf066e42eb','1607719924554-a380ca547006',
] as const

// 시각 라벨링 결과 부적합 ID — 모든 풀에서 제외
// - bench 풀 15장 전부: 야외 공원 벤치(가구몰 데모에 부적합)
// - 1599703678443: 의류 정물(서랍장 위 잡화·화병)
// - 1506968430777: wood texture 추상 클로즈업(가구 아님)
export const EXCLUDE_IDS = new Set<string>([
  '1640480462673-c7c330cfcee9','1571339797354-88c2cdaa5b32','1691927825312-10a278001100',
  '1585206031665-6717320858ff','1559930906-99235d1818eb','1715085961714-46ef18eb0776',
  '1573493334464-21388936965a','1536531107343-511c36068c0e','1643323151268-f6887cfeffb0',
  '1735559523880-ba9ee28c4b03','1632491277096-e1dd41e5a298','1669375716110-c24d162b2384',
  '1669375716091-469a857491fd','1599710244595-dbd9e4f82f74','1723444535388-8c4682a9cef3',
  '1599703678443-4fdafa9e1d0a',
  '1506968430777-bf7784a87f23',
])

function clean(pool: readonly string[]): string[] {
  return pool.filter((id) => !EXCLUDE_IDS.has(id))
}

export const all = [...sofa, ...dining, ...bed, ...wardrobe, ...bookshelf, ...desk, ...interior, ...decor]
export const unique = Array.from(new Set(all))

// 카테고리(가구몰 분류) → 사진 풀 매핑. 거실은 sofa+interior 일부, 학생은 desk+bookshelf 등.
export const POOL_BY_CATEGORY: Record<string, readonly string[]> = {
  '거실': clean([...sofa, ...interior.slice(0, 5)]),
  '침실': clean([...bed, ...wardrobe.slice(0, 5)]),
  '주방': clean([...dining, ...decor.slice(0, 3)]),
  '수납': clean([...wardrobe.slice(5), ...bookshelf]),
  '사무용': clean([...desk]),
  '학생': clean([...desk.slice(10), ...bookshelf, ...decor.slice(3, 5), ...bed.slice(0, 4)]),
}

export const POOL_INTERIOR = clean([...interior, ...decor])

// 시각 라벨링 결과(94장 직접 확인) — sofa 풀 안 혼합 사진 분리
// 1634712282287 파란 암체어+플로어램프 / 1684165610413 부클레 1인 암체어 / 1506898667547 회색 1인 암체어 / 1519961655809 둥근 데이베드
const SOFA_ARMCHAIRS_AND_DAYBED = [
  '1634712282287-14ed57b9cc89',
  '1684165610413-2401399e0e59',
  '1506898667547-42e22a46e125',
  '1519961655809-34fa156820ff',
]
const SOFA_REAL = sofa.filter((id) => !SOFA_ARMCHAIRS_AND_DAYBED.includes(id))

// 서브카테고리 풀 — buildProduct seed별 라운드로빈으로 sub 도메인 매칭 (EXCLUDE 적용)
export const SUB_LIVING_SOFA = clean([...SOFA_REAL])
export const SUB_LIVING_DECOR = clean([...SOFA_ARMCHAIRS_AND_DAYBED, ...interior, ...decor])
export const SUB_BED = clean([...bed])
export const SUB_WARDROBE = clean([...wardrobe])
export const SUB_DINING = clean([...dining])
export const SUB_KITCHEN_STORAGE = clean([...dining.slice(0, 3), ...decor, ...wardrobe.slice(0, 4)])
export const SUB_STORAGE = clean([...bookshelf, ...wardrobe])
export const SUB_DESK = clean([...desk])
export const SUB_STUDENT = clean([...desk.slice(0, 8), ...bookshelf, ...bed.slice(0, 4)])

// 가구몰 sub 한글 라벨 → 풀 매핑
export const SUB_POOL: Record<string, readonly string[]> = {
  '거실장': SUB_LIVING_SOFA,
  '장식장': SUB_LIVING_DECOR,
  '침대': SUB_BED,
  '매트리스': SUB_BED,
  '협탁': SUB_WARDROBE,
  '화장대': SUB_WARDROBE,
  '서랍장': SUB_WARDROBE,
  '장롱': SUB_WARDROBE,
  '식탁 테이블': SUB_DINING,
  '렌지대': SUB_DINING,
  '불판 테이블': SUB_DINING,
  '주방 수납장': SUB_KITCHEN_STORAGE,
  '책장': SUB_STORAGE,
  '책상': SUB_DESK,
  '주니어': SUB_STUDENT,
}

// 컬렉션 slug → 풀 (SOFA_REAL 사용해 컬렉션 hero에 정확한 소파 사진)
export const COLLECTION_POOL: Record<string, readonly string[]> = {
  'warm-living-26ss': [...SOFA_REAL, ...interior.slice(0, 5)],
  'soft-comfort-26ss': [...SOFA_REAL, ...decor],
  'studio-compact-26ss': [...desk, ...bookshelf, ...interior.slice(0, 3)],
  'heritage-oak-26ss': [...dining, ...interior.slice(0, 3)],
  'family-calm-26ss': [...bed, ...interior.slice(0, 3)],
  'modern-line-26ss': [...interior, ...decor.slice(0, 4)],
  'autumn-wood-26fw': [...SOFA_REAL, ...interior.slice(0, 5)],
  'cozy-bedroom-26fw': [...bed, ...decor.slice(0, 4)],
  'workhome-26fw': [...desk, ...interior.slice(0, 3)],
  'rattan-summer-evergreen': [...dining, ...decor.slice(0, 4)],
  'small-corner-evergreen': [...desk.slice(0, 6), ...bookshelf, ...decor.slice(0, 4)],
  'chefs-kitchen-evergreen': [...dining, ...decor],
}

// 룩북 slug → 풀
export const LOOKBOOK_POOL: Record<string, readonly string[]> = {
  '2026-spring': [...SOFA_REAL, ...interior.slice(0, 4)],
  '2025-archive': [...SOFA_REAL, ...bed.slice(0, 4)],
  'bedroom-collection': [...bed, ...interior.slice(0, 4)],
  'small-spaces': [...desk, ...bookshelf, ...interior.slice(0, 3)],
}

// 콘텐츠 모듈 type → 풀
export const MODULE_POOL_BY_TYPE: Record<string, readonly string[]> = {
  'lookbook-card': [...interior, ...sofa.slice(0, 5)],
  'banner': [...decor, ...interior.slice(0, 4)],
  'story': [...interior, ...decor.slice(0, 4)],
  'review-quote': [...interior.slice(0, 8), ...decor.slice(0, 6)],
}
