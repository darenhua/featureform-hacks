import { supabase } from "../../index.js";
import axios from "axios";
import { parseResume } from "../utils/resumeParser.js";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env (if present)
dotenv.config();

// Initialize OpenAI with explicit API key to avoid missing-env error
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Create a user
export async function createUser(req, res) {
  try {
    const { idfv } = req.body;
    if (!idfv) {
      return res.status(400).json({ error: "idfv is required" });
    }

    // Check if user with this idfv already exists
    const { data: existingUser, error: findError } = await supabase
      .from("user")
      .select("*")
      .eq("idfv", idfv)
      .single();

    if (findError && findError.code !== "PGRST116") {
      // PGRST116: No rows found, not an error for our case
      return res.status(500).json({ error: findError.message });
    }

    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User already exists", user: existingUser });
    }

    const { data, error } = await supabase
      .from("user")
      .insert([{ idfv }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).json({ message: "User created", user: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Get all users
export async function getAllUsers(req, res) {
  try {
    const { data, error } = await supabase.from("user").select("*");
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ users: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Get a user by id
export async function getUserById(req, res) {
  try {
    const { idfv } = req.params;
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Get a user by id
export async function getUserByIdfv(req, res) {
  try {
    const { idfv } = req.params;
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("idfv", idfv)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Update a user by id
export async function updateUserById(req, res) {
  try {
    const { id } = req.params;
    const { firstName, oneLiner } = req.body;

    const updateFields = {};
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (oneLiner !== undefined) updateFields.oneLiner = oneLiner;

    const { data, error } = await supabase
      .from("user")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "User not found or not updated" });
    }
    return res.status(200).json({ message: "User updated", user: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function processUser(req, res) {
  try {
    const {
      idfv,
      resumeFileName,
      resumeMimeType,
      resume,
      interests,
      linkedinURL,
    } = req.body;
    if (!idfv) {
      return res.status(400).json({ error: "idfv is required" });
    }

    const linkedinProcessed = await axios.post(
      "https://81be-209-0-75-246.ngrok-free.app/person",
      { linkedinUrl: linkedinURL }
    );

    const fs = require("fs");
    const pdf = require("pdf-parse");

    //Make sure to process the resume in the right way. This may be wrong.

    let dataBuffer = fs.readFileSync(resume);

    pdf(dataBuffer).then(function (data) {
      console.log(data.text);
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function onboardUser(req, res) {
  try {
    const {
      idfv,
      linkedinURL,
      interests,
      resume,
      resumeFileName,
      resumeMimeType,
    } = req.body;

    if (!idfv) {
      return res.status(400).json({ error: "idfv is required" });
    }

    if (!linkedinURL) {
      return res.status(400).json({ error: "linkedinURL is required" });
    }

    if (!interests || interests.length === 0) {
      return res.status(400).json({ error: "interests are required" });
    }

    // Check if user exists and their processed status
    const { data: existingUser, error: findError } = await supabase
      .from("user")
      .select("*")
      .eq("idfv", idfv)
      .single();

    if (findError && findError.code !== "PGRST116") {
      return res.status(500).json({ error: findError.message });
    }

    if (!existingUser) {
      return res.status(404).json({
        error: "User not found. User must be created before onboarding.",
      });
    }

    // Check if user has already been processed
    if (existingUser.processed === true) {
      console.log(
        `🔄 User with IDFV: ${idfv} already processed, skipping onboarding`
      );
      return res.status(200).json({
        message: "User already processed, skipping onboarding",
        user: existingUser,
      });
    }

    console.log(
      `🆕 User with IDFV: ${idfv} found with processed=false, processing onboarding...`
    );

    // Process LinkedIn data
    let linkedinData = null;
    try {
      console.log(`🔗 Processing LinkedIn URL: ${linkedinURL}`);
      const linkedinResponse = await axios.post(
        "https://81be-209-0-75-246.ngrok-free.app/person",
        {
          linkedinUrl: linkedinURL,
        }
      );
      linkedinData = linkedinResponse.data;
      console.log("📊 LinkedIn Data Processed:");
      console.log(JSON.stringify(linkedinData, null, 2));
    } catch (error) {
      console.error("❌ Error processing LinkedIn data:", error.message);
      linkedinData = { error: "Failed to process LinkedIn data" };
    }

    // Process resume if provided
    let resumeText = null;
    if (resume && resumeFileName && resumeMimeType) {
      try {
        console.log(
          `📄 Processing resume: ${resumeFileName} (${resumeMimeType})`
        );
        console.log(`📄 Resume base64 length: ${resume.length} characters`);

        resumeText = await parseResume(resume, resumeMimeType);

        console.log("📄 Resume Text Processed Successfully:");
        console.log("=====================================");
        console.log(
          `📄 Extracted text length: ${resumeText.length} characters`
        );
        console.log("📄 First 500 characters:");
        console.log(resumeText.substring(0, 500));
        console.log("=====================================");
        console.log("📄 Full Resume Text:");
        console.log(resumeText);
        console.log("=====================================");
      } catch (error) {
        console.error("❌ Error processing resume:", error);
        resumeText = `Failed to process resume: ${error.message}`;
      }
    } else {
      console.log(
        "📄 No resume provided or missing mime type, skipping resume processing"
      );
    }

    // Log interests
    console.log("🎯 User Interests:");
    console.log(interests);

    // -------------------
    // 🔮 Generate profile data using OpenAI (in parallel)
    // -------------------
    let profileSummary = null;
    let structuredProfile = null;
    try {
      console.log(
        "🧠 Generating profile summary and structured data with OpenAI..."
      );

      // Run both profile generation tasks in parallel
      const [summaryResult, structuredResult] = await Promise.all([
        generateProfileSummary(linkedinData, resumeText, interests),
        generateStructuredProfile(linkedinData, resumeText, interests),
      ]);

      profileSummary = summaryResult;
      structuredProfile = structuredResult;

      console.log("📝 Profile Summary Generated:\n");
      console.log(profileSummary);
      console.log("\n📊 Structured Profile Generated:");
      console.log(JSON.stringify(structuredProfile, null, 2));
    } catch (error) {
      console.error(
        "❌ Error generating profile summary or structured data:",
        error
      );
    }

    // -------------------
    // 🔢 Generate embedding from profile summary
    // -------------------
    let embeddingVector = null;
    if (profileSummary) {
      try {
        console.log("🔢 Generating embedding from profile summary...");
        embeddingVector = await makeEmbedding(profileSummary);
        console.log(
          `🔢 Embedding generated with length: ${embeddingVector.length}`
        );
      } catch (error) {
        console.error("❌ Error generating embedding:", error);
      }
    } else {
      console.log(
        "⚠️ No profile summary available, skipping embedding generation"
      );
    }

    // -------------------
    // 💾 Save all data to Supabase
    // -------------------
    try {
      console.log("💾 Saving onboarding data to database...");

      // Extract first and last name from LinkedIn data
      const firstName = linkedinData?.message?.first_name || null;
      const lastName = linkedinData?.message?.last_name || null;

      // Prepare update data matching Supabase column names
      const updateData = {
        firstName: firstName,
        lastName: lastName,
        interests: interests, // text[] array
        headline: linkedinData?.message?.headline || null,
        bullet_points: structuredProfile?.bullet_points || null, // text[] array
        processed: true,
        embedding: embeddingVector, // vector type
        short_description: structuredProfile?.short_description || null,
        long_description: profileSummary, // the long narrative summary
        work_history: structuredProfile?.jobs || null, // jsonb array
      };

      console.log("📝 Updating user with data:");
      console.log(JSON.stringify(updateData, null, 2));

      const { data: updatedUser, error: updateError } = await supabase
        .from("user")
        .update(updateData)
        .eq("idfv", idfv)
        .select()
        .single();

      if (updateError) {
        console.error("❌ Error saving to database:", updateError);
        return res
          .status(500)
          .json({ error: "Failed to save onboarding data" });
      }

      console.log("✅ User onboarding data saved successfully!");
      console.log("📊 Updated user record:");
      console.log(JSON.stringify(updatedUser, null, 2));

      return res.status(200).json({
        message: "User onboarding completed and saved successfully",
        user: updatedUser,
        processed_data: {
          linkedin_processed: linkedinData !== null,
          resume_processed: resumeText !== null,
          interests_count: interests.length,
          data_saved: true,
          summary_generated: profileSummary !== null,
          structured_profile_generated: structuredProfile !== null,
          embedding_generated: embeddingVector !== null,
        },
      });
    } catch (saveError) {
      console.error("❌ Error during database save:", saveError);
      return res.status(500).json({ error: "Failed to save onboarding data" });
    }
  } catch (error) {
    console.error("❌ Server error in onboardUser:", error);
    return res.status(500).json({ error: "Server error during onboarding" });
  }
}

async function makeEmbedding(text) {
  try {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text.slice(0, 8000),
    });
    return Array.from(embedding.data[0].embedding);
  } catch (error) {
    console.error("❌ Failed to generate embedding:", error);
    throw error;
  }
}

async function generateStructuredProfile(linkedinData, resumeText, interests) {
  try {
    const systemPrompt =
      "You are a profile structurer. Using the LinkedIn JSON, resume text, and interests, create a JSON object with these exact fields: 'short_description' (2-3 words describing the person professionally), 'bullet_points' (array of exactly 3 brief bullet points summarizing key aspects), 'summary' (approximately 40 words describing the person), 'jobs' (array of work experience only - no projects/education - each with 'start_date', 'end_date', 'title', 'company', 'description'). Use 'Present' for ongoing roles. Be factual, no subjective language. Return ONLY the raw JSON object, no markdown formatting or code blocks.";

    const userPrompt = `LinkedIn JSON:\n${JSON.stringify(
      linkedinData,
      null,
      2
    )}\n\nResume Text (may be truncated):\n${(
      resumeText || "Not provided"
    ).slice(0, 12000)}\n\nInterests: ${interests.join(", ")}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1200,
    });

    const rawResponse = completion.choices[0].message.content.trim();

    // Clean the response - remove markdown code blocks if present
    let cleanedResponse = rawResponse;
    if (rawResponse.startsWith("```json")) {
      cleanedResponse = rawResponse
        .replace(/```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (rawResponse.startsWith("```")) {
      cleanedResponse = rawResponse
        .replace(/```\s*/, "")
        .replace(/\s*```$/, "");
    }

    console.log("🔧 Raw OpenAI response for structured profile:");
    console.log(rawResponse);
    console.log("🔧 Cleaned response:");
    console.log(cleanedResponse);

    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("❌ Failed to generate structured profile:", error);
    throw error;
  }
}

async function generateProfileSummary(linkedinData, resumeText, interests) {
  try {
    const systemPrompt =
      "You are a factual summarizer. Using the LinkedIn JSON, resume text, and interests, craft one coherent paragraph (350-500 words) that chronologically narrates the person's background. Include every concrete role or achievement—state the years (e.g., 2022–2025), title, organisation, and location if available. Mention education and notable projects the same way. Maintain purely objective wording; do not use subjective adjectives like 'ambitious' or 'driven'. Preserve all explicit facts, omit nothing relevant, and avoid bullet points or headings.";

    const userPrompt = `LinkedIn JSON:\n${JSON.stringify(
      linkedinData,
      null,
      2
    )}\n\nResume Text (may be truncated):\n${(
      resumeText || "Not provided"
    ).slice(0, 12000)}\n\nInterests: ${interests.join(", ")}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ Failed to generate profile summary:", error);
    throw error;
  }
}

export async function findSimilarUsers(req, res) {
  try {
    const { idfv } = req.body;

    if (!idfv) {
      return res.status(400).json({ error: "idfv is required" });
    }

    console.log(`🔍 Finding similar users for IDFV: ${idfv}`);

    // Get the current user's data
    const { data: currentUser, error: currentUserError } = await supabase
      .from("user")
      .select("*")
      .eq("idfv", idfv)
      .single();

    if (currentUserError || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!currentUser.embedding || !currentUser.interests) {
      return res.status(400).json({
        error: "User must have embedding and interests to find similar users",
      });
    }

    console.log(
      `👤 Current user: ${currentUser.firstName} ${currentUser.lastName}`
    );
    console.log(
      `🎯 Current user interests: ${JSON.stringify(currentUser.interests)}`
    );

    // Get all other users with embeddings and interests (excluding current user)
    const { data: allUsers, error: allUsersError } = await supabase
      .from("user")
      .select(
        "id, idfv, firstName, lastName, interests, embedding, short_description, headline"
      )
      .neq("idfv", idfv)
      .not("embedding", "is", null)
      .not("interests", "is", null);

    if (allUsersError) {
      console.error("❌ Error fetching users:", allUsersError);
      return res.status(500).json({ error: "Failed to fetch users" });
    }

    console.log(`📊 Found ${allUsers.length} potential similar users`);

    // Calculate similarity scores for each user
    const userSimilarities = allUsers.map((user) => {
      // Calculate cosine similarity between embeddings
      const embeddingSimilarity = calculateCosineSimilarity(
        currentUser.embedding,
        user.embedding
      );

      // Calculate interest overlap (Jaccard similarity)
      const interestSimilarity = calculateInterestSimilarity(
        currentUser.interests,
        user.interests
      );

      // Combined similarity score (weighted: 70% embedding, 30% interests)
      const combinedSimilarity =
        embeddingSimilarity * 0.7 + interestSimilarity * 0.3;

      return {
        id: user.id,
        idfv: user.idfv,
        firstName: user.firstName,
        lastName: user.lastName,
        interests: user.interests,
        short_description: user.short_description,
        headline: user.headline,
        embeddingSimilarity: embeddingSimilarity,
        interestSimilarity: interestSimilarity,
        combinedSimilarity: combinedSimilarity,
      };
    });

    // Sort by combined similarity (highest first) and take top 6
    const topSimilarUsers = userSimilarities
      .sort((a, b) => b.combinedSimilarity - a.combinedSimilarity)
      .slice(0, 6);

    console.log("🎯 TOP 6 SIMILAR USERS (ranked by similarity):");
    console.log("================================================");
    topSimilarUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(
        `   Combined Similarity: ${(user.combinedSimilarity * 100).toFixed(1)}%`
      );
      console.log(
        `   Embedding Similarity: ${(user.embeddingSimilarity * 100).toFixed(
          1
        )}%`
      );
      console.log(
        `   Interest Similarity: ${(user.interestSimilarity * 100).toFixed(1)}%`
      );
      console.log(`   Interests: ${JSON.stringify(user.interests)}`);
      console.log(`   Description: ${user.short_description || "N/A"}`);
      console.log(`   Headline: ${user.headline || "N/A"}`);
      console.log("   ---");
    });

    console.log("\n📋 SIMILAR USERS ARRAY:");
    console.log(topSimilarUsers);

    return res.status(200).json({
      message: "Similar users found successfully",
      currentUser: {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        interests: currentUser.interests,
      },
      similarUsers: topSimilarUsers,
      totalFound: allUsers.length,
    });
  } catch (error) {
    console.error("❌ Server error in findSimilarUsers:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

// Helper function to calculate cosine similarity between two vectors
function calculateCosineSimilarity(vectorA, vectorB) {
  if (!vectorA || !vectorB || vectorA.length !== vectorB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    normA += vectorA[i] * vectorA[i];
    normB += vectorB[i] * vectorB[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Helper function to calculate interest similarity (Jaccard index)
function calculateInterestSimilarity(interestsA, interestsB) {
  if (
    !interestsA ||
    !interestsB ||
    interestsA.length === 0 ||
    interestsB.length === 0
  ) {
    return 0;
  }

  const setA = new Set(interestsA.map((interest) => interest.toLowerCase()));
  const setB = new Set(interestsB.map((interest) => interest.toLowerCase()));

  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  return intersection.size / union.size;
}
