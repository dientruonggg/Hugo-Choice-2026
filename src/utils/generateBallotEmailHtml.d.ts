export interface BallotEmailData {
  userEmail: string;
  userName?: string;
  submittedAt?: string;
  ballot?: {
    team?: string;
    member?: string;
    event?: string;
    rookie?: string;
    duo?: string;
    submittedAt?: string;
  };
  emailConfig?: Record<string, string>;
}

export declare function generateBallotEmailHtml(data: BallotEmailData): string;
