import {
  AudioTrack,
  CurriculumCourse,
  Post,
  ProducerCredit,
  SeoConfig,
  SiteContent,
  ThemeConfig,
  ConsultationInquiry
} from '../types';

export const INITIAL_THEME: ThemeConfig = {
  backgroundColor: '#0a0a0a',
  cardColor: '#121212',
  accentColor: '#ffffff',
  textColor: '#f5f5f5',
  mutedTextColor: '#a3a3a3',
  borderColor: 'rgba(255, 255, 255, 0.1)',
  fontFamily: 'sans',
};

export const INITIAL_SITE_CONTENT: SiteContent = {
  studioName: '제이지뮤직스튜디오',
  studioSubName: 'JG MUSIC STUDIO',
  heroHeadline: 'MAKE YOUR OWN MUSIC',
  heroSubheadline: '음악적 아이디어를 하나의 완성된 작품으로\n작곡부터 편곡, 프로듀싱까지 함께합니다.',
  heroHighlightBadge: '',
  producerName: '장성민 (JG Producer)',
  producerRole: 'Head Producer & Music Director',
  producerBio: '버클리 음악대학 작곡과(Contemporary Writing and Production)를 졸업하고 국내 유수 기획사와의 협업 및 드라마 OST, K-POP 타이틀곡 편곡에 참여해 온 현업 프로듀서입니다. 단순한 기능 전달을 넘어, 머릿속의 멜로디가 실제 스트리밍 플랫폼에서 통하는 상업용 사운드로 완성되는 전 과정을 직접 전수합니다.',
  producerQuote: '"음악을 만드는 기술은 배울 수 있습니다. 중요한 건 본인만의 고유한 사운드 시그니처를 찾는 것입니다."',
  studioPhilosophy: '상업 음원의 핵심은 단단한 저음과 명료한 중고역, 그리고 끝까지 듣게 만드는 편곡의 드라마입니다. 제이지뮤직스튜디오는 홈레코딩의 한계를 넘어 실제 스튜디오 릴리즈 표준을 체득할 수 있도록 철저한 1:1 맞춤형 피드백을 제공합니다.',
  studioEquipment: [
    'Genelec 8341A SAM Studio Monitors + GLM 4.2 Room Calibration',
    'Universal Audio Apollo Twin X Duo Heritage Edition',
    'Native Instruments Komplete Kontrol S88 MK2',
    'Moog Subsequent 37 Analog Synthesizer',
    'Neumann U87 Ai Studio Microphone',
    'Cubase Pro 13, Spectrasonics Omnisphere, FabFilter Pro Bundle, UAD Plugins'
  ],
  contactPhone: '050-71348-0425',
  contactEmail: 'jg_musicstudio@naver.com',
  kakaoId: '채널 : 제이지뮤직스튜디오',
  studioAddress: '경기도 수원시 권선구 호매실동 407 202호 (제이지뮤직스튜디오)',
  transitInfo: '사전 예약 필수',
  instagramUrl: 'https://www.instagram.com/jg.musicstudio/',
  youtubeUrl: 'https://youtube.com/@jzmusicstudio',
  soundcloudUrl: 'https://soundcloud.com/jz_musicstudio',
};

export const INITIAL_PRODUCER_CREDITS: ProducerCredit[] = [
  {
    year: '2025',
    title: '미니 3집 타이틀곡 편곡 및 스트링 편곡',
    role: 'Arranger & Synth Programmer',
    artistOrProject: 'K-POP 걸그룹 메이저 앨범 (멜론 TOP 50 진입)',
  },
  {
    year: '2024',
    title: 'tvN 금토 드라마 메인 테마 OST 작/편곡',
    role: 'Composer, Arranger & Mixing',
    artistOrProject: '드라마 오리지널 사운드트랙 발매',
  },
  {
    year: '2023',
    title: '싱글 [Midnight Waves] 전곡 프로듀싱',
    role: 'Producer & Mixing Engineer',
    artistOrProject: 'R&B 아티스트 앨범 프로덕션',
  },
  {
    year: '2022',
    title: '글로벌 게임사 시네마틱 트레일러 오디오 디렉팅',
    role: 'Music Director',
    artistOrProject: 'AAA급 모바일 RPG 게임 사운드트랙',
  },
  {
    year: '2021',
    title: '수강생 데뷔 앨범 14곡 스트리밍 유통 및 믹스 코칭',
    role: 'Executive Mentor',
    artistOrProject: '제이지 스튜디오 아티스트 인큐베이팅',
  },
];

