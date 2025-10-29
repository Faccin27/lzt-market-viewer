import { type NextRequest, NextResponse } from "next/server"

const RARITY_ORDER: Record<string, number> = {
  "e046854e-406c-37f4-6607-19a9ba8426fc": 1, // Ultra Edition
  "60bca009-4182-7998-dee7-b8a2558dc369": 2, // Exclusive Edition
  "12683d76-48d7-84a3-4e09-6985794f0445": 3, // Premium Edition
  "0cebb8be-46d7-c12a-d306-e9907bfc5a25": 4, // Deluxe Edition
  "411e4a55-4e59-7757-41f0-86a53f101bb5": 5, // Select Edition
}

export async function POST(request: NextRequest) {
  try {
    const { skinIds } = await request.json()

    if (!skinIds || !Array.isArray(skinIds) || skinIds.length === 0) {
      return NextResponse.json({ skins: [] })
    }

    console.log("[v0] Fetching Valorant skins for", skinIds.length, "IDs")

    // Fetch all Valorant skins from Valorant API with retry logic
    let valorantResponse
    let retries = 3

    while (retries > 0) {
      try {
        valorantResponse = await fetch("https://valorant-api.com/v1/weapons/skins", {
          cache: "force-cache",
          signal: AbortSignal.timeout(10000), // 10 second timeout
        })

        if (valorantResponse.ok) break

        console.log("[v0] Valorant API returned", valorantResponse.status, "- retrying...")
        retries--
        if (retries > 0) await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.error("[v0] Fetch error:", error)
        retries--
        if (retries > 0) await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    if (!valorantResponse || !valorantResponse.ok) {
      console.error("[v0] Failed to fetch Valorant skins after retries")
      return NextResponse.json({ error: "Failed to fetch Valorant skins" }, { status: 500 })
    }

    const valorantData = await valorantResponse.json()
    const allSkins = valorantData.data || []

    console.log("[v0] Fetched", allSkins.length, "total skins from Valorant API")

    // Filter skins that exist in the account
    const accountSkins = allSkins
      .filter((skin: any) => skinIds.includes(skin.uuid))
      .map((skin: any) => ({
        uuid: skin.uuid,
        displayName: skin.displayName,
        displayIcon: skin.displayIcon,
        contentTierUuid: skin.contentTierUuid,
      }))
      .sort((a: any, b: any) => {
        const rarityA = RARITY_ORDER[a.contentTierUuid] || 999
        const rarityB = RARITY_ORDER[b.contentTierUuid] || 999
        return rarityA - rarityB
      })

    console.log("[v0] Filtered to", accountSkins.length, "account skins")

    return NextResponse.json({ skins: accountSkins })
  } catch (error) {
    console.error("[v0] Error fetching skins:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
