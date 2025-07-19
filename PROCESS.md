# PROCESS.md

## Architecture and Key Design Choices

The project is structured as a full-stack application with a clear separation between frontend, backend, and database layers:

Frontend - React, Tailwind, Recharts, react-tables.
Backend - Node.js + Express
AI - OpenAi's GPT-4.

## Screen A – Operations Dashboard

- displays charts and summaries to visualize indexing trends and metrics.
- uses recharts for responsive and readable visualizations, sorting and pagination.
- shows deltas and total counts: successfully indexed jobs, failed jobs, records without coordinates, metadata gaps, added last months jobs.
- includes top clients and deal performance with pagination.
- decided not to use lazy loading because i dont think it provides the best user experience,
  even though the page loads without the table being fetched as its on the bottom of the screen, so the user
  can see the top metrics and it won't block the initial render. fetching data upfront ensures that the user will
  see the table when he wil scroll down to it.

## Screen B – AI Chat Assistant

- natural language chat interface built with React.
- sends user queries to the backend via a POST request.
- backend parses the query and uses prompt engineering to request a structured response from GPT-4.
  GPT response is converted to a MongoDB query, executed, and returned again to the GPT as structured data (text or table). GPT provides a summary with insightes and highliting trends, eventually his response goes back to the user.
- fallback logic is implemented for invalid or unsupported queries (suggestions offered when the query isnt supported).
- the latency of sending the query result to GPT again was taken into consideration, i think GPT can add
  meaningfull information to the query, instead of displaying its result immediately.
- decided to differ between aggregation and listing queries for better user experience and to have an elastic prompt so that GPT can take it into consideration when answering.
-

## AI tools used for making this project

- chatGPT was used for learning about different API's libraries and fast setup and installation.
- drafting initial mongoDB queries.
- debug styling and react related issues.
- debug server code, misspellings, and inconsistencies.
