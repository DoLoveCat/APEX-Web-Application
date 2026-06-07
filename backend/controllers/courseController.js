const Course = require("../models/Course");

// The Voyage / Groq SDKs are only needed for the AI-powered semantic search
// (the /embed endpoint). They're loaded lazily so a missing package or API key
// doesn't prevent the server from booting or break plain course browsing.
function getVoyage() {
    const { VoyageAIClient } = require("voyageai");
    return new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });
}

function getGroq() {
    const Groq = require("groq-sdk");
    return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (magA * magB);
}

async function getCourses(req, res) {
    const courses = await Course.find().select("-embedding -rawDescription");
    res.json(courses);
}

async function getCourseById(req, res) {
    const course = await Course.findById(req.params.id).select("-embedding -rawDescription");
    res.json(course);
}

async function keywordSearchCourses(req, res) {
    try {
        const { q } = req.query;

        if (!q) return res.json([]);

        const courses = await Course.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } }
            ]
        }).select("-embedding -rawDescription");

        res.json(courses);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

async function expandQuery(q) {
    const groq = getGroq();
    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        max_tokens: 100,
        messages: [{
            role: "user",
            content: `Expand this course search query into related technical terms and skills. Return only a single sentence: "${q}"`
        }]
    });
    return response.choices[0].message.content;
}

async function generateEmbedding(req, res) {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: "Query is required" });

        const expandedQuery = await expandQuery(q);
        console.log("Expanded query:", expandedQuery);

        const voyage = getVoyage();
        const result = await voyage.embed({
            input: [expandedQuery],
            model: "voyage-3"
        });

        res.json({ embedding: result.data[0].embedding });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function semanticSearch(req, res) {
    try {
        const queryEmbedding = req.body.embedding;
        if (!queryEmbedding) return res.json([]);

        // 2. Get all courses with embeddings
        const courses = await Course.find(
            { embedding: { $exists: true, $ne: [] } }
        ).select("-rawDescription");

        // 3. Score each course
        const scored = courses.map(course => ({
            _id: course._id,
            subject: course.subject,
            courseNumber: course.courseNumber,
            title: course.title,
            description: course.description,
            term: course.term,
            crn: course.crn,
            score: cosineSimilarity(queryEmbedding, course.embedding)
        }));

        // 4. Return the top matches (client decides how many to show: 5/10/15)
        const top = scored
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);

        res.json(top);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getCourses,
    getCourseById,
    keywordSearchCourses,
    semanticSearch,
    generateEmbedding
};