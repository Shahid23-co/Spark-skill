/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  xpReward: number;
  videoUrl: string; // Simulated video asset or video-card backdrop
  completed?: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  xpReward: number;
  badge: string;
  image: string;
  rating: number;
  lessons: Lesson[];
  level: "Beginner" | "Intermediate" | "Advanced";
  mentor: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  type: "daily" | "weekly" | "milestone";
  isCompleted: boolean;
  timeLeft?: string;
  icon: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  imageUrl: string;
  caption: string;
  likesCount: number;
  likedBy: string[]; // List of user IDs for toggles
  commentsCount: number;
  comments?: Array<{ author: string; text: string; time: string }>;
  createdAt: string;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  clientName: string;
  payment: number;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "open" | "in_progress" | "completed";
  assignedTo?: string; // userId of teenage freelancer
  imageUrl?: string;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  avatar: string;
  skillLevel: "Novice" | "Spark" | "Master";
  xp: number;
  savedCourses: string[]; // courseIds
  completedCourses: string[]; // courseIds
  completedLessons: string[]; // lessonIds
  unlockedAchievements: string[]; // achievementIds
  portfolio: Array<{ id: string; title: string; imageUrl: string; likes: number }>;
}

export interface CareerRoadmapStep {
  title: string;
  description: string;
  estimatedDays: number;
  xpValue: number;
}

export interface CareerRoadmap {
  careerPath: string;
  description: string;
  estimatedSalary: string;
  difficulty: string;
  timelineWeeks: number;
  roadmapSteps: CareerRoadmapStep[];
}
