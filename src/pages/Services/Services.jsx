import { useState, useRef, useEffect } from 'react';
import { motion, LazyMotion, domAnimation, useInView, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Play, Clock, Users, Award, Star, BookOpen, ArrowRight, Eye, ThumbsUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

const YoutubeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/>
  </svg>
);

const MotionContainer = ({ children }) => (
  <LazyMotion features={domAnimation}>{children}</LazyMotion>
);

function useScrollAnimation(options = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px', ...options });
  return [ref, isInView];
}

const AnimatedCounter = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useScrollAnimation();
  useEffect(() => {
    if (!inView) return;
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
};

function useTilt() {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const handleMove = (e) => {
      const rect = node.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      node.style.transform = `perspective(600px) rotateX(${(-y / 20)}deg) rotateY(${x / 20}deg) scale(1.02)`;
    };
    const handleLeave = () => { node.style.transform = ''; };
    node.addEventListener('mousemove', handleMove);
    node.addEventListener('mouseleave', handleLeave);
    return () => { node.removeEventListener('mousemove', handleMove); node.removeEventListener('mouseleave', handleLeave); };
  }, []);
  return ref;
}

const VideoCard = ({ video, index }) => {
  const tiltRef = useTilt();
  const [ref, inView] = useScrollAnimation();
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }} className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <a href={video.url} target="_blank" rel="noopener noreferrer" className="block">
        <motion.article ref={tiltRef} className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-cyan-500/20 transition-all will-change-transform h-full flex flex-col border border-slate-700/50" whileHover={{ scale: 1.02, y: -5 }}>
          <div className="relative h-44 overflow-hidden">
            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500" style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: isHovered ? 1 : 0 }}>
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Play className="w-7 h-7 text-white fill-white ml-1" />
              </motion.div>
            </motion.div>
            <div className="absolute bottom-3 right-3"><span className="px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-lg flex items-center gap-1"><Clock className="w-3 h-3" />{video.duration}</span></div>
            <div className="absolute top-3 right-3"><div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center shadow-lg"><YoutubeIcon /></div></div>
            <div className="absolute top-3 left-3"><span className="px-3 py-1 bg-cyan-500/90 text-white text-xs font-bold rounded-full backdrop-blur-sm">{video.category}</span></div>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{video.title}</h3>
            <p className="text-slate-400 text-sm mb-3 flex-1 line-clamp-2">{video.description}</p>
            <div className="flex items-center justify-between text-sm mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-slate-400"><Eye className="w-4 h-4" /><span>{video.views}</span></div>
                <div className="flex items-center gap-1 text-slate-400"><ThumbsUp className="w-4 h-4" /><span>{video.likes}</span></div>
              </div>
              <div className="flex items-center gap-1 text-yellow-400"><Star className="w-4 h-4 fill-yellow-400" /><span className="text-white">{video.rating}</span></div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">{video.instructor.charAt(0)}</div>
              <span className="text-slate-300 text-sm">{video.instructor}</span>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
              <YoutubeIcon /><span>{video.cta}</span><Play className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.article>
      </a>
    </motion.div>
  );
};

const FilterChip = ({ active, onClick, label, count }) => (
  <motion.button onClick={onClick} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`px-5 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${active ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
    <span>{label}</span>
    <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-slate-600'}`}>{count}</span>
  </motion.button>
);

const StatCard = ({ icon: Icon, number, suffix, label, index }) => {
  const [ref, inView] = useScrollAnimation();
  return (<motion.div ref={ref} initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 text-center"><div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center"><Icon className="w-7 h-7 text-white" /></div><div className="text-3xl font-bold text-white mb-1"><AnimatedCounter end={number} duration={2} suffix={suffix} /></div><div className="text-slate-400 text-sm">{label}</div></motion.div>);
};

const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ref, inView] = useScrollAnimation();
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-700/30 transition-colors">
        <span className="font-semibold text-white">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown className="w-5 h-5 text-cyan-400" /></motion.div>
      </button>
      <AnimatePresence>{isOpen && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden"><div className="p-5 pt-0 text-slate-400 bg-slate-800/30">{answer}</div></motion.div>)}</AnimatePresence>
    </motion.div>
  );
};

