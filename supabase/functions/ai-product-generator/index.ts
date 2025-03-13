
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { corsHeaders } from '../_shared/cors.ts'

console.log("AI Product Generator Function loaded");

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') as string
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY') as string

    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get the request body
    const { imageUrl, price, category } = await req.json()

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Image URL is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (!price) {
      return new Response(
        JSON.stringify({ error: 'Price is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Processing image: ${imageUrl} for category: ${category || 'auto-detect'} with price: ${price}`);

    // Simulate AI generation (in a real scenario, this would call OpenAI API)
    const generatedProduct = {
      name: `AI Generated ${getCategoryName(category)} ${getRandomProductType()}`,
      description: generateDescription(category),
      price: parseFloat(price),
      category: category || getRandomCategory(),
      subcategory: getRandomSubcategory(category),
      is_featured: Math.random() > 0.7,
      is_bestseller: Math.random() > 0.8,
      is_new_arrival: true,
      image_url: imageUrl,
      stock_quantity: Math.floor(Math.random() * 50) + 10
    };
    
    console.log("Generated product details:", generatedProduct);

    return new Response(
      JSON.stringify({ 
        success: true, 
        product: generatedProduct
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Error in AI Product Generator:", error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate product' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Helper functions
function getCategoryName(category: string | null): string {
  if (!category) return 'Furniture';
  
  const categoryMap: Record<string, string> = {
    'living-room': 'Living Room',
    'bedroom': 'Bedroom',
    'dining': 'Dining',
    'office': 'Office',
    'outdoor': 'Outdoor'
  };
  
  return categoryMap[category] || 'Furniture';
}

function getRandomProductType(): string {
  const types = [
    'Chair', 'Sofa', 'Table', 'Desk', 'Bed', 'Drawer', 'Bookshelf',
    'Nightstand', 'Cabinet', 'Wardrobe', 'Console'
  ];
  return types[Math.floor(Math.random() * types.length)];
}

function getRandomCategory(): string {
  const categories = [
    'living-room', 'bedroom', 'dining', 'office', 'outdoor'
  ];
  return categories[Math.floor(Math.random() * categories.length)];
}

function getRandomSubcategory(category: string | null): string {
  if (!category) return '';
  
  const subcategories: Record<string, string[]> = {
    'living-room': ['Sofas', 'Coffee Tables', 'TV Stands', 'Chairs', 'Bookshelves'],
    'bedroom': ['Beds', 'Dressers', 'Nightstands', 'Wardrobes', 'Vanities'],
    'dining': ['Dining Tables', 'Dining Chairs', 'Sideboards', 'Bar Stools', 'Buffets'],
    'office': ['Desks', 'Office Chairs', 'Filing Cabinets', 'Bookcases', 'Computer Desks'],
    'outdoor': ['Patio Sets', 'Outdoor Chairs', 'Outdoor Tables', 'Loungers', 'Garden Benches']
  };
  
  const options = subcategories[category] || [];
  if (options.length === 0) return '';
  
  return options[Math.floor(Math.random() * options.length)];
}

function generateDescription(category: string | null): string {
  const descriptions = [
    "Elevate your space with this beautifully crafted piece, designed with both aesthetics and functionality in mind.",
    "Expertly crafted from premium materials, this stunning piece combines form and function for everyday luxury.",
    "A perfect blend of comfort and style, this versatile piece will complement any interior design scheme.",
    "This exquisite piece features clean lines and superior craftsmanship, built to last for generations.",
    "Add a touch of elegance to your space with this meticulously designed piece that merges comfort and sophistication."
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}
