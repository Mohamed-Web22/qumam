import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { motion, LazyMotion, domAnimation, useInView, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, Quote, Users, Award, Globe, Heart, Play, Youtube, Star, Clock, 
  Mail, Phone, MapPin, Send, ArrowRight, MessageCircle, Target,
  TrendingUp, BookOpen, GraduationCap, Award as AwardIcon, Users as UsersIcon
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

const MotionContainer = ({ children }) => (
  <LazyMotion features={domAnimation}>
    {children}
  </LazyMotion>
);

function useScrollAnimation(options = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px', ...options });
  return [ref, isInView];
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
    return () => {
      node.removeEventListener('mousemove', handleMove);
      node.removeEventListener('mouseleave', handleLeave);
    };
  }, []);
  return ref;
}

const ParticlesBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let particles = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const createParticles = () => {
      particles = [];
      const count = Math.floor(window.innerWidth / 80);
      for (let i = 0; i < count; i++) {
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: Math.random() * 2 + 1, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, alpha: Math.random() * 0.5 + 0.1 });
      }
    };
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 222, 179, ${p.alpha})`;
        ctx.fill();
      });
      animationFrame = requestAnimationFrame(animate);
    };
    resize(); createParticles(); animate();
    window.addEventListener('resize', () => { resize(); createParticles(); });
    return () => { cancelAnimationFrame(animationFrame); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.6 }} />;
};

const SuccessStoryCard = ({ story, index }) => {
  const tiltRef = useTilt();
  const [ref, inView] = useScrollAnimation();
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }}>
      <motion.article ref={tiltRef} className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-cyan-500/20 transition-all will-change-transform h-full border border-slate-700/50" whileHover={{ scale: 1.02, y: -5 }}>
        <div className="h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">{story.name.charAt(0)}</div>
            <div><h4 className="text-white font-bold text-lg">{story.name}</h4><p className="text-cyan-400 text-sm">{story.role}</p></div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full"><span className="text-cyan-400 text-xs font-medium">{story.badge}</span></div>
          </div>
          <div className="relative mb-4"><Quote className="absolute -top-2 -left-1 w-8 h-8 text-cyan-500/20" /><p className="text-slate-300 leading-relaxed pl-4 italic">"{story.quote}"</p></div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="text-center"><div className="text-white font-bold">{story.year}</div><div className="text-slate-500 text-xs">السنة</div></div>
              <div className="w-px h-8 bg-slate-700" />
              <div className="text-center"><div className="text-white font-bold">{story.location}</div><div className="text-slate-500 text-xs">الموقع</div></div>
            </div>
            <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />))}</div>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
};

const TestimonialsCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => { const timer = setInterval(() => { setCurrentIndex((prev) => (prev + 1) % items.length); }, 5000); return () => clearInterval(timer); }, [items.length]);
  return (
    <div className="relative max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }} className="text-center">
          <Quote className="w-16 h-16 text-cyan-500 mx-auto mb-6" />
          <p className="text-2xl md:text-3xl text-white leading-relaxed mb-8 italic font-light">"{items[currentIndex].quote}"</p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold">{items[currentIndex].name.charAt(0)}</div>
            <div className="text-left"><p className="font-bold text-white text-lg">{items[currentIndex].name}</p><p className="text-cyan-400">{items[currentIndex].role}</p></div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-2 mt-10">
        {items.map((_, i) => (<button key={i} onClick={() => setCurrentIndex(i)} className={`h-2 rounded-full transition-all ${i === currentIndex ? 'bg-cyan-500 w-8' : 'bg-slate-600 w-2 hover:bg-slate-500'}`} />))}
      </div>
    </div>
  );
};

const ContactSection = ({ lang }) => {
  const [ref, inView] = useScrollAnimation();
  const contactMethods = [
    { icon: Phone, title: lang === 'ar' ? 'اتصل بنا' : 'Call Us', value: '+249 123 456 789', color: 'from-green-500 to-green-600', hover: 'hover:from-green-400 hover:to-green-500' },
    { icon: Mail, title: lang === 'ar' ? 'راسلنا' : 'Email Us', value: 'info@qimamsudanese.com', color: 'from-blue-500 to-blue-600', hover: 'hover:from-blue-400 hover:to-blue-500' },
    { icon: MapPin, title: lang === 'ar' ? 'موقعنا' : 'Visit Us', value: lang === 'ar' ? 'الخرطوم، السودان' : 'Khartoum, Sudan', color: 'from-purple-500 to-purple-600', hover: 'hover:from-purple-400 hover:to-purple-500' },
    { icon: MessageCircle, title: lang === 'ar' ? 'واتساب' : 'WhatsApp', value: '+249 123 456 789', color: 'from-emerald-500 to-emerald-600', hover: 'hover:from-emerald-400 hover:to-emerald-500' },
  ];
  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-slate-900 via-slate-900 to-black">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{lang === 'ar' ? 'نحن هنا لمساعدتك! تواصل معنا بأي طريقة تناسبك' : 'We are here to help! Contact us in any way that suits you'}</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, i) => (<motion.a key={i} href="#" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05, y: -5 }} className="block p-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl hover:border-cyan-500/30 transition-all group"><div className={`w-14 h-14 bg-gradient-to-r ${method.color} ${method.hover} rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg`}><method.icon className="w-7 h-7 text-white" /></div><h4 className="text-white font-semibold mb-1 text-center">{method.title}</h4><p className="text-slate-400 text-sm text-center">{method.value}</p></motion.a>))}
        </div>
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="max-w-2xl mx-auto">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><input type="text" placeholder={lang === 'ar' ? 'الاسم' : 'Name'} className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors" /></div>
              <div><input type="email" placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors" /></div>
            </div>
            <div><textarea rows={5} placeholder={lang === 'ar' ? 'رسالتك...' : 'Your Message...'} className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none" /></div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"><Send className="w-5 h-5" />{lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}</motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

const TelegramSection = ({ lang }) => {
  const [ref, inView] = useScrollAnimation();
  return (
    <section className="py-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 relative overflow-hidden">
      <div className="absolute inset-0"><div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" /><div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" /></div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{lang === 'ar' ? 'انضم لقناتنا على تيلجرام' : 'Join Our Telegram Channel'}</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">{lang === 'ar' ? 'احصل على أحدث الدورات والنصائح التعليمية مباشرة في هاتفك' : 'Get the latest courses and educational tips directly on your phone'}</p>
          <motion.a href="https://t.me/qimamsudanese" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-3 px-8 py-4 bg-white text-cyan-600 font-bold rounded-full shadow-lg hover:shadow-xl transition-all"><svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg><span>{lang === 'ar' ? 'انضم الآن' : 'Join Now'}</span><ArrowRight className="w-5 h-5" /></motion.a>
          <div className="flex justify-center gap-8 mt-10"><div className="text-center"><div className="text-3xl font-bold text-white">10K+</div><div className="text-white/70 text-sm">{lang === 'ar' ? 'مشترك' : 'Subscribers'}</div></div><div className="text-center"><div className="text-3xl font-bold text-white">50+</div><div className="text-white/70 text-sm">{lang === 'ar' ? 'محتوى' : 'Contents'}</div></div><div className="text-center"><div className="text-3xl font-bold text-white">24/7</div><div className="text-white/70 text-sm">{lang === 'ar' ? 'نشط' : 'Active'}</div></div></div>
        </motion.div>
      </div>
    </section>
  );
};

const TimelineItem = ({ item, index, isLeft }) => {
  const [ref, inView] = useScrollAnimation();
  return (<motion.div ref={ref} initial={isLeft ? { opacity: 0, x: -50 } : { opacity: 0, x: 50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: index * 0.1 }} className={`flex items-center gap-8 mb-12 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}><div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'}`}><div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50"><span className="inline-block px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold rounded-full mb-3">{item.year}</span><h4 className="text-xl font-bold text-white mb-2">{item.title}</h4><p className="text-slate-400">{item.description}</p></div></div><div className="relative z-10 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0"><motion.div className="absolute inset-0 rounded-full bg-cyan-500" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} /></div><div className="flex-1" /></motion.div>);
};

