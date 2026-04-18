/**
 * Register API — New user registration (POST /api/auth/register).
 *
 * Flow:
 * 1. Email, password, and slug validation
 * 2. Slug format check (regex: lowercase + digits + hyphens, 3-30 characters)
 * 3. Reserved slug check (admin, dashboard, etc.)
 * 4. Email uniqueness check
 * 5. Slug uniqueness check
 * 6. Password is hashed with bcrypt (12 rounds)
 * 7. Prisma transaction: User + Site + SiteContent + SiteSettings are created
 * 8. Returns 201 Created + user info
 *
 * Newly registered users are automatically assigned default content
 * (sample skills, typing lines, about text).
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name, slug } = body;

        // Validate required fields
        if (!email || !password || !slug) {
            return NextResponse.json(
                { error: "Email, password, and username are required." },
                { status: 400 }
            );
        }

        // Validate slug format
        const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
        if (!slugRegex.test(slug) || slug.length < 3 || slug.length > 30) {
            return NextResponse.json(
                { error: "Username must be 3-30 characters, lowercase letters and digits only." },
                { status: 400 }
            );
        }

        // Reserved slugs
        const reserved = [
            "admin", "dashboard", "login", "register", "api", "about",
            "contact", "work", "settings", "blog", "help", "support",
            "pricing", "terms", "privacy", "app", "www", "mail",
        ];
        if (reserved.includes(slug)) {
            return NextResponse.json(
                { error: "This username is not available." },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { error: "This email is already registered." },
                { status: 409 }
            );
        }

        // Check if slug already taken
        const existingSite = await prisma.site.findUnique({ where: { slug } });
        if (existingSite) {
            return NextResponse.json(
                { error: "This username is already taken." },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user + site + default content + default settings
        const user = await prisma.user.create({
            data: {
                email,
                name: name || null,
                passwordHash,
                sites: {
                    create: {
                        slug,
                        title: name || slug,
                        content: {
                            create: {
                                homeHeroTitle: name || slug,
                                homeHeroSubtitle: "Welcome to my portfolio",
                                homeHeroSubtitleEn: "Welcome to my portfolio",
                                typingLinesJson: JSON.stringify(["Software Developer", "Problem Solver", "Team Player"]),
                                typingLinesJsonEn: JSON.stringify(["Software Developer", "Problem Solver", "Team Player"]),
                                skillsJson: JSON.stringify([
                                    { label: "Programming", items: ["Python", "JavaScript", "SQL"] },
                                    { label: "Web Development", items: ["React", "Node.js", "HTML/CSS"] },
                                    { label: "Tools", items: ["Git", "VS Code", "Figma"] },
                                ]),
                                skillsJsonEn: JSON.stringify([
                                    { label: "Programming", items: ["Python", "JavaScript", "SQL"] },
                                    { label: "Web Development", items: ["React", "Node.js", "HTML/CSS"] },
                                    { label: "Tools", items: ["Git", "VS Code", "Figma"] },
                                ]),
                                aboutMarkdown: "Hello! I'm a recent graduate software developer. Edit this section to introduce yourself.",
                                aboutMarkdownEn: "Hello! I'm a recent graduate software developer. Edit this section to introduce yourself.",
                                featuredDescription: "My featured projects",
                                featuredDescriptionEn: "My featured projects",
                            },
                        },
                        settings: {
                            create: {
                                email,
                            },
                        },
                    },
                },
            },
            include: {
                sites: { take: 1 },
            },
        });

        return NextResponse.json(
            {
                message: "Registration successful!",
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    siteSlug: user.sites[0]?.slug,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "An error occurred. Please try again." },
            { status: 500 }
        );
    }
}
