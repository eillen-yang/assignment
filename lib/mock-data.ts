export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  category: string;
}

export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Next.js 15에서 달라진 점",
    content:
      "Next.js 15에서는 많은 변화가 있었습니다. 가장 큰 변화 중 하나는 App Router의 안정화입니다. 이제 App Router를 사용하면 더욱 직관적인 라우팅 시스템을 구현할 수 있습니다. 또한 Server Components의 도입으로 서버 사이드 렌더링이 더욱 효율적으로 이루어집니다.",
    author: "김개발",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    views: 234,
    category: "기술",
  },
  {
    id: "2",
    title: "효율적인 상태 관리 방법론",
    content:
      "React에서 상태 관리는 항상 중요한 주제입니다. Redux, Zustand, Jotai 등 다양한 라이브러리가 있지만, 프로젝트의 규모와 요구사항에 맞는 도구를 선택하는 것이 중요합니다. 이 글에서는 각 상태 관리 라이브러리의 장단점을 비교해보겠습니다.",
    author: "이프론트",
    createdAt: "2024-01-14",
    updatedAt: "2024-01-14",
    views: 189,
    category: "기술",
  },
  {
    id: "3",
    title: "TypeScript 5.0 새로운 기능",
    content:
      "TypeScript 5.0에서는 데코레이터가 정식으로 지원되고, const type parameters, satisfies 연산자 등 새로운 기능들이 추가되었습니다. 이번 업데이트는 타입 안정성을 더욱 강화하고 개발자 경험을 개선하는 데 초점을 맞추고 있습니다.",
    author: "박타입",
    createdAt: "2024-01-13",
    updatedAt: "2024-01-13",
    views: 312,
    category: "기술",
  },
  {
    id: "4",
    title: "주간 회의록 - 1월 2주차",
    content:
      "이번 주 회의에서는 다음 분기 프로젝트 계획과 팀원 역할 분담에 대해 논의했습니다. 새로운 기능 개발과 기존 코드 리팩토링을 병행하기로 결정했습니다. 자세한 내용은 아래를 참고해주세요.",
    author: "최매니저",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
    views: 56,
    category: "공지",
  },
  {
    id: "5",
    title: "CSS Grid vs Flexbox 실전 활용",
    content:
      "CSS Grid와 Flexbox는 각각의 장점이 있습니다. Grid는 2차원 레이아웃에, Flexbox는 1차원 레이아웃에 적합합니다. 실제 프로젝트에서 두 기술을 어떻게 조합해서 사용할 수 있는지 예제와 함께 알아보겠습니다.",
    author: "정스타일",
    createdAt: "2024-01-11",
    updatedAt: "2024-01-11",
    views: 145,
    category: "기술",
  },
  {
    id: "6",
    title: "신입 개발자 온보딩 가이드",
    content:
      "우리 팀에 새로 합류하신 분들을 위한 온보딩 가이드입니다. 개발 환경 설정, 코드 컨벤션, Git 워크플로우 등 필요한 정보를 정리했습니다. 궁금한 점이 있으면 언제든지 질문해주세요.",
    author: "최매니저",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
    views: 87,
    category: "공지",
  },
  {
    id: "7",
    title: "API 설계 베스트 프랙티스",
    content:
      "RESTful API를 설계할 때 고려해야 할 사항들을 정리했습니다. URL 구조, HTTP 메서드 활용, 에러 처리, 버전 관리 등 실무에서 자주 마주치는 문제들과 해결 방법을 다룹니다.",
    author: "김백엔드",
    createdAt: "2024-01-09",
    updatedAt: "2024-01-09",
    views: 201,
    category: "기술",
  },
  {
    id: "8",
    title: "개발팀 회식 안내",
    content:
      "이번 달 회식이 1월 25일 금요일 저녁 7시에 예정되어 있습니다. 장소는 강남역 근처 한식당입니다. 참석 여부를 1월 20일까지 알려주세요.",
    author: "최매니저",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-08",
    views: 42,
    category: "공지",
  },
  {
    id: "9",
    title: "React 19 Preview 살펴보기",
    content:
      "React 19 Preview가 공개되었습니다. 새로운 use hook, Server Components 개선, 그리고 다양한 성능 최적화가 포함되어 있습니다. 이번 글에서는 주요 변경사항을 살펴보겠습니다.",
    author: "이프론트",
    createdAt: "2024-01-07",
    updatedAt: "2024-01-07",
    views: 278,
    category: "기술",
  },
  {
    id: "10",
    title: "테스트 코드 작성의 중요성",
    content:
      "많은 개발자들이 테스트 코드 작성을 귀찮아하지만, 장기적으로 보면 테스트 코드가 있는 것이 훨씬 효율적입니다. 단위 테스트, 통합 테스트, E2E 테스트의 차이점과 각각 언제 사용해야 하는지 알아보겠습니다.",
    author: "박테스트",
    createdAt: "2024-01-06",
    updatedAt: "2024-01-06",
    views: 167,
    category: "기술",
  },
  {
    id: "11",
    title: "데이터베이스 최적화 기법",
    content:
      "데이터베이스 쿼리 성능을 개선하는 다양한 방법들을 소개합니다. 인덱스 최적화, 쿼리 분석, 캐싱 전략 등 실제 프로젝트에서 적용할 수 있는 기법들을 다룹니다.",
    author: "김백엔드",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
    views: 223,
    category: "기술",
  },
  {
    id: "12",
    title: "2024년 기술 트렌드 전망",
    content:
      "2024년에 주목해야 할 기술 트렌드를 정리했습니다. AI/ML의 발전, 엣지 컴퓨팅, 서버리스 아키텍처 등 개발자로서 알아야 할 주요 트렌드를 살펴보겠습니다.",
    author: "이프론트",
    createdAt: "2024-01-04",
    updatedAt: "2024-01-04",
    views: 345,
    category: "일반",
  },
];
