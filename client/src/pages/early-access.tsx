import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/layout";
import { Check, Volume2, Wrench, Bug, Shield, Layers, UserCheck, MapPin, Users, Star } from "lucide-react";

export default function EarlyAccess() {
  const [heroEmail, setHeroEmail] = useState("");
  const [bottomEmail, setBottomEmail] = useState("");
  const { toast } = useToast();

  const joinWaitlistMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/waitlist", { email });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "You're on the list!",
        description: data.message || "Thanks! We'll notify you when we launch.",
      });
      setHeroEmail("");
      setBottomEmail("");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Couldn't join waitlist",
        description: error.message || "Please check your email and try again.",
      });
    },
  });

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroEmail.trim()) {
      joinWaitlistMutation.mutate(heroEmail.trim());
    }
  };

  const handleBottomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bottomEmail.trim()) {
      joinWaitlistMutation.mutate(bottomEmail.trim());
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#1C1917] to-[#292524] -mt-6 pt-12 pb-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-serif text-3xl md:text-5xl text-white mb-4 leading-tight">
              Know the Truth Before You Sign a Lease.
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-xl mx-auto">
              Read honest, anonymous reviews from real NYC renters about the buildings they lived in.
            </p>

            {/* Hero Email Capture */}
            <form onSubmit={handleHeroSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={heroEmail}
                onChange={(e) => setHeroEmail(e.target.value)}
                className="flex-1 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#ebba48]"
                required
              />
              <Button
                type="submit"
                className="h-12 px-6 bg-[#ebba48] hover:bg-[#C49A3C] text-white rounded-xl font-medium whitespace-nowrap"
                disabled={joinWaitlistMutation.isPending}
              >
                {joinWaitlistMutation.isPending ? "Joining..." : "Join Early Access"}
              </Button>
            </form>
            <p className="text-white/50 text-sm">
              Launching soon in New York City.
            </p>
          </div>
        </div>

        {/* The Problem Section */}
        <div className="py-16 px-4 bg-[#FDFAF6] dark:bg-[#1C1917]">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-[#1C1917] dark:text-white mb-6 text-center">
              Renting in NYC is a gamble.
            </h2>
            <p className="text-[#57534E] dark:text-gray-400 text-center mb-8 text-lg">
              Most renters don't know the real conditions of a building until after they move in.
            </p>

            <Card liquid className="max-w-xl mx-auto">
              <CardContent className="pt-6 pb-6">
                <p className="text-[#57534E] dark:text-gray-400 mb-4 font-medium">
                  You can't easily find out:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-[#57534E] dark:text-gray-400">
                    <Volume2 className="h-5 w-5 text-[#ebba48] flex-shrink-0 mt-0.5" />
                    <span>If the walls are paper thin</span>
                  </li>
                  <li className="flex items-start gap-3 text-[#57534E] dark:text-gray-400">
                    <Wrench className="h-5 w-5 text-[#ebba48] flex-shrink-0 mt-0.5" />
                    <span>If management ignores repairs</span>
                  </li>
                  <li className="flex items-start gap-3 text-[#57534E] dark:text-gray-400">
                    <Bug className="h-5 w-5 text-[#ebba48] flex-shrink-0 mt-0.5" />
                    <span>If there are pests</span>
                  </li>
                  <li className="flex items-start gap-3 text-[#57534E] dark:text-gray-400">
                    <Shield className="h-5 w-5 text-[#ebba48] flex-shrink-0 mt-0.5" />
                    <span>If the building feels safe</span>
                  </li>
                  <li className="flex items-start gap-3 text-[#57534E] dark:text-gray-400">
                    <Layers className="h-5 w-5 text-[#ebba48] flex-shrink-0 mt-0.5" />
                    <span>If certain floors are noisier than others</span>
                  </li>
                </ul>
                <p className="text-[#57534E] dark:text-gray-400 mt-6 pt-4 border-t border-[#E7E5E4] dark:border-gray-700">
                  Leases are signed based on photos and tours — not real living experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* The Solution Section */}
        <div className="py-16 px-4 bg-white dark:bg-[#292524]">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-[#1C1917] dark:text-white mb-6 text-center">
              We're changing that.
            </h2>
            <p className="text-[#57534E] dark:text-gray-400 text-center mb-8 text-lg">
              Rate My Apartment lets renters share honest reviews about the buildings they live in or have lived in.
            </p>

            <Card liquid className="max-w-xl mx-auto">
              <CardContent className="pt-6 pb-6">
                <p className="text-[#57534E] dark:text-gray-400 mb-4 font-medium">
                  Future renters can see:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-[#57534E] dark:text-gray-400">
                    <Star className="h-5 w-5 text-[#ebba48] flex-shrink-0 mt-0.5" />
                    <span>Overall building ratings</span>
                  </li>
                  <li className="flex items-start gap-3 text-[#57534E] dark:text-gray-400">
                    <Layers className="h-5 w-5 text-[#ebba48] flex-shrink-0 mt-0.5" />
                    <span>Floor-level insights</span>
                  </li>
                  <li className="flex items-start gap-3 text-[#57534E] dark:text-gray-400">
                    <Check className="h-5 w-5 text-[#ebba48] flex-shrink-0 mt-0.5" />
                    <span>Category ratings (noise, cleanliness, maintenance, safety, pests)</span>
                  </li>
                  <li className="flex items-start gap-3 text-[#57534E] dark:text-gray-400">
                    <Users className="h-5 w-5 text-[#ebba48] flex-shrink-0 mt-0.5" />
                    <span>Real renter experiences</span>
                  </li>
                </ul>
                <p className="text-[#ebba48] font-medium mt-6 pt-4 border-t border-[#E7E5E4] dark:border-gray-700">
                  All reviews can be posted anonymously.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Section */}
        <div className="py-16 px-4 bg-[#FDFAF6] dark:bg-[#1C1917]">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl text-[#1C1917] dark:text-white mb-8 text-center">
              Built for renters.
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#292524] border border-[#E7E5E4] dark:border-gray-700">
                <div className="h-8 w-8 rounded-lg bg-[#ebba48]/10 flex items-center justify-center flex-shrink-0">
                  <UserCheck className="h-4 w-4 text-[#ebba48]" />
                </div>
                <span className="text-[#1C1917] dark:text-white font-medium">Anonymous reviews</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#292524] border border-[#E7E5E4] dark:border-gray-700">
                <div className="h-8 w-8 rounded-lg bg-[#ebba48]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-[#ebba48]" />
                </div>
                <span className="text-[#1C1917] dark:text-white font-medium">NYC-focused</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#292524] border border-[#E7E5E4] dark:border-gray-700">
                <div className="h-8 w-8 rounded-lg bg-[#ebba48]/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-[#ebba48]" />
                </div>
                <span className="text-[#1C1917] dark:text-white font-medium">No landlords controlling reviews</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#292524] border border-[#E7E5E4] dark:border-gray-700">
                <div className="h-8 w-8 rounded-lg bg-[#ebba48]/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-[#ebba48]" />
                </div>
                <span className="text-[#1C1917] dark:text-white font-medium">Real experiences from real tenants</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Email Capture */}
        <div className="py-16 px-4 bg-gradient-to-b from-[#1C1917] to-[#292524]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-2xl md:text-3xl text-white mb-4">
              Be the first to access building reviews.
            </h2>
            <p className="text-white/70 mb-2">
              Join the waitlist and get notified when we launch.
            </p>
            <p className="text-white/70 mb-8">
              You'll also be able to add your own building reviews.
            </p>

            <form onSubmit={handleBottomSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={bottomEmail}
                onChange={(e) => setBottomEmail(e.target.value)}
                className="flex-1 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#ebba48]"
                required
              />
              <Button
                type="submit"
                className="h-12 px-6 bg-[#ebba48] hover:bg-[#C49A3C] text-white rounded-xl font-medium whitespace-nowrap"
                disabled={joinWaitlistMutation.isPending}
              >
                {joinWaitlistMutation.isPending ? "Joining..." : "Get Early Access"}
              </Button>
            </form>
          </div>
        </div>

        {/* Simple Footer */}
        <div className="py-6 px-4 bg-[#1C1917] text-center">
          <p className="text-white/40 text-sm">
            Rate My Apartment NYC
          </p>
        </div>
      </div>
    </Layout>
  );
}
