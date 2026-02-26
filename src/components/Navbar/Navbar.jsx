import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { motion, AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from 'framer-motion';
import FocusTrap from 'focus-trap-react';
import { Menu, X, Globe } from 'lucide-react';
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
  const closeBtnRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isRtl = lang === 'ar';

  const headerVariants = {
    top: { backgroundColor: 'rgba(25,25,112,0.95)', boxShadow: 'rgba(0,0,0,0.35) 0px 6px 18px', paddingTop: 20, paddingBottom: 20, backdropFilter: 'blur(10px)' },
    scrolled: { backgroundColor: 'rgba(25,25,112,0.95)', boxShadow: 'rgba(0,0,0,0.35) 0px 6px 18px', paddingTop: 6, paddingBottom: 6, backdropFilter: 'blur(10px)' }
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
          className="fixed top-0 left-0 right-0 z-50 text-white backdrop-blur-md"
        >
          <div className={`container mx-auto px-4 ${isRtl ? 'dir-rtl' : ''}`}>
            <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>

              {/* Logo */}
              <MotionLink
                to="/#home"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => handleNavClick(e, 'home')}
                className="inline-flex items-center space-x-3 cursor-pointer"
              >
                <motion.svg whileHover={{ rotate: -8 }} width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#FFFFFF" />
                  <path d="M7 12h10" stroke="#F5DEB3" strokeWidth="1.6" strokeLinecap="round" />
                </motion.svg>
                <span className="text-lg md:text-xl font-semibold select-none">قمم <span className="font-bold">السودانية</span></span>
              </MotionLink>

              {/* Navigation - Desktop */}
              <nav className="hidden md:flex md:items-center md:space-x-6">
                <ul className="flex items-center">
                  {navItems.map((item) => (
                    <li key={item.to} className="relative px-2 py-1">
                      <motion.a
                        href={item.to}
                        onClick={(e) => handleNavClick(e, item.sectionId)}
                        className="relative z-10 inline-block px-3 py-2 text-base md:text-lg font-medium transition-transform hover:text-[#F5DEB3] cursor-pointer"
                        whileHover={prefersReducedMotion ? {} : { y: -2 }}
                      >
                        {t(item.key)}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Right controls */}
              <div className="flex items-center space-x-3">
                {/* Language Switcher */}
                <div className="hidden sm:flex items-center gap-3">
                  <button
                    onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                    className="flex items-center gap-2 px-2 py-1 rounded-full text-sm text-white hover:text-[#F5DEB3]"
                    aria-label="Switch language"
                  >
                    <Globe className="w-5 h-5" />
                    <span>{lang.toUpperCase()}</span>
                  </button>
                </div>

                {/* Contact Button */}
                <button
                  onClick={() => scrollToSection('contact')}
                  className="hidden sm:inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#191970] to-[#0F1440] hover:from-[#0F1440] hover:to-[#191970] text-white rounded-md shadow-md transition-all duration-300"
                >
                  تواصل معنا
                </button>

                {/* Mobile Toggle */}
                <div className="md:hidden">
                  <button
                    onClick={() => setMobileOpen(!isMobileOpen)}
                    aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                    className="p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <AnimatePresence mode="wait">
                      {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </AnimatePresence>
                  </button>
                </div>
              </div>

            </div>
          </div>
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
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setMobileOpen(false)}
              style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
            />

            <FocusTrap active={isMobileOpen}>
              <motion.aside
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                className="fixed top-0 right-0 bottom-0 w-80 bg-[#191970] text-white shadow-xl z-50 p-6"
                role="dialog"
                aria-modal="true"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-semibold">قمم السودانية</span>
                  <button ref={closeBtnRef} onClick={() => setMobileOpen(false)} className="p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-white">✕</button>
                </div>

                <ul className="space-y-4">
                  {navItems.map((item) => (
                    <li key={item.to}>
                      <a
                        href={item.to}
                        onClick={(e) => handleNavClick(e, item.sectionId)}
                        className="block text-lg font-medium cursor-pointer hover:text-[#F5DEB3]"
                      >
                        {t(item.key)}
                      </a>
                    </li>
                  ))}
                  <li className="pt-4">
                    <button
                      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                      className="flex items-center gap-2 px-3 py-1 rounded bg-[#F5DEB3] text-[#191970]"
                    >
                      <Globe className="w-4 h-4" /> {lang.toUpperCase()}
                    </button>
                  </li>
                  <li className="pt-4">
                    <button
                      onClick={() => scrollToSection('contact')}
                      className="w-full px-4 py-2 bg-navy text-white rounded-md font-semibold hover:bg-navy-dark transition-colors"
                    >
                      تواصل معنا
                    </button>
                  </li>
                </ul>
              </motion.aside>
            </FocusTrap>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
