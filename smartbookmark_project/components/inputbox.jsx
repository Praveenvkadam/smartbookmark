"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Enter a valid URL"),
})

export default function InputBox() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values) {
   
    if (!session?.user?.id) {
      router.push("/signup")
      return
    }

    const promise = fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        userId: session.user.id,
      }),
    }).then(async (res) => {
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      return data
    })

    toast.promise(promise, {
      loading: "Adding bookmark...",
      success: "Bookmark added successfully",
      error: (err) => err.message,
    })

    try {
      await promise
      reset()
    } catch {}
  }

 
  if (status === "unauthenticated") {
    router.push("/signup")
    return null
  }

  return (
    <div className="w-full flex justify-center pt-10">
      <div className="w-[95%] max-w-6xl">
        <Card className="w-full rounded-2xl shadow-sm border bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex gap-2">
              <span>✨</span>
              Add New Bookmark
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input {...register("title")} className="h-12" />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input {...register("url")} className="h-12" />
                  {errors.url && (
                    <p className="text-sm text-red-500">
                      {errors.url.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-6 bg-emerald-700 hover:bg-emerald-800 text-white"
              >
                {isSubmitting ? "Adding..." : "+ Add Bookmark"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}