const Services = () => {
  const { t, lang } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const heroRef = useRef(null);
  
  const videos = [
    { id: 1, thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop', category: lang === 'ar' ? 'كهرباء' : 'Electrical', title: lang === 'ar' ? 'مقدمة في الهندسة الكهربائية' : 'Intro to Electrical Engineering', description: lang === 'ar' ? 'تعلم اساسيات الهندسة الكهربائية' : 'Learn electrical engineering basics', duration: '45:30', views: '12K', likes: '1.2K', rating: '4.9', instructor: lang === 'ar' ? 'م. أحمد' : 'Eng. Ahmed', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', cta: lang === 'ar' ? 'شاهد الآن' : 'Watch Now', filter: 'electrical' },
    { id: 2, thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop', category: lang === 'ar' ? 'ميكانيكا' : 'Mechanical', title: lang === 'ar' ? 'الديناميكا الحرارية' : 'Thermodynamics', description: lang === 'ar' ? 'شرح الديناميكا الحرارية' : 'Understanding thermodynamics', duration: '38:15', views: '8.5K', likes: '890', rating: '4.8', instructor: lang === 'ar' ? 'م. فاطمة' : 'Eng. Fatima', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', cta: lang === 'ar' ? 'شاهد الآن' : 'Watch Now', filter: 'mechanical' },
    { id: 3, thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop', category: lang === 'ar' ? 'أتمتة' : 'Automation', title: lang === 'ar' ? 'برمجة PLC' : 'PLC Programming', description: lang === 'ar' ? 'تعلم برمجة المتحكمات' : 'Learn PLC programming', duration: '52:00', views: '15K', likes: '2.1K', rating: '4.9', instructor: lang === 'ar' ? 'م. عمر' : 'Eng. Omar', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', cta: lang === 'ar' ? 'شاهد الآن' : 'Watch Now', filter: 'automation' },
    { id: 4, thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', category: lang === 'ar' ? 'شبكات' : 'Networks', title: lang === 'ar' ? 'شبكات الحاسوب' : 'Computer Networks', description: lang === 'ar' ? 'شرح انظمة الشبكات' : 'Network systems explained', duration: '41:20', views: '6.2K', likes: '720', rating: '4.7', instructor: lang === 'ar' ? 'م. محمد' : 'Eng. Mohamed', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', cta: lang === 'ar' ? 'شاهد الآن' : 'Watch Now', filter: 'networks' },
    { id: 5, thumbnail: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=600&h=400&fit=crop', category: 'CAD', title: lang === 'ar' ? 'تعلم AutoCAD' : 'Learn AutoCAD', description: lang === 'ar' ? 'دورة AutoCAD' : 'AutoCAD course', duration: '1:15:00', views: '22K', likes: '3.4K', rating: '4.8', instructor: lang === 'ar' ? 'م. خالد' : 'Eng. Khaled', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', cta: lang === 'ar' ? 'شاهد الآن' : 'Watch Now', filter: 'cad' },
    { id: 6, thumbnail: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop', category: lang === 'ar' ? 'تركيب' : 'Installation', title: lang === 'ar' ? 'تركيب الالات' : 'Machine Installation', description: lang === 'ar' ? 'تعلم التركيب' : 'Learn installation', duration: '35:45', views: '5.8K', likes: '650', rating: '4.6', instructor: lang === 'ar' ? 'م. Abdulrahman' : 'Eng. Abdulrahman', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', cta: lang === 'ar' ? 'شاهد الآن' : 'Watch Now', filter: 'installation' },
    { id: 7, thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop', category: lang === 'ar' ? 'اليكترونيات' : 'Electronics', title: lang === 'ar' ? 'الاليكترونيات الرقمية' : 'Digital Electronics', description: lang === 'ar' ? 'مقدمة في الرقمية' : 'Digital electronics intro', duration: '48:30', views: '9.1K', likes: '1.1K', rating: '4.8', instructor: lang === 'ar' ? 'م. Ahmed' : 'Eng. Ahmed', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', cta: lang === 'ar' ? 'شاهد الآن' : 'Watch Now', filter: 'electrical' },
    { id: 8, thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=400&fit=crop', category: lang === 'ar' ? 'إنترنت أشياء' : 'IoT', title: lang === 'ar' ? 'إنترنت الأشياء' : 'Internet of Things', description: lang === 'ar' ? 'تعلم IoT' : 'Learn IoT fundamentals', duration: '55:00', views: '11K', likes: '1.5K', rating: '4.9', instructor: lang === 'ar' ? 'م. Omar' : 'Eng. Omar', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', cta: lang === 'ar' ? 'شاهد الآن' : 'Watch Now', filter: 'automation' },
    { id: 9, thumbnail: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=600&h=400&fit=crop', category: lang === 'ar' ? 'ميكانيكا' : 'Mechanical', title: lang === 'ar' ? 'ميكانيكا الموائع' : 'Fluid Mechanics', description: lang === 'ar' ? 'شرح ميكانيكا الموائع' : 'Fluid mechanics explained', duration: '42:15', views: '7.3K', likes: '820', rating: '4.7', instructor: lang === 'ar' ? 'م. Fatima' : 'Eng. Fatima', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', cta: lang === 'ar' ? 'شاهد الآن' : 'Watch Now', filter: 'mechanical' }
  ];
  
  const faqs = [
    { question: lang === 'ar' ? 'هل الفيديوهات مجانية؟' : 'Are the videos free?', answer: lang === 'ar' ? 'نعم، جميع الفيديوهات مجانية على يوتيوب.' : 'Yes, all videos are free on YouTube.' },
    { question: lang === 'ar' ? 'كيف أشاهد الفيديوهات؟' : 'How do I watch videos?', answer: lang === 'ar' ? 'اضغط على البطاقة وسيتم توجيهك ليوتيوب.' : 'Click on the card and you will be redirected to YouTube.' },
    { question: lang === 'ar' ? 'هل توجد شهادات؟' : 'Are there certificates?', answer: lang === 'ar' ? 'نعم، احصل على شهادة بعد اجتياز الاختبارات.' : 'Yes, get a certificate after passing quizzes.' }
  ];
  
  const filteredVideos = videos.filter(video => {
    const matchesFilter = activeFilter === 'all' || video.filter === activeFilter;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  const filters = [
    { id: 'all', label: lang === 'ar' ? 'الكل' : 'All', count: videos.length },
    { id: 'electrical', label: lang === 'ar' ? 'كهرباء' : 'Electrical', count: 2 },
    { id: 'mechanical', label: lang === 'ar' ? 'ميكانيكا' : 'Mechanical', count: 2 },
    { id: 'automation', label: lang === 'ar' ? 'أتمتة' : 'Automation', count: 2 },
    { id: 'cad', label: 'CAD', count: 1 },
    { id: 'networks', label: lang === 'ar' ? 'شبكات' : 'Networks', count: 1 }
  ];
  
  const stats = [
    { icon: Play, number: 200, suffix: '+', label: lang === 'ar' ? 'فيديو' : 'Videos' },
    { icon: Users, number: 50000, suffix: '+', label: lang === 'ar' ? 'مشاهد' : 'Views' },
    { icon: ThumbsUp, number: 8500, suffix: '+', label: lang === 'ar' ? 'إعجاب' : 'Likes' },
    { icon: Award, number: 50, suffix: '+', label: lang === 'ar' ? 'مدرب' : 'Instructors' }
  ];
  
  return (
    <MotionContainer>
      <div className="relative z-10">
        <section ref={heroRef} className="relative min-h-[60vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 py-20 w-full relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="max-w-xl mx-auto">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input type="text" placeholder={lang === 'ar' ? 'ابحث...' : 'Search...'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full py-4 pl-12 pr-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-sm transition-all" />
                </div>
              </motion.div>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full"><path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#0f172a"/></svg>
          </div>
        </section>
        
        <section className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{lang === 'ar' ? 'أحدث الفيديوهات' : 'Latest Videos'}</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">{lang === 'ar' ? 'اختر من مكتبتنا' : 'Choose from our library'}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-wrap justify-center gap-3 mb-10">
              {filters.map((filter) => (<FilterChip key={filter.id} active={activeFilter === filter.id} onClick={() => setActiveFilter(filter.id)} label={filter.label} count={filter.count} />))}
            </motion.div>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">{filteredVideos.map((video, i) => (<VideoCard key={video.id} video={video} index={i} />))}</AnimatePresence>
            </motion.div>
            {filteredVideos.length === 0 && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12"><Play className="w-16 h-16 text-slate-700 mx-auto mb-4" /><p className="text-slate-500 text-lg">{lang === 'ar' ? 'لم يتم العثور على فيديوهات' : 'No videos found'}</p></motion.div>)}
          </div>
        </section>
        
        <section className="py-16 bg-slate-800/50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{stats.map((stat, i) => (<StatCard key={i} {...stat} index={i} />))}</div>
          </div>
        </section>
        
        <section className="py-20 bg-slate-900">
          <div className="max-w-3xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</h2>
            </motion.div>
            <div className="space-y-4">{faqs.map((faq, i) => (<FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />))}</div>
          </div>
        </section>
        
        <section className="py-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6"><TelegramIcon /></div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{lang === 'ar' ? 'انضم لقناتنا على تيلجرام' : 'Join Our Telegram Channel'}</h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">{lang === 'ar' ? 'احصل على أحدث المحتوى' : 'Get the latest content'}</p>
              <motion.a href="https://t.me/qimamsudanese" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-3 px-8 py-4 bg-white text-cyan-600 font-bold rounded-full shadow-lg hover:shadow-xl transition-all">
                <span>{lang === 'ar' ? 'انضم الآن' : 'Join Now'}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <div className="flex justify-center gap-8 mt-10">
                <div className="text-center"><div className="text-3xl font-bold text-white">10K+</div><div className="text-white/70 text-sm">{lang === 'ar' ? 'مشترك' : 'Subscribers'}</div></div>
                <div className="text-center"><div className="text-3xl font-bold text-white">50+</div><div className="text-white/70 text-sm">{lang === 'ar' ? 'محتوى' : 'Contents'}</div></div>
                <div className="text-center"><div className="text-3xl font-bold text-white">24/7</div><div className="text-white/70 text-sm">{lang === 'ar' ? 'نشط' : 'Active'}</div></div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MotionContainer>
  );
};

export default Services;
