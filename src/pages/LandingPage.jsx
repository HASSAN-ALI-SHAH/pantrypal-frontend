import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, BarChart3, Bell, Calendar, ChefHat } from 'lucide-react';
import ParticleBackground from '../components/ui/ParticleBackground';

const floatingEmojis = [
  { emoji: '🥦', x: '8%',  y: '15%', duration: 4,   delay: 0 },
  { emoji: '🥕', x: '85%', y: '20%', duration: 5,   delay: 1 },
  { emoji: '🍎', x: '15%', y: '70%', duration: 3.5, delay: 2 },
  { emoji: '🥛', x: '80%', y: '65%', duration: 4.5, delay: 0.5 },
  { emoji: '🧀', x: '50%', y: '10%', duration: 5,   delay: 1.5 },
  { emoji: '🍌', x: '70%', y: '80%', duration: 3.8, delay: 0.8 },
  { emoji: '🥩', x: '25%', y: '40%', duration: 4.2, delay: 2.5 },
  { emoji: '🌾', x: '90%', y: '45%', duration: 3,   delay: 1.2 },
  { emoji: '🧃', x: '5%',  y: '50%', duration: 5.5, delay: 3 },
  { emoji: '🍓', x: '60%', y: '30%', duration: 4.8, delay: 0.3 },
];

const features = [
  { icon: Calendar, title: 'Track Expiry Dates',  desc: 'Add any food item and set its expiry date. PantryPal keeps a live countdown so you never forget.' },
  { icon: Bell,     title: 'Smart Alerts',        desc: 'Get notified before food expires. Customizable alert windows from 1 to 14 days in advance.' },
  { icon: BarChart3, title: 'Reduce Food Waste',  desc: 'Visualize consumption patterns and save money by using food intelligently before it expires.' },
];

const steps = [
  { num: '01', title: 'Add Items',          desc: 'Enter your food items with name, category, and expiry date. Takes under 10 seconds.' },
  { num: '02', title: 'Get Smart Alerts',   desc: 'PantryPal alerts you automatically when items approach their expiry date.' },
  { num: '03', title: 'Use Food On Time',   desc: 'Act on alerts to consume food before it expires and track your waste reduction.' },
];

const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          setCount(c => {
            if (c + step >= target) { clearInterval(timer); return target; }
            return c + step;
          });
        }, 20);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref} className="font-mono font-bold">{count.toLocaleString()}{suffix}</span>;
};

const LandingPage = () => (
  <div className="min-h-screen relative">
    {/* Hero */}
    <section className="hero-gradient relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Floating emojis */}
      {floatingEmojis.map((e, i) => (
        <div key={i} className="floating-emoji" style={{
          left: e.x, top: e.y,
          '--duration': `${e.duration}s`, '--delay': `${e.delay}s`,
        }}>{e.emoji}</div>
      ))}

      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Logo badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white/80 text-sm mb-8 backdrop-blur-sm">
          <ChefHat size={16} /> Smart Food Expiry Monitoring
        </div>

        <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
          Never Let Food<br />
          <span style={{ color: '#BAE6FD' }}>Go To Waste</span> Again
        </h1>
        <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          PantryPal tracks your food expiry dates so you always know what to use first.
          Smart alerts, beautiful analytics, zero waste.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="btn bg-white text-primary font-bold px-8 py-3.5 rounded-xl shadow-blue-lg text-base"
            >
              Get Started Free <ArrowRight size={16} className="inline ml-1" />
            </motion.button>
          </Link>
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="btn btn-outline-white px-8 py-3.5 rounded-xl text-base"
            >
              Sign In
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce-arrow">
        <ChevronDown size={28} />
      </div>
    </section>

    {/* Features */}
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-text-dark mb-4">Everything You Need</h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">A complete toolkit to eliminate food waste from your household.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="card p-8 text-center group"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary transition-colors">
                <f.icon size={24} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-heading font-bold text-lg text-text-dark mb-3">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="py-24 px-6 bg-bg">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold text-text-dark mb-4">How It Works</h2>
          <p className="text-text-muted text-lg">Three simple steps to a waste-free kitchen.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-sky via-primary-light to-primary-sky" />

          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="text-center relative"
            >
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-blue-md">
                <span className="font-mono text-white text-2xl font-bold">{s.num}</span>
              </div>
              <h3 className="font-heading font-bold text-lg text-text-dark mb-2">{s.title}</h3>
              <p className="text-text-muted text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Stats bar */}
    <section className="py-16 px-6" style={{ background: 'linear-gradient(135deg, #1E3A5F, #1D4ED8)' }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {[
          { target: 10000, suffix: '+', label: 'Items Tracked' },
          { target: 30,    suffix: '%', label: 'Less Food Waste' },
          { target: 500,   suffix: '+', label: 'Happy Households' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: i * 0.2 }}
          >
            <div className="text-5xl text-white mb-2">
              <Counter target={s.target} suffix={s.suffix} />
            </div>
            <p className="text-white/70 text-sm">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-6 bg-white text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-heading text-4xl font-bold text-text-dark mb-4">Ready to stop wasting food?</h2>
        <p className="text-text-muted mb-8">Join thousands of households already using PantryPal.</p>
        <Link to="/register">
          <button className="btn btn-primary btn-lg shadow-blue-md">
            Start For Free <ArrowRight size={18} className="inline ml-1" />
          </button>
        </Link>
      </motion.div>
    </section>

    {/* Footer */}
    <footer className="bg-primary-dark py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white">
          <ChefHat size={20} className="text-primary-sky" />
          <span className="font-heading font-bold">PantryPal</span>
          <span className="text-white/40 text-sm ml-2">Smart Food Expiry Monitor</span>
        </div>
        <div className="flex gap-6 text-white/50 text-sm">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="hover:text-white transition-colors">Register</Link>
        </div>
        <p className="text-white/30 text-xs">© 2025 PantryPal. All rights reserved.</p>
      </div>
    </footer>

    {/* Interactive particle background (fixed to viewport, covers entire page) */}
    <ParticleBackground particleCount={80} />
  </div>
);

export default LandingPage;
