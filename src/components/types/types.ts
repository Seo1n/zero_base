import { type Roadmap } from "./roadmapTypes";

export interface TokenInfo {
  accessToken?: string;
  grantType?: string;
  refreshToken?: string;
}
export interface NewUser {
  accessToken?: TokenInfo['accessToken'];
  nickname?: string;
  text?: string;
  password?: string;
  email?: string;
  id?: number;
  avatarUrl?: string | null;
  baekjoonId?: string | null;
  bio?: string | null;
  blogUrl?: string | null;
  exp?: number;
  githubUrl?: string | null;
  level?: 0;
  inProcessRoadmapDto?: [];
}

// export type User = MemberInfo & NewUser; // origin intialmerge
export type User = NewUser;
export interface RoadmapMetaData {
  // data?: unknown;
  id?: number;
  thumbnailUrl?: string;
  title?: string;
  recommendedExecutionTimeValue?: number;
  recommendedExecutionTimeUnit?: string;
  flowkey?: string;
}

export type UserRoadmap = RoadmapMetaData & Roadmap;

// export type User = MemberInfo & NewUser;
export interface MemberInfo {
  memberId?: number;
  avatarUrl?: string | null;
  baekjoonId?: string | null;
  bio?: string | null;
  blogUrl?: string | null;
  exp?: number;
  githubUrl?: string | null;
  level?: 0;
  inProcessRoadmapDto?: [];
}
export interface GptNode {
  id: string;
  content?: string;
}

export interface NewPrompt {
  keyword: string;
  data?: Array<GptNode | null>;
}
export type Prompt = NewPrompt;
