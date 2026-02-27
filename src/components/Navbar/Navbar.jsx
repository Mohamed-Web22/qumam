import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { motion, AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from 'framer-motion';
import FocusTrap from 'focus-trap-react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MotionLink = motion(Link);

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const navbarHeight = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
};

const navItems = [
  { to: '#home', key: 'navbar.home', sectionId: 'home' },
  { to: '#about', key: 'navbar.about', sectionId: 'about' },
  { to: '#story', key: 'navbar.story', sectionId: 'story' },
  { to: '#courses', key: 'navbar.services', sectionId: 'courses' },
  { to: '#projects', key: 'navbar.projects', sectionId: 'projects' },
  { to: '#contact', key: 'navbar.contact', sectionId: 'contact' }
];

const Header = () => {
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation();
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const closeBtnRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isRtl = lang === 'ar';

  // New color scheme: #0f2145, #414d76, #e9efff, #d2a517
  const headerVariants = {
    top: { 
      backgroundColor: 'rgba(15, 33, 69, 0.95)', 
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
      paddingTop: 16, 
      paddingBottom: 16, 
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(233, 239, 255, 0.1)'
    },
    scrolled: { 
      backgroundColor: 'rgba(15, 33, 69, 0.98)', 
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      paddingTop: 10, 
      paddingBottom: 10, 
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(210, 165, 23, 0.3)'
    }
  };

  const mobilePanelVariants = {
    hidden: { x: isRtl ? '-100%' : '100%', opacity: 0 },
    visible: prefersReducedMotion
      ? { x: 0, opacity: 1 }
      : { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 320, damping: 28, mass: 0.6, when: 'beforeChildren', staggerChildren: 0.06 } }
  };

  const mobileItem = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { x: isRtl ? -20 : 20, opacity: 0 }, visible: { x: 0, opacity: 1 } };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
    setMobileOpen(false);
  };

  return (
    <>
      <LazyMotion features={domAnimation}>
        <motion.header
          initial="top"
          animate={scrolled ? 'scrolled' : 'top'}
          variants={headerVariants}
          transition={{ duration: 0.38, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-50 text-white"
        >
          <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${isRtl ? 'dir-rtl' : ''}`}>
            <div className={`flex items-center justify-between h-full ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>

              {/* Logo */}
              <MotionLink
                to="/#home"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleNavClick(e, 'home')}
                className="flex items-center gap-3 group"
              >
                {/* Logo Image */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg ring-2 ring-[#d2a517]/50 group-hover:ring-[#d2a517] transition-all duration-300">
                  <img 
                    src="/src/assets/logo.png" 
                    alt="Qimam Sudanese"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-[#0f2145] to-[#414d76]">
                    <span className="text-[#d2a517] font-bold text-xl">ق</span>
                  </div>
                </div>
                
                {/* Logo Text */}
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl font-bold tracking-wide text-[#e9efff]">
                    <span className="text-[#d2a517]">ق</span>مم
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#e9efff]/70 tracking-widest uppercase">
                    Sudanese
                  </span>
                </div>
              </MotionLink>

              {/* Navigation - Desktop */}
              <nav className="hidden lg:flex lg:items-center lg:gap-1">
                <ul className="flex items-center gap-1">
                  {navItems.map((item, index) => (
                    <li key={item.to} className="relative">
                      <motion.a
                        href={item.to}
                        onClick={(e) => handleNavClick(e, item.sectionId)}
                        className="relative z-10 inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#e9efff] hover:text-[#d2a517] transition-all duration-300 cursor-pointer rounded-lg hover:bg-[#414d76]/30"
                        whileHover={prefersReducedMotion ? {} : { y: -2 }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {t(item.key)}
                        <ChevronDown className="w-3 h-3 opacity-50" />
                      </motion.a>
                      
                      {/* Hover underline effect */}
                      <motion.div
                        className="absolute bottom-0 left-1/2 h-0.5 bg-[#d2a517] rounded-full"
                        initial={{ width: 0, x: '-50%' }}
                        whileHover={{ width: '60%', x: '-50%' }}
                        transition={{ duration: 0.2 }}
                      />
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Right controls */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Language Switcher */}
                <div className="flex items-center">
                  <button
                    onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#e9efff] hover:text-[#d2a517] hover:bg-[#414d76]/30 transition-all duration-300 border border-[#414d76]/50 hover:border-[#d2a517]/50"
                    aria-label="Switch language"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">{lang.toUpperCase()}</span>
                  </button>
                </div>

                {/* Contact Button */}
                <motion.button
                  onClick={() => scrollToSection('contact')}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(210, 165, 23, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-[#d2a517] to-[#b8941a] text-[#0f2145] font-bold rounded-lg shadow-lg hover:shadow-[#d2a517]/30 transition-all duration-300 text-sm"
                >
                  {t('navbar.contact') || 'تواصل معنا'}
                </motion.button>

                {/* Mobile Toggle */}
                <div className="lg:hidden">
                  <motion.button
                    onClick={() => setMobileOpen(!isMobileOpen)}
                    aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                    className="p-2.5 rounded-lg bg-[#414d76]/50 text-[#e9efff] hover:bg-[#414d76] hover:text-[#d2a517] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d2a517]"
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence mode="wait">
                      {isMobileOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <X size={24} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Menu size={24} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d2a517] to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: scrolled ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          />
        </motion.header>
      </LazyMotion>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60"
              onClick={() => setMobileOpen(false)}
              style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            />

            <FocusTrap active={isMobileOpen}>
              <motion.aside
                initial={{ x: isRtl ? '-100%' : '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: isRtl ? '-100%' : '100%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 bottom-0 w-[300px] z-50 shadow-2xl overflow-y-auto"
                style={{
                  background: 'linear-gradient(180deg, #0f2145 0%, #1a2d4a 50%, #0f2145 100%)',
                  borderLeft: isRtl ? 'none' : '2px solid #d2a517',
                  borderRight: isRtl ? '2px solid #d2a517' : 'none'
                }}
                role="dialog"
                aria-modal="true"
              >
                {/* Mobile Header */}
                <div className="sticky top-0 bg-[#0f2145]/95 backdrop-blur-lg p-4 border-b border-[#414d76]/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d2a517] to-[#b8941a] flex items-center justify-center shadow-lg">
                        <span className="text-[#0f2145] font-bold text-lg">ق</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-[#e9efff]">قمم السودانية</span>
                        <span className="text-[10px] text-[#e9efff]/60 uppercase">Sudanese</span>
                      </div>
                    </div>
                    <button 
                      ref={closeBtnRef} 
                      onClick={() => setMobileOpen(false)} 
                      className="p-2 rounded-lg bg-[#414d76]/30 text-[#e9efff] hover:bg-[#d2a517] hover:text-[#0f2145] transition-all duration-200"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="p-4">
                  <ul className="space-y-2">
                    {navItems.map((item, index) => (
                      <motion.li
                        key={item.to}
                        initial={{ x: isRtl ? 50 : -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <a
                          href={item.to}
                          onClick={(e) => handleNavClick(e, item.sectionId)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#e9efff] font-medium hover:bg-[#414d76]/40 hover:text-[#d2a517] transition-all duration-200 group"
                        >
                          <span className="w-8 h-8 rounded-lg bg-[#414d76]/30 flex items-center justify-center text-[#d2a517] group-hover:bg-[#d2a517] group-hover:text-[#0f2145] transition-all duration-200">
                            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                          </span>
                          {t(item.key)}
                        </a>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Mobile Actions */}
                  <div className="mt-6 pt-6 border-t border-[#414d76]/30 space-y-3">
                    <button
                      onClick={() => {
                        setLang(lang === 'en' ? 'ar' : 'en');
                        setMobileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#414d76]/30 text-[#e9efff] font-medium hover:bg-[#d2a517] hover:text-[#0f2145] transition-all duration-200"
                    >
                      <Globe className="w-5 h-5" /> 
                      {lang === 'ar' ? 'English' : 'العربية'}
                    </button>
                    
                    <motion.button
                      onClick={() => {
                        scrollToSection('contact');
                        setMobileOpen(false);
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#d2a517] to-[#b8941a] text-[#0f2145] font-bold shadow-lg hover:shadow-[#d2a517]/30 transition-all duration-200"
                    >
                      {t('navbar.contact') || 'تواصل معنا'}
                    </motion.button>
                  </div>
                </nav>

                {/* Mobile Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0f2145] to-transparent">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#d2a517] animate-pulse"></div>
                    <span className="text-xs text-[#e9efff]/50">© 2024 Qimam Sudanese</span>
                    <div className="w-2 h-2 rounded-full bg-[#d2a517] animate-pulse"></div>
                  </div>
                </div>
              </motion.aside>
            </FocusTrap>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
