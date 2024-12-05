export const profilesData: Profiles = {
  short: {
    system_prompt:
      'Provide very short, direct responses focusing only on essential information. Use concise language and get straight to the point.',
    image_url:
      'https://static.wikia.nocookie.net/ben10/images/b/bc/4_-_XLR8.png/revision/latest?cb=20190422041355',
    name: 'Short Answers',
    description:
      'Minimalist communication style that delivers key points quickly. Ideal for busy professionals who need immediate, actionable information without additional context.',
    short_description: 'Quick and essential points',
    is_custom: false,
  },
  detailed: {
    system_prompt:
      'Provide very comprehensive explanations with thorough context, examples, and relevant details. Cover all aspects of the topic while maintaining clarity.',
    image_url:
      'https://static.wikia.nocookie.net/ben10/images/6/6c/Brainstorm_ov.png/revision/latest?cb=20200531230656',
    name: 'Detailed',
    description:
      'Thorough communication style that explores topics in-depth. Perfect for complex explanations, analysis, and situations requiring complete understanding of context and implications.',
    short_description: 'Comprehensive Answers',
    is_custom: false,
  },
  casual: {
    system_prompt:
      'Communicate in a friendly, conversational manner using everyday language. Feel free to use common expressions and maintain a relaxed tone.',
    image_url:
      'https://static.wikia.nocookie.net/ben10/images/d/da/Ditto_os_render.png/revision/latest?cb=20141129025301',
    name: 'Casual',
    description:
      'Relaxed, conversational communication style that makes information approachable and engaging. Suitable for informal discussions and building rapport while maintaining professionalism.',
    short_description: 'Friendly and engaging answers',
    is_custom: false,
  },
  professional: {
    system_prompt:
      'Maintain formal business communication with polished language and industry-appropriate terminology. Focus on clarity while preserving professional standards.',
    image_url:
      'https://static.wikia.nocookie.net/ben10/images/7/78/UAFDiamondhead.png/revision/latest/scale-to-width-down/1000?cb=20210316125949',
    name: 'Professional',
    description:
      'Formal business communication style that adheres to professional standards. Ideal for corporate environments, client interactions, and official documentation.',
    short_description: 'Uses Formal industrial terminologies',
    is_custom: false,
  },
};
