import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Type,
  KeyRound,
  Edit3,
  Globe,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Disc,
  LayoutGrid,
  Search,
  ArrowUp,
  ArrowDown,
  Upload,
  Eye,
  EyeOff,
  ArrowRight,
  Music,
  Film,
  Sparkles,
  Check,
  FolderPlus,
  GraduationCap,
  Briefcase,
  Layers,
} from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';
import {
  ConsultationInquiry,
  CurriculumCourse,
  CustomHomepageCategory,
  CustomSectionCard,
  HomepageConfig,
  LessonPlanItem,
  PortfolioCategoryConfig,
  ProducerCredit,
  ProductionServiceItem,
  ReleaseCategory,
  ReleaseItem,
  SeoConfig,
  SiteContent,
  ThemeConfig,
} from '../types';
import { INITIAL_HOMEPAGE_CONFIG } from '../data/initialData';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  releases: ReleaseItem[];
  setReleases: React.Dispatch<React.SetStateAction<ReleaseItem[]>>;
  homepageConfig: HomepageConfig;
  setHomepageConfig: React.Dispatch<React.SetStateAction<HomepageConfig>>;
  theme: ThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  credits: ProducerCredit[];
  setCredits: React.Dispatch<React.SetStateAction<ProducerCredit[]>>;
  courses: CurriculumCourse[];
  setCourses: React.Dispatch<React.SetStateAction<CurriculumCourse[]>>;
  seo: SeoConfig;
  setSeo: React.Dispatch<React.SetStateAction<SeoConfig>>;
  inquiries: ConsultationInquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<ConsultationInquiry[]>>;
  onResetAllData: () => void;
}

type AdminMainTab =
  | 'releases'
  | 'lessonInquiries'
  | 'workInquiries'
  | 'categories'
  | 'homepage'
  | 'typography'
  | 'password'
  | 'content'
  | 'seo'
  | `custom:${string}`;

type HomepageSubTab =
  | 'overview'
  | 'hero'
  | 'portfolio'
  | 'lessonPricing'
  | 'productionPricing'
  | 'lessonSection'
  | 'contactSection'
  | 'footerSection'
  | 'eventPopup';

const BUILTIN_SECTION_META: Record<
  string,
  {
    title: string;
    desc: string;
    visKey: keyof HomepageConfig['sections'];
    subTab: HomepageSubTab;
  }
> = {
  hero: {
    title: '히어로 배너 섹션',
    desc: '최상단 메인 헤드라인, 로고, 예약 버튼',
    visKey: 'heroVisible',
    subTab: 'hero',
  },
  portfolio: {
    title: '발매 작품 (DISCOGRAPHY)',
    desc: '음원 / 프로그램 / BGM 포트폴리오 섹션',
    visKey: 'portfolioVisible',
    subTab: 'portfolio',
  },
  pricing: {
    title: '레슨 금액표 (LESSON PRICE)',
    desc: '1:1 개인 레슨 클래스 및 수강료 테이블',
    visKey: 'pricingVisible',
    subTab: 'lessonPricing',
  },
  productionPricing: {
    title: '음원 제작 견적 (MUSIC PRODUCTION)',
    desc: '음원 제작 및 편곡 표준 견적 테이블',
    visKey: 'productionPricingVisible',
    subTab: 'productionPricing',
  },
  lesson: {
    title: '레슨 문의 안내 (START YOUR MUSIC)',
    desc: '3가지 핵심 안내 카드 및 빠른 상담 배너',
    visKey: 'lessonVisible',
    subTab: 'lessonSection',
  },
  contact: {
    title: '방문 상담 예약 & 오시는 길',
    desc: '스튜디오 위치 안내, 연락처, 레슨/작업 문의 폼',
    visKey: 'contactVisible',
    subTab: 'contactSection',
  },
};

const isProductionInquiry = (inq: ConsultationInquiry): boolean => {
  if (inq.inquiryType === 'production') return true;
  if (inq.inquiryType === 'lesson') return false;
  return inq.courseId.startsWith('[작업의뢰]');
};

