-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SiteContent" (
    "id" TEXT NOT NULL,
    "homeHeroTitle" TEXT NOT NULL,
    "homeHeroSubtitle" TEXT NOT NULL,
    "aboutMarkdown" TEXT NOT NULL,
    "workIntroMarkdown" TEXT NOT NULL DEFAULT '',
    "contactMarkdown" TEXT NOT NULL DEFAULT '',
    "homeHeroTitleEn" TEXT NOT NULL DEFAULT '',
    "homeHeroSubtitleEn" TEXT NOT NULL DEFAULT '',
    "aboutMarkdownEn" TEXT NOT NULL DEFAULT '',
    "workIntroMarkdownEn" TEXT NOT NULL DEFAULT '',
    "contactMarkdownEn" TEXT NOT NULL DEFAULT '',
    "musicTitle" TEXT NOT NULL DEFAULT 'Korist',
    "musicTitleEn" TEXT NOT NULL DEFAULT 'Chorus Member',
    "musicContent" TEXT NOT NULL DEFAULT '',
    "musicContentEn" TEXT NOT NULL DEFAULT '',
    "musicMediaUrl" TEXT NOT NULL DEFAULT '',
    "canadaTitle" TEXT NOT NULL DEFAULT 'Kanada''da 10 Yıl',
    "canadaTitleEn" TEXT NOT NULL DEFAULT '10 Years in Canada',
    "canadaContent" TEXT NOT NULL DEFAULT '',
    "canadaContentEn" TEXT NOT NULL DEFAULT '',
    "womanTitle" TEXT NOT NULL DEFAULT 'Zarafet ile Liderlik',
    "womanTitleEn" TEXT NOT NULL DEFAULT 'Leading with Craft',
    "womanContent" TEXT NOT NULL DEFAULT '',
    "womanContentEn" TEXT NOT NULL DEFAULT '',
    "animalTitle" TEXT NOT NULL DEFAULT 'Dost',
    "animalTitleEn" TEXT NOT NULL DEFAULT 'Companion',
    "animalContent" TEXT NOT NULL DEFAULT '',
    "animalContentEn" TEXT NOT NULL DEFAULT '',
    "skillsJson" TEXT NOT NULL DEFAULT '[]',
    "skillsJsonEn" TEXT NOT NULL DEFAULT '[]',
    "timelineJson" TEXT NOT NULL DEFAULT '[]',
    "typingLinesJson" TEXT NOT NULL DEFAULT '[]',
    "typingLinesJsonEn" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT '',
    "summary" TEXT NOT NULL DEFAULT '',
    "cover" TEXT NOT NULL DEFAULT '',
    "stack" TEXT NOT NULL DEFAULT '[]',
    "problem" TEXT NOT NULL DEFAULT '',
    "solution" TEXT NOT NULL DEFAULT '[]',
    "results" TEXT NOT NULL DEFAULT '[]',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "techStack" TEXT,
    "titleEn" TEXT NOT NULL DEFAULT '',
    "roleEn" TEXT NOT NULL DEFAULT '',
    "summaryEn" TEXT NOT NULL DEFAULT '',
    "problemEn" TEXT NOT NULL DEFAULT '',
    "solutionEn" TEXT NOT NULL DEFAULT '',
    "resultsEn" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "email" TEXT NOT NULL DEFAULT 'spinarunsal@gmail.com',
    "linkedin" TEXT NOT NULL DEFAULT '',
    "github" TEXT NOT NULL DEFAULT '',
    "website" TEXT NOT NULL DEFAULT '',
    "cvUrl" TEXT NOT NULL DEFAULT '',
    "yearsExperience" TEXT NOT NULL DEFAULT '5+',
    "projectsDelivered" TEXT NOT NULL DEFAULT '15+',
    "industriesServed" TEXT NOT NULL DEFAULT 'Finance, Health, B2B',
    "availabilityStatus" TEXT NOT NULL DEFAULT 'open',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "public"."Project"("slug");

