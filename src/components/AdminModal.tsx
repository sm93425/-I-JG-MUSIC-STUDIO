import React, { useState } from 'react';
import {
  X,
  Lock,
  FileText,
  Palette,
  Edit3,
  Globe,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle,
  Eye,
  AlertCircle,
  Users,
  ExternalLink
} from 'lucide-react';
import {
  ConsultationInquiry,
  CurriculumCourse,
  Post,
  PostCategory,
  ProducerCredit,
  SeoConfig,
  SiteContent,
  ThemeConfig
} from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  // State and setters passed from App
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
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

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  posts,
  setPosts,
  theme,
  setTheme,
  content,
  setContent,
  credits,
  setCredits,
  courses,
  setCourses,
  seo,
  setSeo,
  inquiries,
  setInquiries,
  onResetAllData,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('jz_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'theme' | 'content' | 'inquiries' | 'seo'>('posts');

  // Post form state for add/edit
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postFormData, setPostFormData] = useState({
    title: '',
    category: 'tip' as PostCategory,
    categoryLabel: '프로듀싱 팁',
    excerpt: '',
    content: '',
    author: '제이지뮤직스튜디오',
    date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
    thumbnailUrl: '/src/assets/images/hero_music_studio_1794239965350.jpg',
    readTime: '3분',
  });

  // Credit form state
  const [newCredit, setNewCredit] = useState<ProducerCredit>({
    year: '2026',
    title: '',
    role: '',
    artistOrProject: '',
  });

  // Feedback notifications
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const showSavedMessage = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('jz_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('비밀번호가 일치하지 않습니다. (기본: admin123)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('jz_admin_auth');
    setPasswordInput('');
  };

  // --- CMS Operations ---
  const handleStartCreatePost = () => {
    setIsCreatingPost(true);
    setEditingPost(null);
    setPostFormData({
      title: '',
      category: 'tip',
      categoryLabel: '프로듀싱 팁',
      excerpt: '',
      content: '',
      author: '제이지뮤직스튜디오',
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      thumbnailUrl: '/src/assets/images/lesson_midi_setup_1794239966437.jpg',
      readTime: '3분',
    });
  };

  const handleStartEditPost = (p: Post) => {
    setEditingPost(p);
    setIsCreatingPost(false);
    setPostFormData({
      title: p.title,
      category: p.category,
      categoryLabel: p.categoryLabel,
      excerpt: p.excerpt,
      content: p.content,
      author: p.author,
      date: p.date,
      thumbnailUrl: p.thumbnailUrl,
      readTime: p.readTime,
    });
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postFormData.title.trim()) return;

    const categoryLabels: Record<PostCategory, string> = {
      review: '합격 소식',
      release: '앨범 발매 후기',
      tip: '프로듀싱 팁',
      notice: '공지사항',
    };

    const finalPost: Post = {
      id: editingPost ? editingPost.id : `post-${Date.now()}`,
      title: postFormData.title,
      category: postFormData.category,
      categoryLabel: categoryLabels[postFormData.category] || '칼럼',
      excerpt: postFormData.excerpt,
      content: postFormData.content,
      author: postFormData.author,
      date: postFormData.date,
      thumbnailUrl: postFormData.thumbnailUrl,
      readTime: postFormData.readTime,
    };

    if (editingPost) {
      setPosts(posts.map((p) => (p.id === editingPost.id ? finalPost : p)));
      showSavedMessage('게시글이 성공적으로 수정되었습니다.');
    } else {
      setPosts([finalPost, ...posts]);
      showSavedMessage('새 게시글이 성공적으로 등록되었습니다.');
    }

    setEditingPost(null);
    setIsCreatingPost(false);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('이 게시글을 삭제하시겠습니까?')) {
      setPosts(posts.filter((p) => p.id !== id));
      showSavedMessage('게시글이 삭제되었습니다.');
    }
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
  const handleUpdateInquiryStatus = (
    id: string,
    status: 'pending' | 'contacted' | 'completed'
  ) => {
    setInquiries(
      inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
    showSavedMessage('상담 상태가 변경되었습니다.');
  };

  const handleDeleteInquiry = (id: string) => {
    if (confirm('이 상담 문의 내역을 삭제하시겠습니까?')) {
      setInquiries(inquiries.filter((inq) => inq.id !== id));
      showSavedMessage('상담 내역이 삭제되었습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] flex flex-col rounded-2xl border border-white/20 bg-neutral-950 text-neutral-200 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white overflow-hidden p-0.5 shrink-0 shadow-sm">
              <img
                src="/assets/aistudio/JG_MUSIC_STUDIO_2dd5aa15.png"
                alt="JG MUSIC STUDIO 로고"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>제이지뮤직스튜디오 통합 관리자 대시보드</span>
                <span className="text-[10px] text-neutral-400 font-mono px-2 py-0.5 rounded bg-white/10">
                  ADMIN v2.0
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
          <div className="absolute top-16 right-6 z-20 flex items-center gap-2 bg-white text-black text-xs font-semibold px-4 py-2.5 rounded-md shadow-lg animate-in slide-in-from-top duration-200">
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
                <h3 className="text-xl font-bold text-white">
                  스튜디오 관리자 로그인
                </h3>
                <p className="text-xs text-neutral-400 mt-2">
                  접근 권한이 필요합니다. 관리자 비밀번호를 입력해주세요.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    placeholder="비밀번호 입력 (기본: admin123)"
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
            <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-white/10 bg-neutral-900/50 p-4 shrink-0 flex md:flex-col gap-1 overflow-x-auto">
              <button
                onClick={() => {
                  setActiveTab('posts');
                  setIsCreatingPost(false);
                  setEditingPost(null);
                }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'posts'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>게시글 관리 (CMS)</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'inquiries'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4" />
                  <span>상담 신청 CRM</span>
                </div>
                {inquiries.filter((q) => q.status === 'pending').length > 0 && (
                  <span className="h-4 min-w-4 px-1 rounded-full text-[10px] font-bold bg-white text-black flex items-center justify-center">
                    {inquiries.filter((q) => q.status === 'pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('theme')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === 'theme'
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Palette className="h-4 w-4" />
                <span>비주얼 & 테마 설정</span>
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
                <span>콘텐츠 & 크레딧</span>
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

              <div className="hidden md:block mt-auto pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    if (
                      confirm(
                        '모든 설정을 초기 데이터로 복원하시겠습니까? 수정한 내용이 초기화됩니다.'
                      )
                    ) {
                      onResetAllData();
                      showSavedMessage('기본값으로 복원되었습니다.');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-neutral-400 hover:text-red-400 border border-white/10 hover:border-red-400/30 rounded-lg transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>초기 데이터 복원</span>
                </button>
              </div>
            </div>

            {/* Main Tab Panel Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {/* TAB 1: POSTS CMS */}
              {activeTab === 'posts' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        게시판 및 칼럼 관리 (CMS)
                      </h3>
                      <p className="text-xs text-neutral-400">
                        공지사항, 앨범 발매 후기, 합격 수기, 프로듀싱 팁을 관리합니다.
                      </p>
                    </div>
                    {!isCreatingPost && !editingPost && (
                      <button
                        onClick={handleStartCreatePost}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-md transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>새 글 작성</span>
                      </button>
                    )}
                  </div>

                  {isCreatingPost || editingPost ? (
                    /* Post Form (Add/Edit) */
                    <form onSubmit={handleSavePost} className="space-y-4 max-w-2xl bg-neutral-900/60 p-6 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <h4 className="text-sm font-bold text-white">
                          {editingPost ? '게시글 수정' : '새 게시글 작성'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingPost(false);
                            setEditingPost(null);
                          }}
                          className="text-xs text-neutral-400 hover:text-white"
                        >
                          취소
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          제목
                        </label>
                        <input
                          type="text"
                          required
                          value={postFormData.title}
                          onChange={(e) =>
                            setPostFormData({ ...postFormData, title: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none focus:border-white/30"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            카테고리
                          </label>
                          <select
                            value={postFormData.category}
                            onChange={(e) =>
                              setPostFormData({
                                ...postFormData,
                                category: e.target.value as PostCategory,
                              })
                            }
                            className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none"
                          >
                            <option value="tip">프로듀싱 팁</option>
                            <option value="release">앨범 발매 후기</option>
                            <option value="review">합격 소식</option>
                            <option value="notice">공지사항</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            작성자
                          </label>
                          <input
                            type="text"
                            value={postFormData.author}
                            onChange={(e) =>
                              setPostFormData({ ...postFormData, author: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          썸네일 이미지 URL
                        </label>
                        <input
                          type="text"
                          value={postFormData.thumbnailUrl}
                          onChange={(e) =>
                            setPostFormData({
                              ...postFormData,
                              thumbnailUrl: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          요약 (Excerpt)
                        </label>
                        <textarea
                          rows={2}
                          value={postFormData.excerpt}
                          onChange={(e) =>
                            setPostFormData({ ...postFormData, excerpt: e.target.value })
                          }
                          className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          본문 내용 (Markdown/줄바꿈 지원)
                        </label>
                        <textarea
                          rows={8}
                          required
                          value={postFormData.content}
                          onChange={(e) =>
                            setPostFormData({ ...postFormData, content: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatingPost(false);
                            setEditingPost(null);
                          }}
                          className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-md transition-colors flex items-center gap-1.5"
                        >
                          <Save className="h-3.5 w-3.5" />
                          <span>저장 및 게시</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Posts Table */
                    <div className="border border-white/10 rounded-xl overflow-hidden bg-neutral-900/40">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-900 text-neutral-400 uppercase font-mono tracking-wider border-b border-white/10">
                          <tr>
                            <th className="px-4 py-3">분류</th>
                            <th className="px-4 py-3">제목</th>
                            <th className="px-4 py-3 hidden sm:table-cell">작성일</th>
                            <th className="px-4 py-3 text-right">관리</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-white/5">
                              <td className="px-4 py-3 font-medium text-neutral-300 whitespace-nowrap">
                                {post.categoryLabel}
                              </td>
                              <td className="px-4 py-3 font-semibold text-white max-w-xs truncate">
                                {post.title}
                              </td>
                              <td className="px-4 py-3 text-neutral-500 font-mono hidden sm:table-cell">
                                {post.date}
                              </td>
                              <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                                <button
                                  onClick={() => handleStartEditPost(post)}
                                  className="text-neutral-300 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  className="text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-950/40 hover:bg-red-950/80"
                                >
                                  삭제
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: THEME & VISUALS */}
              {activeTab === 'theme' && (
                <div className="space-y-8 max-w-2xl">
                  <div className="pb-4 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">
                      비주얼 & 디자인 커스터마이징 (Theme Settings)
                    </h3>
                    <p className="text-xs text-neutral-400">
                      웹사이트의 배경색, 액센트 포인트 컬러, 서체 스타일을 실시간으로 변경합니다.
                    </p>
                  </div>

                  {/* Preset Themes */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-2">
                      원클릭 테마 프리셋
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { name: 'Pure Obsidian', bg: '#0a0a0a', accent: '#ffffff', card: '#121212' },
                        { name: 'Charcoal Studio', bg: '#141414', accent: '#e5e5e5', card: '#1c1c1c' },
                        { name: 'Amber Glow', bg: '#0d0b09', accent: '#f59e0b', card: '#171412' },
                        { name: 'Deep Midnight', bg: '#080b11', accent: '#38bdf8', card: '#0f172a' },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setTheme((prev) => ({
                              ...prev,
                              backgroundColor: preset.bg,
                              cardColor: preset.card,
                              accentColor: preset.accent,
                            }));
                            showSavedMessage(`${preset.name} 테마가 적용되었습니다.`);
                          }}
                          className="p-3 rounded-lg border border-white/10 hover:border-white/30 text-left bg-neutral-900 transition-all flex flex-col justify-between"
                        >
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="w-4 h-4 rounded-full border border-white/20" style={{ background: preset.bg }} />
                            <span className="w-4 h-4 rounded-full" style={{ background: preset.accent }} />
                          </div>
                          <span className="text-xs font-medium text-white">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Pickers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-xl border border-white/10 bg-neutral-900/60">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-2">
                        배경 기본 색상 (Background)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={theme.backgroundColor}
                          onChange={(e) =>
                            setTheme({ ...theme, backgroundColor: e.target.value })
                          }
                          className="h-10 w-14 rounded cursor-pointer bg-transparent border-0"
                        />
                        <span className="font-mono text-xs text-neutral-300">
                          {theme.backgroundColor}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-2">
                        포인트 액센트 색상 (Accent)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={theme.accentColor}
                          onChange={(e) =>
                            setTheme({ ...theme, accentColor: e.target.value })
                          }
                          className="h-10 w-14 rounded cursor-pointer bg-transparent border-0"
                        />
                        <span className="font-mono text-xs text-neutral-300">
                          {theme.accentColor}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Font Family Switcher */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-2">
                      타이포그래피 스타일 (Typography Style)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['sans', 'serif', 'mono'] as const).map((font) => (
                        <button
                          key={font}
                          onClick={() => {
                            setTheme({ ...theme, fontFamily: font });
                            showSavedMessage(`서체가 ${font} 스타일로 변경되었습니다.`);
                          }}
                          className={`p-3 rounded-lg border text-xs font-semibold capitalize transition-all ${
                            theme.fontFamily === font
                              ? 'bg-white text-black border-white'
                              : 'bg-neutral-900 text-neutral-400 border-white/10 hover:border-white/20'
                          }`}
                        >
                          {font === 'sans' && 'Modern Sans (기본)'}
                          {font === 'serif' && 'Editorial Serif'}
                          {font === 'mono' && 'Studio Monospace'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Realtime Headline Text Editor */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h4 className="text-sm font-bold text-white">
                      메인 히어로 문구 실시간 편집
                    </h4>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        메인 헤드라인 (Hero Headline)
                      </label>
                      <input
                        type="text"
                        value={content.heroHeadline}
                        onChange={(e) =>
                          setContent({ ...content, heroHeadline: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        서브 헤드라인 (Hero Subheadline)
                      </label>
                      <textarea
                        rows={2}
                        value={content.heroSubheadline}
                        onChange={(e) =>
                          setContent({ ...content, heroSubheadline: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-white/10 rounded-md text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CONTENT & CREDITS */}
              {activeTab === 'content' && (
                <div className="space-y-8 max-w-3xl">
                  <div className="pb-4 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">
                      콘텐츠 & 크레딧 관리 (Site Content)
                    </h3>
                    <p className="text-xs text-neutral-400">
                      프로듀서 정보, 디스코그래피 크레딧 및 연락처/SNS 링크를 편집합니다.
                    </p>
                  </div>

                  {/* Producer Info */}
                  <div className="space-y-4 p-5 rounded-xl border border-white/10 bg-neutral-900/60">
                    <h4 className="text-sm font-bold text-white">
                      디렉터 / 프로듀서 정보
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          프로듀서 이름
                        </label>
                        <input
                          type="text"
                          value={content.producerName}
                          onChange={(e) =>
                            setContent({ ...content, producerName: e.target.value })
                          }
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
                          onChange={(e) =>
                            setContent({ ...content, producerRole: e.target.value })
                          }
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
                        onChange={(e) =>
                          setContent({ ...content, producerBio: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-white/10 rounded-md text-white leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Producer Credits Manager */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">
                        디스코그래피 / 크레딧 항목
                      </h4>
                    </div>

                    {/* Add Credit Form */}
                    <form onSubmit={handleAddCredit} className="p-4 rounded-xl border border-white/10 bg-neutral-900/40 grid grid-cols-1 sm:grid-cols-4 gap-2">
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
                        onChange={(e) => setNewCredit({ ...newCredit, artistOrProject: e.target.value })}
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

                  {/* Contact & Social Links */}
                  <div className="space-y-4 p-5 rounded-xl border border-white/10 bg-neutral-900/60">
                    <h4 className="text-sm font-bold text-white">
                      연락처 및 소셜 미디어 링크
                    </h4>

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
                          onChange={(e) =>
                            setContent({ ...content, kakaoId: e.target.value })
                          }
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

              {/* TAB 4: CONSULTATION CRM */}
              {activeTab === 'inquiries' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        방문 상담 신청 관리 (CRM)
                      </h3>
                      <p className="text-xs text-neutral-400">
                        웹사이트를 통해 고객이 접수한 1:1 방문 상담 예약 내역입니다.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-neutral-400">
                      총 {inquiries.length}건
                    </span>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="p-12 text-center border border-white/10 rounded-xl bg-neutral-900/40 text-neutral-400 text-xs">
                      현재 접수된 상담 내역이 없습니다.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inquiries.map((inq) => {
                        const course = courses.find((c) => c.id === inq.courseId);

                        return (
                          <div
                            key={inq.id}
                            className="p-5 rounded-xl border border-white/10 bg-neutral-900/60 space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                              <div className="flex items-center gap-3">
                                <span className="text-base font-bold text-white">
                                  {inq.name}
                                </span>
                                <span className="font-mono text-xs text-neutral-400">
                                  {inq.phone}
                                </span>
                                {inq.email && (
                                  <span className="text-xs text-neutral-500 hidden sm:inline">
                                    ({inq.email})
                                  </span>
                                )}
                              </div>

                              {/* Status Badges */}
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

                                <button
                                  onClick={() => handleDeleteInquiry(inq.id)}
                                  className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                                  aria-label="삭제"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-neutral-300">
                              <div>
                                <span className="text-neutral-500 block">희망 과정:</span>
                                <span className="font-semibold text-white">
                                  {course ? `[${course.level}] ${course.name}` : inq.courseId}
                                </span>
                              </div>
                              <div>
                                <span className="text-neutral-500 block">주 DAW:</span>
                                <span>{inq.daw || '-'}</span>
                              </div>
                              <div>
                                <span className="text-neutral-500 block">희망 장르:</span>
                                <span>{inq.genre || '-'}</span>
                              </div>
                              <div>
                                <span className="text-neutral-500 block">접수 일시:</span>
                                <span className="font-mono text-neutral-400">
                                  {inq.createdAt}
                                </span>
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
              )}

              {/* TAB 5: SEO & SOCIAL PREVIEW */}
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
                        onChange={(e) =>
                          setSeo({ ...seo, metaDescription: e.target.value })
                        }
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

                  {/* Live Google Search Preview */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      구글 검색 결과 라이브 미리보기
                    </h4>
                    <div className="p-4 rounded-xl border border-white/10 bg-[#1c1c1c] text-left">
                      <div className="text-[11px] text-neutral-400 mb-0.5">
                        https://jzmusic.studio › lesson
                      </div>
                      <div className="text-base text-[#8ab4f8] font-medium hover:underline cursor-pointer line-clamp-1">
                        {seo.metaTitle}
                      </div>
                      <div className="text-xs text-neutral-300 mt-1 line-clamp-2 leading-relaxed">
                        {seo.metaDescription}
                      </div>
                    </div>
                  </div>

                  {/* Live Social Share Card Preview (KakaoTalk / Facebook) */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      카카오톡 / 소셜 링크 공유 라이브 미리보기
                    </h4>
                    <div className="max-w-md rounded-xl border border-white/15 bg-neutral-900 overflow-hidden shadow-lg">
                      <div className="aspect-[1.91/1] w-full bg-neutral-800 overflow-hidden">
                        <img
                          src={seo.ogImageUrl}
                          alt="OG Preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 bg-neutral-950">
                        <div className="text-[10px] uppercase font-mono text-neutral-500 mb-1">
                          JZMUSIC.STUDIO
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
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
