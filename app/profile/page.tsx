"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/organisms/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import type { User } from "@/lib/types"
import { Loader2, Upload, UserIcon, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading, refreshProfile } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    gender: "",
    phone_number: "",
    address: "",
  })

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to access your profile",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    fetchProfile()
  }, [user, authLoading, router])

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/profile")
      const profileData = response.data

      setProfile(profileData)
      setFormData({
        username: profileData.username || "",
        firstname: profileData.firstname || "",
        lastname: profileData.lastname || "",
        gender: profileData.gender || "",
        phone_number: profileData.phone_number || "",
        address: profileData.address || "",
      })

      if (profileData.profile_picture_url) {
        setPreviewUrl(profileData.profile_picture_url)
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error)

      if (error.response?.status === 401) {
        toast({
          title: "Authentication Failed",
          description: "Please login again",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid image file (JPEG, PNG, or WebP)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 2MB",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    setPreviewUrl(profile?.profile_picture_url || "")

    // Reset file input
    const fileInput = document.getElementById("profile_picture") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)

    try {
      // Validate required fields
      if (!formData.username.trim()) {
        throw new Error("Username is required")
      }
      if (!formData.firstname.trim()) {
        throw new Error("First name is required")
      }
      if (!formData.lastname.trim()) {
        throw new Error("Last name is required")
      }
      if (!formData.phone_number.trim()) {
        throw new Error("Phone number is required")
      }

      // Create FormData for multipart/form-data
      const submitData = new FormData()

      // Add form fields
      submitData.append("username", formData.username.trim())
      submitData.append("firstname", formData.firstname.trim())
      submitData.append("lastname", formData.lastname.trim())
      submitData.append("gender", formData.gender || "")
      submitData.append("phone_number", formData.phone_number.trim())
      submitData.append("address", formData.address.trim())

      // Add profile picture if selected
      if (selectedFile) {
        submitData.append("profile_picture", selectedFile)
      }

      const response = await api.put("/auth/profile", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })

      // Update local profile data
      setProfile(response.data)
      setSelectedFile(null)

      // Refresh auth context to update navbar
      await refreshProfile()

      // Redirect to home after successful update
      setTimeout(() => {
        router.push("/")
      }, 1500) // Small delay to show success message
    } catch (error: any) {
      console.error("Update profile error:", error)

      let errorMessage = "Failed to update profile"

      if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again."
        router.push("/login")
        return
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value || "" }))
  }

  const getInitials = (firstname?: string, lastname?: string, username?: string) => {
    const first = firstname?.charAt(0)?.toUpperCase() || ""
    const last = lastname?.charAt(0)?.toUpperCase() || ""
    return first + last || username?.charAt(0)?.toUpperCase() || "U"
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Invalid Date"
    }
  }

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  // Show login required if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 md:px-6 py-8">
          <div className="text-center space-y-4">
            <UserIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h1 className="text-2xl font-bold">Authentication Required</h1>
            <p className="text-muted-foreground">Please login to access your profile.</p>
            <Button onClick={() => router.push("/login")}>Go to Login</Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 md:px-6 py-8">
          <div className="text-center space-y-4">
            <UserIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h1 className="text-2xl font-bold">Profile Not Found</h1>
            <p className="text-muted-foreground">Unable to load your profile information.</p>
            <Button onClick={() => router.push("/")}>Go Home</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl flex items-center justify-center">
              <UserIcon className="mr-3 h-8 w-8" />
              My Profile
            </h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Summary Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage
                        src={previewUrl || profile.profile_picture_url || "/placeholder-user.jpg"}
                        alt={profile.username}
                      />
                      <AvatarFallback className="text-2xl">
                        {getInitials(profile.firstname, profile.lastname, profile.username)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl">
                    {profile.firstname && profile.lastname
                      ? `${profile.firstname} ${profile.lastname}`
                      : profile.username}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {profile.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  

                  {profile.phone_number && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        Phone:
                      </span>
                      <span className="font-medium">{profile.phone_number}</span>
                    </div>
                  )}

                  {profile.address && (
                    <div className="flex items-start justify-between text-sm">
                      <span className="text-muted-foreground flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        Address:
                      </span>
                      <span className="font-medium text-right max-w-[60%]">{profile.address}</span>
                    </div>
                  )}

                  <Separator />

                  

                  {profile.updated_at !== profile.created_at && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">{formatDate(profile.updated_at)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Edit Profile Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="space-y-4">
                      <Label htmlFor="profile_picture">Profile Picture</Label>
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={previewUrl || profile.profile_picture_url || "/placeholder-user.jpg"}
                            alt="Profile preview"
                          />
                          <AvatarFallback>
                            {getInitials(formData.firstname, formData.lastname, formData.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              id="profile_picture"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                              disabled={updating}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById("profile_picture")?.click()}
                              disabled={updating}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {selectedFile ? "Change Photo" : "Upload Photo"}
                            </Button>
                            {selectedFile && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={removeSelectedFile}
                                disabled={updating}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">JPG, PNG or WebP. Max size 2MB.</p>
                          {selectedFile && (
                            <p className="text-xs text-green-600">
                              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username *</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => handleChange("username", e.target.value)}
                          placeholder="Enter username"
                          required
                          disabled={updating}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={profile.email} disabled className="bg-muted" />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstname">First Name *</Label>
                        <Input
                          id="firstname"
                          value={formData.firstname}
                          onChange={(e) => handleChange("firstname", e.target.value)}
                          placeholder="Enter first name"
                          required
                          disabled={updating}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastname">Last Name *</Label>
                        <Input
                          id="lastname"
                          value={formData.lastname}
                          onChange={(e) => handleChange("lastname", e.target.value)}
                          placeholder="Enter last name"
                          required
                          disabled={updating}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) => handleChange("gender", value)}
                          disabled={updating}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number *</Label>
                        <Input
                          id="phone_number"
                          value={formData.phone_number}
                          onChange={(e) => handleChange("phone_number", e.target.value)}
                          placeholder="Enter phone number"
                          required
                          disabled={updating}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="Enter your address"
                        rows={3}
                        disabled={updating}
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <Button type="button" variant="outline" onClick={() => router.back()} disabled={updating}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={updating}>
                        {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Profile
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
