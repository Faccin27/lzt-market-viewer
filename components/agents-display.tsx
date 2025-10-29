"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Loader2 } from "lucide-react"
import Image from "next/image"

interface Agent {
  uuid: string
  displayName: string
  displayIcon: string | null
  role: string
}

interface AgentsDisplayProps {
  agentIds: string[]
}

export function AgentsDisplay({ agentIds }: AgentsDisplayProps) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAgents() {
      if (!agentIds || agentIds.length === 0) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/valorant/agents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ agentIds }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch agents")
        }
        const data = await response.json()
        setAgents(data.agents || [])
      } catch (err) {
        console.error("[v0] Client: Error loading agents:", err)
        setError("Erro ao carregar agentes")
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [agentIds])

  if (loading) {
    return (
      <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Agentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || agents.length === 0) {
    return null
  }

  return (
    <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Agentes
          <span className="text-sm font-normal text-muted-foreground ml-2">({agents.length} agentes)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.uuid}
              className="group relative p-3 bg-background/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="aspect-square relative mb-2 bg-background/30 rounded flex items-center justify-center overflow-hidden">
                {agent.displayIcon ? (
                  <Image
                    src={agent.displayIcon || "/placeholder.svg"}
                    alt={agent.displayName}
                    fill
                    className="object-contain p-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                    }}
                  />
                ) : (
                  <Users className="h-8 w-8 text-muted-foreground/30" />
                )}
              </div>
              <div className="text-xs font-medium text-center text-balance leading-tight line-clamp-2 mb-1">
                {agent.displayName}
              </div>
              <div className="text-[10px] text-center text-muted-foreground">{agent.role}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
