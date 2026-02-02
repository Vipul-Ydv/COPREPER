// AI Provider Factory - Modular adapter pattern
// Priority: Groq > OpenAI > Mock

function getProvider() {
    const providerName = process.env.AI_PROVIDER || 'auto';

    // Auto-detect: prioritize Groq (free), then OpenAI, then mock
    if (providerName === 'auto') {
        if (process.env.GROQ_API_KEY) {
            console.log('⚡ Using Groq provider (Llama 3.1 70B - fast & free)');
            return require('./providers/groq');
        }
        if (process.env.OPENAI_API_KEY) {
            console.log('🤖 Using OpenAI provider (GPT-4o-mini)');
            return require('./providers/openai');
        }
        console.log('🎭 Using mock provider (set GROQ_API_KEY or OPENAI_API_KEY for real AI)');
        return require('./providers/mock');
    }

    // Explicit provider selection
    if (providerName === 'groq') {
        if (!process.env.GROQ_API_KEY) {
            console.warn('⚠️ GROQ_API_KEY not set, falling back to mock');
            return require('./providers/mock');
        }
        return require('./providers/groq');
    }

    if (providerName === 'openai') {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('⚠️ OPENAI_API_KEY not set, falling back to mock');
            return require('./providers/mock');
        }
        return require('./providers/openai');
    }

    return require('./providers/mock');
}

module.exports = { getProvider };
