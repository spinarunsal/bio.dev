/**
 * Turkish Translation Dictionary — lib/i18n/tr.ts
 *
 * Contains all Turkish text strings used throughout the application.
 * The Dictionary type is defined here and en.ts conforms to this type.
 *
 * Sections:
 * - meta: Page titles and SEO text
 * - hero: Homepage hero section
 * - skills: Skill categories (fallback data)
 * - about / featured / contact / identity: Section headings
 * - work / caseStudy: Project page text
 *
 * Content entered from the dashboard overrides this dictionary.
 * Values in this file are only used as defaults (fallback).
 */
export type Dictionary = {
    nav: {
        work: string;
        about: string;
        contact: string;
    };
    hero: {
        fallbackSubtitle: string;
        typingLines: string[];
        ctaWork: string;
        ctaWorld: string;
    };
    metrics: {
        yearsLabel: string;
        projectsLabel: string;
        industriesLabel: string;
    };
    skills: {
        title: string;
        categories: {
            label: string;
            items: string[];
        }[];
    };
    featured: {
        title: string;
        emptyState: string;
        fallbackSummary: string;
        browseProjects: string;
        description: string;
        viewCase: string;
    };
    identity: {
        sectionTitle: string;
        musicTagline: string;
        canadaTagline: string;
        womanTagline: string;
        animalTagline: string;
        musicFallback: string;
        canadaFallback: string;
        womanFallback: string;
        animalFallback: string;
    };
    talk: {
        title: string;
        description: string;
        contactMe: string;
        emailDirectly: string;
        downloadCv: string;
        statusOpen: string;
        statusBusy: string;
    };
    footer: {
        builtWith: string;
    };
    about: {
        title: string;
        subtitle: string;
        fallbackContent: string;
        backHome: string;
    };
    contact: {
        title: string;
        home: string;
        formName: string;
        formEmail: string;
        formMessage: string;
        formSend: string;
        formSending: string;
        formSent: string;
        formError: string;
    };
    work: {
        title: string;
        fallbackIntro: string;
        backHome: string;
        timelineFallback: string;
    };
    workDetail: {
        problem: string;
        solution: string;
        results: string;
        backToWork: string;
    };
};

const tr: Dictionary = {
    nav: {
        work: "Projeler",
        about: "Hakkımda",
        contact: "İletişim",
    },
    hero: {
        fallbackSubtitle:
            "Yazılım Geliştirici · Dijital Ürün Tasarımcısı · Problem Çözücü",
        typingLines: [
            "Dijital ürünler tasarlıyorum",
            "Kullanıcı odaklı çözümler üretiyorum",
            "Modern teknolojilerle çalışıyorum",
        ],
        ctaWork: "İşlerimi Gör",
        ctaWorld: "Hikayemi Keşfet",
    },
    metrics: {
        yearsLabel: "Yıl Deneyim",
        projectsLabel: "Proje",
        industriesLabel: "Sektör",
    },
    skills: {
        title: "Uzmanlık Alanları",
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
                label: "📱 Mobil",
                items: ["Flutter", "React Native", "iOS", "Android"],
            },
            {
                label: "🏗️ Araçlar",
                items: ["Git", "Docker", "Figma", "VS Code", "CI/CD"],
            },
        ],
    },
    featured: {
        title: "Öne Çıkan İşler",
        emptyState:
            'Henüz öne çıkan proje yok. Admin\'den "Featured" olarak işaretleyin.',
        fallbackSummary: "Detaylar için tıkla.",
        browseProjects: "Tüm Projelere Göz At",
        description:
            "Her projeyi problem, çözüm ve sonuç adımlarıyla inceleyebilirsiniz.",
        viewCase: "İncele →",
    },
    identity: {
        sectionTitle: "Kodun Ötesinde",
        musicTagline: "Müzik, disiplin ve uyumu öğretir.",
        canadaTagline: "Farklı bakış açıları, daha güçlü ürünler.",
        womanTagline: "Hassasiyet ve empatiye inanan bir mühendis.",
        animalTagline: "Onlar da bu şehrin sakinleri.",
        musicFallback:
            "Müzikle ilgilenmek, disiplin ve topluluk uyumunu pekiştirir. Bu beceriler yazılım geliştirme süreçlerime de yansıyor.",
        canadaFallback:
            "Uluslararası deneyimler, farklı kültürlerden ekiplerle çalışma becerisini güçlendirir.",
        womanFallback:
            "Teknoloji dünyasında hassasiyet ve empatiye inanıyorum.",
        animalFallback:
            "Sokak sakinleriyle paylaştığımız şehirlerde yaşıyoruz. Onlara bir kap su, bir avuç mama bile fark yaratır. 🐾",
    },
    talk: {
        title: "İletişime Geç",
        description: "Yeni fırsatlar, işbirlikleri veya sadece merhaba demek için.",
        contactMe: "İletişim Formu",
        emailDirectly: "E-posta Gönder",
        downloadCv: "CV İndir",
        statusOpen: "🟢 Fırsatlara açığım",
        statusBusy: "🟡 Şu an meşgulüm",
    },
    footer: {
        builtWith: "Next.js ile yapıldı",
    },
    about: {
        title: "Hakkımda",
        subtitle: "Hakkımda, deneyimlerim ve yeteneklerim.",
        fallbackContent:
            "# Hakkımda\n\nAdmin panelden **Content → About Markdown** alanını doldur.\n",
        backHome: "← Ana Sayfa",
    },
    contact: {
        title: "İletişim",
        home: "Ana Sayfa",
        formName: "Adınız",
        formEmail: "E-posta Adresiniz",
        formMessage: "Mesajınız",
        formSend: "Mesaj Gönder",
        formSending: "Gönderiliyor...",
        formSent: "Mesajınız başarıyla gönderildi ✨",
        formError: "Bir hata oluştu.",
    },
    work: {
        title: "İşler",
        fallbackIntro: "Problem → Çözüm → Sonuç formatında seçili işler.",
        backHome: "← Ana Sayfa",
        timelineFallback: "Detaylar için tıkla.",
    },
    workDetail: {
        problem: "Problem",
        solution: "Çözüm",
        results: "Sonuçlar",
        backToWork: "← İşlere Dön",
    },
};

export default tr;