const scrollToSection = (sectionId) => { const element = document.getElementById(sectionId); if (element) { const navbarHeight = 80; const elementPosition = element.getBoundingClientRect().top; const offsetPosition = elementPosition + window.pageYOffset - navbarHeight; window.scrollTo({ top: offsetPosition, behavior: 'smooth' }); }};

const Home = () => {
  const { t, lang } = useLanguage();
  const heroRef = useRef(null);
  const successStories = [
    { name: 'أحمد محمد', role: lang === 'ar' ? 'مهندس كهربائي' : 'Electrical Engineer', badge: lang === 'ar' ? 'فائز بمسابقة' : 'Competition Winner', quote: lang === 'ar' ? 'قمم السودانية غيرت حياتي. حصلت على وظيفة في شركة هندسية كبرى!' : 'Qimam Sudanese changed my life. I got a job at a top engineering firm!', year: '2024', location: 'الخرطوم' },
    { name: 'فاطمة علي', role: lang === 'ar' ? 'مهندسة ميكانيكية' : 'Mechanical Engineer', badge: lang === 'ar' ? 'حاصلة على منحة' : 'Scholarship Recipient', quote: lang === 'ar' ? 'الجلسات المباشرة ساعدتني على فهم المواد الصعبة!' : 'The live sessions helped me understand difficult subjects!', year: '2024', location: 'أم درمان' },
    { name: 'عمر حسن', role: lang === 'ar' ? 'مطور أتمتة' : 'Automation Developer', badge: lang === 'ar' ? 'ريادي' : 'Entrepreneur', quote: lang === 'ar' ? 'تعلمت مهارات يبحث عنها الجميع. الآن لدي استشارتي الخاصة!' : 'I learned skills everyone is looking for. Now I have my own consultancy!', year: '2023', location: 'بورتسودان' }
  ];
  const testimonials = [
    { name: 'خالد Ibrahim', role: lang === 'ar' ? 'طالب هندسة' : 'Engineering Student', quote: lang === 'ar' ? 'أفضل منصة تعليمية للطلاب السودانيين. أنصح بها الجميع!' : 'The best educational platform for Sudanese students. I recommend it to everyone!' },
    { name: 'Sara Ahmed', role: lang === 'ar' ? 'طالبة تقنية' : 'Tech Student', quote: lang === 'ar' ? 'المحتوى عالي الجودة والمدربين روائع. شكراً قمم!' : 'High quality content and great instructors. Thanks Qimam!' },
    { name: 'Jamal Hussein', role: lang === 'ar' ? 'خريج حديث' : 'Recent Graduate', quote: lang === 'ar' ? 'ساعدتني في الحصول على وظيفتي الأولى. شكراً جزيلاً!' : 'Helped me get my first job. Thank you so much!' }
  ];
  return (
    <MotionContainer>
      <ParticlesBackground />
      <main className="relative z-10">
        <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #191970 0%, #2a4a7f 50%, #3a5a8f 70%, #F5DEB3 100%)' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 py-20 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }} className="space-y-6">
                <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>{t('home.hero.headline', { defaultValue: '' })}</motion.h1>
                <motion.p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>{t('home.hero.subtitle', { defaultValue: '' })}</motion.p>
                <motion.div className="flex flex-col sm:flex-row gap-4 pt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}>
                  <motion.button onClick={() => scrollToSection('story')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-secondary text-primary font-bold rounded-lg shadow-lg hover:shadow-xl transition-all">{t('home.hero.cta_primary', { defaultValue: 'Start Learning' })}</motion.button>
                </motion.div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.5 }} className="hidden lg:block">
                <div className="relative"><div className="w-80 h-80 mx-auto relative"><motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 border-4 border-dashed border-white/20 rounded-full" /><motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} className="absolute inset-8 border-4 border-dashed border-cyan-500/30 rounded-full" /><div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><div className="text-6xl font-bold text-white mb-2">50K+</div><div className="text-cyan-400">{lang === 'ar' ? 'طالب' : 'Students'}</div></div></div><motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center"><BookOpen className="w-6 h-6 text-white" /></motion.div><motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"><AwardIcon className="w-6 h-6 text-white" /></motion.div></div></div>
              </motion.div>
            </div>
          </div>
          <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}><button onClick={() => scrollToSection('about')} className="flex flex-col items-center text-white/70 hover:text-white transition-colors"><span className="text-sm mb-2">{t('home.hero.scroll_hint', { defaultValue: 'Scroll' })}</span><ChevronDown className="w-6 h-6" /></button></motion.div>
        </section>
        
        <section id="about" className="py-20 bg-gradient-to-b from-slate-900 to-black">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('about.overviewTitle', { defaultValue: 'من نحن' })}</h2>
              <p className="text-slate-400 text-lg max-w-3xl mx-auto">{t('about.overviewText', { defaultValue: '' })}</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[{ icon: Globe, title: 'الرؤية', text: t('about.vision.text', { defaultValue: '' }), color: 'from-cyan-500 to-blue-500' }, { icon: Heart, title: 'المهمة', text: t('about.mission.text', { defaultValue: '' }), color: 'from-pink-500 to-rose-500' }, { icon: Award, title: 'قيمنا', text: '', color: 'from-purple-500 to-violet-500', items: true }, { icon: Users, title: 'قصتنا', text: '', color: 'from-amber-500 to-orange-500', items: true }].map((item, i) => (<motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-2xl"><div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4`}><item.icon className="w-7 h-7 text-white" /></div><h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>{item.text && <p className="text-slate-400 leading-relaxed">{item.text}</p>}{item.items && (<ul className="space-y-2">{(item.items ? t('about.values.items', { returnObjects: true, defaultValue: [] }) : []).map((v, idx) => (<li key={idx} className="flex items-center gap-2 text-slate-400"><span className="w-2 h-2 bg-cyan-500 rounded-full" /><span>{v.title}</span></li>))}</ul>)}</motion.div>))}
            </div>
          </div>
        </section>
        
        <section id="story" className="py-20 bg-black">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('home.story.title', { defaultValue: 'Our Journey' })}</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t('home.story.subtitle', { defaultValue: '' })}</p>
            </motion.div>
            <div className="relative"><div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500 transform -translate-x-1/2" />{t('home.story.timeline', { returnObjects: true, defaultValue: [] }).map((item, i) => (<TimelineItem key={i} item={item} index={i} isLeft={i % 2 === 0} />))}</div>
          </div>
        </section>
        
        <section id="projects" className="py-20 bg-gradient-to-b from-slate-900 to-black">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <motion.span initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 text-sm font-semibold rounded-full mb-4 border border-cyan-500/30">🏆 {lang === 'ar' ? 'قصص نجاح' : 'Success Stories'}</motion.span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{lang === 'ar' ? 'طلابنا نجاحهم' : 'Our Students\' Success'}</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">{lang === 'ar' ? 'شاهد قصص نجاح طلابنا وكيف غيرت قمم حياتهم' : 'See our students\' success stories and how Qimam changed their lives'}</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{successStories.map((story, i) => (<SuccessStoryCard key={i} story={story} index={i} />))}</div>
          </div>
        </section>
        
        <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{lang === 'ar' ? 'ماذا يقول طلابنا' : 'What Our Students Say'}</h2>
            </motion.div>
            <TestimonialsCarousel items={testimonials} />
          </div>
        </section>
        
        <TelegramSection lang={lang} />
        <ContactSection lang={lang} />
      </main>
    </MotionContainer>
  );
};

export default Home;
