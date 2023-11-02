export declare class GptMail {
    private apiKey;
    private openai;
    private gptc;
    constructor(apikey: string);
    setGptType(m_gpt_cfg: string): void;
    gptSendReply(emailConfig: any): Promise<void>;
}