export const INITIAL_CURRICULUM: CurriculumCourse[] = [
  {
    id: 'course-basic',
    level: '기초 입문',
    name: '큐베이스 & 미디 비트메이킹 기초',
    targetAudience: '음악을 처음 시작하거나 DAW 조작이 낯선 비전공자 및 취미 작곡가',
    duration: '4주 (주 1회, 회당 90분)',
    sessionsPerWeek: '주 1회 1:1 맞춤',
    description: '큐베이스 인터페이스 완전 정복부터 필수 미디 에디팅, 기본 드럼 시퀀싱 및 8마디 루프 빌드업까지 막힘없이 완성합니다.',
    keyPoints: [
      'Cubase Pro 세팅 및 오디오 인터페이스 레이턴시 최적화',
      '드럼 비트 프로그래밍 (Kick, Snare, Hi-hat 그루브의 이해)',
      '필수 가상악기(VSTi) 탐색 및 피아노 롤 노트 입력법',
      '기초 코드 진행과 베이스라인 매칭 원리 실습'
    ],
    recommendedDaw: 'Steinberg Cubase 12 / 13 Pro',
    syllabus: [
      { week: 1, title: 'DAW 환경 세팅 & 오디오 루프 기초', topics: ['단축키 설정', '오디오 엔진 설정', '루프 샘플 가공과 템포 매칭'] },
      { week: 2, title: '미디 에디팅 & 드럼 프로그래밍', topics: ['벨로시티 다이내믹스', '스윙과 퀀타이즈', '장르별 드럼 패턴 제작'] },
      { week: 3, title: '코드와 베이스라인 기초', topics: ['3화음 & 7화음 실전 보이싱', '루트 모션과 808 베이스 연동'] },
      { week: 4, title: '첫 8마디 완성 트랙 크리틱', topics: ['간단한 오토메이션', '익스포트(Export) 설정', '1:1 디렉팅'] }
    ]
  },
  {
    id: 'course-intermediate',
    level: '정규 실전',
    name: '프로페셔널 작편곡 & 사운드 디자인',
    targetAudience: '루프는 만들지만 완곡 편곡이 어렵거나 사운드가 얇아 고민인 분',
    duration: '12주 (주 1회, 회당 90분)',
    sessionsPerWeek: '주 1회 1:1 맞춤',
    description: 'A-B-C 완곡 구조 설계, K-Pop/R&B/Lo-fi 장르별 편곡 문법, 세럼(Serum) 신스 디자인 및 믹싱 테크닉을 체득합니다.',
    keyPoints: [
      '도입부부터 드랍(Drop)/싸비(Hook)까지 긴장감을 유지하는 편곡 기법',
      'Serum / Vital 기반 리드, 패드, 플럭 사운드 직접 디자인',
      '보컬 튠(VariAudio/Melodyne) 및 공간계(Reverb, Delay) 레이어링',
      'EQ, 컴프레서, 사이드체인을 활용한 상업 음원 레벨 밸런싱'
    ],
    recommendedDaw: 'Steinberg Cubase 13 Pro',
    isPopular: true,
    syllabus: [
      { week: 1, title: '상업 음악 편곡 구조 분석', topics: ['레퍼런스 트랙 해체', '송폼(Songform) 설계', '트랙 에너지 분배'] },
      { week: 2, title: '장르별 텐션 코드 & 모달 인터체인지', topics: ['K-Pop/Neo-Soul 텐션 보이싱', '세컨더리 도미넌트 활용'] },
      { week: 3, title: '신디사이저 사운드 디자인 기초', topics: ['오실레이터, 필터, LFO 모듈레이션', 'Serum 패치 직접 만들기'] },
      { week: 4, title: '트랜지션 & FX 사운드 메이킹', topics: ['화이트노이즈 라이저', '드럼 필인', '임팩트 효과음 배치'] },
      { week: 5, title: '보컬 레코딩 & 정밀 피치 튜닝', topics: ['VariAudio 튜닝', '타이밍 보정', '배킹 보컬 하모니 레이어'] },
      { week: 6, title: '중간 점검: 1차 데모 트랙 크리틱', topics: ['트랙 솎아내기', '공간 분리감 사전 체크'] },
      { week: 7, title: '로우엔드(Kick & Bass) 분리 테크닉', topics: ['사이드체인 더킹', '페이즈 위상 일치', '모노 베이스 관리'] },
      { week: 8, title: '공간계 이펙터의 미학', topics: ['Send/Return 리버브 뎁스 설계', '스테레오 이미저 활용법'] },
      { week: 9, title: '컴프레서 심화 & 다이내믹 제어', topics: ['VCA vs Opto vs FET', '패러럴 컴프레션 기법'] },
      { week: 10, title: '버스 프로세싱 & 믹스 버스 체인', topics: ['글루(Glue) 컴프레션', '토널 밸런스 점검'] },
      { week: 11, title: '상업 음원 타겟 마스터링', topics: ['LUFS 라우드니스 전쟁 극복', 'True Peak 리미터 제어'] },
      { week: 12, title: '최종 음원 완성 & 포트폴리오 리뷰', topics: ['스마트폰/모니터/이어폰 교차 청음', '피칭용 스펙 완성'] }
    ]
  },
  {
    id: 'course-master',
    level: '프로 데뷔 / 입시',
    name: '아티스트 음원 릴리즈 & 프로 데뷔 코스',
    targetAudience: '공식 음원 발매(스포티파이, 멜론), 실용음악과 입시 또는 프로 작곡가 데뷔를 목표로 하는 분',
    duration: '16주 집중 (주 1회, 회당 120분)',
    sessionsPerWeek: '주 1회 심화 1:1',
    description: '기획사 송캠프 리드 시트 기준 작업, 레이블 유통사 계약 피칭, 프로급 믹스/마스터링 완성을 원스톱으로 지원합니다.',
    keyPoints: [
      '실제 기획사 리드 시트 기반의 1:1 공동 프로덕션',
      '전문 믹싱/마스터링 엔지니어 관점의 파이널라이징',
      '국내외 음원 유통사(디스트로키드, 포크라노스 등) 심사 통과 가이드',
      '실용음악과 작곡 전공 실기 시험 자작곡 완벽 대비'
    ],
    recommendedDaw: 'Steinberg Cubase 13 Pro',
    syllabus: [
      { week: 1, title: '아티스트 아이덴티티 및 장르 타겟팅', topics: ['시장 분석', '대표곡 기획서 작성'] },
      { week: 4, title: '데모 트랙 빌드업 & 탑라인 협업', topics: ['멜로디 가이드', '악기 오케스트레이션'] },
      { week: 8, title: '세션 레코딩 디렉팅 및 믹스 다운', topics: ['기타/보컬 디렉팅 노하우', '스템(Stems) 정리'] },
      { week: 12, title: '마스터링 & 스트리밍 플랫폼 규격 검수', topics: ['Apple Digital Masters 규격', '메타데이터 태깅'] },
      { week: 16, title: '공식 음원 유통 접수 및 앨범 릴리즈', topics: ['유통사 심사 등록', '저작권협회 등록 절차'] }
    ]
  }
];

