import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  GitBranch,
  Github,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Users,
  Calendar,
  Activity,
} from "lucide-react"

export default function Component() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Sarah Chen" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Sarah Chen</h2>
            <p className="text-sm text-muted-foreground">Senior DevOps Engineer</p>
            <div className="flex items-center justify-center text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 mr-1" />
              San Francisco, CA
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Contact</h3>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="w-4 h-4 mr-2" />
              sarah.chen@company.com
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="w-4 h-4 mr-2" />
              +1 (555) 123-4567
            </div>
          </div>
        </div>

        <Separator />

        {/* Team Information */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Team</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <Users className="w-4 h-4 mr-2 text-muted-foreground" />
              Platform Engineering
            </div>
            <Badge variant="secondary" className="text-xs">
              Team Lead
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Skills */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Skills</h3>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              Kubernetes
            </Badge>
            <Badge variant="outline" className="text-xs">
              Docker
            </Badge>
            <Badge variant="outline" className="text-xs">
              AWS
            </Badge>
            <Badge variant="outline" className="text-xs">
              Terraform
            </Badge>
            <Badge variant="outline" className="text-xs">
              Jenkins
            </Badge>
            <Badge variant="outline" className="text-xs">
              Python
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Activity Stats */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Activity</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <GitBranch className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Deployments:</span>
              <span className="ml-1 font-medium">47</span>
            </div>
            <div className="flex items-center">
              <Activity className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Uptime:</span>
              <span className="ml-1 font-medium">99.9%</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Reviews:</span>
              <span className="ml-1 font-medium">23</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Joined:</span>
              <span className="ml-1 font-medium">2022</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button variant="outline" size="sm">
            <Github className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Linkedin className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
