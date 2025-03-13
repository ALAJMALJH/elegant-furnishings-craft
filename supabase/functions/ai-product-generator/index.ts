
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, price, category } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    // Prepare the prompt for OpenAI
    const systemPrompt = `You are a furniture expert who creates detailed product descriptions and provides specifications. 
    Based on the image and price, create a detailed and attractive furniture product listing.
    Return ONLY valid JSON in the following format:
    {
      "name": "Product name (max 60 chars)",
      "description": "Detailed product description that highlights features, materials, and benefits (100-200 words)",
      "subcategory": "Specific subcategory based on the image (e.g., sofa, dining table, bed frame)",
      "is_bestseller": boolean (set to false),
      "is_featured": boolean (set to false),
      "is_new_arrival": boolean (set to true),
      "stock_quantity": random number between 10-50
    }`;

    const userPrompt = `Here is a furniture image. The price is AED ${price}. The category is ${category || 'unknown - please determine from the image'}.
    Please analyze this image and create a comprehensive product listing with an engaging description.`;

    // Call OpenAI API with the image
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: userPrompt },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(data.error?.message || 'Failed to get response from OpenAI');
    }

    // Extract the AI-generated content
    const aiResponseText = data.choices[0]?.message?.content || '';
    
    // Try to parse the JSON response
    let productData;
    try {
      // Find JSON in the response (in case it includes other text)
      const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        productData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in the response');
      }
    } catch (jsonError) {
      console.error('Error parsing JSON from OpenAI response:', jsonError);
      throw new Error('Failed to parse product data from AI response');
    }

    return new Response(JSON.stringify({ 
      product: { 
        ...productData, 
        price: parseFloat(price) || 0,
        image_url: imageUrl,
        category: category || (productData.subcategory ? productData.subcategory.split('-')[0] : 'living-room')
      } 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI product generator function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