export const INITIAL_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'track-1',
    title: 'Neon Horizon (K-Pop Future Bass)',
    artist: '제이지뮤직스튜디오 Produced',
    tag: 'ORIGINAL TRACK',
    duration: 168,
    genre: 'K-Pop / Future Bass',
    bpm: 128,
    description: '타격감 넘치는 퓨처베이스 코드 신스와 청량한 보컬 챱이 돋보이는 댄스 팝 트랙',
    type: 'original'
  },
  {
    id: 'track-2',
    title: 'Rainy Cafe in Seoul (Lo-Fi R&B)',
    artist: '수강생 김민준 (수강 3개월 차 완성작)',
    tag: 'STUDENT RELEASE',
    duration: 145,
    genre: 'Lo-Fi / Neo-Soul',
    bpm: 84,
    description: '따뜻한 로즈 피아노와 빈티지 바이닐 텍스처, 감성적인 재즈 기타 편곡',
    type: 'original'
  },
  {
    id: 'track-3',
    title: 'Echoes of the Night (Cinematic Drama OST)',
    artist: '정재우 감독 작/편곡',
    tag: 'OST SYNC',
    duration: 182,
    genre: 'Cinematic / Orchestral',
    bpm: 72,
    description: '애절한 첼로 솔로와 앰비언트 신스 패드가 어우러진 현대적인 영상 음악 트랙',
    type: 'original'
  },
  {
    id: 'track-4',
    title: 'Before & After: 플랫한 스케치 → 상업용 트랙 환골탈태',
    artist: '제이지뮤직 1:1 코칭 비포&애프터 비교',
    tag: 'BEFORE & AFTER',
    duration: 120,
    genre: 'Pop Dance / Production',
    bpm: 124,
    description: '단순 피아노 코드 스케치에서 입체적인 베이스와 레이어링 사운드로 진화한 실전 과정',
    type: 'before_after'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: '비전공 직장인 수강생의 첫 칠합 싱글, 스포티파이 공식 에디토리얼 등재 후기',
    category: 'release',
    categoryLabel: '앨범 발매 후기',
    excerpt: '퇴근 후 주 1회 큐베이스 레슨으로 6개월 만에 완성한 자작곡 [Late Night Flight]이 해외 리스너 12만 회를 달성하기까지의 과정.',
    content: `평범한 IT 기업 마케터였던 수강생 민성 님은 악기를 다뤄본 적 없는 완전한 초보였습니다. 

'과연 내가 음악을 만들 수 있을까?'라는 막연한 불안감으로 제이지뮤직스튜디오의 문을 두드렸습니다.

우리는 1:1 맞춤형 커리큘럼을 통해 다음 3단계에 집중했습니다:
1. 큐베이스 단축키와 기본 에디팅을 손에 익혀 작업 속도를 3배 이상 단축
2. 코드 이론을 책으로 외우는 대신 피아노 롤에서 직관적인 텐션 보이싱 공식 적용
3. 칠합 특유의 따뜻하고 묵직한 로우엔드(Kick & Sub Bass) 사운드 디자인 노하우 전수

6개월 후 완성된 싱글은 글로벌 음원 유통사를 통해 공식 발매되었으며, 스포티파이 공식 플레이리스트에 등재되는 쾌거를 이루었습니다. 취미로 시작한 음악이 이제 전 세계 사람들의 플레이리스트에서 재생되고 있습니다.`,
    author: '제이지뮤직스튜디오',
    date: '2026.02.18',
    thumbnailUrl: '/src/assets/images/lesson_midi_setup_1794239966437.jpg',
    readTime: '4분'
  },
  {
    id: 'post-2',
    title: '큐베이스 13 Pro 실전 팁: 킥과 808 베이스가 뭉치지 않는 사이드체인 & EQ 분리법',
    category: 'tip',
    categoryLabel: '프로듀싱 팁',
    excerpt: '많은 초보 작곡가들이 겪는 믹싱의 난제, 킥과 베이스의 주파수 충돌을 수학적으로 깔끔하게 정리하는 노하우를 공개합니다.',
    content: `트랙을 만들고 모니터 스피커나 이어폰으로 들어봤을 때, 킥이 나올 때마다 베이스가 먹먹해지거나 스피커가 벙벙거리는 경험을 해보셨을 것입니다.

이 문제의 90%는 50Hz~120Hz 대역의 주파수 및 시간축 충돌에서 발생합니다.

핵심 해결 솔루션:
1. **주파수 슬롯 분할**: 킥이 60Hz에서 펀치감을 낸다면, 베이스는 60Hz에 좁은 Q값으로 2~3dB 컷을 주고 40Hz 서브 대역이나 100Hz 하모닉스에서 존재감을 갖도록 포지셔닝합니다.
2. **사이드체인 릴리즈 타이밍 계산**: 템포(BPM)에 맞춰 릴리즈를 정밀하게 설정해야 그루브를 해치지 않고 킥이 치고 빠질 때 베이스가 자연스럽게 돌아옵니다.
3. **위상(Phase) 일치 확인**: 킥의 스타트 포인트와 베이스 파형의 피크 위상이 정반대라면 소리가 상쇄됩니다. 큐베이스의 Phase Invert 버튼을 한 번 눌러보는 것만으로 저음이 즉시 살아납니다.`,
    author: '정재우 프로듀서',
    date: '2026.01.29',
    thumbnailUrl: '/src/assets/images/producer_workstation_1794239966408.jpg',
    readTime: '5분'
  },
  {
    id: 'post-3',
    title: '2026학년도 서울예대 실용음악과 작곡 전공 수시 1차 최종 합격 인터뷰',
    category: 'review',
    categoryLabel: '합격 소식',
    excerpt: '치열한 경쟁률을 뚫고 서울예술대학교 실용음악과 작곡 전공에 당당히 합격한 수강생 이채원 님의 1년 준비기.',
    content: `실용음악과 입시는 매년 치열해지고 있으며, 단순한 화성학 풀이가 아닌 '실제 본인이 프로듀싱한 자작곡의 사운드 완성도와 독창성'이 합격의 결정타가 됩니다.

채원 님은 제이지뮤직스튜디오의 아티스트 입시 코스를 수강하며:
- 심사위원의 귀를 첫 10초 만에 사로잡는 인트로 사운드 디자인
- 전통 화성학을 모던 팝 사운드로 치환하는 텐션 편곡법
- 현장 구술 시험 및 DAW 즉흥 연주 질문 대비 모의 인터뷰

를 철저히 준비했습니다. 실기 시험장에서 심사위원 교수님들로부터 "사운드가 이미 상업 프로 수준이다"라는 극찬을 받으며 수시 1차로 당당히 최종 합격하였습니다.`,
    author: '제이지뮤직스튜디오',
    date: '2026.01.15',
    thumbnailUrl: '/src/assets/images/hero_music_studio_1794239965350.jpg',
    readTime: '3분'
  },
  {
    id: 'post-4',
    title: '멜론 TOP 100 차트 분석: 2026 트렌드 코드 진행과 편곡 미니멀리즘',
    category: 'tip',
    categoryLabel: '프로듀싱 팁',
    excerpt: '최신 음원 차트에서 사랑받는 트랙들의 공통점은 복잡한 악기 구성이 아닌, 단 하나의 매력적인 메인 테마와 여백의 미입니다.',
    content: `요즘 대중음악은 악기를 많이 쌓는다고 좋은 소리가 나지 않습니다. 오히려 악기 개수를 8~12트랙 이내로 극도로 압축하고, 각 악기의 사운드 질감과 공간감을 극대화하는 '미니멀 프로덕션'이 대세입니다.

최근 차트 상위권 곡들의 3대 공통 요소:
1. 기억하기 쉬운 2마디 단위의 모티브 리프
2. 보컬이 들어설 자리를 철저히 비워두는 중음역대 EQ 이큅먼트
3. 짧고 강력한 쇼츠/릴스 훅(Hook) 설계

제이지뮤직스튜디오에서는 이러한 최신 트렌드를 매주 분석하여 레슨생들의 트랙에 직접 접목할 수 있도록 커리큘럼을 업데이트하고 있습니다.`,
    author: '정재우 프로듀서',
    date: '2025.12.20',
    thumbnailUrl: '/src/assets/images/producer_workstation_1794239966408.jpg',
    readTime: '4분'
  },
  {
    id: 'post-5',
    title: '2026년 하반기 소수 정예 1:1 레슨 신규 수강생 모집 안내',
    category: 'notice',
    categoryLabel: '공지사항',
    excerpt: '개인별 역량과 목표에 맞춘 1:1 밀착 코칭을 위해 소수 인원(월 최대 8명)으로 한정하여 신청을 접수합니다.',
    content: `제이지뮤직스튜디오는 모든 수강생의 작업물에 대해 원장이 직접 1:1로 피드백하고 음원 릴리즈까지 책임지기 위해 매월 제한된 인원만 모집하고 있습니다.

- 모집 대상: 기초 입문반, 정규 실전 작편곡반, 아티스트 음원 릴리즈반
- 수업 방식: 홍대입구역 도보 5분 제이지뮤직 컨트롤룸 1:1 오프라인 레슨 (지방 거주자의 경우 고음질 원격 오디오 스트리밍 온라인 병행 가능)
- 특전: 수강 기간 중 작업실 녹음 부스 및 UAD 플러그인 무제한 자습 지원, 완성 음원 공식 발매 시 유통사 무료 연계

상담 신청 폼 또는 카카오톡 오픈채팅으로 문의 주시면 사전 미팅 일정을 조율해 드립니다.`,
    author: '제이지뮤직스튜디오',
    date: '2026.02.01',
    thumbnailUrl: '/src/assets/images/hero_music_studio_1794239965350.jpg',
    readTime: '2분'
  }
];

