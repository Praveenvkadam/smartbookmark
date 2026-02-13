"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const ITEMS_PER_PAGE = 5

export default function Bookmarks() {
  const { data: session } = useSession()


  const [bookmarks, setBookmarks] = useState([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  const userId = session?.user?.id


  async function fetchBookmarks() {
    if (!userId) return

    setLoading(true)

    try {
      const res = await fetch(
        `/api/bookmarks?userId=${userId}&search=${search}`
      )

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setBookmarks(data)
    } catch (err) {
      toast.error(err.message || "Failed to fetch bookmarks")
    } finally {
      setLoading(false)
    }
  }

  /* Fetch whenever user or search changes */
  useEffect(() => {
    fetchBookmarks()
  }, [userId, search])


  async function handleDelete(id) {
    const promise = fetch(
      `/api/bookmarks?id=${id}&userId=${userId}`,
      { method: "DELETE" }
    ).then(async (res) => {
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      return data
    })

    toast.promise(promise, {
      loading: "Deleting bookmark...",
      success: "Bookmark deleted successfully",
      error: (err) => err.message,
    })

    try {
      await promise
      fetchBookmarks()
    } catch {}
  }

  async function handleUpdate() {
    const promise = fetch("/api/bookmarks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing.id,
        title: editing.title,
        url: editing.url,
        userId,
      }),
    }).then(async (res) => {
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      return data
    })

    toast.promise(promise, {
      loading: "Updating bookmark...",
      success: "Bookmark updated successfully",
      error: (err) => err.message,
    })

    try {
      await promise
      setEditing(null)
      fetchBookmarks()
    } catch {}
  }

  /* =========================
     PAGINATION LOGIC
  ========================= */
  const totalPages = Math.ceil(bookmarks.length / ITEMS_PER_PAGE)

  const paginatedBookmarks = bookmarks.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  return (
    <div className="w-full flex justify-center pt-10 pb-20 bg-gray-100 min-h-screen">
      {/* Main container – SAME WIDTH as InputBox */}
      <div className="w-[95%] max-w-6xl space-y-8">

        {/* =========================
            SEARCH INPUT (BIGGER HEIGHT)
        ========================= */}
        <div className="w-full">
          <Input
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1) // reset to page 1 on search
            }}
            className="h-14 w-full bg-white text-base rounded-xl shadow-sm"
          />
        </div>

        {/* =========================
            BOOKMARK LIST
        ========================= */}
        <div className="space-y-6">
          {loading && (
            <p className="text-center text-gray-500">
              Loading...
            </p>
          )}

          {paginatedBookmarks.map((bookmark) => (
            <Card
              key={bookmark.id}
              className="rounded-2xl shadow-sm bg-white"
            >
              <CardContent className="p-6 flex justify-between items-start">
                {/* Left side (Title + URL) */}
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">
                    {bookmark.title}
                  </h2>

                  <a
                    href={bookmark.url}
                    target="_blank"
                    className="text-amber-600 text-sm"
                  >
                    {bookmark.url}
                  </a>
                </div>

                {/* Right side (Actions) */}
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditing(bookmark)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(bookmark.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* =========================
            PAGINATION CONTROLS
        ========================= */}
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages || 1}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>

        {/* =========================
            FOOTER COUNT
        ========================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center text-gray-600">
          You have {bookmarks.length} bookmarks saved
        </div>

        {/* =========================
            EDIT DIALOG
        ========================= */}
        <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Bookmark</DialogTitle>
            </DialogHeader>

            {editing && (
              <div className="space-y-4">
                <Input
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      title: e.target.value,
                    })
                  }
                />

                <Input
                  value={editing.url}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      url: e.target.value,
                    })
                  }
                />

                <Button
                  className="w-full"
                  onClick={handleUpdate}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}