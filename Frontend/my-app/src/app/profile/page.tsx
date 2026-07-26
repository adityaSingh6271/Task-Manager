"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { ArrowLeft, UserRound } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/hooks/useProfile";
import { useUpdateProfile } from "@/hooks/use-update-profile";

type ProfileForm = { name: string; avatar: string };

export default function ProfilePage() {
  const { data } = useProfile();
  const updateProfile = useUpdateProfile();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>();
  useEffect(() => { if (data?.user) reset({ name: data.user.name ?? "", avatar: data.user.avatar ?? "" }); }, [data?.user, reset]);
  const displayName = data?.user?.name?.trim() || data?.user?.email?.split("@")[0] || "User";
  const initial = displayName[0]?.toUpperCase() || "U";

  return <div className="min-h-screen bg-muted/30"><Header user={data?.user} /><main className="mx-auto max-w-2xl p-4 sm:p-8"><Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to Today</Link><Card><CardHeader><CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5" />Profile</CardTitle><CardDescription>Add the name and photo shown throughout your workspace.</CardDescription></CardHeader><CardContent><form onSubmit={handleSubmit((form) => updateProfile.mutate({ name: form.name, avatar: form.avatar.trim() || null }))} className="space-y-6"><div className="flex items-center gap-4"><Avatar className="h-16 w-16"><AvatarImage src={data?.user?.avatar || undefined} alt={displayName} /><AvatarFallback>{initial}</AvatarFallback></Avatar><div><p className="font-medium">{displayName}</p><p className="text-sm text-muted-foreground">{data?.user?.email}</p></div></div><div className="space-y-2"><Label htmlFor="name">Display name</Label><Input id="name" placeholder="e.g. Aditya Singh" {...register("name", { required: "Please enter your name", maxLength: 100 })} />{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}</div><div className="space-y-2"><Label htmlFor="avatar">Avatar image URL <span className="text-muted-foreground">(optional)</span></Label><Input id="avatar" type="url" placeholder="https://example.com/photo.jpg" {...register("avatar")} /></div><Button type="submit" disabled={updateProfile.isPending}>{updateProfile.isPending ? "Saving…" : "Save profile"}</Button></form></CardContent></Card></main></div>;
}
