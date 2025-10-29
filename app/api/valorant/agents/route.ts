import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { agentIds } = await request.json()

    if (!agentIds || !Array.isArray(agentIds) || agentIds.length === 0) {
      return NextResponse.json({ agents: [] })
    }


    // Fetch all Valorant agents from Valorant API with retry logic
    let valorantResponse
    let retries = 3

    while (retries > 0) {
      try {
        valorantResponse = await fetch("https://valorant-api.com/v1/agents", {
          cache: "force-cache",
          signal: AbortSignal.timeout(10000), // 10 second timeout
        })

        if (valorantResponse.ok) break

        retries--
        if (retries > 0) await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.error("[v0] Fetch error:", error)
        retries--
        if (retries > 0) await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    if (!valorantResponse || !valorantResponse.ok) {
      console.error("[v0] Failed to fetch Valorant agents after retries")
      return NextResponse.json({ error: "Failed to fetch Valorant agents" }, { status: 500 })
    }

    const valorantData = await valorantResponse.json()
    const allAgents = valorantData.data || []


    // Filter agents that exist in the account and are playable
    const accountAgents = allAgents
      .filter((agent: any) => agent.isPlayableCharacter && agentIds.includes(agent.uuid))
      .map((agent: any) => ({
        uuid: agent.uuid,
        displayName: agent.displayName,
        displayIcon: agent.displayIcon,
        role: agent.role?.displayName || "Unknown",
      }))
      .sort((a: any, b: any) => a.displayName.localeCompare(b.displayName))


    return NextResponse.json({ agents: accountAgents })
  } catch (error) {
    console.error("[v0] Error fetching agents:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
