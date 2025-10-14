'use client'

import { Button } from "@/components/ui/button"
import { Card, CardElevated, CardInteractive, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Heart, CheckCircle } from "lucide-react"

/**
 * ShadCN Test Page - Daybreak Theme
 * 
 * This page demonstrates all ShadCN components with the Daybreak golden hour theme.
 * Visit /shadcn-test to see components in action.
 */
export default function ShadCNTestPage() {
  return (
    <div className="min-h-screen bg-dawn-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-display-lg text-gradient-sunset mb-4">
            🌅 ShadCN + Daybreak Theme
          </h1>
          <p className="text-h4 text-bark-400">
            All components styled with golden hour vibes
          </p>
        </div>

        {/* Buttons Section */}
        <Card className="p-6">
          <h2 className="text-h2 text-bark-500 mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="success">
              <CheckCircle className="w-4 h-4" />
              Success
            </Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="link">Link Button</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large Button</Button>
            <Button variant="primary" size="icon">
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Cards Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Standard Card</CardTitle>
              <CardDescription>Basic card with shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body text-bark-400">
                This is a standard card component with the Daybreak theme applied.
              </p>
            </CardContent>
          </Card>

          <CardElevated className="p-6">
            <h3 className="text-h3 text-bark-500 mb-2">Elevated Card</h3>
            <p className="text-body text-bark-300">
              Has more prominent shadow for emphasis.
            </p>
          </CardElevated>

          <CardInteractive>
            <h3 className="text-h3 text-bark-500 mb-2">Interactive Card</h3>
            <p className="text-body text-bark-300">
              Lifts on hover with smooth animation.
            </p>
          </CardInteractive>
        </div>

        {/* Inputs & Forms */}
        <Card className="p-6">
          <h2 className="text-h2 text-bark-500 mb-4">Form Elements</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-body-sm font-medium text-bark-400 mb-2 block">
                Text Input
              </label>
              <Input placeholder="Enter your name..." />
            </div>
            
            <div>
              <label className="text-body-sm font-medium text-bark-400 mb-2 block">
                Select Dropdown
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="primary" className="w-full">
              Submit Form
            </Button>
          </div>
        </Card>

        {/* Badges */}
        <Card className="p-6">
          <h2 className="text-h2 text-bark-500 mb-4">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </Card>

        {/* Comparison: Old vs New */}
        <Card className="p-6 bg-gradient-to-r from-accent-gold/10 to-accent-orange/10 border-gold-300">
          <h2 className="text-h2 text-bark-500 mb-4">✅ Installation Complete!</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-gold mt-0.5" />
              <div>
                <p className="text-body font-medium text-bark-500">ShadCN components installed</p>
                <p className="text-body-sm text-bark-300">All components use Daybreak theme colors</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent-gold mt-0.5" />
              <div>
                <p className="text-body font-medium text-bark-500">Your old utility classes still work</p>
                <p className="text-body-sm text-bark-300">No breaking changes to existing pages</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-sunset-500 mt-0.5" />
              <div>
                <p className="text-body font-medium text-bark-500">Ready to use in your app</p>
                <p className="text-body-sm text-bark-300">Import from @/components/ui/[component]</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Usage Examples */}
        <Card className="p-6">
          <h2 className="text-h2 text-bark-500 mb-4">Usage Examples</h2>
          <div className="space-y-4">
            <div className="bg-dawn-100 p-4 rounded-warm-lg border border-border-light">
              <p className="text-caption text-bark-400 mb-2">Import components:</p>
              <code className="text-body-sm text-bark-500 font-mono">
                import &#123; Button &#125; from "@/components/ui/button"
              </code>
            </div>
            <div className="bg-dawn-100 p-4 rounded-warm-lg border border-border-light">
              <p className="text-caption text-bark-400 mb-2">Use in your JSX:</p>
              <code className="text-body-sm text-bark-500 font-mono">
                &lt;Button variant="primary"&gt;Click Me&lt;/Button&gt;
              </code>
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}

