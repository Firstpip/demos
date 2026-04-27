export type UserType = "general" | "company" | "admin";
export type JobType = "lesson" | "performance" | "event" | "project";

export interface LessonMeta {
  qualification: string;
  schedule: string;
  studioAddress: string;
  trialClass: boolean;
}

export interface PerformanceMeta {
  showDates: string;
  rehearsals: string;
  venue: string;
  costumeProvided: boolean;
}

export interface EventMeta {
  eventDate: string;
  dressCode: string;
  briefingDate: string;
  cateringProvided: boolean;
}

export interface ProjectMeta {
  deliverables: string;
  copyright: string;
  ndaRequired: boolean;
  finalUseScope: string;
}

export type JobTypeMeta =
  | ({ kind: "lesson" } & LessonMeta)
  | ({ kind: "performance" } & PerformanceMeta)
  | ({ kind: "event" } & EventMeta)
  | ({ kind: "project" } & ProjectMeta);
export type JobStatus = "pending" | "approved" | "closed" | "rejected";
export type ApplicationStatus = "pending" | "accepted" | "rejected";
export type ProjectStatus = "open" | "closed";
export type ReportStatus = "open" | "resolved" | "dismissed";
export type UserStatus = "active" | "suspended";

export interface User {
  id: string;
  email: string;
  type: UserType;
  name: string;
  phone?: string;
  createdAt: string;
  status: UserStatus;
  avatar?: string;
  lastLoginAt?: string;
}

export interface ArtistProfile {
  userId: string;
  headline: string;
  genres: string[];
  experienceYears: number;
  location: string;
  availableAreas: string[];
  bio: string;
  portfolioVideos: { url: string; title: string; thumb: string }[];
  portfolioImages: { url: string; caption: string }[];
  skills: string[];
  careerTimeline: { year: number; title: string; description: string }[];
  reviews?: { author: string; rating: number; body: string; createdAt: string }[];
  followers?: number;
}

export interface CompanyProfile {
  userId: string;
  companyName: string;
  businessNumber: string;
  representative: string;
  description: string;
  website?: string;
  logo?: string;
  industry: string;
}

import type { LucideIcon } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: LucideIcon;
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  jobType: JobType;
  categoryId: string;
  location: string;
  employmentType: "상주" | "프로젝트" | "일회성";
  experience: "무관" | "1년 미만" | "1~3년" | "3년+";
  deadline: string;
  budget: string;
  headcount: number;
  description: string;
  perks: string[];
  preferred: string[];
  status: JobStatus;
  createdAt: string;
  views: number;
  scraps: number;
  posterImage?: string;
  typeMeta?: JobTypeMeta;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  coverLetter: string;
  attachedPortfolio?: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface Project {
  id: string;
  authorId: string;
  title: string;
  categoryId: string;
  location: string;
  duration: string;
  headcount: number;
  payType: "유보수" | "무보수" | "수익 배분";
  payDetail?: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  deadline: string;
  comments: { id: string; userId: string; body: string; createdAt: string }[];
  applicantsCount: number;
}

export interface Report {
  id: string;
  targetType: "job" | "project" | "profile";
  targetId: string;
  targetTitle: string;
  reporterId: string;
  reason: string;
  detail: string;
  status: ReportStatus;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type: "application" | "approval" | "system" | "message";
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}
