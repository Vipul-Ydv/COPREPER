'use client';

import { Icons } from './Icons';
import styles from './AppMockup.module.css';

export default function AppMockup() {
    return (
        <div className={styles.mockupContainer}>
            {/* Browser Frame */}
            <div className={styles.browserFrame}>
                <div className={styles.browserHeader}>
                    <div className={styles.browserDots}>
                        <span className={styles.dot}></span>
                        <span className={styles.dot}></span>
                        <span className={styles.dot}></span>
                    </div>
                    <div className={styles.browserUrl}>
                        <Icons.Logo size={12} />
                        <span>copreper.vercel.app/dashboard</span>
                    </div>
                </div>

                {/* App Content Preview */}
                <div className={styles.appContent}>
                    {/* Mini Sidebar */}
                    <div className={styles.miniSidebar}>
                        <div className={styles.miniLogo}>
                            <Icons.Logo size={16} />
                        </div>
                        <div className={styles.miniNavItems}>
                            <div className={`${styles.miniNavItem} ${styles.active}`}></div>
                            <div className={styles.miniNavItem}></div>
                            <div className={styles.miniNavItem}></div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className={styles.miniMain}>
                        {/* Welcome */}
                        <div className={styles.miniWelcome}>
                            <div className={styles.miniTitle}></div>
                            <div className={styles.miniSubtitle}></div>
                        </div>

                        {/* Stats Row */}
                        <div className={styles.miniStats}>
                            <div className={styles.miniStatCard}>
                                <div className={styles.miniStatIcon}><Icons.Folder size={12} /></div>
                                <div className={styles.miniStatText}>
                                    <span className={styles.miniStatValue}>5</span>
                                    <span className={styles.miniStatLabel}>Projects</span>
                                </div>
                            </div>
                            <div className={styles.miniStatCard}>
                                <div className={styles.miniStatIcon}><Icons.Code size={12} /></div>
                                <div className={styles.miniStatText}>
                                    <span className={styles.miniStatValue}>12</span>
                                    <span className={styles.miniStatLabel}>Technologies</span>
                                </div>
                            </div>
                            <div className={styles.miniStatCard}>
                                <div className={styles.miniStatIcon}><Icons.Target size={12} /></div>
                                <div className={styles.miniStatText}>
                                    <span className={styles.miniStatValue}>28</span>
                                    <span className={styles.miniStatLabel}>Questions</span>
                                </div>
                            </div>
                        </div>

                        {/* Project Cards */}
                        <div className={styles.miniProjects}>
                            <div className={styles.miniProjectCard}>
                                <div className={styles.cardAccent}></div>
                                <div className={styles.cardLines}>
                                    <div className={styles.cardTitle}></div>
                                    <div className={styles.cardDesc}></div>
                                    <div className={styles.cardTags}>
                                        <span className={styles.cardTag}>React</span>
                                        <span className={styles.cardTag}>Node.js</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.miniProjectCard}>
                                <div className={`${styles.cardAccent} ${styles.accent2}`}></div>
                                <div className={styles.cardLines}>
                                    <div className={styles.cardTitle}></div>
                                    <div className={styles.cardDesc}></div>
                                    <div className={styles.cardTags}>
                                        <span className={styles.cardTag}>Python</span>
                                        <span className={styles.cardTag}>AI</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Elements */}
            <div className={`${styles.floatingCard} ${styles.float1}`}>
                <Icons.Sparkles size={16} />
                <span>AI Generated</span>
            </div>
            <div className={`${styles.floatingCard} ${styles.float2}`}>
                <Icons.Check size={16} />
                <span>Interview Ready</span>
            </div>
            <div className={`${styles.floatingCard} ${styles.float3}`}>
                <Icons.Target size={16} />
                <span>Practice Mode</span>
            </div>
        </div>
    );
}
