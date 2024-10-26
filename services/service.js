const axios = require('axios');
const OpenAI = require('openai');
const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const {SystemMessage, HumanMessage} = require("@langchain/core/messages");
const {StringOutputParser} = require("@langchain/core/output_parsers");
const {ChatGoogleGenerativeAI} = require("@langchain/google-genai");
const parser = new StringOutputParser();

require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey,
});


const model = new ChatOpenAI({ model: "gpt-3.5-turbo" });

const g_model = new ChatGoogleGenerativeAI({
    modelName: "gemini-pro",
    maxOutputTokens: 2048,
});


async function analyzeSentiment(feedback) {
    const apiUrl = 'https://api.openai.com/v1/completions';
    const prompt = `Analyze the sentiment of the following feedback as either "positive", "neutral", or "negative": "${feedback}"`;

    console.log({ prompt });

    const completion = await openai.completions.create({
        model: 'davinci-002',
        prompt
    });

    console.log({ completion });

    const response = await axios.post(
        apiUrl,
        {
            model: 'gpt-3.5-turbo',
            prompt: prompt,
            max_tokens: 60,
            temperature: 0.7,
        },
        {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        }
    );

    const sentiment = response.data.choices[0].text.trim();
    return sentiment;
}

async function analyzeFeedbackWithLangchain(feedback) {
    const messages = [
        new SystemMessage("You are a helpful assistant."),
        new HumanMessage(`Please analyze the sentiment of the following feedback as "positive", "neutral", or "negative". Also, provide a brief summary in one sentence.\nFeedback: "${feedback}"`),
    ];
    // const messages = [
    //     { role: "system", content: "You are a helpful assistant." },
    //     { role: "user", content: `Please analyze the sentiment of the following feedback as "positive", "neutral", or "negative". Also, provide a brief summary in one sentence.\nFeedback: "${feedback}"` }
    // ];

    try {
        let response = await model.invoke(messages);
        response = await parser.invoke(response);
        console.log({response})
        const sentimentAnalysis = response.text.trim(); // Ensure the result is properly formatted.
        console.log({ sentimentAnalysis });
        return sentimentAnalysis;
    } catch (error) {
        console.error("Error calling LangChain model:", error);
        throw error; // Let the error propagate for proper error handling.
    }
}

/**
 * Analyzes feedback for sentiment and provides a brief summary.
 *
 * @param {string} feedback - The feedback text to analyze.
 * @returns {Promise<{sentiment: string, summary: string}>} - Object containing sentiment and summary.
 */
async function analyzeFeedbackWithLangchainAndGemini(feedback) {
    try {
        const messages = [
            // new SystemMessage("You are a helpful assistant."),
            new SystemMessage("You are an analysis expert who evaluates user feedback to determine whether it is positive, neutral, or negative."),
            new HumanMessage(`Analyze the sentiment of the following feedback as "positive" or "negative". Also, provide a brief summary.\nFeedback: "${feedback}"`)
        ];
        const conf_messages = [
            new SystemMessage("You are a sentiment analysis expert who evaluates user feedback to determine if it is positive, neutral, or negative and respond with confidence percentage of how negative, neutral, or positive it is."),
            new HumanMessage(`Please analyze the sentiment of the following feedback. and return the confidence in the following way : e.g "90% negative" else return "Neutral" or something befitting, "${feedback}"`)
        ];

        const response = await g_model.invoke(messages);
        const conf_response = await g_model.invoke(conf_messages);
        const [sentimentLine, summaryLine] = response.content.split('\n\n');
        console.log({sentimentLine, summaryLine})
        const sentiment = sentimentLine.replace("**Sentiment:** ", "").trim();
        const summary = summaryLine.replace("**Summary:** ", "").trim();
        console.log({sentiment, summary})
        const confidence = conf_response.content;
        return { sentiment, summary };
    } catch (error) {
        console.error("Error analyzing feedback:", error);
        throw new Error('Feedback analysis failed');
    }
}

// async function analyzeFeedbackWithLangchainAndGemini(feedback) {
//     try {
//         const messages = [
//             new SystemMessage("You are a sentiment analysis expert who evaluates user feedback to determine if it is positive, neutral, or negative. Respond concisely and include a sentiment confidence percentage and a brief summary of the feedback."),
//             new HumanMessage(`Please analyze the sentiment of the following feedback. Indicate if it is "positive", "neutral", or "negative", with a confidence percentage, and provide a brief summary in one sentence.\nFeedback: "${feedback}"`)
//         ];
//
//         const response = await g_model.invoke(messages);
//         console.log(response.content);
//
//
//         const sentimentMatch = response.content.match(/(?:\*\*|)Sentiment(?:\*\*|):\s*(Positive|Neutral|Negative)/i);
//         const confidenceMatch = response.content.match(/(?:\*\*|)Confidence(?:\*\*|):\s*([\d.]+)%/i);
//         const summaryMatch = response.content.match(/(?:\*\*|)Summary(?:\*\*|):\s*(.+)/is);
//
//
//         const sentiment = sentimentMatch ? sentimentMatch[1].trim() : "Unknown";
//         const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : null;
//
//
//         const summary = summaryMatch ? summaryMatch[1].replace(/^\*\*\s*|\s*\*\*$/g, '').trim() : "No summary available.";
//
//         return { sentiment, confidence, summary };
//     } catch (error) {
//         console.error("Error analyzing feedback:", error);
//         throw new Error('Feedback analysis failed');
//     }
// }


module.exports = {
    analyzeSentiment,
    analyzeFeedbackWithLangchain,
    analyzeFeedbackWithLangchainAndGemini
};
