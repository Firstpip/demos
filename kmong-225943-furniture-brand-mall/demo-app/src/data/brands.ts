import type { Brand } from '@/lib/types'

const partnerNames: Array<{ slug: string; name: string; desc: string }> = [
  { slug: 'maholn', name: '마홀앤', desc: '거실·침실의 따뜻한 호흡을 담는 가구. 자체 브랜드, 마이크로사이트 운영.' },
  { slug: 'raonwood', name: '라온우드', desc: '국내산 원목 침대·수납을 직접 가공해 도장 마감까지 일괄 진행하는 공방형 브랜드.' },
  { slug: 'forestlab', name: '포레스트랩', desc: '북유럽풍 좌식·라운지 가구를 합리적 가격대에 구성하는 라이프스타일 브랜드.' },
  { slug: 'monodot', name: '모노닷', desc: '단정한 선과 무광 도장 마감의 모던 미니멀 가구 큐레이션.' },
  { slug: 'oakhaus', name: '오크하우스', desc: '오크·월넛 원목 다이닝과 수납에 집중하는 정통 우드 브랜드.' },
  { slug: 'softline', name: '소프트라인', desc: '리클라이너·모듈 소파 위주의 거실 컴포트 전문 브랜드.' },
  { slug: 'lenore', name: '르노어', desc: '클래식 패브릭·러그·커튼을 전문으로 하는 패브릭 인테리어 브랜드.' },
  { slug: 'studio-knot', name: '스튜디오 노트', desc: '소형 평수 맞춤 모듈 가구를 설계하는 스몰 스페이스 전문.' },
  { slug: 'havana', name: '하바나', desc: '라탄·페이퍼 코드를 활용한 핸드크래프트 다이닝·라운지.' },
  { slug: 'morning-craft', name: '모닝크래프트', desc: '아침의 햇살을 닮은 밝은 톤의 침실 가구 라인.' },
  { slug: 'kibun', name: '기분상점', desc: '데일리 잡화·트레이·플랜트 스탠드를 곁들인 라이프 셀렉트.' },
  { slug: 'fold-and', name: '폴드앤', desc: '접고 펼치는 변형 가구를 핵심으로 하는 프리미엄 가변형 브랜드.' },
  { slug: 'lumira', name: '루미라', desc: '간접 조명과 가구를 함께 큐레이션하는 라이팅 인테리어 브랜드.' },
  { slug: 'noaks', name: '노악스', desc: '솔리드 컬러 도장 가구를 전문으로 하는 컬러 캐비닛 라인.' },
  { slug: 'mossin', name: '모씬', desc: '북유럽 디자이너 협업으로 시즌마다 한 컬렉션을 출시하는 디자이너 라인.' },
  { slug: 'roundbrew', name: '라운드브루', desc: '라운드형 다이닝·티 테이블 전문, 카페 납품 경력 다수.' },
  { slug: 'pantry-craft', name: '팬트리크래프트', desc: '주방 수납·팬트리 가구 풀라인업.' },
  { slug: 'sleep-island', name: '슬립아일랜드', desc: '매트리스·프레임·헤드보드의 슬립 솔루션 패키지.' },
  { slug: 'wally-and-co', name: '왈리앤코', desc: '아동·청소년 가구 안전 인증 라인업.' },
  { slug: 'graybook', name: '그레이북', desc: '재택 사무·서재 가구에 집중하는 워크룸 전문.' },
  { slug: 'porchlight', name: '포치라이트', desc: '현관·복도·발코니 가구의 작은 공간 전문 브랜드.' },
  { slug: 'velvet-room', name: '벨벳룸', desc: '벨벳·부클레 패브릭 소파 라인의 무드 인테리어.' },
  { slug: 'mineral', name: '미네랄', desc: '석재·메탈 결합 가구의 컨템포러리 라인.' },
  { slug: 'cottonbird', name: '코튼버드', desc: '천연 패브릭과 면 소재를 활용한 키즈·패밀리 침구·가구.' },
  { slug: 'hyggehaus', name: '휘게하우스', desc: '아늑한 휘게 무드의 라운지·러그·조명 통합 코디.' },
  { slug: 'wagle', name: '와글', desc: '컬러풀한 1~2인 가구를 큐레이션하는 영 라인.' },
  { slug: 'cobalt-and', name: '코발트앤', desc: '메탈 프레임을 베이스로 한 인더스트리얼 모던 라인.' },
  { slug: 'kerf', name: '커프', desc: '하드우드 도마·키친웨어와 미니 가구의 부엌 셀렉트.' },
  { slug: 'pinemoon', name: '파인문', desc: '소나무 원목·라이트 톤의 부드러운 침실 라인.' },
  { slug: 'archline', name: '아치라인', desc: '아치 모티프 가구·미러·헤드보드 시그니처 라인.' },
]

export const brands: Brand[] = partnerNames.map((p, i) => ({
  id: `brand-${p.slug}`,
  slug: p.slug,
  name: p.name,
  isMicrosite: p.slug === 'maholn',
  description: p.desc,
  primaryColor: i === 0 ? '#1F1E1B' : ['#5C4632', '#7A6A4F', '#3F3A33', '#A89272'][i % 4],
  logoLetter: p.name.charAt(0),
  partnerUserIds: i < 4 ? [`user-partner-${i + 1}`] : [],
}))

export function brandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug)
}

export function brandById(id: string): Brand | undefined {
  return brands.find((b) => b.id === id)
}
