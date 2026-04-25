const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

exports.getValuation = async (req, res) => {
    try {
        const { make, model, year, mileage, condition, fuelType, engineCC } = req.body;

        if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_google_api_key') {
            // Fallback mock logic if no API key is provided
            const basePrice = 8500000;
            const yearFactor = (year - 2010) * 500000;
            const mileageFactor = (mileage / 1000) * 10000;
            const mockValuation = Math.max(500000, basePrice + yearFactor - mileageFactor);
            
            return res.status(200).json({
                success: true,
                valuation: Math.round(mockValuation),
                isMock: true,
                message: "Using offline estimation logic (No API Key)"
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an expert vehicle valuation AI for a car auction platform in Sri Lanka. 
        Given the following car details, provide a realistic estimated market value in Sri Lankan Rupees (LKR).
        
        Car Details:
        - Make: ${make}
        - Model: ${model}
        - Year: ${year}
        - Mileage: ${mileage} km
        - Condition: ${condition}
        - Fuel Type: ${fuelType}
        - Engine: ${engineCC} CC
        
        Respond ONLY with a JSON object in this format: {"valuation": number, "reasoning": "string"}. Do not include any other text.`;

        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Find JSON in response (Gemini sometimes adds markdown backticks)
        const jsonMatch = text.match(/\{.*\}/s);
        if (!jsonMatch) throw new Error("Invalid AI response format");
        
        const data = JSON.parse(jsonMatch[0]);

        res.status(200).json({
            success: true,
            valuation: data.valuation,
            reasoning: data.reasoning
        });
    } catch (error) {
        console.error("AI Valuation Error:", error);
        res.status(500).json({ message: "AI Valuation failed", error: error.message });
    }
};

exports.getDescription = async (req, res) => {
    try {
        const { make, model, year, transmission, fuelType, engineCC, condition } = req.body;

        if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_google_api_key') {
            return res.status(200).json({
                success: true,
                description: `This is a well-maintained ${year} ${make} ${model} in ${condition} condition. Featuring a ${engineCC}cc ${fuelType} engine and ${transmission} transmission. Perfect for daily driving.`
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Write a professional, attractive vehicle description for a car auction listing.
        Details:
        - Car: ${year} ${make} ${model}
        - Engine: ${engineCC} CC ${fuelType}
        - Transmission: ${transmission}
        - Condition: ${condition}
        
        The description should be concise (2-3 sentences), highlight the benefits, and sound inviting to buyers. 
        Respond ONLY with the description text. Do not include any other text.`;

        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        res.status(200).json({
            success: true,
            description: text
        });
    } catch (error) {
        console.error("AI Description Error:", error);
        res.status(500).json({ message: "AI Description generation failed", error: error.message });
    }
};

exports.verifyDocumentAI = async (documentUrl, userName) => {
    try {
        if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_google_api_key' || !process.env.GOOGLE_API_KEY) {
            // Mock result if no API key
            return {
            extractedName: userName,
            extractedDob: "1995-05-15",
            extractedId: "951350000V",
            status: "match",
            isMock: true
        };
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Resolve absolute path (documentUrl is like /uploads/kyc/file.jpg)
    const absolutePath = path.join(process.cwd(), documentUrl);
    
    if (!fs.existsSync(absolutePath)) {
        console.error("File not found at:", absolutePath);
        return { status: "unclear", message: "Document file not found" };
    }

    const fileData = fs.readFileSync(absolutePath);
    const base64Data = fileData.toString("base64");
    
    // Determine mime type
    const ext = path.extname(absolutePath).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';

    const prompt = `You are a document verification AI for a car auction platform in Sri Lanka. 
    Analyze the provided document (NIC, Passport, or Driver's License). 
    Extract the following information:
    1. Full Name
    2. Date of Birth
    3. ID Number (NIC No, Passport No etc.)
    
    Then, compare the extracted name with the provided user name: "${userName}".
    
    Respond ONLY with a JSON object in this format: 
    {"extractedName": "string", "extractedDob": "string", "extractedId": "string", "status": "match" | "mismatch" | "unclear"}. 
    Set status to "match" if the names are similar, "mismatch" if they are different, or "unclear" if the quality is poor.
    Do not include any other text.`;

    const result = await geminiModel.generateContent([
        prompt,
        { inlineData: { data: base64Data, mimeType } }
    ]);

    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{.*\}/s);
    if (!jsonMatch) throw new Error("Invalid AI response format");
    
    const data = JSON.parse(jsonMatch[0]);
    // Ensure the status is valid for the enum
    if (!['match', 'mismatch', 'unclear'].includes(data.status)) {
        data.status = 'unclear';
    }
    return data;

} catch (error) {
    console.error("KYC AI Verification Error:", error);
    return { status: "unclear", message: error.message };
}
};