export const INITIAL_INQUIRIES: ConsultationInquiry[] = [
  {
    id: 'inq-1',
    name: '최현우',
    phone: '010-3491-8821',
    email: 'hwchoi@example.com',
    courseId: 'course-intermediate',
    daw: 'Cubase 13',
    genre: 'K-Pop / R&B',
    experienceLevel: '독학 1년, 비트메이킹 경험 있음',
    message: '혼자서 큐베이스로 비트는 찍는데 완곡 편곡과 믹싱이 너무 막막해서 1:1 레슨 상담받고 싶습니다. 주말 오후 시간대 가능할까요?',
    createdAt: '2026-03-01 14:20',
    status: 'pending'
  },
  {
    id: 'inq-2',
    name: '박서연',
    phone: '010-9082-1244',
    email: 'seoyeon.music@example.com',
    courseId: 'course-basic',
    daw: '처음 시작 (DAW 미보유)',
    genre: 'Lo-Fi / 인디 팝',
    experienceLevel: '피아노 반주 가능, 미디는 완전 초보',
    message: '피아노는 칠 줄 아는데 컴퓨터로 음악을 만들어보고 싶습니다. 장비 구매부터 상담받을 수 있는지 궁금합니다.',
    createdAt: '2026-02-28 19:05',
    status: 'contacted'
  }
];

export const INITIAL_SEO: SeoConfig = {
  metaTitle: '제이지뮤직스튜디오 | JZ Music Studio - 작곡·편곡·미디 레슨',
  metaDescription: '홍대입구역 5분. 현업 차트 인 프로듀서의 1:1 큐베이스 미디 작편곡 레슨. 사운드 디자인부터 믹싱, 공식 음원 발매까지.',
  ogImageUrl: '/src/assets/images/hero_music_studio_1794239965350.jpg',
  keywords: '제이지뮤직스튜디오, 큐베이스 레슨, 미디 레슨, 작곡 레슨, 편곡 레슨, 홍대 미디학원, 음원 발매, 비트메이킹',
};
