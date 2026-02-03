'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Icons } from '@/components/Icons';
import AppMockup from '@/components/AppMockup';
import styles from './landing.module.css';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}><Icons.Logo size={28} /></span>
          <span className={styles.logoText}>COPREPER</span>
        </Link>
        <div className={styles.navActions}>
          <button onClick={toggleTheme} className={styles.themeBtn} aria-label="Toggle theme">
            {isDark ? <Icons.Sun size={18} /> : <Icons.Moon size={18} />}
          </button>
          <Link href="/login" className={styles.loginBtn}>
            Sign In
          </Link>
          <Link href="/login" className={styles.ctaBtn}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gradientOrb1}></div>
          <div className={styles.gradientOrb2}></div>
          <div className={styles.gradientOrb3}></div>
        </div>
        <div className={styles.heroContent}>
          <span className={styles.badge}>
            <Icons.Rocket size={14} />
            Interview Prep Made Simple
          </span>
          <h1 className={styles.heroTitle}>
            Never Forget Your
            <span className={styles.gradient}> Project Details </span>
            Again
          </h1>
          <p className={styles.heroSubtitle}>
            Store, organize, and practice explaining your software projects before interviews.
            Get AI-generated questions and nail every technical discussion.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/login" className={styles.primaryCta}>
              Start Preparing Free
              <Icons.ArrowRight size={18} />
            </Link>
            <a href="#features" className={styles.secondaryCta}>
              See How It Works
            </a>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>100%</span>
              <span className={styles.statLabel}>Free Forever</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.stat}>
              <span className={styles.statValue}>AI</span>
              <span className={styles.statLabel}>Question Generation</span>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.stat}>
              <span className={styles.statValue}><Icons.Infinity size={24} /></span>
              <span className={styles.statLabel}>Projects</span>
            </div>
          </div>
        </div>

        {/* App Preview Mockup */}
        <AppMockup />
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Features</span>
          <h2 className={styles.sectionTitle}>Everything You Need to Ace Your Interview</h2>
          <p className={styles.sectionSubtitle}>
            A complete toolkit designed specifically for software engineers preparing for technical interviews.
          </p>
        </div>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Icons.Folder size={32} /></div>
            <h3 className={styles.featureTitle}>Project Documentation</h3>
            <p className={styles.featureDesc}>
              Store comprehensive details about each project—architecture, challenges, tradeoffs, and more.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Icons.Sparkles size={32} /></div>
            <h3 className={styles.featureTitle}>AI-Powered Questions</h3>
            <p className={styles.featureDesc}>
              Get interview questions auto-generated based on your project details and tech stack.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Icons.Code size={32} /></div>
            <h3 className={styles.featureTitle}>Code Snippets</h3>
            <p className={styles.featureDesc}>
              Save key code snippets with explanations to discuss your technical decisions confidently.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Icons.Target size={32} /></div>
            <h3 className={styles.featureTitle}>Mock Interview Mode</h3>
            <p className={styles.featureDesc}>
              Practice answering questions with AI evaluation and get instant feedback on your responses.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Icons.Moon size={32} /></div>
            <h3 className={styles.featureTitle}>Dark Mode</h3>
            <p className={styles.featureDesc}>
              Easy on the eyes with a beautiful dark theme. Perfect for late-night prep sessions.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Icons.Cloud size={32} /></div>
            <h3 className={styles.featureTitle}>Cloud Synced</h3>
            <p className={styles.featureDesc}>
              Access your projects from anywhere. Your data is securely stored and always available.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>How It Works</span>
          <h2 className={styles.sectionTitle}>From Project to Interview Ready in 3 Steps</h2>
        </div>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Add Your Projects</h3>
            <p className={styles.stepDesc}>
              Document your projects with descriptions, tech stack, architecture, and key decisions.
            </p>
          </div>
          <div className={styles.stepConnector}></div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Generate Questions</h3>
            <p className={styles.stepDesc}>
              AI analyzes your project and creates relevant interview questions for you to practice.
            </p>
          </div>
          <div className={styles.stepConnector}></div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Practice & Review</h3>
            <p className={styles.stepDesc}>
              Use mock interview mode to practice and refine your answers before the real thing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Ready to Ace Your Next Interview?</h2>
          <p className={styles.ctaSubtitle}>
            Join developers who use COPREPER to prepare for their dream job interviews.
          </p>
          <Link href="/login" className={styles.ctaButton}>
            Get Started Free — No Credit Card
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <Icons.Logo size={24} />
            <span className={styles.logoText}>COPREPER</span>
          </div>
          <p className={styles.footerText}>
            Built with <Icons.Heart size={14} className={styles.heartIcon} /> for developers, by developers.
          </p>
          <p className={styles.footerCopy}>
            © {new Date().getFullYear()} COPREPER. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
