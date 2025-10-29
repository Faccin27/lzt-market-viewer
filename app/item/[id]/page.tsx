import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Mail,
  Phone,
  Globe,
  Coins,
  Trophy,
  User,
  Calendar,
  ExternalLink,
  Zap,
  Target,
  Award,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WeaponSkinsDisplay } from "@/components/weapon-skins-display";
import { AgentsDisplay } from "@/components/agents-display";
import { BuddiesDisplay } from "@/components/buddies-display";
import Link from "next/link";

interface ItemData {
  item: {
    item_id: number;
    title: string;
    title_en: string;
    price: number;
    rub_price: number;
    riot_country: string;
    riot_email_verified: number;
    riot_phone_verified: number;
    riot_account_verified: number;
    riot_username: string;
    riot_valorant_level: number;
    riot_valorant_rank: number;
    riot_valorant_previous_rank: number;
    riot_valorant_last_rank: number;
    riot_valorant_rank_type: string;
    riot_valorant_region: string;
    riot_valorant_skin_count: number;
    riot_valorant_agent_count: number;
    riot_valorant_knife_count: number;
    riot_valorant_wallet_vp: number;
    riot_valorant_wallet_rp: number;
    riot_valorant_wallet_fa: number;
    riot_valorant_inventory_value: number;
    riot_lol_region: string;
    riot_lol_level: number;
    riot_lol_skin_count: number;
    riot_lol_champion_count: number;
    riot_lol_wallet_blue: number;
    riot_lol_wallet_purple: number;
    riot_lol_wallet_mythic: number;
    riot_lol_wallet_riot: number;
    riot_lol_rank: string;
    riot_lol_rank_win_rate: number;
    account_last_activity: number;
    item_origin: string;
    valorantRankTitle: string;
    valorantPreviousRankTitle: string;
    valorantLastRankTitle: string;
    valorantRegionPhrase: string;
    imagePreviewLinks?: {
      direct: {
        weapons: string;
        agents: string;
        buddies: string;
      };
    };
    accountLinks?: Array<{
      link: string;
      text: string;
    }>;
    seller: {
      username: string;
      sold_items_count: number;
      isOnline: boolean;
    };
    valorantInventory?: {
      WeaponSkins: string[];
      Agent: string[];
      Buddy: string[];
    };
  };
}

