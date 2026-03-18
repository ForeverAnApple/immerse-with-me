import { useMemo, useState } from "react"
import { Clipboard } from "lucide-react"
import toast from "react-hot-toast"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { generateLoremIpsum, type GenerationMode } from "@/lib/lorem-ipsum"

const clampCount = (value: number) => Math.min(50, Math.max(1, value))

const modeLabels: Record<GenerationMode, string> = {
  paragraphs: "Paragraphs",
  sentences: "Sentences",
  words: "Words",
}

export default function LoremIpsumPage() {
  const [mode, setMode] = useState<GenerationMode>("paragraphs")
  const [count, setCount] = useState(3)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [includeHtmlTags, setIncludeHtmlTags] = useState(false)
  const [seed, setSeed] = useState(0)

  const generatedText = useMemo(
    () =>
      generateLoremIpsum({
        mode,
        count,
        startWithLorem,
        includeHtmlTags,
      }),
    [mode, count, startWithLorem, includeHtmlTags, seed]
  )

  const wordCount = useMemo(() => {
    const plainText = includeHtmlTags
      ? generatedText.replace(/<[^>]*>/g, " ")
      : generatedText
    const trimmed = plainText.trim()
    if (!trimmed) return 0
    return trimmed.split(/\s+/).filter(Boolean).length
  }, [generatedText, includeHtmlTags])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedText)
      toast.success("Copied to clipboard!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Copy failed")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Lorem Ipsum Generator
          </h1>
          <p className="text-sm text-gray-600">
            Craft placeholder copy with precision. Adjust the structure, tone,
            and format to match your layout in seconds.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
          <Card className="border-gray-200">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg">Controls</CardTitle>
              <CardDescription>
                Fine-tune the structure of your placeholder text.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs
                value={mode}
                onValueChange={(value) =>
                  setMode(value as GenerationMode)
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="paragraphs">Paragraphs</TabsTrigger>
                  <TabsTrigger value="sentences">Sentences</TabsTrigger>
                  <TabsTrigger value="words">Words</TabsTrigger>
                </TabsList>
                <TabsContent value={mode} className="mt-6 space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Number of {modeLabels[mode]}
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        min={1}
                        max={50}
                        step={1}
                        value={[count]}
                        onValueChange={(value) =>
                          setCount(clampCount(value[0] ?? 1))
                        }
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min={1}
                        max={50}
                        value={count}
                        onChange={(event) => {
                          const next = clampCount(
                            Number(event.target.value || 1)
                          )
                          setCount(next)
                        }}
                        className="w-20"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="start-lorem" className="text-sm">
                      Start with Lorem ipsum
                    </Label>
                    <p className="text-xs text-gray-500">
                      Begin the output with the classic opening line.
                    </p>
                  </div>
                  <Switch
                    id="start-lorem"
                    checked={startWithLorem}
                    onCheckedChange={setStartWithLorem}
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="include-html" className="text-sm">
                      Include HTML tags
                    </Label>
                    <p className="text-xs text-gray-500">
                      Output paragraphs wrapped in HTML tags.
                    </p>
                  </div>
                  <Switch
                    id="include-html"
                    checked={includeHtmlTags}
                    onCheckedChange={setIncludeHtmlTags}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => setSeed((current) => current + 1)}
              >
                Generate
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">Output</CardTitle>
                  <CardDescription>Preview and copy your text.</CardDescription>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                  onClick={handleCopy}
                >
                  <Clipboard className="h-4 w-4" />
                  Copy to clipboard
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Badge variant="secondary">{wordCount} words</Badge>
                {includeHtmlTags && (
                  <span className="text-[11px] uppercase tracking-wide text-gray-400">
                    Raw HTML
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-[500px] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {generatedText}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
