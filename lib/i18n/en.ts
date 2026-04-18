/**
 * English Translation Dictionary — lib/i18n/en.ts
 *
 * Contains English text strings conforming to the Dictionary type from tr.ts.
 * This dictionary is used when the language is switched to English.
 */
import type { Dictionary } from "./tr";

const en: Dictionary = {
    nav: {
        work: "Work",
        about: "About",
        contact: "Contact",
    },
    hero: {
        fallbackSubtitle:
            "Software Developer · Digital Product Designer · Problem Solver",
        typingLines: [
            "I design digital products",
            "I build user-focused solutions",
            "I work with modern technologies",
        ],
        ctaWork: "See My Work",
        ctaWorld: "Discover My Story",
    },
    metrics: {
        yearsLabel: "Years Experience",
        projectsLabel: "Projects",
        industriesLabel: "Industries",
    },
    skills: {
        title: "Expertise",
        categories: [
            {
                label: "🌐 Frontend",
                items: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3"],
            },
            {
                label: "⚙️ Backend",
                items: ["Node.js", "Python", "REST API", "PostgreSQL", "MongoDB"],
            },
            {
                label: "📱 Mobile",
                items: ["Flutter", "React Native", "iOS", "Android"],
            },
            {
                label: "🏗️ Tools",
                items: ["Git", "Docker", "Figma", "VS Code", "CI/CD"],
            },
        ],
    },
    featured: {
        title: "Featured Work",
        emptyState:
            'No featured projects yet. Mark a project as "Featured" from Admin.',
        fallbackSummary: "Click for details.",
        browseProjects: "Browse All Projects",
        description:
            "Explore each project through its problem, solution, and results.",
        viewCase: "View →",
    },
    identity: {
        sectionTitle: "Beyond the Code",
        musicTagline: "Music teaches discipline and harmony.",
        canadaTagline: "Different perspectives, stronger products.",
        womanTagline: "An engineer who believes in precision and empathy.",
        animalTagline: "They are residents of this city too.",
        musicFallback:
            "Engaging with music strengthens discipline and teamwork. These skills naturally reflect in my software development process.",
        canadaFallback:
            "International experiences strengthen the ability to collaborate across cultures and think globally.",
        womanFallback:
            "In the world of technology, I believe in precision and empathy.",
        animalFallback:
            "We share these cities with our street friends. Even a bowl of water, a handful of food makes a difference. 🐾",
    },
    talk: {
        title: "Let's Talk",
        description: "For new opportunities, collaborations, or just to say hello.",
        contactMe: "Contact Form",
        emailDirectly: "Email Directly",
        downloadCv: "Download CV",
        statusOpen: "🟢 Open to opportunities",
        statusBusy: "🟡 Currently busy",
    },
    footer: {
        builtWith: "Built with Next.js",
    },
    about: {
        title: "About",
        subtitle: "About me, my experience, and skills.",
        fallbackContent:
            "# About\n\nFill in the **Content → About Markdown** field from the admin panel.\n",
        backHome: "← Home",
    },
    contact: {
        title: "Contact",
        home: "Home",
        formName: "Your Name",
        formEmail: "Your Email",
        formMessage: "Your Message",
        formSend: "Send Message",
        formSending: "Sending...",
        formSent: "Message sent successfully ✨",
        formError: "Something went wrong.",
    },
    work: {
        title: "Work",
        fallbackIntro:
            "Selected works presented in Problem → Solution → Results format.",
        backHome: "← Home",
        timelineFallback: "Click for details.",
    },
    workDetail: {
        problem: "Problem",
        solution: "Solution",
        results: "Results",
        backToWork: "← Back to Work",
    },
};

export default en;