async function getItemData(itemId: string): Promise<ItemData | null> {
  try {
    const token = process.env.LZT_MARKET_TOKEN;

    if (!token) {
      return null;
    }

    const url = `https://prod-api.lzt.market/${itemId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getItemData(id);

  if (!data) {
    notFound();
  }

  const { item } = data;

  const skinIds = item.valorantInventory?.WeaponSkins || [];
  const agentIds = item.valorantInventory?.Agent || [];
  const buddyIds = item.valorantInventory?.Buddy || [];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex gap-6 p-6 bg-card/50 backdrop-blur-sm border-2 border-primary/20 rounded-xl glow-purple mb-8">
          <h1 className="text-4xl text-center mx-auto font-black mb-2 text-balance text-glow">
           VAVA Acc0unts
          </h1>
        </div>

        <div className="space-y-6">
          {/* General Info Section */}
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                Informações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Região</div>
                    <div className="font-bold text-lg">Brasil</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      E-mail verificado
                    </div>
                    <Badge
                      variant={
                        item.riot_email_verified ? "default" : "secondary"
                      }
                      className="mt-1"
                    >
                      {item.riot_email_verified ? "Sim" : "Não"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Telefone verificado
                    </div>
                    <Badge
                      variant={
                        item.riot_phone_verified ? "default" : "secondary"
                      }
                      className="mt-1"
                    >
                      {item.riot_phone_verified ? "Sim" : "Não"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Risco de recuperação
                    </div>
                    <Badge variant="outline" className="mt-1">
                      Nenhum
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Última atividade
                    </div>
                    <div className="font-bold text-sm">
                      {formatDate(item.account_last_activity)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-primary/10">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Compre em:
                    </div>
                    <Link
                      href={"discord.gg/"}
                      className="font-bold flex items-center gap-2 text-white p-1 mt-1 rounded-md bg-primary hover:scale-105 transition-all duration-300"
                    >
                      https://discord.gg/s3qWBD49Mt{" "}
                    </Link>
                  </div>
                </div>
              </div>

              {item.accountLinks && item.accountLinks.length > 0 && (
                <>
                  <Separator className="bg-primary/20" />
                  <div>
                    <div className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-primary" />
                      Links externos
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.accountLinks.map((link, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-primary/20 hover:bg-primary/10 bg-transparent"
                        >
                          <a
                            href={link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                          >
                            {link.text}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Valorant Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-primary" />
                  Valorant Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-background/50 rounded-lg border border-primary/10">
                  <div className="text-xs text-muted-foreground">
                    Nome de usuário
                  </div>
                  <div className="font-bold text-xl text-primary">
                    {item.riot_username}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background/50 rounded-lg border border-primary/10">
                    <div className="text-xs text-muted-foreground">Região</div>
                    <div className="font-bold text-lg">Brasil</div>
                  </div>

                  <div className="p-4 bg-background/50 rounded-lg border border-primary/10">
                    <div className="text-xs text-muted-foreground">Nível</div>
                    <div className="font-bold text-lg">
                      {item.riot_valorant_level}
                    </div>
                  </div>
                </div>

                <Separator className="bg-primary/20" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <span className="text-sm font-medium">Rank atual</span>
                    <Badge className="bg-primary text-primary-foreground">
                      {item.valorantRankTitle}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-primary/10">
                    <span className="text-sm font-medium">Último rank</span>
                    <Badge variant="outline">
                      {item.valorantLastRankTitle}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-primary/10">
                    <span className="text-sm font-medium">Rank anterior</span>
                    <Badge variant="outline">
                      {item.valorantPreviousRankTitle}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Coins className="h-6 w-6 text-primary" />
                  Moedas & Inventário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-background/50 rounded-lg border border-primary/10 text-center">
                    <div className="text-xs text-muted-foreground mb-1">VP</div>
                    <div className="text-2xl font-black text-primary">
                      {item.riot_valorant_wallet_vp}
                    </div>
                  </div>

                  <div className="p-4 bg-background/50 rounded-lg border border-primary/10 text-center">
                    <div className="text-xs text-muted-foreground mb-1">RP</div>
                    <div className="text-2xl font-black text-primary">
                      {item.riot_valorant_wallet_rp}
                    </div>
                  </div>

                  <div className="p-4 bg-background/50 rounded-lg border border-primary/10 text-center">
                    <div className="text-xs text-muted-foreground mb-1">FA</div>
                    <div className="text-2xl font-black text-primary">
                      {item.riot_valorant_wallet_fa}
                    </div>
                  </div>
                </div>

                <Separator className="bg-primary/20" />

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-background/50 rounded-lg border border-primary/10 text-center">
                    <Target className="h-5 w-5 text-primary mx-auto mb-2" />
                    <div className="text-xs text-muted-foreground mb-1">
                      Skins
                    </div>
                    <div className="text-2xl font-black">
                      {item.riot_valorant_skin_count}
                    </div>
                  </div>

                  <div className="p-4 bg-background/50 rounded-lg border border-primary/10 text-center">
                    <Zap className="h-5 w-5 text-primary mx-auto mb-2" />
                    <div className="text-xs text-muted-foreground mb-1">
                      Facas
                    </div>
                    <div className="text-2xl font-black">
                      {item.riot_valorant_knife_count}
                    </div>
                  </div>

                  <div className="p-4 bg-background/50 rounded-lg border border-primary/10 text-center">
                    <User className="h-5 w-5 text-primary mx-auto mb-2" />
                    <div className="text-xs text-muted-foreground mb-1">
                      Agentes
                    </div>
                    <div className="text-2xl font-black">
                      {item.riot_valorant_agent_count}
                    </div>
                  </div>
                </div>

                <Separator className="bg-primary/20" />

                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 text-center">
                  <Award className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-xs text-muted-foreground mb-1">
                    Valor estimado do inventário
                  </div>
                  <div className="text-3xl font-black text-primary text-glow">
                    ${item.riot_valorant_inventory_value}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* League of Legends Section */}
          {item.riot_lol_region && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    League of Legends Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-background/50 rounded-lg border border-primary/10">
                      <div className="text-xs text-muted-foreground">
                        Região
                      </div>
                      <div className="font-bold text-lg">
                        {item.riot_lol_region}
                      </div>
                    </div>

                    <div className="p-4 bg-background/50 rounded-lg border border-primary/10">
                      <div className="text-xs text-muted-foreground">Nível</div>
                      <div className="font-bold text-lg">
                        {item.riot_lol_level}
                      </div>
                    </div>

                    <div className="p-4 bg-background/50 rounded-lg border border-primary/10">
                      <div className="text-xs text-muted-foreground">Rank</div>
                      <Badge className="mt-1">
                        {item.riot_lol_rank || "Sem rank"}
                      </Badge>
                    </div>

                    <div className="p-4 bg-background/50 rounded-lg border border-primary/10">
                      <div className="text-xs text-muted-foreground">
                        Taxa de vitória
                      </div>
                      <div className="font-bold text-lg">
                        {item.riot_lol_rank_win_rate}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Coins className="h-6 w-6 text-primary" />
                    Moedas LoL
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-background/50 rounded-lg border border-primary/10 text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        Riot Points
                      </div>
                      <div className="text-2xl font-black text-primary">
                        {item.riot_lol_wallet_riot}
                      </div>
                    </div>

                    <div className="p-4 bg-background/50 rounded-lg border border-primary/10 text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        Essência Azul
                      </div>
                      <div className="text-2xl font-black text-primary">
                        {item.riot_lol_wallet_blue}
                      </div>
                    </div>

                    <div className="p-4 bg-background/50 rounded-lg border border-primary/10 text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        Essência Laranja
                      </div>
                      <div className="text-2xl font-black text-primary">
                        {item.riot_lol_wallet_purple}
                      </div>
                    </div>

                    <div className="p-4 bg-background/50 rounded-lg border border-primary/10 text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        Essência Mítica
                      </div>
                      <div className="text-2xl font-black text-primary">
                        {item.riot_lol_wallet_mythic}
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-primary/20" />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-background/50 rounded-lg border border-primary/10 text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        Skins
                      </div>
                      <div className="text-2xl font-black">
                        {item.riot_lol_skin_count}
                      </div>
                    </div>

                    <div className="p-4 bg-background/50 rounded-lg border border-primary/10 text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        Campeões
                      </div>
                      <div className="text-2xl font-black">
                        {item.riot_lol_champion_count}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Inventory Images Section */}
          <div className="space-y-6">
            <WeaponSkinsDisplay skinIds={skinIds} />
            <AgentsDisplay agentIds={agentIds} />
            <BuddiesDisplay buddyIds={buddyIds} />
          </div>
        </div>
      </div>
    </div>
  );
}
