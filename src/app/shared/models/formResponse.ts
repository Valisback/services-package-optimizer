import { ScoreData } from 'src/app/pages/thank-you-screen/models/scoreData';

export class FormResponse {
    id?: string;
    formattedRes: ScoreData[];
    industry?: string;
    organization?: string;
    country?: string;
    businessProblem?: string;
    jobTitle?: string;
    genMaturity?: number;
    genPriority?: number;
    date: string;
    formID: string;
    tag:string;
    responses: string;
    submissionID: string;
}

