/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
  Question = 'question',
  Quiz = 'quiz',
  QuizStatus = 'quiz_status',
  Round = 'round',
  Team = 'team',
  TeamAnswers = 'team_answers',
  Users = 'users'
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
  id: RecordIdString
  created: IsoDateString
  updated: IsoDateString
  collectionId: string
  collectionName: Collections
  expand?: T
}

export type AuthSystemFields<T = never> = {
  email: string
  emailVisibility: boolean
  username: string
  verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type QuestionRecord = {
  answer?: string
  content?: string
  round?: RecordIdString
}

export type QuizRecord = {
  name?: string
  password?: string
  pin?: string
  quiz_status?: RecordIdString
}

export enum QuizStatusStatusOptions {
  'JOINING' = 'JOINING',
  'PLAYING' = 'PLAYING',
  'END_ROUND' = 'END_ROUND',
  'EVALUCATION' = 'EVALUCATION',
  'SCORE_VIEWING' = 'SCORE_VIEWING',
  'END_QUIZ' = 'END_QUIZ'
}
export type QuizStatusRecord = {
  current_question?: RecordIdString
  status?: QuizStatusStatusOptions
}

export type RoundRecord = {
  name?: string
  quiz?: RecordIdString
}

export type TeamRecord = {
  name?: string
  quiz?: RecordIdString
}

export type TeamAnswersRecord = {
  answer?: string
  question?: RecordIdString
  score?: number
  team?: RecordIdString
}

export type UsersRecord = {
  avatar?: string
  name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type QuestionResponse<Texpand = unknown> = Required<QuestionRecord> &
  BaseSystemFields<Texpand>
export type QuizResponse<Texpand = unknown> = Required<QuizRecord> &
  BaseSystemFields<Texpand>
export type QuizStatusResponse<Texpand = unknown> = Required<QuizStatusRecord> &
  BaseSystemFields<Texpand>
export type RoundResponse<Texpand = unknown> = Required<RoundRecord> &
  BaseSystemFields<Texpand>
export type TeamResponse<Texpand = unknown> = Required<TeamRecord> &
  BaseSystemFields<Texpand>
export type TeamAnswersResponse<Texpand = unknown> =
  Required<TeamAnswersRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> &
  AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
  question: QuestionRecord
  quiz: QuizRecord
  quiz_status: QuizStatusRecord
  round: RoundRecord
  team: TeamRecord
  team_answers: TeamAnswersRecord
  users: UsersRecord
}

export type CollectionResponses = {
  question: QuestionResponse
  quiz: QuizResponse
  quiz_status: QuizStatusResponse
  round: RoundResponse
  team: TeamResponse
  team_answers: TeamAnswersResponse
  users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
  collection(idOrName: 'question'): RecordService<QuestionResponse>
  collection(idOrName: 'quiz'): RecordService<QuizResponse>
  collection(idOrName: 'quiz_status'): RecordService<QuizStatusResponse>
  collection(idOrName: 'round'): RecordService<RoundResponse>
  collection(idOrName: 'team'): RecordService<TeamResponse>
  collection(idOrName: 'team_answers'): RecordService<TeamAnswersResponse>
  collection(idOrName: 'users'): RecordService<UsersResponse>
}
