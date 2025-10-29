import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { buddyIds } = await request.json()

    if (!buddyIds || !Array.isArray(buddyIds) || buddyIds.length === 0) {
      return NextResponse.json({ buddies: [] })
    }

    console.log("[v0] Fetching Valorant buddies for", buddyIds.length, "IDs")

    // Fetch all Valorant buddies from Valorant API with retry logic
    let valorantResponse
    let retries = 3

    while (retries > 0) {
      try {
        valorantResponse = await fetch("https://valorant-api.com/v1/buddies", {
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
      console.error("[v0] Failed to fetch Valorant buddies after retries")
      return NextResponse.json({ error: "Failed to fetch Valorant buddies" }, { status: 500 })
    }

    const valorantData = await valorantResponse.json()
    const allBuddies = valorantData.data || []

    console.log("[v0] Fetched", allBuddies.length, "total buddies from Valorant API")

    // Filter buddies that exist in the account
    const accountBuddies = allBuddies
      .filter((buddy: any) => buddyIds.includes(buddy.uuid))
      .map((buddy: any) => ({
        uuid: buddy.uuid,
        displayName: buddy.displayName,
        displayIcon: buddy.displayIcon,
      }))
      .sort((a: any, b: any) => a.displayName.localeCompare(b.displayName))

    console.log("[v0] Filtered to", accountBuddies.length, "account buddies")

    return NextResponse.json({ buddies: accountBuddies })
  } catch (error) {
    console.error("[v0] Error fetching buddies:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