const compressImageFile = (file: File, maxSize = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('올바른 이미지 파일이 아닙니다.'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width >= height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl =
          outputType === 'image/png'
            ? canvas.toDataURL('image/png')
            : canvas.toDataURL('image/jpeg', 0.84);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};

const AUTO_LOGOUT_MS = 5 * 60 * 1000;

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  releases,
  setReleases,
  homepageConfig,
  setHomepageConfig,
  theme,
  setTheme,
  content,
  setContent,
  credits,
  setCredits,
  courses,
  seo,
  setSeo,
  inquiries,
  setInquiries,
  onResetAllData,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (sessionStorage.getItem('jz_admin_auth') !== 'true') return false;
    const closedAt = sessionStorage.getItem('jz_admin_closed_at');
    if (closedAt && Date.now() - Number(closedAt) >= AUTO_LOGOUT_MS) {
      sessionStorage.removeItem('jz_admin_auth');
      sessionStorage.removeItem('jz_admin_closed_at');
      return false;
    }
    return true;
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminMainTab>('releases');
  const [homepageSubTab, setHomepageSubTab] = useState<HomepageSubTab>('overview');

  const portfolioCategories =
    homepageConfig.portfolioCategories || INITIAL_HOMEPAGE_CONFIG.portfolioCategories;
  const customCategories = homepageConfig.customCategories || [];
  const sectionOrder = homepageConfig.sectionOrder || INITIAL_HOMEPAGE_CONFIG.sectionOrder;

  // --- Release Manager State ---
  const [releaseFilter, setReleaseFilter] = useState<ReleaseCategory>('ALL');
  const [releaseSearch, setReleaseSearch] = useState('');
  const [isReleaseFormOpen, setIsReleaseFormOpen] = useState(false);
  const [editingReleaseId, setEditingReleaseId] = useState<string | null>(null);
  const [confirmDeleteReleaseId, setConfirmDeleteReleaseId] = useState<string | null>(null);
  const [releaseForm, setReleaseForm] = useState<{
    title: string;
    artist: string;
    category: string;
    coverUrl: string;
    youtubeUrl: string;
    releaseOrder: number;
  }>({
    title: '',
    artist: '',
    category: 'MUSIC',
    coverUrl: '/assets/aistudio/KakaoTalk_20261029_152546267_01_40abeb0d.png',
    youtubeUrl: '',
    releaseOrder: 145,
  });

  // --- Category Builder State ---
  const [newCustomCatForm, setNewCustomCatForm] = useState<{
    navLabel: string;
    badge: string;
    title: string;
    subtitle: string;
    layout: 'cards' | 'list' | 'banner';
  }>({
    navLabel: '',
    badge: 'STUDIO CATEGORY',
    title: '',
    subtitle: '',
    layout: 'cards',
  });
  const [isNewCatFormOpen, setIsNewCatFormOpen] = useState(false);
  const [newPortfolioCatForm, setNewPortfolioCatForm] = useState<{
    label: string;
    shortTag: string;
    aspectRatio: 'square' | 'poster';
  }>({
    label: '',
    shortTag: '',
    aspectRatio: 'square',
  });
  const [confirmRemoveSectionId, setConfirmRemoveSectionId] = useState<string | null>(null);
  const [confirmRemovePortfolioCatId, setConfirmRemovePortfolioCatId] = useState<string | null>(null);

  // --- Homepage Form Option Draft Inputs ---
  const [newLessonCourseOption, setNewLessonCourseOption] = useState('');
  const [newProductionTypeOption, setNewProductionTypeOption] = useState('');
  const [newExperienceLevelOption, setNewExperienceLevelOption] = useState('');

  // --- Confirmation States ---
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [confirmDeleteInquiryId, setConfirmDeleteInquiryId] = useState<string | null>(null);

  // Credit form state
  const [newCredit, setNewCredit] = useState<ProducerCredit>({
    year: '2026',
    title: '',
    role: '',
    artistOrProject: '',
  });

  // --- Password Change State ---
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  // Feedback notifications
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const showSavedMessage = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  // Auto-logout 5 minutes after closing AdminModal
  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.removeItem('jz_admin_closed_at');
      return;
    }

    if (isOpen) {
      const closedAt = sessionStorage.getItem('jz_admin_closed_at');
      if (closedAt && Date.now() - Number(closedAt) >= AUTO_LOGOUT_MS) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('jz_admin_auth');
        sessionStorage.removeItem('jz_admin_closed_at');
        setPasswordInput('');
        return;
      }
      sessionStorage.removeItem('jz_admin_closed_at');
      return;
    }

    const existingClosedAt = sessionStorage.getItem('jz_admin_closed_at');
    const closedTimestamp = existingClosedAt ? Number(existingClosedAt) : Date.now();
    if (!existingClosedAt) {
      sessionStorage.setItem('jz_admin_closed_at', String(closedTimestamp));
    }

    const remaining = Math.max(0, AUTO_LOGOUT_MS - (Date.now() - closedTimestamp));
    const timer = setTimeout(() => {
      setIsAuthenticated(false);
      sessionStorage.removeItem('jz_admin_auth');
      sessionStorage.removeItem('jz_admin_closed_at');
      setPasswordInput('');
    }, remaining);

    return () => clearTimeout(timer);
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const getActiveAdminPassword = () => {
    return localStorage.getItem('jz_admin_password') || '1234567890A!';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === getActiveAdminPassword()) {
      setIsAuthenticated(true);
      sessionStorage.setItem('jz_admin_auth', 'true');
      sessionStorage.removeItem('jz_admin_closed_at');
      setAuthError('');
    } else {
      setAuthError('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('jz_admin_auth');
    sessionStorage.removeItem('jz_admin_closed_at');
    setPasswordInput('');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    const currentActive = getActiveAdminPassword();
    if (currentPasswordInput !== currentActive) {
      setPasswordChangeError('기존 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPasswordInput.trim().length < 4) {
      setPasswordChangeError('변경할 비밀번호는 4자 이상 입력해주세요.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError('새 비밀번호와 비밀번호 재확인이 일치하지 않습니다.');
      return;
    }

    localStorage.setItem('jz_admin_password', newPasswordInput);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setPasswordChangeSuccess('비밀번호가 성공적으로 변경되었습니다. 다음 로그인부터 새 비밀번호가 적용됩니다.');
    showSavedMessage('관리자 비밀번호가 변경되었습니다.');
  };

  // --- Release Manager Helpers ---
  const getNextReleaseOrder = () => {
    if (releases.length === 0) return 1;
    return Math.max(...releases.map((r) => r.releaseOrder || 0)) + 1;
  };

  const handleOpenNewReleaseForm = () => {
    setEditingReleaseId(null);
    const defaultCat =
      releaseFilter === 'ALL' ? portfolioCategories[0]?.id || 'MUSIC' : releaseFilter;
    setReleaseForm({
      title: '',
      artist: '',
      category: defaultCat,
      coverUrl: '/assets/aistudio/KakaoTalk_20261029_152546267_01_40abeb0d.png',
      youtubeUrl: '',
      releaseOrder: getNextReleaseOrder(),
    });
    setIsReleaseFormOpen(true);
  };

  const handleStartEditRelease = (item: ReleaseItem) => {
    setEditingReleaseId(item.id);
    setReleaseForm({
      title: item.title,
      artist: item.artist || '',
      category: item.category || portfolioCategories[0]?.id || 'MUSIC',
      coverUrl: item.coverUrl,
      youtubeUrl: item.youtubeUrl || '',
      releaseOrder: item.releaseOrder,
    });
    setIsReleaseFormOpen(true);
  };

  const handleReleaseImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 800);
      setReleaseForm((prev) => ({ ...prev, coverUrl: dataUrl }));
      showSavedMessage('커버 이미지가 업로드되었습니다.');
    } catch {
      showSavedMessage('이미지 파일을 처리하지 못했습니다.');
    }
  };

  const handleHeroLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 900);
      setHomepageConfig((prev) => ({
        ...prev,
        hero: { ...prev.hero, logoUrl: dataUrl },
      }));
      showSavedMessage('로고 이미지가 반영되었습니다.');
    } catch {
      showSavedMessage('이미지 파일을 처리하지 못했습니다.');
    }
  };

  const handleCustomCardImageUpload = async (
    catId: string,
    cardId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 800);
      handleUpdateCustomCard(catId, cardId, { imageUrl: dataUrl });
      showSavedMessage('이미지가 업로드되었습니다.');
    } catch {
      showSavedMessage('이미지 파일을 처리하지 못했습니다.');
    }
  };

  const handleSaveRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!releaseForm.title.trim()) return;

    const cleanRelease: ReleaseItem = {
      id: editingReleaseId || `release-${Date.now()}`,
      title: releaseForm.title.trim(),
      artist: releaseForm.artist.trim() || undefined,
      category: releaseForm.category,
      coverUrl:
        releaseForm.coverUrl.trim() ||
        '/assets/aistudio/KakaoTalk_20261029_152546267_01_40abeb0d.png',
      youtubeUrl: releaseForm.youtubeUrl.trim() || undefined,
      releaseOrder: Number(releaseForm.releaseOrder) || getNextReleaseOrder(),
    };

    if (editingReleaseId) {
      setReleases((prev) => prev.map((r) => (r.id === editingReleaseId ? cleanRelease : r)));
      showSavedMessage('발매 작품 정보가 수정되었습니다.');
    } else {
      setReleases((prev) => [cleanRelease, ...prev]);
      showSavedMessage('새 발매 작품이 등록되었습니다.');
    }

    setIsReleaseFormOpen(false);
    setEditingReleaseId(null);
  };

  const handleDeleteRelease = (id: string) => {
    setReleases((prev) => prev.filter((r) => r.id !== id));
    setConfirmDeleteReleaseId(null);
    if (editingReleaseId === id) {
      setIsReleaseFormOpen(false);
      setEditingReleaseId(null);
    }
    showSavedMessage('발매 작품이 삭제되었습니다.');
  };

  // Sorted releases matching AudioPlayer order
  const categoryPriority: Record<string, number> = {};
  portfolioCategories.forEach((c, idx) => {
    categoryPriority[c.id] = idx + 1;
  });

  const sortedReleases = [...releases].sort((a, b) => {
    const catA = a.category || 'MUSIC';
    const catB = b.category || 'MUSIC';
    if (catA !== catB) {
      return (categoryPriority[catA] || 99) - (categoryPriority[catB] || 99);
    }
    return b.releaseOrder - a.releaseOrder;
  });

  const filteredAdminReleases = sortedReleases.filter((item) => {
    const itemCat = item.category || 'MUSIC';
    const matchesCat = releaseFilter === 'ALL' || itemCat === releaseFilter;
    const q = releaseSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.artist || '').toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const handleSwapReleaseOrder = (item: ReleaseItem, direction: 'up' | 'down') => {
    const itemCat = item.category || 'MUSIC';
    const sameCategoryList = sortedReleases.filter((r) => (r.category || 'MUSIC') === itemCat);
    const currentIndex = sameCategoryList.findIndex((r) => r.id === item.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sameCategoryList.length) return;

    const targetItem = sameCategoryList[targetIndex];
    const orderA = item.releaseOrder;
    const orderB = targetItem.releaseOrder;

    const newOrderForItem =
      orderA === orderB ? (direction === 'up' ? orderB + 1 : orderB - 1) : orderB;
    const newOrderForTarget = orderA === orderB ? orderB : orderA;

    setReleases((prev) =>
      prev.map((r) => {
        if (r.id === item.id) return { ...r, releaseOrder: newOrderForItem };
        if (r.id === targetItem.id) return { ...r, releaseOrder: newOrderForTarget };
        return r;
      })
    );
    showSavedMessage('작품 순서가 변경되었습니다.');
  };

  // --- Custom Category & Section Management ---
  const handleCreateCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const label = newCustomCatForm.navLabel.trim() || newCustomCatForm.title.trim();
    const title = newCustomCatForm.title.trim() || newCustomCatForm.navLabel.trim();
    if (!label && !title) return;

    const newId = `custom-${Date.now()}`;
    const newCategory: CustomHomepageCategory = {
      id: newId,
      navLabel: label,
      showInNav: true,
      visible: true,
      badge: newCustomCatForm.badge.trim() || 'CATEGORY',
      title,
      subtitle: newCustomCatForm.subtitle.trim(),
      layout: newCustomCatForm.layout,
      items: [
        {
          id: `item-${Date.now()}`,
          title: `${title} 첫 번째 항목`,
          subtitle: '',
          description: '여기에 상세 설명을 입력하세요.',
          badge: 'NEW',
        },
      ],
      ctaText: '',
      ctaAction: 'lesson',
    };

    setHomepageConfig((prev) => ({
      ...prev,
      customCategories: [...(prev.customCategories || []), newCategory],
      sectionOrder: [...(prev.sectionOrder || INITIAL_HOMEPAGE_CONFIG.sectionOrder), newId],
    }));

    setNewCustomCatForm({
      navLabel: '',
      badge: 'STUDIO CATEGORY',
      title: '',
      subtitle: '',
      layout: 'cards',
    });
    setIsNewCatFormOpen(false);
    setActiveTab(`custom:${newId}`);
    showSavedMessage(`'${label}' 카테고리가 생성되었습니다.`);
  };

  const handleUpdateCustomCategory = (
    catId: string,
    patch: Partial<CustomHomepageCategory>
  ) => {
    setHomepageConfig((prev) => ({
      ...prev,
      customCategories: (prev.customCategories || []).map((c) =>
        c.id === catId ? { ...c, ...patch } : c
      ),
    }));
  };

  const handleAddCustomCard = (catId: string) => {
    const newCard: CustomSectionCard = {
      id: `item-${Date.now()}`,
      title: '새 항목 제목',
      subtitle: '',
      description: '세부 내용을 입력하세요.',
      badge: '',
    };
    setHomepageConfig((prev) => ({
      ...prev,
      customCategories: (prev.customCategories || []).map((c) =>
        c.id === catId ? { ...c, items: [...c.items, newCard] } : c
      ),
    }));
    showSavedMessage('새 항목이 추가되었습니다.');
  };

  const handleUpdateCustomCard = (
    catId: string,
    cardId: string,
    patch: Partial<CustomSectionCard>
  ) => {
    setHomepageConfig((prev) => ({
      ...prev,
      customCategories: (prev.customCategories || []).map((c) =>
        c.id === catId
          ? {
              ...c,
              items: c.items.map((item) => (item.id === cardId ? { ...item, ...patch } : item)),
            }
          : c
      ),
    }));
  };

  const handleDeleteCustomCard = (catId: string, cardId: string) => {
    setHomepageConfig((prev) => ({
      ...prev,
      customCategories: (prev.customCategories || []).map((c) =>
        c.id === catId ? { ...c, items: c.items.filter((item) => item.id !== cardId) } : c
      ),
    }));
    showSavedMessage('항목이 삭제되었습니다.');
  };

  const handleMoveSectionOrder = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= sectionOrder.length) return;
    const nextOrder = [...sectionOrder];
    [nextOrder[index], nextOrder[target]] = [nextOrder[target], nextOrder[index]];
    setHomepageConfig((prev) => ({ ...prev, sectionOrder: nextOrder }));
    showSavedMessage('카테고리 순서가 변경되었습니다.');
  };

  const handleRemoveSection = (sectionId: string) => {
    const isBuiltIn = Boolean(BUILTIN_SECTION_META[sectionId]);
    setHomepageConfig((prev) => {
      const nextOrder = (prev.sectionOrder || []).filter((id) => id !== sectionId);
      if (isBuiltIn) {
        const meta = BUILTIN_SECTION_META[sectionId];
        return {
          ...prev,
          sectionOrder: nextOrder,
          sections: { ...prev.sections, [meta.visKey]: false },
        };
      }
      return {
        ...prev,
        sectionOrder: nextOrder,
        customCategories: (prev.customCategories || []).filter((c) => c.id !== sectionId),
      };
    });
    if (activeTab === `custom:${sectionId}`) {
      setActiveTab('categories');
    }
    setConfirmRemoveSectionId(null);
    showSavedMessage('카테고리가 제거되었습니다.');
  };

  const handleRestoreBuiltInSection = (sectionId: string) => {
    const meta = BUILTIN_SECTION_META[sectionId];
    if (!meta) return;
    setHomepageConfig((prev) => ({
      ...prev,
      sectionOrder: prev.sectionOrder.includes(sectionId)
        ? prev.sectionOrder
        : [...prev.sectionOrder, sectionId],
      sections: { ...prev.sections, [meta.visKey]: true },
    }));
    showSavedMessage(`'${meta.title}' 카테고리가 복구되었습니다.`);
  };

  // --- Portfolio Sub-Category Add / Update / Remove ---
  const handleAddPortfolioCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const label = newPortfolioCatForm.label.trim();
    if (!label) return;
    const shortTag = (newPortfolioCatForm.shortTag.trim() || label).toUpperCase();
    const newId = `CAT_${Date.now()}`;
    const newCat: PortfolioCategoryConfig = {
      id: newId,
      label,
      shortTag,
      aspectRatio: newPortfolioCatForm.aspectRatio,
    };
    setHomepageConfig((prev) => ({
      ...prev,
      portfolioCategories: [
        ...(prev.portfolioCategories || INITIAL_HOMEPAGE_CONFIG.portfolioCategories),
        newCat,
      ],
    }));
    setNewPortfolioCatForm({ label: '', shortTag: '', aspectRatio: 'square' });
    showSavedMessage(`발매 작품 카테고리 '${label}'가 추가되었습니다.`);
  };

  const handleUpdatePortfolioCategory = (
    catId: string,
    patch: Partial<PortfolioCategoryConfig>
  ) => {
    setHomepageConfig((prev) => ({
      ...prev,
      portfolioCategories: (
        prev.portfolioCategories || INITIAL_HOMEPAGE_CONFIG.portfolioCategories
      ).map((c) => (c.id === catId ? { ...c, ...patch } : c)),
    }));
  };

  const handleRemovePortfolioCategory = (catId: string) => {
    if (portfolioCategories.length <= 1) return;
    const remaining = portfolioCategories.filter((c) => c.id !== catId);
    const fallbackId = remaining[0].id;
    setHomepageConfig((prev) => ({
      ...prev,
      portfolioCategories: remaining,
    }));
    // Reassign releases in deleted category to first remaining category so no items become orphaned
    setReleases((prev) =>
      prev.map((r) => ((r.category || 'MUSIC') === catId ? { ...r, category: fallbackId } : r))
    );
    if (releaseFilter === catId) setReleaseFilter('ALL');
    setConfirmRemovePortfolioCatId(null);
    showSavedMessage('발매 작품 카테고리가 제거되었습니다.');
  };

  // --- Homepage Lesson & Production Plan Helpers ---
  const handleAddLessonPlan = () => {
    const newPlan: LessonPlanItem = {
      id: `plan-${Date.now()}`,
      name: '새 레슨 반',
      time: '60분',
      price: '상담 문의',
      popular: false,
    };
    setHomepageConfig((prev) => ({
      ...prev,
      lessonPricing: {
        ...prev.lessonPricing,
        plans: [...prev.lessonPricing.plans, newPlan],
      },
    }));
    showSavedMessage('새 레슨 과정이 추가되었습니다.');
  };

  const handleUpdateLessonPlan = (id: string, patch: Partial<LessonPlanItem>) => {
    setHomepageConfig((prev) => ({
      ...prev,
      lessonPricing: {
        ...prev.lessonPricing,
        plans: prev.lessonPricing.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      },
    }));
  };

  const handleMoveLessonPlan = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    const plans = [...homepageConfig.lessonPricing.plans];
    if (target < 0 || target >= plans.length) return;
    [plans[index], plans[target]] = [plans[target], plans[index]];
    setHomepageConfig((prev) => ({
      ...prev,
      lessonPricing: { ...prev.lessonPricing, plans },
    }));
  };

  const handleDeleteLessonPlan = (id: string) => {
    setHomepageConfig((prev) => ({
      ...prev,
      lessonPricing: {
        ...prev.lessonPricing,
        plans: prev.lessonPricing.plans.filter((p) => p.id !== id),
      },
    }));
    showSavedMessage('레슨 항목이 삭제되었습니다.');
  };

  const handleAddProductionService = () => {
    const newSvc: ProductionServiceItem = {
      id: `svc-${Date.now()}`,
      service: '새 제작 서비스',
      price: '상담 문의',
      priceNote: '',
      note: '상세 설명 입력',
    };
    setHomepageConfig((prev) => ({
      ...prev,
      productionPricing: {
        ...prev.productionPricing,
        services: [...prev.productionPricing.services, newSvc],
      },
    }));
    showSavedMessage('새 제작 견적 항목이 추가되었습니다.');
  };

  const handleUpdateProductionService = (id: string, patch: Partial<ProductionServiceItem>) => {
    setHomepageConfig((prev) => ({
      ...prev,
      productionPricing: {
        ...prev.productionPricing,
        services: prev.productionPricing.services.map((s) =>
          s.id === id ? { ...s, ...patch } : s
        ),
      },
    }));
  };

  const handleMoveProductionService = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    const services = [...homepageConfig.productionPricing.services];
    if (target < 0 || target >= services.length) return;
    [services[index], services[target]] = [services[target], services[index]];
    setHomepageConfig((prev) => ({
      ...prev,
      productionPricing: { ...prev.productionPricing, services },
    }));
  };

  const handleDeleteProductionService = (id: string) => {
    setHomepageConfig((prev) => ({
      ...prev,
      productionPricing: {
        ...prev.productionPricing,
        services: prev.productionPricing.services.filter((s) => s.id !== id),
      },
    }));
    showSavedMessage('제작 견적 항목이 삭제되었습니다.');
  };

  // --- Credits Operations ---
  const handleAddCredit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCredit.title.trim()) return;
    setCredits([newCredit, ...credits]);
    setNewCredit({
      year: '2026',
      title: '',
      role: '',
      artistOrProject: '',
    });
    showSavedMessage('새 크레딧 이력이 추가되었습니다.');
  };

  const handleDeleteCredit = (index: number) => {
    setCredits(credits.filter((_, i) => i !== index));
    showSavedMessage('크레딧이 삭제되었습니다.');
  };

  // --- Inquiries Operations ---
  const lessonInquiries = inquiries.filter((inq) => !isProductionInquiry(inq));
  const workInquiries = inquiries.filter((inq) => isProductionInquiry(inq));
  const pendingLessonCount = lessonInquiries.filter((q) => q.status === 'pending').length;
  const pendingWorkCount = workInquiries.filter((q) => q.status === 'pending').length;

  const handleUpdateInquiryStatus = (
    id: string,
    status: 'pending' | 'contacted' | 'completed'
  ) => {
    setInquiries(inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
    showSavedMessage('상담 상태가 변경되었습니다.');
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiries(inquiries.filter((inq) => inq.id !== id));
    setConfirmDeleteInquiryId(null);
    showSavedMessage('상담 내역이 삭제되었습니다.');
  };

  const removedBuiltInSectionIds = Object.keys(BUILTIN_SECTION_META).filter(
    (id) => !sectionOrder.includes(id)
  );

  const homepageSubTabs: { key: HomepageSubTab; label: string }[] = [
    { key: 'overview', label: '전체 섹션 · 메뉴' },
    { key: 'hero', label: '히어로 배너' },
    { key: 'portfolio', label: '발매 작품 헤더' },
    { key: 'lessonPricing', label: '레슨 금액표' },
    { key: 'productionPricing', label: '음원 제작 견적' },
    { key: 'lessonSection', label: '레슨 문의' },
    { key: 'contactSection', label: '방문 상담 · 위치 · 폼' },
    { key: 'footerSection', label: '푸터 설정' },
    { key: 'eventPopup', label: '이벤트 팝업' },
  ];

  const activeCustomCategory = activeTab.startsWith('custom:')
    ? customCategories.find((c) => `custom:${c.id}` === activeTab)
    : undefined;

  const renderInquiryList = (
    list: ConsultationInquiry[],
    title: string,
    description: string,
    isWork: boolean
  ) => (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-xs text-neutral-400 mt-1">{description}</p>
        </div>
        <span className="text-xs font-mono text-neutral-400 shrink-0">총 {list.length}건</span>
      </div>

      {/* Email Notification Info Banner */}
      <div className="p-3.5 rounded-xl border border-white/10 bg-neutral-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="space-y-0.5">
          <p className="text-neutral-200 font-semibold">
            알림 메일 수신 주소:{' '}
            <span className="font-mono text-white">
              {homepageConfig.contactSection.notificationEmail?.trim() || 'sm93425@naver.com'}
            </span>
          </p>
          <p className="text-[11px] text-neutral-400">
            상담 접수 시 위 메일로 &quot;제이지뮤직스튜디오 상담신청 문의&quot;가 자동 발송됩니다. (최초 1회 테스트 접수 후 네이버 메일함에서 FormSubmit 활성화 링크를 클릭하시면 이후 즉시 수신됩니다.)
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="p-12 text-center border border-white/10 rounded-xl bg-neutral-900/40 text-neutral-400 text-xs">
          현재 접수된 {isWork ? '작업 상담 신청' : '레슨 상담 신청'} 내역이 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((inq) => {
            const course = courses.find((c) => c.id === inq.courseId);
            const displayCourseOrType = course
              ? `[${course.level}] ${course.name}`
              : inq.courseId.replace(/^\[작업의뢰\]\s*/, '');

            return (
              <div
                key={inq.id}
                className="p-5 rounded-xl border border-white/10 bg-neutral-900/60 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-white">{inq.name}</span>
                    <span className="font-mono text-xs text-neutral-400">{inq.phone}</span>
                    {inq.email && (
                      <span className="text-xs text-neutral-500 hidden sm:inline">
                        ({inq.email})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={inq.status}
                      onChange={(e) =>
                        handleUpdateInquiryStatus(
                          inq.id,
                          e.target.value as ConsultationInquiry['status']
                        )
                      }
                      className={`text-xs px-2.5 py-1 rounded font-semibold border ${
                        inq.status === 'pending'
                          ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                          : inq.status === 'contacted'
                          ? 'bg-blue-950/60 border-blue-500/40 text-blue-300'
                          : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      }`}
                    >
                      <option value="pending">대기 중 (미연락)</option>
                      <option value="contacted">연락 완료 (일정 조율)</option>
                      <option value="completed">상담 완료</option>
                    </select>

                    {confirmDeleteInquiryId === inq.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="px-2 py-1 text-xs rounded bg-red-600 text-white font-semibold"
                        >
                          삭제 확인
                        </button>
                        <button
                          onClick={() => setConfirmDeleteInquiryId(null)}
                          className="px-2 py-1 text-xs rounded bg-white/10 text-neutral-300"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteInquiryId(inq.id)}
                        className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                        aria-label="삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-neutral-300">
                  <div>
                    <span className="text-neutral-500 block">
                      {isWork ? '작업 의뢰 분야:' : '희망 수강 과정:'}
                    </span>
                    <span className="font-semibold text-white">{displayCourseOrType}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">음악 경험:</span>
                    <span>{inq.experienceLevel || '-'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">주 DAW / 장르:</span>
                    <span>{inq.daw || inq.genre || '-'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">접수 일시:</span>
                    <span className="font-mono text-neutral-400">{inq.createdAt}</span>
                  </div>
                </div>

                {inq.message && (
                  <div className="p-3 rounded bg-black/40 border border-white/5 text-xs text-neutral-300 leading-relaxed">
                    <span className="font-semibold text-neutral-400 block mb-1">
                      문의 및 희망 일정:
                    </span>
                    {inq.message}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] flex flex-col rounded-2xl border border-white/20 bg-neutral-950 text-neutral-200 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white overflow-hidden p-0.5 shrink-0 shadow-sm">
              <OptimizedImage
                src="/assets/aistudio/JG_MUSIC_STUDIO_2dd5aa15.png"
                alt="JG MUSIC STUDIO 로고"
                sizes="32px"
                maxWidth={320}
                priority
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>제이지뮤직스튜디오 통합 관리자 대시보드</span>
                <span className="text-[10px] text-neutral-400 font-mono px-2 py-0.5 rounded bg-white/10">
                  ADMIN v3.1
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs text-neutral-400 hover:text-white px-2.5 py-1 border border-white/10 rounded transition-colors"
              >
                로그아웃
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Saved Toast Notice */}
        {savedNotice && (
          <div className="absolute top-16 right-6 z-30 flex items-center gap-2 bg-white text-black text-xs font-semibold px-4 py-2.5 rounded-md shadow-lg animate-in slide-in-from-top duration-200">
            <CheckCircle className="h-4 w-4" />
            <span>{savedNotice}</span>
          </div>
        )}

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Password Authentication Gate */
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md p-8 rounded-xl border border-white/10 bg-neutral-900 text-center space-y-6">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mx-auto text-white">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">스튜디오 관리자 로그인</h3>
                <p className="text-xs text-neutral-400 mt-2">
                  접근 권한이 필요합니다. 관리자 비밀번호를 입력해주세요.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    placeholder="비밀번호 입력"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-neutral-950 border border-white/15 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                  />
                  {authError && (
                    <div className="mt-2 text-xs text-red-400 flex items-center justify-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{authError}</span>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-md transition-colors"
                >
                  대시보드 접속
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-neutral-900/50 p-4 shrink-0 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto">
              <button
                onClick={() => setActiveTab('releases')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'releases'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Disc className="h-4 w-4" />
                  <span>발매 작품 관리</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === 'releases'
                      ? 'bg-black/15 text-black'
                      : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  {releases.length}
                </span>
              </button>

              {/* Separated Consultation Categories */}
              <button
                onClick={() => setActiveTab('lessonInquiries')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'lessonInquiries'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="h-4 w-4" />
                  <span>레슨 상담 신청</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === 'lessonInquiries'
                      ? 'bg-black/15 text-black'
                      : pendingLessonCount > 0
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  {lessonInquiries.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('workInquiries')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'workInquiries'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="h-4 w-4" />
                  <span>작업 상담 신청</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === 'workInquiries'
                      ? 'bg-black/15 text-black'
                      : pendingWorkCount > 0
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  {workInquiries.length}
                </span>
              </button>

              <div className="hidden md:block my-1 border-t border-white/10" />

              {/* Category Builder & Full Category Control */}
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'categories'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FolderPlus className="h-4 w-4" />
                  <span>전체 카테고리 생성/제거</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === 'categories'
                      ? 'bg-black/15 text-black'
                      : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  {sectionOrder.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('homepage')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'homepage'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutGrid className="h-4 w-4" />
                  <span>홈페이지 세부 설정</span>
                </div>
              </button>

              {/* Dynamic Sidebar Links for User-Created Categories */}
              {customCategories.length > 0 && (
                <div className="hidden md:flex flex-col gap-1 pt-2 mt-1 border-t border-white/10">
                  <span className="px-2 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    추가된 카테고리
                  </span>
                  {customCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(`custom:${cat.id}`)}
                      className={`flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                        activeTab === `custom:${cat.id}`
                          ? 'bg-white text-black font-semibold'
                          : 'text-neutral-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Layers className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{cat.navLabel || cat.title}</span>
                      </div>
                      {!cat.visible && (
                        <span className="text-[10px] opacity-60 shrink-0">숨김</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="hidden md:block my-1 border-t border-white/10" />

              <button
                onClick={() => setActiveTab('typography')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'typography'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Type className="h-4 w-4" />
                <span>글씨체 & 글씨 크기</span>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'content'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Edit3 className="h-4 w-4" />
                <span>프로듀서 & 크레딧</span>
              </button>

              <button
                onClick={() => setActiveTab('seo')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'seo'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span>SEO & 검색 최적화</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('password');
                  setPasswordChangeError('');
                  setPasswordChangeSuccess('');
                }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'password'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <KeyRound className="h-4 w-4" />
                <span>비밀번호 변경</span>
              </button>

              <div className="hidden md:block mt-auto pt-4 border-t border-white/10">
                {confirmResetAll ? (
                  <div className="p-2.5 rounded-lg border border-red-500/40 bg-red-950/30 space-y-2">
                    <p className="text-[11px] text-red-200 text-center leading-snug">
                      모든 변경사항을 초기값으로 복원할까요?
                    </p>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onResetAllData();
                          setConfirmResetAll(false);
                          setActiveTab('releases');
                          showSavedMessage('기본값으로 복원되었습니다.');
                        }}
                        className="flex-1 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-[11px] font-semibold"
                      >
                        복원 실행
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmResetAll(false)}
                        className="flex-1 py-1.5 rounded bg-white/10 hover:bg-white/20 text-neutral-300 text-[11px]"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmResetAll(true)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-neutral-400 hover:text-red-400 border border-white/10 hover:border-red-400/30 rounded-lg transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>초기 데이터 복원</span>
                  </button>
                )}
              </div>
            </div>

            {/* Main Tab Panel Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {/* ================================================================= */}
              {/* TAB: RELEASES MANAGER                                             */}
              {/* ================================================================= */}
              {activeTab === 'releases' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-xl font-bold text-white">발매 작품 관리</h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        홈페이지의 발매 작품들을 직접 추가, 수정, 삭제하고 노출 순서를 제어합니다.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenNewReleaseForm}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors shrink-0 shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>새 발매 작품 추가</span>
                    </button>
                  </div>

                  {/* Add / Edit Release Form */}
                  {isReleaseFormOpen && (
                    <form
                      onSubmit={handleSaveRelease}
                      className="p-5 sm:p-6 rounded-xl border border-white/20 bg-neutral-900/90 space-y-4 shadow-xl"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <h4 className="text-sm font-bold text-white">
                          {editingReleaseId ? '발매 작품 수정' : '새 발매 작품 등록'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setIsReleaseFormOpen(false);
                            setEditingReleaseId(null);
                          }}
                          className="text-xs text-neutral-400 hover:text-white"
                        >
                          닫기
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                        <div className="sm:col-span-4 space-y-2.5">
                          <label className="block text-xs font-semibold text-neutral-300">
                            앨범 / 포스터 커버 미리보기
                          </label>
                          <div
                            className={`w-full max-w-[200px] rounded-xl overflow-hidden border border-white/15 bg-black flex items-center justify-center ${
                              portfolioCategories.find((c) => c.id === releaseForm.category)
                                ?.aspectRatio === 'poster'
                                ? 'aspect-[3/4]'
                                : 'aspect-square'
                            }`}
                          >
                            <OptimizedImage
                              src={releaseForm.coverUrl}
                              alt="커버 미리보기"
                              sizes="200px"
                              maxWidth={640}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-white cursor-pointer transition-colors">
                            <Upload className="h-3.5 w-3.5" />
                            <span>이미지 파일 업로드</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleReleaseImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <div className="sm:col-span-8 space-y-3.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                작품명 / 곡 제목 <span className="text-red-400">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="예) 밤하늘의 멜로디"
                                value={releaseForm.title}
                                onChange={(e) =>
                                  setReleaseForm({ ...releaseForm, title: e.target.value })
                                }
                                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none focus:border-white/40"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                아티스트 / 프로그램 구분
                              </label>
                              <input
                                type="text"
                                placeholder="예) 홍길동 또는 KBS 드라마"
                                value={releaseForm.artist}
                                onChange={(e) =>
                                  setReleaseForm({ ...releaseForm, artist: e.target.value })
                                }
                                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none focus:border-white/40"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                카테고리
                              </label>
                              <select
                                value={releaseForm.category}
                                onChange={(e) =>
                                  setReleaseForm({
                                    ...releaseForm,
                                    category: e.target.value,
                                  })
                                }
                                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none focus:border-white/40"
                              >
                                {portfolioCategories.map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                최신순 정렬 번호 (높을수록 먼저 노출)
                              </label>
                              <input
                                type="number"
                                value={releaseForm.releaseOrder}
                                onChange={(e) =>
                                  setReleaseForm({
                                    ...releaseForm,
                                    releaseOrder: Number(e.target.value),
                                  })
                                }
                                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono focus:outline-none focus:border-white/40"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              커버 이미지 URL (또는 위 버튼으로 파일 직접 업로드)
                            </label>
                            <input
                              type="text"
                              value={releaseForm.coverUrl}
                              onChange={(e) =>
                                setReleaseForm({ ...releaseForm, coverUrl: e.target.value })
                              }
                              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono focus:outline-none focus:border-white/40"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              유튜브 링크 (선택 — 입력 시 클릭하면 유튜브로 연결)
                            </label>
                            <input
                              type="url"
                              placeholder="https://www.youtube.com/watch?v=..."
                              value={releaseForm.youtubeUrl}
                              onChange={(e) =>
                                setReleaseForm({ ...releaseForm, youtubeUrl: e.target.value })
                              }
                              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono focus:outline-none focus:border-white/40"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            setIsReleaseFormOpen(false);
                            setEditingReleaseId(null);
                          }}
                          className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded-md transition-colors"
                        >
                          <Save className="h-3.5 w-3.5" />
                          <span>{editingReleaseId ? '수정 저장' : '작품 등록'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Dynamic Filter Tabs + Search Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-900 rounded-xl border border-white/10 text-xs">
                      <button
                        type="button"
                        onClick={() => setReleaseFilter('ALL')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          releaseFilter === 'ALL'
                            ? 'bg-white text-black'
                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>전체</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            releaseFilter === 'ALL'
                              ? 'bg-black/15 text-black'
                              : 'bg-white/10 text-neutral-400'
                          }`}
                        >
                          {releases.length}
                        </span>
                      </button>
                      {portfolioCategories.map((cat) => {
                        const count = releases.filter(
                          (r) => (r.category || 'MUSIC') === cat.id
                        ).length;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setReleaseFilter(cat.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              releaseFilter === cat.id
                                ? 'bg-white text-black'
                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {cat.id === 'PROGRAM' ? (
                              <Film className="w-3.5 h-3.5" />
                            ) : cat.id === 'BGM' ? (
                              <Disc className="w-3.5 h-3.5" />
                            ) : (
                              <Music className="w-3.5 h-3.5" />
                            )}
                            <span>{cat.label}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                releaseFilter === cat.id
                                  ? 'bg-black/15 text-black'
                                  : 'bg-white/10 text-neutral-400'
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="h-3.5 w-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="제목 또는 아티스트 검색..."
                        value={releaseSearch}
                        onChange={(e) => setReleaseSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs bg-neutral-900 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  {/* Releases List */}
                  {filteredAdminReleases.length === 0 ? (
                    <div className="p-12 text-center border border-dashed border-white/10 rounded-xl text-xs text-neutral-400">
                      검색 조건에 맞는 발매 작품이 없습니다.
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-neutral-900/30">
                      {filteredAdminReleases.map((item) => {
                        const cat = item.category || 'MUSIC';
                        const catDef = portfolioCategories.find((c) => c.id === cat);
                        const sameCategoryList = sortedReleases.filter(
                          (r) => (r.category || 'MUSIC') === cat
                        );
                        const idxInCat = sameCategoryList.findIndex((r) => r.id === item.id);
                        const isFirstInCat = idxInCat === 0;
                        const isLastInCat = idxInCat === sameCategoryList.length - 1;

                        return (
                          <div
                            key={item.id}
                            className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.03] transition-colors"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="h-14 w-14 rounded-lg overflow-hidden border border-white/10 bg-black shrink-0">
                                <OptimizedImage
                                  src={item.coverUrl}
                                  alt={item.title}
                                  sizes="56px"
                                  maxWidth={320}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="min-w-0 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                      cat === 'MUSIC'
                                        ? 'bg-white/10 text-neutral-200 border-white/15'
                                        : cat === 'PROGRAM'
                                        ? 'bg-amber-950/70 text-amber-300 border-amber-500/30'
                                        : cat === 'BGM'
                                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30'
                                        : 'bg-sky-950/70 text-sky-300 border-sky-500/30'
                                    }`}
                                  >
                                    {catDef?.shortTag || cat}
                                  </span>
                                  <span className="text-[10px] font-mono text-neutral-500">
                                    #{item.releaseOrder}
                                  </span>
                                  {item.youtubeUrl && (
                                    <span className="text-[10px] font-mono text-red-300 bg-red-950/50 border border-red-500/20 px-1.5 py-0.5 rounded">
                                      YouTube
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-sm font-bold text-white truncate">
                                  {item.title}
                                </h4>
                                {item.artist && (
                                  <p className="text-xs text-neutral-400 truncate">{item.artist}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 justify-end">
                              <button
                                type="button"
                                disabled={isFirstInCat}
                                onClick={() => handleSwapReleaseOrder(item, 'up')}
                                title="위로 (최신순)"
                                className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-neutral-300 disabled:opacity-25 disabled:cursor-not-allowed"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={isLastInCat}
                                onClick={() => handleSwapReleaseOrder(item, 'down')}
                                title="아래로"
                                className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-neutral-300 disabled:opacity-25 disabled:cursor-not-allowed"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStartEditRelease(item)}
                                className="px-2.5 py-1.5 text-xs font-medium rounded bg-white/10 hover:bg-white/20 text-white"
                              >
                                수정
                              </button>
                              {confirmDeleteReleaseId === item.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRelease(item.id)}
                                    className="px-2.5 py-1.5 text-xs font-semibold rounded bg-red-600 hover:bg-red-500 text-white"
                                  >
                                    삭제 확인
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteReleaseId(null)}
                                    className="px-2 py-1.5 text-xs rounded bg-white/10 text-neutral-300"
                                  >
                                    취소
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteReleaseId(item.id)}
                                  className="px-2.5 py-1.5 text-xs font-medium rounded bg-red-950/40 hover:bg-red-950/80 text-red-400"
                                >
                                  삭제
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ================================================================= */}
              {/* TAB: LESSON INQUIRIES (레슨 상담 신청 전용)                         */}
              {/* ================================================================= */}
              {activeTab === 'lessonInquiries' &&
                renderInquiryList(
                  lessonInquiries,
                  '레슨 상담 신청 관리',
                  '1:1 미디·작곡·피아노 레슨 방문 상담으로 접수된 내역입니다.',
                  false
                )}

              {/* ================================================================= */}
              {/* TAB: WORK INQUIRIES (작업 상담 신청 전용)                           */}
              {/* ================================================================= */}
              {activeTab === 'workInquiries' &&
                renderInquiryList(
                  workInquiries,
                  '작업 상담 신청 관리',
                  '음원 제작, 작/편곡, MIDI 스트링·피아노 편곡 등 작업 의뢰로 접수된 내역입니다.',
                  true
                )}

              {/* ================================================================= */}
              {/* TAB: FULL CATEGORY CREATOR / REMOVER (전체 카테고리 생성 및 제거)     */}
              {/* ================================================================= */}
              {activeTab === 'categories' && (
                <div className="space-y-8 max-w-4xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-xl font-bold text-white">전체 카테고리 생성 및 제거</h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        홈페이지 상단 메뉴·섹션 카테고리와 발매 작품 카테고리를 자유롭게 추가, 순서 변경, 삭제할 수 있습니다.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNewCatFormOpen(!isNewCatFormOpen)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                      <span>새 홈페이지 카테고리 만들기</span>
                    </button>
                  </div>

                  {/* Create New Custom Homepage Category Form */}
                  {isNewCatFormOpen && (
                    <form
                      onSubmit={handleCreateCustomCategory}
                      className="p-5 sm:p-6 rounded-xl border border-white/20 bg-neutral-900/90 space-y-4 shadow-xl"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <h4 className="text-sm font-bold text-white">
                          새 홈페이지 카테고리 생성 (상단 메뉴 & 섹션 자동 추가)
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsNewCatFormOpen(false)}
                          className="text-xs text-neutral-400 hover:text-white"
                        >
                          닫기
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            상단 메뉴 / 카테고리 이름 <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="예) 스튜디오 장비, 수강생 후기, Q&A"
                            value={newCustomCatForm.navLabel}
                            onChange={(e) =>
                              setNewCustomCatForm({
                                ...newCustomCatForm,
                                navLabel: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            섹션 큰 제목 (미입력 시 메뉴명과 동일)
                          </label>
                          <input
                            type="text"
                            placeholder="예) STUDIO EQUIPMENT"
                            value={newCustomCatForm.title}
                            onChange={(e) =>
                              setNewCustomCatForm({ ...newCustomCatForm, title: e.target.value })
                            }
                            className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            영문 배지 태그
                          </label>
                          <input
                            type="text"
                            placeholder="예) EQUIPMENT"
                            value={newCustomCatForm.badge}
                            onChange={(e) =>
                              setNewCustomCatForm({ ...newCustomCatForm, badge: e.target.value })
                            }
                            className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            표시 레이아웃 스타일
                          </label>
                          <select
                            value={newCustomCatForm.layout}
                            onChange={(e) =>
                              setNewCustomCatForm({
                                ...newCustomCatForm,
                                layout: e.target.value as 'cards' | 'list' | 'banner',
                              })
                            }
                            className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          >
                            <option value="cards">카드 그리드형 (3열 카드)</option>
                            <option value="list">리스트형 (목록/표 형태)</option>
                            <option value="banner">와이드 배너형</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          섹션 소개 설명
                        </label>
                        <input
                          type="text"
                          placeholder="카테고리에 대한 간단한 안내 문구"
                          value={newCustomCatForm.subtitle}
                          onChange={(e) =>
                            setNewCustomCatForm({ ...newCustomCatForm, subtitle: e.target.value })
                          }
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsNewCatFormOpen(false)}
                          className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded-md"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>카테고리 생성 및 배치</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* 1. Active Homepage Categories & Sections Order */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white">
                      현재 홈페이지 섹션 & 카테고리 ({sectionOrder.length}개)
                    </h4>
                    <div className="divide-y divide-white/5 border border-white/10 rounded-xl bg-neutral-900/50 overflow-hidden">
                      {sectionOrder.map((secId, index) => {
                        const builtIn = BUILTIN_SECTION_META[secId];
                        const custom = customCategories.find((c) => c.id === secId);
                        if (!builtIn && !custom) return null;

                        const title = builtIn
                          ? builtIn.title
                          : `${custom!.navLabel} (${custom!.title})`;
                        const desc = builtIn
                          ? builtIn.desc
                          : custom!.subtitle || '사용자 추가 커스텀 카테고리';
                        const visible = builtIn
                          ? homepageConfig.sections[builtIn.visKey]
                          : custom!.visible;

                        return (
                          <div
                            key={secId}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02]"
                          >
                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono text-neutral-500">
                                  #{index + 1}
                                </span>
                                <span className="text-sm font-bold text-white">{title}</span>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                    builtIn
                                      ? 'bg-white/10 text-neutral-300'
                                      : 'bg-sky-950/80 text-sky-300 border border-sky-500/30'
                                  }`}
                                >
                                  {builtIn ? '기본 카테고리' : '추가된 카테고리'}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-400 truncate">{desc}</p>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveSectionOrder(index, 'up')}
                                title="위로 이동"
                                className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-neutral-300 disabled:opacity-25"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={index === sectionOrder.length - 1}
                                onClick={() => handleMoveSectionOrder(index, 'down')}
                                title="아래로 이동"
                                className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-neutral-300 disabled:opacity-25"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (builtIn) {
                                    setHomepageConfig((prev) => ({
                                      ...prev,
                                      sections: {
                                        ...prev.sections,
                                        [builtIn.visKey]: !visible,
                                      },
                                    }));
                                  } else if (custom) {
                                    handleUpdateCustomCategory(custom.id, { visible: !visible });
                                  }
                                }}
                                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold border ${
                                  visible
                                    ? 'bg-white text-black border-white'
                                    : 'bg-neutral-950 text-neutral-400 border-white/15'
                                }`}
                              >
                                {visible ? (
                                  <>
                                    <Eye className="h-3 w-3" />
                                    <span>노출</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="h-3 w-3" />
                                    <span>숨김</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (builtIn) {
                                    setHomepageSubTab(builtIn.subTab);
                                    setActiveTab('homepage');
                                  } else if (custom) {
                                    setActiveTab(`custom:${custom.id}`);
                                  }
                                }}
                                className="px-2.5 py-1.5 rounded text-xs font-medium bg-white/10 hover:bg-white/20 text-white"
                              >
                                세부 편집
                              </button>

                              {confirmRemoveSectionId === secId ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSection(secId)}
                                    className="px-2.5 py-1.5 rounded text-xs font-bold bg-red-600 hover:bg-red-500 text-white"
                                  >
                                    제거 확인
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmRemoveSectionId(null)}
                                    className="px-2 py-1.5 rounded text-xs bg-white/10 text-neutral-300"
                                  >
                                    취소
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmRemoveSectionId(secId)}
                                  className="px-2.5 py-1.5 rounded text-xs font-medium bg-red-950/40 hover:bg-red-950/80 text-red-400"
                                >
                                  제거
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Removed Built-in Sections Recovery */}
                    {removedBuiltInSectionIds.length > 0 && (
                      <div className="p-4 rounded-xl border border-dashed border-white/15 bg-neutral-900/30 space-y-2">
                        <div className="text-xs font-semibold text-neutral-300">
                          제거된 기본 카테고리 (원할 때 다시 추가 가능)
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {removedBuiltInSectionIds.map((id) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => handleRestoreBuiltInSection(id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>{BUILTIN_SECTION_META[id].title} 다시 추가</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Portfolio (발매 작품) Sub-Categories Create / Edit / Remove */}
                  <div className="space-y-4 p-5 rounded-xl border border-white/10 bg-neutral-900/50">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        발매 작품 세부 카테고리 관리 (자유 생성 / 수정 / 제거)
                      </h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        발매 작품 상단 탭과 내비게이션 드롭다운에 표시되는 카테고리를 추가하거나 제거할 수 있습니다.
                      </p>
                    </div>

                    {/* Add Portfolio Category Form */}
                    <form
                      onSubmit={handleAddPortfolioCategory}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3.5 rounded-lg border border-white/10 bg-neutral-950/70"
                    >
                      <input
                        type="text"
                        required
                        placeholder="탭 표시명 (예: 4. OST)"
                        value={newPortfolioCatForm.label}
                        onChange={(e) =>
                          setNewPortfolioCatForm({
                            ...newPortfolioCatForm,
                            label: e.target.value,
                          })
                        }
                        className="sm:col-span-4 px-3 py-2 text-xs bg-neutral-900 border border-white/10 rounded text-white"
                      />
                      <input
                        type="text"
                        placeholder="배지 태그 (예: OST)"
                        value={newPortfolioCatForm.shortTag}
                        onChange={(e) =>
                          setNewPortfolioCatForm({
                            ...newPortfolioCatForm,
                            shortTag: e.target.value,
                          })
                        }
                        className="sm:col-span-3 px-3 py-2 text-xs bg-neutral-900 border border-white/10 rounded text-white"
                      />
                      <select
                        value={newPortfolioCatForm.aspectRatio}
                        onChange={(e) =>
                          setNewPortfolioCatForm({
                            ...newPortfolioCatForm,
                            aspectRatio: e.target.value as 'square' | 'poster',
                          })
                        }
                        className="sm:col-span-3 px-3 py-2 text-xs bg-neutral-900 border border-white/10 rounded text-white"
                      >
                        <option value="square">1:1 정사각형 (앨범)</option>
                        <option value="poster">3:4 포스터형 (방송)</option>
                      </select>
                      <button
                        type="submit"
                        className="sm:col-span-2 py-2 px-3 rounded bg-white text-black text-xs font-bold hover:bg-neutral-200 flex items-center justify-center gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>추가</span>
                      </button>
                    </form>

                    {/* List of Portfolio Categories */}
                    <div className="space-y-2.5">
                      {portfolioCategories.map((cat) => {
                        const count = releases.filter(
                          (r) => (r.category || 'MUSIC') === cat.id
                        ).length;
                        return (
                          <div
                            key={cat.id}
                            className="p-3 rounded-lg border border-white/10 bg-neutral-950/60 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                          >
                            <div className="sm:col-span-4">
                              <label className="block text-[10px] text-neutral-500 mb-0.5">
                                탭 이름 ({count}개 작품)
                              </label>
                              <input
                                type="text"
                                value={cat.label}
                                onChange={(e) =>
                                  handleUpdatePortfolioCategory(cat.id, { label: e.target.value })
                                }
                                className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-white"
                              />
                            </div>
                            <div className="sm:col-span-3">
                              <label className="block text-[10px] text-neutral-500 mb-0.5">
                                카드 상단 배지
                              </label>
                              <input
                                type="text"
                                value={cat.shortTag}
                                onChange={(e) =>
                                  handleUpdatePortfolioCategory(cat.id, {
                                    shortTag: e.target.value,
                                  })
                                }
                                className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-white"
                              />
                            </div>
                            <div className="sm:col-span-3">
                              <label className="block text-[10px] text-neutral-500 mb-0.5">
                                카드 비율
                              </label>
                              <select
                                value={cat.aspectRatio}
                                onChange={(e) =>
                                  handleUpdatePortfolioCategory(cat.id, {
                                    aspectRatio: e.target.value as 'square' | 'poster',
                                  })
                                }
                                className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-white"
                              >
                                <option value="square">1:1 정사각형</option>
                                <option value="poster">3:4 포스터형</option>
                              </select>
                            </div>
                            <div className="sm:col-span-2 flex justify-end pt-3 sm:pt-4">
                              {confirmRemovePortfolioCatId === cat.id ? (
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePortfolioCategory(cat.id)}
                                    className="px-2 py-1 rounded bg-red-600 text-white text-[11px] font-bold"
                                  >
                                    확인
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmRemovePortfolioCatId(null)}
                                    className="px-2 py-1 rounded bg-white/10 text-neutral-300 text-[11px]"
                                  >
                                    취소
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  disabled={portfolioCategories.length <= 1}
                                  onClick={() => setConfirmRemovePortfolioCatId(cat.id)}
                                  className="px-2.5 py-1.5 rounded bg-red-950/40 hover:bg-red-950/80 text-red-400 text-xs font-medium disabled:opacity-25"
                                >
                                  제거
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* TAB: CUSTOM CATEGORY EDITOR (사용자 추가 카테고리 세부 편집)         */}
              {/* ================================================================= */}
              {activeCustomCategory && (
                <div className="space-y-6 max-w-4xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <div className="text-[11px] font-mono text-sky-400 mb-1">
                        USER CUSTOM CATEGORY
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {activeCustomCategory.navLabel || activeCustomCategory.title} 관리
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateCustomCategory(activeCustomCategory.id, {
                            visible: !activeCustomCategory.visible,
                          })
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border ${
                          activeCustomCategory.visible
                            ? 'bg-white text-black border-white'
                            : 'bg-neutral-900 text-neutral-400 border-white/15'
                        }`}
                      >
                        {activeCustomCategory.visible ? (
                          <>
                            <Eye className="h-3.5 w-3.5" />
                            <span>홈페이지 노출 중</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            <span>숨김 상태</span>
                          </>
                        )}
                      </button>

                      {confirmRemoveSectionId === activeCustomCategory.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleRemoveSection(activeCustomCategory.id)}
                            className="px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-bold"
                          >
                            카테고리 완전 삭제
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmRemoveSectionId(null)}
                            className="px-2.5 py-2 rounded-lg bg-white/10 text-neutral-300 text-xs"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmRemoveSectionId(activeCustomCategory.id)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-red-950/50 hover:bg-red-950/80 text-red-400 text-xs font-semibold"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>카테고리 삭제</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Header & Layout Settings */}
                  <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          상단 메뉴(GNB) & 사이드바 이름
                        </label>
                        <input
                          type="text"
                          value={activeCustomCategory.navLabel}
                          onChange={(e) =>
                            handleUpdateCustomCategory(activeCustomCategory.id, {
                              navLabel: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                        />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2 text-xs text-neutral-200 cursor-pointer pb-2">
                          <input
                            type="checkbox"
                            checked={activeCustomCategory.showInNav}
                            onChange={(e) =>
                              handleUpdateCustomCategory(activeCustomCategory.id, {
                                showInNav: e.target.checked,
                              })
                            }
                            className="rounded border-white/20"
                          />
                          <span>상단 네비게이션 메뉴바에 표시</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          영문 배지
                        </label>
                        <input
                          type="text"
                          value={activeCustomCategory.badge}
                          onChange={(e) =>
                            handleUpdateCustomCategory(activeCustomCategory.id, {
                              badge: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          섹션 제목
                        </label>
                        <input
                          type="text"
                          value={activeCustomCategory.title}
                          onChange={(e) =>
                            handleUpdateCustomCategory(activeCustomCategory.id, {
                              title: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          레이아웃
                        </label>
                        <select
                          value={activeCustomCategory.layout}
                          onChange={(e) =>
                            handleUpdateCustomCategory(activeCustomCategory.id, {
                              layout: e.target.value as 'cards' | 'list' | 'banner',
                            })
                          }
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                        >
                          <option value="cards">카드 그리드형 (3열)</option>
                          <option value="list">리스트형 (목록)</option>
                          <option value="banner">와이드 배너형</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        섹션 부제목 (줄바꿈 지원)
                      </label>
                      <textarea
                        rows={2}
                        value={activeCustomCategory.subtitle}
                        onChange={(e) =>
                          handleUpdateCustomCategory(activeCustomCategory.id, {
                            subtitle: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                      />
                    </div>
                  </div>

                  {/* Items inside this custom category */}
                  <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">
                        카테고리 내 항목 ({activeCustomCategory.items.length}개)
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleAddCustomCard(activeCustomCategory.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-black hover:bg-neutral-200"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>새 항목 추가</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {activeCustomCategory.items.map((item, idx) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-xl border border-white/10 bg-neutral-950/70 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-neutral-400">
                              ITEM #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteCustomCard(activeCustomCategory.id, item.id)
                              }
                              className="p-1.5 rounded bg-red-950/40 hover:bg-red-950/80 text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] text-neutral-500 mb-0.5">
                                항목 제목
                              </label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) =>
                                  handleUpdateCustomCard(activeCustomCategory.id, item.id, {
                                    title: e.target.value,
                                  })
                                }
                                className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-neutral-500 mb-0.5">
                                배지 (선택)
                              </label>
                              <input
                                type="text"
                                value={item.badge || ''}
                                onChange={(e) =>
                                  handleUpdateCustomCard(activeCustomCategory.id, item.id, {
                                    badge: e.target.value,
                                  })
                                }
                                className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-neutral-500 mb-0.5">
                                부제목 / 가격 / 스펙 (선택)
                              </label>
                              <input
                                type="text"
                                value={item.subtitle || ''}
                                onChange={(e) =>
                                  handleUpdateCustomCard(activeCustomCategory.id, item.id, {
                                    subtitle: e.target.value,
                                  })
                                }
                                className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-neutral-500 mb-0.5">
                              상세 설명 (줄바꿈 지원)
                            </label>
                            <textarea
                              rows={2}
                              value={item.description}
                              onChange={(e) =>
                                handleUpdateCustomCard(activeCustomCategory.id, item.id, {
                                  description: e.target.value,
                                })
                              }
                              className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-white"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-neutral-500 mb-0.5">
                                이미지 URL (선택) 또는 파일 업로드
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="https://..."
                                  value={item.imageUrl || ''}
                                  onChange={(e) =>
                                    handleUpdateCustomCard(activeCustomCategory.id, item.id, {
                                      imageUrl: e.target.value,
                                    })
                                  }
                                  className="flex-1 px-2.5 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-white font-mono"
                                />
                                <label className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs text-white cursor-pointer shrink-0">
                                  <Upload className="h-3 w-3" />
                                  <span>업로드</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleCustomCardImageUpload(
                                        activeCustomCategory.id,
                                        item.id,
                                        e
                                      )
                                    }
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] text-neutral-500 mb-0.5">
                                외부 연결 링크 URL (선택)
                              </label>
                              <input
                                type="url"
                                placeholder="https://..."
                                value={item.linkUrl || ''}
                                onChange={(e) =>
                                  handleUpdateCustomCard(activeCustomCategory.id, item.id, {
                                    linkUrl: e.target.value,
                                  })
                                }
                                className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Optional Bottom CTA */}
                  <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-3">
                    <h4 className="text-sm font-bold text-white">하단 버튼 설정 (선택)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          버튼 텍스트 (비워두면 표시 안 함)
                        </label>
                        <input
                          type="text"
                          placeholder="예) 방문 체험 예약하기"
                          value={activeCustomCategory.ctaText || ''}
                          onChange={(e) =>
                            handleUpdateCustomCategory(activeCustomCategory.id, {
                              ctaText: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          버튼 클릭 시 이동 대상
                        </label>
                        <select
                          value={activeCustomCategory.ctaAction || 'lesson'}
                          onChange={(e) =>
                            handleUpdateCustomCategory(activeCustomCategory.id, {
                              ctaAction: e.target.value as 'lesson' | 'production' | 'link',
                            })
                          }
                          className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                        >
                          <option value="lesson">레슨 상담 신청 폼으로 이동</option>
                          <option value="production">작업 상담 신청 폼으로 이동</option>
                          <option value="link">외부 링크로 이동</option>
                        </select>
                      </div>
                    </div>
                    {activeCustomCategory.ctaAction === 'link' && (
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          이동 URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={activeCustomCategory.ctaUrl || ''}
                          onChange={(e) =>
                            handleUpdateCustomCategory(activeCustomCategory.id, {
                              ctaUrl: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ================================================================= */}
              {/* TAB: HOMEPAGE DETAIL SETTINGS                                     */}
              {/* ================================================================= */}
              {activeTab === 'homepage' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-xl font-bold text-white">홈페이지 세부 콘텐츠 설정</h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        각 섹션의 세부 문구, 금액표, 안내 카드, 상담 폼 선택지 및 푸터를 수정합니다.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('categories')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white shrink-0"
                    >
                      <FolderPlus className="h-3.5 w-3.5" />
                      <span>카테고리 추가/제거하기</span>
                    </button>
                  </div>

                  {/* Sub-tabs */}
                  <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-neutral-900 border border-white/10">
                    {homepageSubTabs.map((sub) => (
                      <button
                        key={sub.key}
                        type="button"
                        onClick={() => setHomepageSubTab(sub.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          homepageSubTab === sub.key
                            ? 'bg-white text-black shadow-sm'
                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>

                  {/* SUB-TAB: OVERVIEW */}
                  {homepageSubTab === 'overview' && (
                    <div className="space-y-6 max-w-3xl">
                      <div className="space-y-4 p-5 rounded-xl border border-white/10 bg-neutral-900/50">
                        <h4 className="text-sm font-bold text-white">상단 메뉴(GNB) 이름 편집</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { key: 'portfolio' as const, label: '메뉴 1 (발매 작품)' },
                            { key: 'pricing' as const, label: '메뉴 2 (레슨 금액)' },
                            { key: 'productionPricing' as const, label: '메뉴 3 (음원 제작 견적)' },
                            { key: 'lesson' as const, label: '메뉴 4 (레슨 문의)' },
                            { key: 'workContact' as const, label: '메뉴 5 (작업 문의)' },
                            { key: 'location' as const, label: '메뉴 6 (오시는 길)' },
                            { key: 'topCta' as const, label: '상단 우측 버튼 텍스트' },
                          ].map((field) => (
                            <div key={field.key}>
                              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                {field.label}
                              </label>
                              <input
                                type="text"
                                value={homepageConfig.navLabels[field.key]}
                                onChange={(e) =>
                                  setHomepageConfig((prev) => ({
                                    ...prev,
                                    navLabels: {
                                      ...prev.navLabels,
                                      [field.key]: e.target.value,
                                    },
                                  }))
                                }
                                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none focus:border-white/30"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB: HERO */}
                  {homepageSubTab === 'hero' && (
                    <div className="space-y-5 max-w-3xl p-5 rounded-xl border border-white/10 bg-neutral-900/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            스튜디오명 (국문)
                          </label>
                          <input
                            type="text"
                            value={content.studioName}
                            onChange={(e) => setContent({ ...content, studioName: e.target.value })}
                            className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            서브 브랜드명 (영문)
                          </label>
                          <input
                            type="text"
                            value={content.studioSubName}
                            onChange={(e) =>
                              setContent({ ...content, studioSubName: e.target.value })
                            }
                            className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          메인 헤드라인
                        </label>
                        <input
                          type="text"
                          value={content.heroHeadline}
                          onChange={(e) =>
                            setContent({ ...content, heroHeadline: e.target.value })
                          }
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          서브 소개 문구 (줄바꿈 지원)
                        </label>
                        <textarea
                          rows={3}
                          value={content.heroSubheadline}
                          onChange={(e) =>
                            setContent({ ...content, heroSubheadline: e.target.value })
                          }
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          메인 버튼 텍스트
                        </label>
                        <input
                          type="text"
                          value={homepageConfig.hero.ctaText}
                          onChange={(e) =>
                            setHomepageConfig((prev) => ({
                              ...prev,
                              hero: { ...prev.hero, ctaText: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                        />
                      </div>

                      <div className="pt-3 border-t border-white/10 space-y-3">
                        <label className="block text-xs font-semibold text-neutral-300">
                          우측 대표 로고 이미지 URL / 업로드
                        </label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="h-24 w-24 rounded-xl border border-white/15 bg-black p-2 shrink-0 flex items-center justify-center">
                            <OptimizedImage
                              src={homepageConfig.hero.logoUrl}
                              alt="로고 미리보기"
                              sizes="96px"
                              maxWidth={320}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="flex-1 w-full space-y-2">
                            <input
                              type="text"
                              value={homepageConfig.hero.logoUrl}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, logoUrl: e.target.value },
                                }))
                              }
                              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono"
                            />
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-white cursor-pointer">
                              <Upload className="h-3.5 w-3.5" />
                              <span>새 로고 이미지 업로드</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleHeroLogoUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB: PORTFOLIO HEADER */}
                  {homepageSubTab === 'portfolio' && (
                    <div className="space-y-5 max-w-3xl">
                      <div className="p-4 rounded-xl border border-white/15 bg-white/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold text-white">
                            발매 작품 추가/삭제 또는 작품 카테고리 추가/제거
                          </div>
                          <p className="text-xs text-neutral-400">
                            현재 {releases.length}개 작품 / {portfolioCategories.length}개 카테고리
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveTab('releases')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-white text-black hover:bg-neutral-200 shrink-0"
                          >
                            <span>작품 관리</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab('categories')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-white/10 text-white hover:bg-white/20 shrink-0"
                          >
                            <span>카테고리 관리</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4 p-5 rounded-xl border border-white/10 bg-neutral-900/50">
                        <h4 className="text-sm font-bold text-white">섹션 타이틀 & 전체 탭 이름</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              상단 배지
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.portfolio.badge}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  portfolio: { ...prev.portfolio, badge: e.target.value },
                                }))
                              }
                              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              섹션 제목
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.portfolio.title}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  portfolio: { ...prev.portfolio, title: e.target.value },
                                }))
                              }
                              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              전체 탭 이름
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.portfolio.allTabLabel}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  portfolio: { ...prev.portfolio, allTabLabel: e.target.value },
                                }))
                              }
                              className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            부제목 설명
                          </label>
                          <input
                            type="text"
                            value={homepageConfig.portfolio.subtitle}
                            onChange={(e) =>
                              setHomepageConfig((prev) => ({
                                ...prev,
                                portfolio: { ...prev.portfolio, subtitle: e.target.value },
                              }))
                            }
                            className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB: LESSON PRICING */}
                  {homepageSubTab === 'lessonPricing' && (
                    <div className="space-y-6 max-w-4xl">
                      <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-4">
                        <h4 className="text-sm font-bold text-white">섹션 및 카드 헤더 설정</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              상단 배지
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.lessonPricing.badge}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  lessonPricing: { ...prev.lessonPricing, badge: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              섹션 타이틀
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.lessonPricing.title}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  lessonPricing: { ...prev.lessonPricing, title: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              우측 배지
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.lessonPricing.cardBadge}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  lessonPricing: {
                                    ...prev.lessonPricing,
                                    cardBadge: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            섹션 설명 문구
                          </label>
                          <input
                            type="text"
                            value={homepageConfig.lessonPricing.subtitle}
                            onChange={(e) =>
                              setHomepageConfig((prev) => ({
                                ...prev,
                                lessonPricing: {
                                  ...prev.lessonPricing,
                                  subtitle: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              카드 상단 키커
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.lessonPricing.cardKicker}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  lessonPricing: {
                                    ...prev.lessonPricing,
                                    cardKicker: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              카드 제목
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.lessonPricing.cardTitle}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  lessonPricing: {
                                    ...prev.lessonPricing,
                                    cardTitle: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              카드 부제목
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.lessonPricing.cardSubtitle}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  lessonPricing: {
                                    ...prev.lessonPricing,
                                    cardSubtitle: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">수업 클래스 및 금액 목록</h4>
                          <button
                            type="button"
                            onClick={handleAddLessonPlan}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-black hover:bg-neutral-200"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>클래스 추가</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {homepageConfig.lessonPricing.plans.map((plan, index) => (
                            <div
                              key={plan.id}
                              className="p-3.5 rounded-lg border border-white/10 bg-neutral-950/70 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                            >
                              <div className="sm:col-span-4">
                                <label className="block text-[10px] text-neutral-500 mb-0.5">
                                  CLASS 이름
                                </label>
                                <input
                                  type="text"
                                  value={plan.name}
                                  onChange={(e) =>
                                    handleUpdateLessonPlan(plan.id, { name: e.target.value })
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-white"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] text-neutral-500 mb-0.5">
                                  TIME
                                </label>
                                <input
                                  type="text"
                                  value={plan.time}
                                  onChange={(e) =>
                                    handleUpdateLessonPlan(plan.id, { time: e.target.value })
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-white"
                                />
                              </div>
                              <div className="sm:col-span-3">
                                <label className="block text-[10px] text-neutral-500 mb-0.5">
                                  MONTHLY 가격
                                </label>
                                <input
                                  type="text"
                                  value={plan.price}
                                  onChange={(e) =>
                                    handleUpdateLessonPlan(plan.id, { price: e.target.value })
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-white font-mono"
                                />
                              </div>
                              <div className="sm:col-span-3 flex items-center justify-end gap-1.5 pt-3 sm:pt-4">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateLessonPlan(plan.id, { popular: !plan.popular })
                                  }
                                  className={`px-2 py-1.5 rounded text-[11px] font-bold border transition-colors ${
                                    plan.popular
                                      ? 'bg-white text-black border-white'
                                      : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                                  }`}
                                >
                                  추천
                                </button>
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => handleMoveLessonPlan(index, 'up')}
                                  className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-neutral-300 disabled:opacity-25"
                                >
                                  <ArrowUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={index === homepageConfig.lessonPricing.plans.length - 1}
                                  onClick={() => handleMoveLessonPlan(index, 'down')}
                                  className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-neutral-300 disabled:opacity-25"
                                >
                                  <ArrowDown className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLessonPlan(plan.id)}
                                  className="p-1.5 rounded bg-red-950/40 hover:bg-red-950/80 text-red-400"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-3">
                        <h4 className="text-sm font-bold text-white">하단 안내 문구 및 버튼</h4>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            안내 문구 1
                          </label>
                          <input
                            type="text"
                            value={homepageConfig.lessonPricing.footnotePrimary}
                            onChange={(e) =>
                              setHomepageConfig((prev) => ({
                                ...prev,
                                lessonPricing: {
                                  ...prev.lessonPricing,
                                  footnotePrimary: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            안내 문구 2
                          </label>
                          <input
                            type="text"
                            value={homepageConfig.lessonPricing.footnoteSecondary}
                            onChange={(e) =>
                              setHomepageConfig((prev) => ({
                                ...prev,
                                lessonPricing: {
                                  ...prev.lessonPricing,
                                  footnoteSecondary: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            하단 예약 버튼 텍스트
                          </label>
                          <input
                            type="text"
                            value={homepageConfig.lessonPricing.ctaText}
                            onChange={(e) =>
                              setHomepageConfig((prev) => ({
                                ...prev,
                                lessonPricing: {
                                  ...prev.lessonPricing,
                                  ctaText: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB: PRODUCTION PRICING */}
                  {homepageSubTab === 'productionPricing' && (
                    <div className="space-y-6 max-w-4xl">
                      <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-4">
                        <h4 className="text-sm font-bold text-white">섹션 및 카드 헤더 설정</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              상단 배지
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.productionPricing.badge}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  productionPricing: {
                                    ...prev.productionPricing,
                                    badge: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              섹션 타이틀
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.productionPricing.title}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  productionPricing: {
                                    ...prev.productionPricing,
                                    title: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              우측 배지
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.productionPricing.cardBadge}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  productionPricing: {
                                    ...prev.productionPricing,
                                    cardBadge: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            섹션 설명 문구
                          </label>
                          <input
                            type="text"
                            value={homepageConfig.productionPricing.subtitle}
                            onChange={(e) =>
                              setHomepageConfig((prev) => ({
                                ...prev,
                                productionPricing: {
                                  ...prev.productionPricing,
                                  subtitle: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              카드 상단 키커
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.productionPricing.cardKicker}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  productionPricing: {
                                    ...prev.productionPricing,
                                    cardKicker: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              카드 제목
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.productionPricing.cardTitle}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  productionPricing: {
                                    ...prev.productionPricing,
                                    cardTitle: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              카드 부제목
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.productionPricing.cardSubtitle}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  productionPricing: {
                                    ...prev.productionPricing,
                                    cardSubtitle: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white">음원 제작 견적 항목 목록</h4>
                          <button
                            type="button"
                            onClick={handleAddProductionService}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-black hover:bg-neutral-200"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>항목 추가</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {homepageConfig.productionPricing.services.map((svc, index) => (
                            <div
                              key={svc.id}
                              className="p-3.5 rounded-lg border border-white/10 bg-neutral-950/70 space-y-2.5"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                                <div className="sm:col-span-4">
                                  <label className="block text-[10px] text-neutral-500 mb-0.5">
                                    SERVICE 항목명
                                  </label>
                                  <input
                                    type="text"
                                    value={svc.service}
                                    onChange={(e) =>
                                      handleUpdateProductionService(svc.id, {
                                        service: e.target.value,
                                      })
                                    }
                                    className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-white"
                                  />
                                </div>
                                <div className="sm:col-span-3">
                                  <label className="block text-[10px] text-neutral-500 mb-0.5">
                                    PRICE (예: 상담 문의 / 250,000원)
                                  </label>
                                  <input
                                    type="text"
                                    value={svc.price}
                                    onChange={(e) =>
                                      handleUpdateProductionService(svc.id, {
                                        price: e.target.value,
                                      })
                                    }
                                    className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-white font-mono"
                                  />
                                </div>
                                <div className="sm:col-span-3">
                                  <label className="block text-[10px] text-neutral-500 mb-0.5">
                                    가격 보조 표기 (예: (가요 4분 기준))
                                  </label>
                                  <input
                                    type="text"
                                    value={svc.priceNote || ''}
                                    onChange={(e) =>
                                      handleUpdateProductionService(svc.id, {
                                        priceNote: e.target.value,
                                      })
                                    }
                                    className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-white"
                                  />
                                </div>
                                <div className="sm:col-span-2 flex items-center justify-end gap-1.5 pt-3 sm:pt-4">
                                  <button
                                    type="button"
                                    disabled={index === 0}
                                    onClick={() => handleMoveProductionService(index, 'up')}
                                    className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-neutral-300 disabled:opacity-25"
                                  >
                                    <ArrowUp className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={
                                      index ===
                                      homepageConfig.productionPricing.services.length - 1
                                    }
                                    onClick={() => handleMoveProductionService(index, 'down')}
                                    className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-neutral-300 disabled:opacity-25"
                                  >
                                    <ArrowDown className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProductionService(svc.id)}
                                    className="p-1.5 rounded bg-red-950/40 hover:bg-red-950/80 text-red-400"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] text-neutral-500 mb-0.5">
                                  항목 하단 설명
                                </label>
                                <input
                                  type="text"
                                  value={svc.note}
                                  onChange={(e) =>
                                    handleUpdateProductionService(svc.id, { note: e.target.value })
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs bg-neutral-900 border border-white/10 rounded text-neutral-200"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-3">
                        <h4 className="text-sm font-bold text-white">하단 안내 문구 및 버튼</h4>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            안내 문구 1
                          </label>
                          <input
                            type="text"
                            value={homepageConfig.productionPricing.footnotePrimary}
                            onChange={(e) =>
                              setHomepageConfig((prev) => ({
                                ...prev,
                                productionPricing: {
                                  ...prev.productionPricing,
                                  footnotePrimary: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            안내 문구 2
                          </label>
                          <input
                            type="text"
                            value={homepageConfig.productionPricing.footnoteSecondary}
                            onChange={(e) =>
                              setHomepageConfig((prev) => ({
                                ...prev,
                                productionPricing: {
                                  ...prev.productionPricing,
                                  footnoteSecondary: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            하단 작업 의뢰 버튼 텍스트
                          </label>
                          <input
                            type="text"
                            value={homepageConfig.productionPricing.ctaText}
                            onChange={(e) =>
                              setHomepageConfig((prev) => ({
                                ...prev,
                                productionPricing: {
                                  ...prev.productionPricing,
                                  ctaText: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB: LESSON SECTION */}
                  {homepageSubTab === 'lessonSection' && (
                    <div className="space-y-6 max-w-3xl">
                      <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-4">
                        <h4 className="text-sm font-bold text-white">섹션 헤더</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              상단 배지
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.lessonSection.badge}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  lessonSection: { ...prev.lessonSection, badge: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              섹션 제목
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.lessonSection.title}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  lessonSection: { ...prev.lessonSection, title: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-white">3개 안내 카드 내용</h4>
                        {homepageConfig.lessonSection.cards.map((card, idx) => (
                          <div
                            key={card.id}
                            className="p-4 rounded-xl border border-white/10 bg-neutral-900/50 space-y-3"
                          >
                            <div className="text-xs font-mono text-neutral-400">
                              CARD {idx + 1}
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                카드 제목 (줄바꿈 지원)
                              </label>
                              <textarea
                                rows={2}
                                value={card.title}
                                onChange={(e) =>
                                  setHomepageConfig((prev) => ({
                                    ...prev,
                                    lessonSection: {
                                      ...prev.lessonSection,
                                      cards: prev.lessonSection.cards.map((c) =>
                                        c.id === card.id ? { ...c, title: e.target.value } : c
                                      ),
                                    },
                                  }))
                                }
                                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                카드 본문 (줄바꿈 지원)
                              </label>
                              <textarea
                                rows={2}
                                value={card.description}
                                onChange={(e) =>
                                  setHomepageConfig((prev) => ({
                                    ...prev,
                                    lessonSection: {
                                      ...prev.lessonSection,
                                      cards: prev.lessonSection.cards.map((c) =>
                                        c.id === card.id
                                          ? { ...c, description: e.target.value }
                                          : c
                                      ),
                                    },
                                  }))
                                }
                                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-3">
                        <h4 className="text-sm font-bold text-white">하단 상담 유도 배너</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              키커 문구
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.lessonSection.ctaKicker}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  lessonSection: {
                                    ...prev.lessonSection,
                                    ctaKicker: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              버튼 텍스트
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.lessonSection.ctaButtonText}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  lessonSection: {
                                    ...prev.lessonSection,
                                    ctaButtonText: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            배너 메인 제목
                          </label>
                          <input
                            type="text"
                            value={homepageConfig.lessonSection.ctaTitle}
                            onChange={(e) =>
                              setHomepageConfig((prev) => ({
                                ...prev,
                                lessonSection: {
                                  ...prev.lessonSection,
                                  ctaTitle: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB: CONTACT SECTION */}
                  {homepageSubTab === 'contactSection' && (
                    <div className="space-y-6 max-w-4xl">
                      <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-4">
                        <h4 className="text-sm font-bold text-white">섹션 헤더 & 위치 카드 정보</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              상단 영문 키커
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.contactSection.kicker}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  contactSection: {
                                    ...prev.contactSection,
                                    kicker: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              섹션 제목
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.contactSection.title}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  contactSection: {
                                    ...prev.contactSection,
                                    title: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            섹션 부제목
                          </label>
                          <input
                            type="text"
                            value={homepageConfig.contactSection.subtitle}
                            onChange={(e) =>
                              setHomepageConfig((prev) => ({
                                ...prev,
                                contactSection: {
                                  ...prev.contactSection,
                                  subtitle: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              스튜디오 도로명 / 지번 주소
                            </label>
                            <input
                              type="text"
                              value={content.studioAddress}
                              onChange={(e) =>
                                setContent({ ...content, studioAddress: e.target.value })
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              지도 앱 길찾기 링크
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.contactSection.mapLinkUrl}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  contactSection: {
                                    ...prev.contactSection,
                                    mapLinkUrl: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              위치 카드 제목
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.contactSection.locationCardTitle}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  contactSection: {
                                    ...prev.contactSection,
                                    locationCardTitle: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              지역 영문 태그
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.contactSection.regionTag}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  contactSection: {
                                    ...prev.contactSection,
                                    regionTag: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              지역 배지
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.contactSection.landmarkTag}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  contactSection: {
                                    ...prev.contactSection,
                                    landmarkTag: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              호수 / 예약 태그
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.contactSection.roomTag}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  contactSection: {
                                    ...prev.contactSection,
                                    roomTag: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-4">
                        <h4 className="text-sm font-bold text-white">연락처 · SNS · 운영 시간</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              전화/문자 번호
                            </label>
                            <input
                              type="text"
                              value={content.contactPhone}
                              onChange={(e) =>
                                setContent({ ...content, contactPhone: e.target.value })
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              이메일 주소
                            </label>
                            <input
                              type="email"
                              value={content.contactEmail}
                              onChange={(e) =>
                                setContent({ ...content, contactEmail: e.target.value })
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              카카오톡 채널 표기명
                            </label>
                            <input
                              type="text"
                              value={content.kakaoId}
                              onChange={(e) => setContent({ ...content, kakaoId: e.target.value })}
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              카카오톡 채널 URL
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.contactSection.kakaoUrl}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  contactSection: {
                                    ...prev.contactSection,
                                    kakaoUrl: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              인스타그램 아이디
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.contactSection.instagramHandle}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  contactSection: {
                                    ...prev.contactSection,
                                    instagramHandle: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              인스타그램 URL
                            </label>
                            <input
                              type="text"
                              value={content.instagramUrl}
                              onChange={(e) =>
                                setContent({ ...content, instagramUrl: e.target.value })
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              평일 운영 시간
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.contactSection.weekdayHours}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  contactSection: {
                                    ...prev.contactSection,
                                    weekdayHours: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              주말 운영 시간
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.contactSection.weekendHours}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  contactSection: {
                                    ...prev.contactSection,
                                    weekendHours: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/50 space-y-5">
                        <h4 className="text-sm font-bold text-white">상담 신청 폼 선택 항목 관리</h4>

                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-neutral-300">
                            레슨 상담 — 희망 수강 과정 목록
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="새 과정명 입력 (예: [입시반] 작곡 전공)"
                              value={newLessonCourseOption}
                              onChange={(e) => setNewLessonCourseOption(e.target.value)}
                              className="flex-1 px-3 py-1.5 text-xs bg-neutral-950 border border-white/10 rounded text-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!newLessonCourseOption.trim()) return;
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  contactSection: {
                                    ...prev.contactSection,
                                    lessonCourses: [
                                      ...prev.contactSection.lessonCourses,
                                      newLessonCourseOption.trim(),
                                    ],
                                  },
                                }));
                                setNewLessonCourseOption('');
                                showSavedMessage('수강 과정 옵션이 추가되었습니다.');
                              }}
                              className="px-3 py-1.5 rounded bg-white text-black text-xs font-bold hover:bg-neutral-200"
                            >
                              추가
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            {homepageConfig.contactSection.lessonCourses.map((opt, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) =>
                                    setHomepageConfig((prev) => ({
                                      ...prev,
                                      contactSection: {
                                        ...prev.contactSection,
                                        lessonCourses: prev.contactSection.lessonCourses.map(
                                          (item, i) => (i === idx ? e.target.value : item)
                                        ),
                                      },
                                    }))
                                  }
                                  className="flex-1 px-2.5 py-1.5 text-xs bg-neutral-950 border border-white/10 rounded text-white"
                                />
                                <button
                                  type="button"
                                  disabled={homepageConfig.contactSection.lessonCourses.length <= 1}
                                  onClick={() =>
                                    setHomepageConfig((prev) => ({
                                      ...prev,
                                      contactSection: {
                                        ...prev.contactSection,
                                        lessonCourses: prev.contactSection.lessonCourses.filter(
                                          (_, i) => i !== idx
                                        ),
                                      },
                                    }))
                                  }
                                  className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-950/80 disabled:opacity-30"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-white/10">
                          <label className="block text-xs font-semibold text-neutral-300">
                            작업 의뢰 — 작업 의뢰 분야 목록
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="새 작업 의뢰 분야 입력"
                              value={newProductionTypeOption}
                              onChange={(e) => setNewProductionTypeOption(e.target.value)}
                              className="flex-1 px-3 py-1.5 text-xs bg-neutral-950 border border-white/10 rounded text-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!newProductionTypeOption.trim()) return;
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  contactSection: {
                                    ...prev.contactSection,
                                    productionTypes: [
                                      ...prev.contactSection.productionTypes,
                                      newProductionTypeOption.trim(),
                                    ],
                                  },
                                }));
                                setNewProductionTypeOption('');
                                showSavedMessage('작업 의뢰 분야 옵션이 추가되었습니다.');
                              }}
                              className="px-3 py-1.5 rounded bg-white text-black text-xs font-bold hover:bg-neutral-200"
                            >
                              추가
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            {homepageConfig.contactSection.productionTypes.map((opt, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) =>
                                    setHomepageConfig((prev) => ({
                                      ...prev,
                                      contactSection: {
                                        ...prev.contactSection,
                                        productionTypes: prev.contactSection.productionTypes.map(
                                          (item, i) => (i === idx ? e.target.value : item)
                                        ),
                                      },
                                    }))
                                  }
                                  className="flex-1 px-2.5 py-1.5 text-xs bg-neutral-950 border border-white/10 rounded text-white"
                                />
                                <button
                                  type="button"
                                  disabled={
                                    homepageConfig.contactSection.productionTypes.length <= 1
                                  }
                                  onClick={() =>
                                    setHomepageConfig((prev) => ({
                                      ...prev,
                                      contactSection: {
                                        ...prev.contactSection,
                                        productionTypes:
                                          prev.contactSection.productionTypes.filter(
                                            (_, i) => i !== idx
                                          ),
                                      },
                                    }))
                                  }
                                  className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-950/80 disabled:opacity-30"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-white/10">
                          <label className="block text-xs font-semibold text-neutral-300">
                            공통 — 현재 음악 경험 목록
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="새 경험 단계 입력"
                              value={newExperienceLevelOption}
                              onChange={(e) => setNewExperienceLevelOption(e.target.value)}
                              className="flex-1 px-3 py-1.5 text-xs bg-neutral-950 border border-white/10 rounded text-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!newExperienceLevelOption.trim()) return;
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  contactSection: {
                                    ...prev.contactSection,
                                    experienceLevels: [
                                      ...prev.contactSection.experienceLevels,
                                      newExperienceLevelOption.trim(),
                                    ],
                                  },
                                }));
                                setNewExperienceLevelOption('');
                                showSavedMessage('음악 경험 옵션이 추가되었습니다.');
                              }}
                              className="px-3 py-1.5 rounded bg-white text-black text-xs font-bold hover:bg-neutral-200"
                            >
                              추가
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            {homepageConfig.contactSection.experienceLevels.map((opt, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) =>
                                    setHomepageConfig((prev) => ({
                                      ...prev,
                                      contactSection: {
                                        ...prev.contactSection,
                                        experienceLevels:
                                          prev.contactSection.experienceLevels.map((item, i) =>
                                            i === idx ? e.target.value : item
                                          ),
                                      },
                                    }))
                                  }
                                  className="flex-1 px-2.5 py-1.5 text-xs bg-neutral-950 border border-white/10 rounded text-white"
                                />
                                <button
                                  type="button"
                                  disabled={
                                    homepageConfig.contactSection.experienceLevels.length <= 1
                                  }
                                  onClick={() =>
                                    setHomepageConfig((prev) => ({
                                      ...prev,
                                      contactSection: {
                                        ...prev.contactSection,
                                        experienceLevels:
                                          prev.contactSection.experienceLevels.filter(
                                            (_, i) => i !== idx
                                          ),
                                      },
                                    }))
                                  }
                                  className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-950/80 disabled:opacity-30"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              신청 버튼 하단 안내 문구
                            </label>
                            <input
                              type="text"
                              value={homepageConfig.contactSection.submitNotice}
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  contactSection: {
                                    ...prev.contactSection,
                                    submitNotice: e.target.value,
                                  },
                                }))
                              }
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                              상담 신청 알림 수신 이메일
                            </label>
                            <input
                              type="email"
                              value={
                                homepageConfig.contactSection.notificationEmail ??
                                'sm93425@naver.com'
                              }
                              onChange={(e) =>
                                setHomepageConfig((prev) => ({
                                  ...prev,
                                  contactSection: {
                                    ...prev.contactSection,
                                    notificationEmail: e.target.value,
                                  },
                                }))
                              }
                              placeholder="sm93425@naver.com"
                              className="w-full px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB: FOOTER */}
                  {homepageSubTab === 'footerSection' && (
                    <div className="space-y-4 max-w-3xl p-5 rounded-xl border border-white/10 bg-neutral-900/50">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <h4 className="text-sm font-bold text-white">하단 푸터(Footer) 설정</h4>
                        <button
                          type="button"
                          onClick={() =>
                            setHomepageConfig((prev) => ({
                              ...prev,
                              sections: {
                                ...prev.sections,
                                footerVisible: !prev.sections.footerVisible,
                              },
                            }))
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold border ${
                            homepageConfig.sections.footerVisible
                              ? 'bg-white text-black border-white'
                              : 'bg-neutral-950 text-neutral-400 border-white/15'
                          }`}
                        >
                          {homepageConfig.sections.footerVisible ? '노출 중' : '숨김'}
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          슬로건 / 핵심 서비스 라인
                        </label>
                        <input
                          type="text"
                          value={homepageConfig.footerSection.tagline}
                          onChange={(e) =>
                            setHomepageConfig((prev) => ({
                              ...prev,
                              footerSection: { ...prev.footerSection, tagline: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          사업자 / 대표 정보 라인
                        </label>
                        <input
                          type="text"
                          value={homepageConfig.footerSection.businessInfo}
                          onChange={(e) =>
                            setHomepageConfig((prev) => ({
                              ...prev,
                              footerSection: {
                                ...prev.footerSection,
                                businessInfo: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          네이버 플레이스 PC URL
                        </label>
                        <input
                          type="text"
                          value={homepageConfig.footerSection.naverPcUrl}
                          onChange={(e) =>
                            setHomepageConfig((prev) => ({
                              ...prev,
                              footerSection: {
                                ...prev.footerSection,
                                naverPcUrl: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          네이버 플레이스 모바일 URL
                        </label>
                        <input
                          type="text"
                          value={homepageConfig.footerSection.naverMobileUrl}
                          onChange={(e) =>
                            setHomepageConfig((prev) => ({
                              ...prev,
                              footerSection: {
                                ...prev.footerSection,
                                naverMobileUrl: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB: EVENT POPUP */}
                  {homepageSubTab === 'eventPopup' && (
                    <div className="space-y-4 max-w-3xl p-5 rounded-xl border border-white/10 bg-neutral-900/50">
                      {(() => {
                        const popup =
                          homepageConfig.eventPopup || INITIAL_HOMEPAGE_CONFIG.eventPopup!;
                        const updatePopup = (patch: Partial<typeof popup>) =>
                          setHomepageConfig((prev) => ({
                            ...prev,
                            eventPopup: {
                              ...(prev.eventPopup || INITIAL_HOMEPAGE_CONFIG.eventPopup!),
                              ...patch,
                            },
                          }));
                        return (
                          <>
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                              <div>
                                <h4 className="text-sm font-bold text-white">
                                  이벤트 팝업창 설정
                                </h4>
                                <p className="text-[11px] text-neutral-400 mt-0.5">
                                  홈페이지 첫 진입 시 노출되는 프로모션 팝업의 노출 여부와 문구를 관리합니다.
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    localStorage.removeItem('jz_event_popup_hide_date');
                                    showSavedMessage(
                                      '오늘 하루 보지 않기 기록이 초기화되었습니다.'
                                    );
                                  }}
                                  className="px-3 py-1 rounded text-xs font-medium bg-neutral-950 text-neutral-300 hover:text-white border border-white/15"
                                >
                                  오늘 숨김 초기화
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updatePopup({ enabled: !popup.enabled })}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold border ${
                                    popup.enabled
                                      ? 'bg-white text-black border-white'
                                      : 'bg-neutral-950 text-neutral-400 border-white/15'
                                  }`}
                                >
                                  {popup.enabled ? '노출 중' : '숨김'}
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                  상단 배지
                                </label>
                                <input
                                  type="text"
                                  value={popup.badge}
                                  onChange={(e) => updatePopup({ badge: e.target.value })}
                                  className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                  행사 제목
                                </label>
                                <input
                                  type="text"
                                  value={popup.title}
                                  onChange={(e) => updatePopup({ title: e.target.value })}
                                  className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                메인 혜택 상품명 1
                              </label>
                              <input
                                type="text"
                                value={popup.headline}
                                onChange={(e) => updatePopup({ headline: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                  기존 금액 1 (취소선)
                                </label>
                                <input
                                  type="text"
                                  value={popup.originalPrice}
                                  onChange={(e) => updatePopup({ originalPrice: e.target.value })}
                                  className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                  특가 금액 1
                                </label>
                                <input
                                  type="text"
                                  value={popup.salePrice}
                                  onChange={(e) => updatePopup({ salePrice: e.target.value })}
                                  className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                  행사 기간 안내 1
                                </label>
                                <input
                                  type="text"
                                  value={popup.periodText}
                                  onChange={(e) => updatePopup({ periodText: e.target.value })}
                                  className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                                />
                              </div>
                            </div>

                            <div className="pt-3 border-t border-white/10 space-y-4">
                              <div>
                                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                  추가 혜택 상품명 2 (미디 스트링 등 · 비우면 숨김)
                                </label>
                                <input
                                  type="text"
                                  value={popup.secondaryHeadline || ''}
                                  onChange={(e) =>
                                    updatePopup({ secondaryHeadline: e.target.value })
                                  }
                                  className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                    기존 금액 2 (취소선)
                                  </label>
                                  <input
                                    type="text"
                                    value={popup.secondaryOriginalPrice || ''}
                                    onChange={(e) =>
                                      updatePopup({ secondaryOriginalPrice: e.target.value })
                                    }
                                    className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                    특가 금액 2
                                  </label>
                                  <input
                                    type="text"
                                    value={popup.secondarySalePrice || ''}
                                    onChange={(e) =>
                                      updatePopup({ secondarySalePrice: e.target.value })
                                    }
                                    className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                    행사 기간 안내 2
                                  </label>
                                  <input
                                    type="text"
                                    value={popup.secondaryPeriodText || ''}
                                    onChange={(e) =>
                                      updatePopup({ secondaryPeriodText: e.target.value })
                                    }
                                    className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                보조 설명 문구
                              </label>
                              <textarea
                                rows={2}
                                value={popup.description}
                                onChange={(e) => updatePopup({ description: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                버튼 문구 (클릭 시 작업 문의 폼으로 이동)
                              </label>
                              <input
                                type="text"
                                value={popup.ctaText}
                                onChange={(e) => updatePopup({ ctaText: e.target.value })}
                                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                              />
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-neutral-400 pt-2">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                    <span>모든 수정 사항은 홈페이지에 실시간으로 반영되며 브라우저에 자동 저장됩니다.</span>
                  </div>
                </div>
              )}

              {/* TAB: TYPOGRAPHY & FONT SIZE THEME */}
              {activeTab === 'typography' && (
                <div className="space-y-8 max-w-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        글씨체 & 글씨 크기 테마 설정
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        홈페이지 전체에 적용되는 서체와 PC·모바일 화면별 글씨 크기를 실시간으로 조절합니다.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTheme((prev) => ({
                          ...prev,
                          fontFamily: 'sans',
                          fontSizeScale: 100,
                          mobileFontSizeScale: 100,
                        }));
                        showSavedMessage('글씨체 및 글씨 크기가 기본값(100%)으로 복원되었습니다.');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:text-white border border-white/15 hover:bg-white/5 transition-colors shrink-0"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>기본값 초기화</span>
                    </button>
                  </div>

                  {/* Font Family Picker */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-neutral-300">
                      홈페이지 서체 (글씨체)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(
                        [
                          {
                            id: 'sans',
                            name: '모던 산스 (기본)',
                            desc: 'Plus Jakarta Sans + Noto Sans KR',
                            previewClass: "font-['Plus_Jakarta_Sans','Noto_Sans_KR',sans-serif]",
                          },
                          {
                            id: 'ibm',
                            name: 'IBM 플렉스 고딕',
                            desc: 'IBM Plex Sans KR — 깔끔한 스튜디오 고딕',
                            previewClass: "font-['IBM_Plex_Sans_KR',sans-serif]",
                          },
                          {
                            id: 'serif',
                            name: '에디토리얼 명조',
                            desc: 'Noto Serif KR — 클래식 & 감성 세리프',
                            previewClass: "font-['Noto_Serif_KR',Georgia,serif]",
                          },
                          {
                            id: 'mono',
                            name: '스튜디오 모노스페이스',
                            desc: 'JetBrains Mono — 정밀한 프로덕션 서체',
                            previewClass: "font-['JetBrains_Mono','Noto_Sans_KR',monospace]",
                          },
                        ] as const
                      ).map((font) => {
                        const isSelected = theme.fontFamily === font.id;
                        return (
                          <button
                            key={font.id}
                            type="button"
                            onClick={() => {
                              setTheme((prev) => ({ ...prev, fontFamily: font.id }));
                              showSavedMessage(`서체가 [${font.name}]으로 변경되었습니다.`);
                            }}
                            className={`p-4 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'bg-white text-black border-white shadow-lg'
                                : 'bg-neutral-900/80 text-neutral-300 border-white/10 hover:border-white/25'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm font-bold ${font.previewClass}`}>
                                {font.name}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black text-white">
                                  적용중
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-[11px] mb-2 ${
                                isSelected ? 'text-neutral-600' : 'text-neutral-500'
                              }`}
                            >
                              {font.desc}
                            </p>
                            <div
                              className={`text-xs pt-2 border-t ${
                                isSelected ? 'border-black/10 text-neutral-800' : 'border-white/5 text-neutral-300'
                              } ${font.previewClass}`}
                            >
                              JG MUSIC STUDIO · 작곡·편곡·미디 레슨
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Desktop Font Size Scale */}
                  <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">PC 버전 전체 글씨 크기</h4>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          태블릿·데스크톱 화면(640px 이상)에 적용되는 글자 비율입니다.
                        </p>
                      </div>
                      <span className="text-sm font-mono font-bold text-white px-2.5 py-1 rounded bg-white/10">
                        {theme.fontSizeScale ?? 100}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min={85}
                      max={125}
                      step={5}
                      value={theme.fontSizeScale ?? 100}
                      onChange={(e) =>
                        setTheme((prev) => ({ ...prev, fontSizeScale: Number(e.target.value) }))
                      }
                      className="w-full accent-white cursor-pointer"
                    />

                    <div className="grid grid-cols-5 gap-2">
                      {[90, 95, 100, 110, 120].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            setTheme((prev) => ({ ...prev, fontSizeScale: val }));
                            showSavedMessage(`PC 글씨 크기가 ${val}%로 설정되었습니다.`);
                          }}
                          className={`py-2 rounded-lg text-xs font-semibold border transition-colors ${
                            (theme.fontSizeScale ?? 100) === val
                              ? 'bg-white text-black border-white'
                              : 'bg-neutral-950 text-neutral-300 border-white/10 hover:border-white/25'
                          }`}
                        >
                          {val === 100 ? '100% (기본)' : `${val}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Font Size Scale */}
                  <div className="p-5 rounded-xl border border-white/10 bg-neutral-900/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">모바일 버전 전체 글씨 크기</h4>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          스마트폰 세로 화면(640px 미만)에 별도로 적용되는 글자 비율입니다.
                        </p>
                      </div>
                      <span className="text-sm font-mono font-bold text-white px-2.5 py-1 rounded bg-white/10">
                        {theme.mobileFontSizeScale ?? 100}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min={85}
                      max={125}
                      step={5}
                      value={theme.mobileFontSizeScale ?? 100}
                      onChange={(e) =>
                        setTheme((prev) => ({
                          ...prev,
                          mobileFontSizeScale: Number(e.target.value),
                        }))
                      }
                      className="w-full accent-white cursor-pointer"
                    />

                    <div className="grid grid-cols-5 gap-2">
                      {[90, 95, 100, 110, 120].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            setTheme((prev) => ({ ...prev, mobileFontSizeScale: val }));
                            showSavedMessage(`모바일 글씨 크기가 ${val}%로 설정되었습니다.`);
                          }}
                          className={`py-2 rounded-lg text-xs font-semibold border transition-colors ${
                            (theme.mobileFontSizeScale ?? 100) === val
                              ? 'bg-white text-black border-white'
                              : 'bg-neutral-950 text-neutral-300 border-white/10 hover:border-white/25'
                          }`}
                        >
                          {val === 100 ? '100% (기본)' : `${val}%`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PASSWORD CHANGE */}
              {activeTab === 'password' && (
                <div className="space-y-6 max-w-lg">
                  <div className="pb-4 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">관리자 비밀번호 변경</h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      기존 비밀번호를 확인한 뒤 새로운 비밀번호를 2번 입력해 안전하게 변경합니다.
                    </p>
                  </div>

                  <form
                    onSubmit={handleChangePassword}
                    className="p-6 rounded-xl border border-white/10 bg-neutral-900/60 space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        기존 비밀번호 <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPw ? 'text' : 'password'}
                          required
                          placeholder="현재 사용 중인 비밀번호를 입력하세요"
                          value={currentPasswordInput}
                          onChange={(e) => {
                            setCurrentPasswordInput(e.target.value);
                            setPasswordChangeError('');
                            setPasswordChangeSuccess('');
                          }}
                          className="w-full px-3.5 py-2.5 pr-10 text-xs bg-neutral-950 border border-white/10 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPw((v) => !v)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white"
                          aria-label={showCurrentPw ? '비밀번호 숨기기' : '비밀번호 보기'}
                        >
                          {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          변경할 비밀번호 <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPw ? 'text' : 'password'}
                            required
                            placeholder="새 비밀번호 (4자 이상)"
                            value={newPasswordInput}
                            onChange={(e) => {
                              setNewPasswordInput(e.target.value);
                              setPasswordChangeError('');
                              setPasswordChangeSuccess('');
                            }}
                            className="w-full px-3.5 py-2.5 pr-10 text-xs bg-neutral-950 border border-white/10 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPw((v) => !v)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white"
                            aria-label={showNewPw ? '비밀번호 숨기기' : '비밀번호 보기'}
                          >
                            {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                          변경할 비밀번호 재확인 <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPw ? 'text' : 'password'}
                            required
                            placeholder="새 비밀번호를 한 번 더 입력하세요"
                            value={confirmPasswordInput}
                            onChange={(e) => {
                              setConfirmPasswordInput(e.target.value);
                              setPasswordChangeError('');
                              setPasswordChangeSuccess('');
                            }}
                            className="w-full px-3.5 py-2.5 pr-10 text-xs bg-neutral-950 border border-white/10 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPw((v) => !v)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white"
                            aria-label={showConfirmPw ? '비밀번호 숨기기' : '비밀번호 보기'}
                          >
                            {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {confirmPasswordInput.length > 0 && (
                          <p
                            className={`mt-1.5 text-[11px] font-medium ${
                              newPasswordInput === confirmPasswordInput
                                ? 'text-emerald-400'
                                : 'text-red-400'
                            }`}
                          >
                            {newPasswordInput === confirmPasswordInput
                              ? '새 비밀번호가 일치합니다.'
                              : '새 비밀번호가 일치하지 않습니다.'}
                          </p>
                        )}
                      </div>
                    </div>

                    {passwordChangeError && (
                      <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{passwordChangeError}</span>
                      </div>
                    )}

                    {passwordChangeSuccess && (
                      <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <span>{passwordChangeSuccess}</span>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-lg text-xs font-bold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <KeyRound className="h-4 w-4" />
                        <span>비밀번호 변경 저장</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: CONTENT & CREDITS */}
              {activeTab === 'content' && (
                <div className="space-y-8 max-w-3xl">
                  <div className="pb-4 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">
                      프로듀서 & 크레딧 관리 (Site Content)
                    </h3>
                    <p className="text-xs text-neutral-400">
                      프로듀서 정보, 디스코그래피 크레딧 및 연락처/SNS 링크를 편집합니다.
                    </p>
                  </div>

                  <div className="space-y-4 p-5 rounded-xl border border-white/10 bg-neutral-900/60">
                    <h4 className="text-sm font-bold text-white">디렉터 / 프로듀서 정보</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          프로듀서 이름
                        </label>
                        <input
                          type="text"
                          value={content.producerName}
                          onChange={(e) => setContent({ ...content, producerName: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          직책 / 역할
                        </label>
                        <input
                          type="text"
                          value={content.producerRole}
                          onChange={(e) => setContent({ ...content, producerRole: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        프로듀서 소개글 (Bio)
                      </label>
                      <textarea
                        rows={3}
                        value={content.producerBio}
                        onChange={(e) => setContent({ ...content, producerBio: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">디스코그래피 / 크레딧 항목</h4>
                    </div>

                    <form
                      onSubmit={handleAddCredit}
                      className="p-4 rounded-xl border border-white/10 bg-neutral-900/40 grid grid-cols-1 sm:grid-cols-4 gap-2"
                    >
                      <input
                        type="text"
                        placeholder="연도 (2026)"
                        value={newCredit.year}
                        onChange={(e) => setNewCredit({ ...newCredit, year: e.target.value })}
                        className="px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded text-white"
                      />
                      <input
                        type="text"
                        placeholder="곡/프로젝트명"
                        required
                        value={newCredit.title}
                        onChange={(e) => setNewCredit({ ...newCredit, title: e.target.value })}
                        className="px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded text-white"
                      />
                      <input
                        type="text"
                        placeholder="아티스트/설명"
                        value={newCredit.artistOrProject}
                        onChange={(e) =>
                          setNewCredit({ ...newCredit, artistOrProject: e.target.value })
                        }
                        className="px-3 py-2 text-xs bg-neutral-950 border border-white/10 rounded text-white"
                      />
                      <button
                        type="submit"
                        className="py-2 text-xs font-semibold bg-white text-black hover:bg-neutral-200 rounded flex items-center justify-center gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>추가</span>
                      </button>
                    </form>

                    <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-neutral-900/20">
                      {credits.map((cr, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-neutral-500">{cr.year}</span>
                            <span className="font-semibold text-white">{cr.title}</span>
                            <span className="text-neutral-400">({cr.artistOrProject})</span>
                          </div>
                          <button
                            onClick={() => handleDeleteCredit(idx)}
                            className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                            aria-label="크레딧 삭제"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 p-5 rounded-xl border border-white/10 bg-neutral-900/60">
                    <h4 className="text-sm font-bold text-white">연락처 및 소셜 미디어 링크</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          전화번호
                        </label>
                        <input
                          type="text"
                          value={content.contactPhone}
                          onChange={(e) =>
                            setContent({ ...content, contactPhone: e.target.value })
                          }
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          카카오톡 ID
                        </label>
                        <input
                          type="text"
                          value={content.kakaoId}
                          onChange={(e) => setContent({ ...content, kakaoId: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        작업실 주소
                      </label>
                      <input
                        type="text"
                        value={content.studioAddress}
                        onChange={(e) =>
                          setContent({ ...content, studioAddress: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SEO & SOCIAL PREVIEW */}
              {activeTab === 'seo' && (
                <div className="space-y-8 max-w-2xl">
                  <div className="pb-4 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">
                      SEO 및 오픈그래프(OG) 메타 설정
                    </h3>
                    <p className="text-xs text-neutral-400">
                      검색 엔진 최적화 및 카카오톡, 페이스북 공유 시 나타나는 썸네일과 미리보기 정보를 설정합니다.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        메타 타이틀 (Meta Title)
                      </label>
                      <input
                        type="text"
                        value={seo.metaTitle}
                        onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        메타 설명 (Meta Description)
                      </label>
                      <textarea
                        rows={3}
                        value={seo.metaDescription}
                        onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        오픈그래프(OG) 대표 이미지 URL
                      </label>
                      <input
                        type="text"
                        value={seo.ogImageUrl}
                        onChange={(e) => setSeo({ ...seo, ogImageUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      구글 검색 결과 라이브 미리보기
                    </h4>
                    <div className="p-4 rounded-xl border border-white/10 bg-[#1c1c1c] text-left">
                      <div className="text-[11px] text-neutral-400 mb-0.5">
                        https://jgmusic.studio › lesson
                      </div>
                      <div className="text-base text-[#8ab4f8] font-medium hover:underline cursor-pointer line-clamp-1">
                        {seo.metaTitle}
                      </div>
                      <div className="text-xs text-neutral-300 mt-1 line-clamp-2 leading-relaxed">
                        {seo.metaDescription}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      카카오톡 / 소셜 링크 공유 라이브 미리보기
                    </h4>
                    <div className="max-w-md rounded-xl border border-white/15 bg-neutral-900 overflow-hidden shadow-lg">
                      <div className="aspect-[1.91/1] w-full bg-neutral-800 overflow-hidden">
                        <OptimizedImage
                          src={seo.ogImageUrl}
                          alt="OG Preview"
                          referrerPolicy="no-referrer"
                          sizes="448px"
                          maxWidth={640}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 bg-neutral-950">
                        <div className="text-[10px] uppercase font-mono text-neutral-500 mb-1">
                          JGMUSIC.STUDIO
                        </div>
                        <div className="text-sm font-bold text-white line-clamp-1 mb-1">
                          {seo.metaTitle}
                        </div>
                        <div className="text-xs text-neutral-400 line-clamp-2">
                          {seo.metaDescription}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <Check className="h-3.5 w-3.5" />
                    <span>SEO 메타 정보는 입력 즉시 문서 메타데이터에 반영됩니다.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
