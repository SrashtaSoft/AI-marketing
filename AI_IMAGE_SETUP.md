# AI Image Generation Setup

## Issue
AI image generation is not working because the OpenAI API key is not configured.

## Error Message
```
401 Incorrect API key provided: sk-proj-
```

## Solution

### Step 1: Get OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the API key (it starts with `sk-`)

### Step 2: Add API Key to .env

Open your `.env` file and update:

```bash
OPENAI_API_KEY="sk-your-actual-api-key-here"
```

**Important:** 
- Replace `sk-your-actual-api-key-here` with your actual API key
- Keep the quotes around the key
- Don't share this key publicly

### Step 3: Restart Backend

After adding the API key, restart the backend:

```bash
# Stop backend
lsof -ti :3000 | xargs kill -9 2>/dev/null
pkill -f "nest start.*backend" 2>/dev/null

# Restart backend
pnpm run dev:backend
```

### Step 4: Test AI Image Generation

1. Go to your frontend: http://localhost:4200
2. Create a new post
3. Enter at least 30 characters in the post text
4. Click "AI Image" button
5. Select a style (e.g., "Realistic")
6. The image should generate successfully

## How It Works

- **Model**: DALL-E 3 (OpenAI's image generation model)
- **Styles Available**: Realistic, Cartoon, Anime, Fantasy, Abstract, Pixel Art, Sketch, Watercolor, Minimalist, Cyberpunk, Monochromatic, Surreal, Pop Art, Fantasy Realism
- **Minimum Text**: 30 characters required
- **API Endpoint**: `/media/generate-image-with-prompt`

## Cost Information

⚠️ **Note**: OpenAI API usage has costs associated with it:
- DALL-E 3: ~$0.04 per image (1024x1024)
- Check current pricing: https://openai.com/pricing

## Troubleshooting

### Still Getting Errors?

1. **Check API Key Format**:
   ```bash
   grep OPENAI_API_KEY .env
   ```
   Should show: `OPENAI_API_KEY="sk-..."`

2. **Check Backend Logs**:
   ```bash
   tail -f /tmp/backend.log | grep -i "openai\|error"
   ```

3. **Verify API Key is Valid**:
   - Make sure the key is active in your OpenAI account
   - Check if you have credits/billing set up
   - Ensure the key hasn't been revoked

4. **Check Credits**:
   - The system checks for subscription credits if Stripe is configured
   - If `STRIPE_PUBLISHABLE_KEY` is set, you need credits to generate images

### Alternative: Disable Credit Check (Development Only)

If you want to test without Stripe, you can temporarily comment out the credit check in the code, but this is **NOT recommended for production**.

## Example .env Configuration

```bash
# OpenAI API Key for AI image generation
OPENAI_API_KEY="sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"

# Optional: If you want to require credits for AI features
# STRIPE_PUBLISHABLE_KEY="pk_test_..."
# STRIPE_SECRET_KEY="sk_test_..."
```

## After Setup

Once configured, you can:
- Generate AI images with different styles
- Use AI features in posts
- Create content with AI assistance

Make sure to restart the backend after adding the API key!

