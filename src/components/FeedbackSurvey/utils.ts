/** Survey keypad / UI responses (see FeedbackSurveyView inputToResponse). */
export type FeedbackSurveyResponse = 'dismissed' | 'bad' | 'fine' | 'good';

/** Emitted on analytics / OTel as `survey_type`. */
export type FeedbackSurveyType = 'session' | 'memory' | 'post_compact';
