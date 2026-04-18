/**
 * Seed Script — Test data generation.
 *
 * Generates sample data for a quick start in the development environment:
 * - Test user (test@bio.dev / test123)
 * - Sample site (slug: "test")
 * - Default content (hero, about, skills)
 * - Sample projects
 *
 * Run: npx prisma db seed
 * This script is triggered by the prisma.seed setting in package.json.
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
    const prisma = new PrismaClient();

    // Check if test user already exists
    const existing = await prisma.user.findUnique({ where: { email: 'test@bio.dev' } });
    if (existing) {
        console.log('✅ Test user already exists');
        await prisma.$disconnect();
        return;
    }

    // Hash the test password
    const hash = await bcrypt.hash('test123', 12);

    // Create test user with site, content, settings, and sample projects
    await prisma.user.create({
        data: {
            email: 'test@bio.dev',
            name: 'Test User',
            passwordHash: hash,
            sites: {
                create: {
                    slug: 'test',
                    title: 'Test Portfolio',
                    isPublished: true,
                    content: {
                        create: {
                            homeHeroTitle: 'Test User',
                            homeHeroSubtitle: 'Full Stack Developer | bio.dev demo page',
                            homeHeroTitleEn: 'Test User',
                            homeHeroSubtitleEn: 'Full Stack Developer | bio.dev demo page',
                            aboutMarkdown: 'Hello! This is a **bio.dev** demo page.',
                            aboutMarkdownEn: 'Hello! This is a **bio.dev** demo page.',
                            skillsJson: JSON.stringify([
                                { label: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind'] },
                                { label: 'Backend', items: ['Node.js', 'PostgreSQL', 'Prisma'] },
                                { label: 'Mobile', items: ['Flutter', 'React Native'] },
                            ]),
                            skillsJsonEn: JSON.stringify([
                                { label: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind'] },
                                { label: 'Backend', items: ['Node.js', 'PostgreSQL', 'Prisma'] },
                                { label: 'Mobile', items: ['Flutter', 'React Native'] },
                            ]),
                            typingLinesJson: JSON.stringify(['Full Stack Developer', 'Mobile App Expert', 'Open Source Enthusiast']),
                            typingLinesJsonEn: JSON.stringify(['Full Stack Developer', 'Mobile App Expert', 'Open Source Enthusiast']),
                            featuredDescription: 'My featured projects',
                            featuredDescriptionEn: 'My featured projects',
                        }
                    },
                    settings: {
                        create: {
                            email: 'test@bio.dev',
                            linkedin: 'https://linkedin.com/in/test',
                            github: 'https://github.com/test',
                            yearsExperience: '5+',
                            projectsDelivered: '10+',
                            industriesServed: 'Fintech, Health, E-commerce',
                            availabilityStatus: 'open',
                        }
                    },
                    projects: {
                        create: [
                            {
                                slug: 'biodev-platform',
                                title: 'Bio.dev Platform',
                                titleEn: 'Bio.dev Platform',
                                role: 'Full Stack Developer',
                                roleEn: 'Full Stack Developer',
                                summary: 'Multi-tenant portfolio platform',
                                summaryEn: 'Multi-tenant portfolio platform',
                                stack: JSON.stringify(['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind', 'NextAuth']),
                                problem: 'Lack of ready-made portfolio solutions for developers',
                                problemEn: 'Lack of ready-made portfolio solutions for developers',
                                solution: JSON.stringify(['Multi-tenant architecture', 'Dashboard', 'TR/EN support']),
                                solutionEn: JSON.stringify(['Multi-tenant architecture', 'Dashboard', 'TR/EN support']),
                                results: JSON.stringify(['One-click portfolio', 'SEO friendly', 'Fast SSR']),
                                resultsEn: JSON.stringify(['One-click portfolio', 'SEO friendly', 'Fast SSR']),
                                isFeatured: true,
                                isPublished: true,
                            },
                            {
                                slug: 'fintech-app',
                                title: 'Fintech Mobile App',
                                titleEn: 'Fintech Mobile App',
                                role: 'Lead Mobile Developer',
                                roleEn: 'Lead Mobile Developer',
                                summary: 'Fintech app built with Flutter',
                                summaryEn: 'Fintech app built with Flutter',
                                stack: JSON.stringify(['Flutter', 'Dart', 'Firebase', 'Stripe']),
                                problem: 'Simplifying complex financial transactions on mobile',
                                problemEn: 'Simplifying complex financial transactions on mobile',
                                solution: JSON.stringify(['Intuitive UI', 'Secure payment']),
                                solutionEn: JSON.stringify(['Intuitive UI', 'Secure payment']),
                                results: JSON.stringify(['50K+ downloads', '4.8 App Store']),
                                resultsEn: JSON.stringify(['50K+ downloads', '4.8 App Store']),
                                isFeatured: true,
                                isPublished: true,
                            }
                        ]
                    }
                }
            }
        }
    });

    console.log('✅ Test user created: test@bio.dev / test123');
    console.log('✅ Public page: http://localhost:3000/test');
    await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
