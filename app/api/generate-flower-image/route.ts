import { NextResponse } from "next/server"
import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const maxDuration = 60

/**
 * Generates a square studio photograph of a flower based on its name, using
 * the AI Gateway's image-capable Gemini model. Returns a data URL the client
 * can preview and persist directly into the flowers.image_url column.
 *
 * Admin-only: we verify the caller is an admin via Supabase before spending
 * tokens on image generation.
 */
export async function POST(request: Request) {
  let body: { name?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const name = body.name?.trim()
  if (!name) {
    return NextResponse.json({ error: "Flower name is required" }, { status: 400 })
  }

  // Auth + admin check
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admins only" }, { status: 403 })
  }

  // Generate the image
  try {
    const result = await generateText({
      model: "google/gemini-3.1-flash-image-preview",
      prompt: `A single ${name} flower, photographed in a soft, natural-light studio setting. Centered composition, plain off-white parchment background, gentle shadow, editorial floral catalog style. Sharp focus on the petals, true-to-life colors, no text, no watermark.`,
    })

    // The image arrives as a file in the response.
    const imageFile = result.files?.find((f) =>
      f.mediaType?.startsWith("image/"),
    )

    if (!imageFile) {
      return NextResponse.json(
        { error: "Model did not return an image" },
        { status: 502 },
      )
    }

    const base64 =
      typeof (imageFile as { base64?: string }).base64 === "string"
        ? (imageFile as { base64: string }).base64
        : Buffer.from(imageFile.uint8Array).toString("base64")

    const mediaType = imageFile.mediaType ?? "image/png"
    const dataUrl = `data:${mediaType};base64,${base64}`

    return NextResponse.json({ image_url: dataUrl })
  } catch (err) {
    console.error("[v0] Image generation failed:", err)
    return NextResponse.json(
      { error: "Image generation failed", details: (err as Error).message },
      { status: 500 },
    )
  }
}
