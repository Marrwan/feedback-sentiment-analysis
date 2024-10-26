# Feedback Analysis API

This project provides a simple API for analyzing user feedback using sentiment analysis. It uses Langchain and Gemini models to determine if the feedback is positive or negative and generates a brief summary.

## Features

- Sentiment analysis of feedback (`positive`, `negative`, or `neutral`)
- Brief summary generation of the feedback
- RESTful endpoint to receive and analyze feedback
- Error handling for empty or invalid feedback input

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Marrwan/feedback-sentiment-analysis.git
   cd feedback...
   ```

2. **Install Dependencies**  
   Navigate to the project directory and install all necessary dependencies with:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**  
   Ensure you have access to the necessary APIs for Langchain and Gemini. Create an `.env` file in the project root and add your API credentials:
   ```plaintext
   GOOGLE_API_KEY=your_gemini_api_key
  
   ```

4. **Start the Server**  
   Run the server in development mode with:
   ```bash
   npm run dev
   ```
   Alternatively, to start in production mode:
   ```bash
   npm start
   ```
   The server will be running on `http://localhost:3000`.

## Usage

### Analyze Feedback
Make a `POST` request to the `/feedback-analyze` endpoint with a JSON body containing the `feedback` text:
   ```json
   POST /feedback-analyze
   Content-Type: application/json

   {
     "feedback": "The product was very user-friendly and met all my expectations."
   }
   ```

### Response
The server responds with JSON containing the sentiment analysis result and a summary:
   ```json
   {
     "sentiment": "positive",
     "summary": "The feedback highlights a positive experience with user-friendliness."
   }
   ```

### Error Handling
- **400 Bad Request**: Returned if the `feedback` is missing or empty.
- **500 Internal Server Error**: Returned if an error occurs during the feedback analysis.

## Project Structure

- `services/service.js`: Contains the `analyzeFeedbackWithLangchainAndGemini` function for processing feedback.
- `routes/feedback.js`: Defines the `/feedback-analyze` endpoint to accept feedback from the client.
- `app.js`: The main application file, sets up middleware and routes.

## Dependencies

- **Express** - Web framework for handling HTTP requests.
- **Langchain and Gemini Models** - Provides AI-powered sentiment analysis and summary generation.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Developed by Abdulbasit Damilola Alabi**
