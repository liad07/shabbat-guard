"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Moon, Sun, Copy, RotateCcw, Play, Star, Shield, Globe, Clock, MapPin, Palette } from "lucide-react"
import { useTheme } from "next-themes"

export default function ShabbatGuardPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [cdnUrl, setCdnUrl] = useState("https://cdn.shabbatguard.com/shabbat-guard.umd.min.js")
  const [locationMode, setLocationMode] = useState("api")
  const [onDeny, setOnDeny] = useState("api")
  const [minhag, setMinhag] = useState("default")
  const [havdalahMinutes, setHavdalahMinutes] = useState("40")

  const [customDesign, setCustomDesign] = useState(true) // Default to custom design
  const [customMessage, setCustomMessage] = useState("עמכם הסליחה האתר יחזור לפעילות במוצאי השבת")
  const [customImage, setCustomImage] = useState("/shabbat-shalom.png")
  const [backgroundColor, setBackgroundColor] = useState("#1a1a1a")
  const [textColor, setTextColor] = useState("#ffffff")
  const [cardBackground, setCardBackground] = useState("#2a2a2a")
  const [accentColor, setAccentColor] = useState("#d4af37")

  const [generatedTag, setGeneratedTag] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)
  const [userLocation, setUserLocation] = useState<string>("")
  const [shabbatEndTime, setShabbatEndTime] = useState<string>("")

  const defaultImages = [
    { name: "נרות שבת וחלה", url: "/shabbat-shalom.png" },
    { name: "נרות שבת קלאסיים", url: "/realistic-lit-candle-with-warm-flame-on-dark-backg.png" },
    { name: "נרות שבת אלגנטיים", url: "/realistic-lit-candle-with-warm-flame--elegant-shab.png" },
  ]

  useEffect(() => {
    setMounted(true)
    getUserLocationQuietly()
  }, [])

  useEffect(() => {
    generateTag()
  }, [
    cdnUrl,
    locationMode,
    onDeny,
    minhag,
    havdalahMinutes,
    customDesign,
    customMessage,
    customImage,
    backgroundColor,
    textColor,
    cardBackground,
    accentColor,
  ])

  const getUserLocationQuietly = async () => {
    try {
      const Ipapi_resp = await fetch("https://ipapi.co/json/")
      const clienInfo = await Ipapi_resp.json()
      const hebcal_resp = await fetch(`https://www.hebcal.com/shabbat?cfg=json&city=${clienInfo.region}&b=40&M=on`)
      const chabatInfo = await hebcal_resp.json()
      const { items } = chabatInfo

      if (items && items.length >= 3) {
        const chabatIn = new Date(items[0].date)
        const chabatOut = new Date(items[2].date)

        const location = `${clienInfo.city}, ${clienInfo.country}`
        setUserLocation(location)

        const endTime = chabatOut.toLocaleTimeString("he-IL", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        setShabbatEndTime(endTime)
      }
    } catch (error) {
      console.log("[v0] Could not fetch location or Shabbat times quietly:", error)
      // Fallback times if API fails
      setShabbatEndTime("20:45")
      setUserLocation("ישראל")
    }
  }

  const generateTag = () => {
    try {
      const url = new URL(cdnUrl)
      const params = new URLSearchParams()

      params.set("location", locationMode)
      if (locationMode === "prompt-only") {
        params.set("onDeny", onDeny)
      }
      params.set("minhag", minhag)
      if (minhag === "custom") {
        params.set("havdalah", havdalahMinutes)
      }

      if (customDesign) {
        params.set("customDesign", "true")
        params.set("message", encodeURIComponent(customMessage))
        params.set("image", encodeURIComponent(customImage))
        params.set("bgColor", encodeURIComponent(backgroundColor))
        params.set("textColor", encodeURIComponent(textColor))
        params.set("cardBg", encodeURIComponent(cardBackground))
        params.set("accentColor", encodeURIComponent(accentColor))
      }

      const tag = `<script src="${url.toString()}?${params.toString()}" defer></script>`
      setGeneratedTag(tag)
    } catch {
      setGeneratedTag("<!-- הזן כתובת CDN תקפה -->")
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedTag)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = generatedTag
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const resetForm = () => {
    setCdnUrl("https://cdn.shabbatguard.com/shabbat-guard.umd.min.js")
    setLocationMode("api")
    setOnDeny("api")
    setMinhag("default")
    setHavdalahMinutes("40")
    setCustomDesign(true)
    setCustomMessage("עמכם הסליחה האתר יחזור לפעילות במוצאי השבת")
    setCustomImage("/shabbat-shalom.png")
    setBackgroundColor("#1a1a1a")
    setTextColor("#ffffff")
    setCardBackground("#2a2a2a")
    setAccentColor("#d4af37")
  }

  const showDemo = () => {
    const overlay = document.createElement("div")

    const bgColor = customDesign ? backgroundColor : theme === "dark" ? "#1a1a1a" : "#ffffff"
    const txtColor = customDesign ? textColor : theme === "dark" ? "#ffffff" : "#1a1a1a"
    const cardBg = customDesign ? cardBackground : theme === "dark" ? "#2a2a2a" : "#f8f8f8"
    const accent = customDesign ? accentColor : "#d4af37"
    const message = customDesign ? customMessage : "האתר אינו פעיל בשבת"
    const imageUrl = customDesign ? customImage : "/shabbat-shalom.png"

    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: ${bgColor};
      color: ${txtColor};
      text-align: center;
      padding: 32px;
      font-family: inherit;
      backdrop-filter: blur(8px);
    `

    const displayEndTime = shabbatEndTime || "20:45"
    const displayLocation = userLocation || "ישראל"

    overlay.innerHTML = `
      <div style="max-width: 500px; background: ${cardBg}; padding: 48px 32px; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(16px);">
        
        <div style="margin-bottom: 24px; position: relative;">
          <img src="${imageUrl}" 
               alt="שבת שלום" 
               style="width: 200px; height: 200px; margin: 0 auto; display: block; filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3)); border-radius: 12px; object-fit: cover;" />
        </div>
        
        <p style="font-size: 18px; margin: 0 0 24px; opacity: 0.8; font-weight: 500;">${message}</p>
        
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 20px 0; padding: 16px 24px; background: rgba(255, 255, 255, 0.1); border-radius: 16px; font-size: 18px; font-weight: 600; border: 1px solid ${accent};">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${accent}" strokeWidth="2.5" style="opacity: 0.8;">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
          <span style="color: ${accent};">צאת השבת: ${displayEndTime}</span>
        </div>
        
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 32px; font-size: 15px; opacity: 0.7; font-weight: 500;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>${displayLocation}</span>
        </div>
        
        <div style="padding: 12px 20px; background: rgba(255, 255, 255, 0.05); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
          <p style="font-size: 13px; opacity: 0.6; margin: 0; font-weight: 500;">הדגמה - השכבה תיעלם בעוד 5 שניות</p>
        </div>
      </div>
    `

    document.body.appendChild(overlay)
    setTimeout(() => overlay.remove(), 5000)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">שומר שבת</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-sm text-muted-foreground">סקריפט חוסם אתר בשבת</span>
          </div>
          <div className="flex items-center gap-3">
            {userLocation && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{userLocation}</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="mr-2">{theme === "dark" ? "בהיר" : "כהה"}</span>
            </Button>
            <Badge variant="secondary">גרסה 2025</Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-balance">
                סוגרים את האתר בשבת – פותחים במוצ״ש
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                "שומר שבת" הוא סקריפט קטן ומינימליסטי שמזהה את זמן כניסת ויציאת שבת לפי מיקום המשתמש ומנהג נבחר, מציג
                שכבת כיסוי זמנית, ושומר על קדושת השבת – בלי לשבור את האתר.
              </p>
            </div>

            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <span>
                  התקנה בשורה אחת באמצעות <code className="bg-muted px-1 rounded">&lt;script src&gt;</code>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <span>בחירת שיטת מיקום: Geolocation, IP-API, שילוב או ללא</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>התאמה למנהגים: ברירת מחדל / חב״ד / ירושלים / מותאם אישית</span>
              </div>
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                <span>עיצוב אישי: צבעים, הודעות ותמונות מותאמות אישית</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={() => document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" })}
              >
                בנה תגית התקנה
              </Button>
              <Button variant="outline" size="lg" onClick={showDemo}>
                <Play className="h-4 w-4 ml-2" />
                הדגמה חיה
              </Button>
            </div>
          </div>

          <div className="relative">
            <Card className="p-6 shadow-lg">
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <img
                    src={customDesign ? customImage : "/shabbat-shalom.png"}
                    alt="שבת שלום - נרות שבת וחלה"
                    className="w-48 h-48 mx-auto rounded-lg shadow-lg object-cover"
                  />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">צאת השבת: {shabbatEndTime || "20:45"}</p>
                    <p className="text-xs text-muted-foreground">דוגמת השכבה המוצגת בזמן שבת</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Tag Builder */}
      <section id="builder" className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">בונה תגית התקנה (CDN)</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                בחר העדפות וקבל תגית <code>&lt;script&gt;</code> מוכנה להדבקה באתר שלך. כולל עיצוב אישי מלא!
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Configuration Form */}
              <Card>
                <CardHeader>
                  <CardTitle>הגדרות</CardTitle>
                  <CardDescription>התאם את הסקריפט לצרכים שלך</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>שיטת מיקום</Label>
                    <Select value={locationMode} onValueChange={setLocationMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="api">IP-API שקט (ברירת מחדל)</SelectItem>
                        <SelectItem value="prompt-then-api">Geolocation ואז נפילה ל־IP-API</SelectItem>
                        <SelectItem value="prompt-only">Geolocation בלבד</SelectItem>
                        <SelectItem value="none">ללא מיקום (לא סוגר)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {locationMode === "prompt-only" && (
                    <div className="space-y-2">
                      <Label>אם המשתמש דוחה בקשת מיקום</Label>
                      <Select value={onDeny} onValueChange={setOnDeny}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="api">להשתמש ב־IP-API</SelectItem>
                          <SelectItem value="none">לא להשתמש בכלל (לא סוגר)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>מנהג</Label>
                    <Select value={minhag} onValueChange={setMinhag}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">ברירת מחדל (≈40)</SelectItem>
                        <SelectItem value="chabad">חב״ד (≈50)</SelectItem>
                        <SelectItem value="jerusalem40">ירושלים 40</SelectItem>
                        <SelectItem value="custom">מותאם אישית</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {minhag === "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor="havdalah">דקות הבדלה</Label>
                      <Input
                        id="havdalah"
                        type="number"
                        min="0"
                        max="90"
                        value={havdalahMinutes}
                        onChange={(e) => setHavdalahMinutes(e.target.value)}
                      />
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-primary" />
                      <Label className="text-base font-semibold">עיצוב אישי (ברירת מחדל)</Label>
                    </div>

                    <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="custom-message">הודעה מותאמת</Label>
                        <Input
                          id="custom-message"
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          placeholder="האתר אינו פעיל בשבת"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="custom-image">תמונה</Label>
                        <div className="space-y-2">
                          <Select value={customImage} onValueChange={setCustomImage}>
                            <SelectTrigger>
                              <SelectValue placeholder="בחר תמונת ברירת מחדל" />
                            </SelectTrigger>
                            <SelectContent>
                              {defaultImages.map((img) => (
                                <SelectItem key={img.url} value={img.url}>
                                  {img.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const reader = new FileReader()
                                  reader.onload = (event) => {
                                    setCustomImage(event.target?.result as string)
                                  }
                                  reader.readAsDataURL(file)
                                }
                              }}
                              className="text-sm"
                            />
                            <Input
                              id="custom-image"
                              value={customImage}
                              onChange={(e) => setCustomImage(e.target.value)}
                              placeholder="או הזן כתובת תמונה מותאמת אישית"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bg-color">צבע רקע</Label>
                          <div className="flex gap-2">
                            <Input
                              id="bg-color"
                              type="color"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              placeholder="#1a1a1a"
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="text-color">צבע טקסט</Label>
                          <div className="flex gap-2">
                            <Input
                              id="text-color"
                              type="color"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              placeholder="#ffffff"
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="card-bg">רקע כרטיס</Label>
                          <div className="flex gap-2">
                            <Input
                              id="card-bg"
                              type="color"
                              value={cardBackground}
                              onChange={(e) => setCardBackground(e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={cardBackground}
                              onChange={(e) => setCardBackground(e.target.value)}
                              placeholder="#2a2a2a"
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="accent-color">צבע הדגשה</Label>
                          <div className="flex gap-2">
                            <Input
                              id="accent-color"
                              type="color"
                              value={accentColor}
                              onChange={(e) => setAccentColor(e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={accentColor}
                              onChange={(e) => setAccentColor(e.target.value)}
                              placeholder="#d4af37"
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={copyToClipboard} className="flex-1" size="lg">
                      <Copy className="h-4 w-4 ml-2" />
                      {copySuccess ? "הועתק!" : "COPY CODE"}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      <RotateCcw className="h-4 w-4 ml-2" />
                      איפוס
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Generated Tag */}
              <Card>
                <CardHeader>
                  <CardTitle>תגית להדבקה</CardTitle>
                  <CardDescription>העתק והדבק לפני סגירת &lt;/body&gt;</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto font-mono border">
                        <pre className="whitespace-pre-wrap break-all">
                          <code className="text-blue-300">
                            <span className="text-gray-500">&lt;</span>
                            <span className="text-red-400">script</span>
                            <span className="text-yellow-300"> src</span>
                            <span className="text-gray-500">=</span>
                            <span className="text-white">"{generatedTag.match(/src="([^"]*)"/)?.[1] || ""}"</span>
                            <span className="text-yellow-300"> defer</span>
                            <span className="text-gray-500">&gt;&lt;/</span>
                            <span className="text-red-400">script</span>
                            <span className="text-gray-500">&gt;</span>
                          </code>
                        </pre>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 left-2 h-8 px-3 text-xs"
                        onClick={copyToClipboard}
                      >
                        <Copy className="h-3 w-3 ml-1" />
                        {copySuccess ? "הועתק!" : "Copy code"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      העתק והדבק את הקוד לפני סגירת <code>&lt;/body&gt;</code> באתר שלך. כולל פרמטרי עיצוב אישי מלאים.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">למה בכלל לסגור אתר בשבת?</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              מטרת הסקריפט היא לאפשר לבעל האתר לשמור על אופי ותדמית המתיישבים עם קדושת השבת.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                סגירת האתר בשבת מונעת עדכונים ושינויים מצד המפעיל, ומעבירה מסר ברור של כבוד לשבת לקהילה וללקוחות.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>חשוב לציין:</strong> זהו כלי טכנולוגי בלבד. הוא אינו מחליף פסיקה הלכתית. יש להתייעץ עם סמכות
                  רבנית מקומית לשאלות מעשיות.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">שאלות נפוצות</h3>
              <div className="space-y-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">זה חוסם גם תהליכים ברקע?</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      הסקריפט מציג שכבת כיסוי בדפדפן – הוא לא מכבה שרתים ולא חוסם API. אם צריך חסימה בצד שרת, יש להוסיף
                      לוגיקה ב־backend.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">איך בוחרים מנהג נכון?</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      בחר preset מוכר (ברירת מחדל ≈40 דק׳, חב״ד ≈50, ירושלים 40), או הגדר מותאם אישית. לרגשות הלכתיות –
                      התייעצות רבנית.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">איך עובד העיצוב האישי?</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      ניתן להתאים צבעים, הודעות ותמונות. הפרמטרים מועברים ב־URL ומאפשרים התאמה מלאה למיתוג האתר שלך.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} שומר שבת – כלי קוד פתוח לשמירת קדושת השבת באתרי אינטרנט.</p>
            <div className="flex items-center gap-2">
              <span>התקנה בשורה אחת</span>
              <span>•</span>
              <span>עיצוב אישי מלא</span>
              <span>•</span>
              <span>
                פרמטרים ב־<code>script src</code> בלבד
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
