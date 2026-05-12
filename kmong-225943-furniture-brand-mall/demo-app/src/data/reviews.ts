import type { Review, QnA } from '@/lib/types'
import { products } from './products'
import { users } from './users'

const memberUsers = users.filter((u) => u.role === 'member')

const reviewBodies: Array<{ body: string; rating: 1 | 2 | 3 | 4 | 5 }> = [
  { body: '거실에 두자마자 분위기가 정돈되는 느낌입니다. 오크 톤이 사진보다 훨씬 따뜻하고, 주변 가구와 결이 자연스럽게 이어집니다. 조립도 30분 내외로 끝났고 도장 마감이 매끈해서 만족합니다.', rating: 5 },
  { body: '가격대가 있는 만큼 마감 디테일이 정말 꼼꼼합니다. 모서리 가공, 도장 두께, 결의 일관성 모두 좋아요. 두께감 있는 천연 소재라 시간이 지나도 결이 깊어질 것 같습니다.', rating: 5 },
  { body: '배송 예약일 정확히 맞춰서 도착했고 설치 기사님 친절하셨어요. 다만 모서리 한 곳에 미세한 흠이 있어서 별 하나 뺍니다. CS는 빠르게 응대해 주셨습니다.', rating: 4 },
  { body: '집들이용으로 미리 사뒀는데 사진 그대로의 색감이라 안심했습니다. 패브릭 부분은 약간 더 부드럽고, 견고함은 가구 무게로 충분히 느껴집니다.', rating: 5 },
  { body: '소재가 광고대로 천연이고, 살짝 결의 차이가 있는 부분이 오히려 마음에 듭니다. 청소가 조금 까다로운 편이라 관리 안내문을 한 번 더 읽었습니다.', rating: 4 },
  { body: '디자인은 마음에 드는데 색상이 조금 더 어두워서 별 4개. 실내 조명에 따라 차이가 큰 편이라 사이트의 색상 안내 좀 더 풍부했으면 좋겠어요.', rating: 4 },
  { body: '재구매입니다. 같은 시리즈로 두 점 들였는데 결이 정확히 맞아서 한 호흡으로 보입니다. 시즌별 컬렉션을 한 자리에 묶어주는 점이 큰 장점.', rating: 5 },
  { body: '소재의 단단함은 좋은데 무게가 상당해서 혼자 옮기긴 어렵습니다. 설치 후에는 만족도가 높아요.', rating: 4 },
  { body: '패키징도 깔끔하고 보호재가 충분히 들어 있었습니다. 생활 흠집 방지용 캡까지 함께 와서 친절했어요.', rating: 5 },
  { body: '이전에 사용하던 가구와 결이 너무 잘 어울려서 놀랐습니다. 큐레이션이 일관되어 있다는 게 이 브랜드의 가장 큰 매력 같아요.', rating: 5 },
  { body: '배송이 약간 지연됐는데 자동으로 적립금이 5,000원 들어와서 별도로 클레임 걸 일이 없었습니다. 이런 운영 방식 좋습니다.', rating: 5 },
  { body: '조립 안내문이 그림 위주라 처음 가구 조립하는 사람도 어렵지 않을 것 같아요.', rating: 4 },
]

function rngRating(seed: number): 1 | 2 | 3 | 4 | 5 {
  const r = (seed * 7) % 100
  if (r < 5) return 1
  if (r < 10) return 2
  if (r < 20) return 3
  if (r < 50) return 4
  return 5
}

export const reviews: Review[] = (() => {
  const out: Review[] = []
  let counter = 0
  products.forEach((p) => {
    const targetCount = 4 + ((p.id.length * 3) % 6)
    for (let i = 0; i < targetCount; i++) {
      counter += 1
      const seed = counter
      const sample = reviewBodies[seed % reviewBodies.length]
      const ratingOverride = i % 4 === 0 ? rngRating(seed) : sample.rating
      const user = memberUsers[seed % memberUsers.length]
      const day = (seed * 11) % 60
      const date = new Date(Date.UTC(2026, 4, 11) - day * 86400 * 1000)
      out.push({
        id: `rv-${counter}`,
        productId: p.id,
        userId: user.id,
        rating: ratingOverride,
        body: sample.body,
        hasPhoto: seed % 3 === 0,
        createdAt: date.toISOString(),
        helpfulCount: (seed * 3) % 27,
      })
    }
  })
  return out
})()

export function reviewsByProduct(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId)
}

const qnaSeeds: Array<{ q: string; a?: string }> = [
  { q: '대형 가구인데 무료 배송·설치가 가능한가요?', a: '서울·경기 지역은 무료 설치 포함입니다. 그 외 지역은 도착 후 셀프 조립 안내문이 동봉되며, 설치비는 권역별로 4~10만원이 별도 산정됩니다.' },
  { q: '천연 원목과 엔지니어드 우드의 차이가 궁금합니다.', a: '천연 원목은 결의 자연스러운 변화가 매력이지만 습도 변화에 더 민감합니다. 엔지니어드 우드는 형태 안정성이 우수하고 가격대가 합리적입니다. 사용 환경에 따라 추천 드립니다.' },
  { q: '컬러 옵션 사진과 실제 색이 차이 나면 어떻게 하나요?', a: '도착 후 7일 이내 미사용 상태에서 단순 변심 환불이 가능합니다. 회수 운반비는 권역에 따라 4~10만원이 발생합니다.' },
  { q: '배송일 지정이 가능한가요?', a: '결제 단계에서 원하는 배송 예약일을 선택할 수 있습니다. 가구 특성상 ±2일 여유를 두고 잡으시는 것을 권장합니다. 예약일을 초과하면 자동 보상이 지급됩니다.' },
  { q: '결제 후 옵션 변경이 가능한가요?', a: '주문 상태가 결제 완료 또는 배송 준비 중일 때만 가능합니다. 배송 시작 후에는 환불 절차로 처리됩니다.' },
  { q: '같은 컬렉션 안에서 다른 가구도 추천해 주세요.', a: '상세 페이지 하단의 "이 컬렉션의 다른 가구" 모듈에서 같은 시리즈의 4점, 같은 브랜드의 4점이 자동으로 큐레이션됩니다.' },
]

export const qna: QnA[] = (() => {
  const out: QnA[] = []
  let counter = 0
  products.forEach((p) => {
    const targetCount = 3
    for (let i = 0; i < targetCount; i++) {
      counter += 1
      const sample = qnaSeeds[counter % qnaSeeds.length]
      const day = (counter * 13) % 50
      const askedAt = new Date(Date.UTC(2026, 4, 11) - day * 86400 * 1000).toISOString()
      const answered = counter % 5 !== 0
      out.push({
        id: `qa-${counter}`,
        productId: p.id,
        question: sample.q,
        answer: answered ? sample.a : undefined,
        askedAt,
        answeredAt: answered ? new Date(Date.UTC(2026, 4, 11) - (day - 1) * 86400 * 1000).toISOString() : undefined,
      })
    }
  })
  return out
})()

export function qnaByProduct(productId: string): QnA[] {
  return qna.filter((q) => q.productId === productId)
}
