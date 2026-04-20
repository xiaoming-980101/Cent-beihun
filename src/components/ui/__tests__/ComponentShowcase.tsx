/**
 * Component Showcase
 *
 * This file demonstrates the customized shadcn/ui components
 * with Figma design specifications applied.
 *
 * To view: Import this component in a page and render it
 */

import { Badge } from "../badge";
import { Button } from "../button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../card";

export function ComponentShowcase() {
    return (
        <div className="p-8 space-y-8 bg-background min-h-screen">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-h2 font-bold text-text-primary mb-2">
                        Customized shadcn/ui Components
                    </h1>
                    <p className="text-body text-text-secondary">
                        Components customized according to Figma design
                        specifications
                    </p>
                </div>

                {/* Button Showcase */}
                <Card>
                    <CardHeader>
                        <CardTitle>Button Component</CardTitle>
                        <CardDescription>
                            Customized with design system colors and proper
                            theme support
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-4">
                            <Button>Primary Button</Button>
                            <Button variant="secondary">
                                Secondary Button
                            </Button>
                            <Button variant="outline">Outline Button</Button>
                            <Button variant="ghost">Ghost Button</Button>
                            <Button variant="link">Link Button</Button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Button size="sm">Small Button</Button>
                            <Button size="default">Default Button</Button>
                            <Button size="lg">Large Button</Button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Button disabled>Disabled Button</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Card Showcase */}
                <Card>
                    <CardHeader>
                        <CardTitle>Card Component</CardTitle>
                        <CardDescription>
                            12px border radius, 20px padding, custom shadow
                            effect
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle>Feature Card</CardTitle>
                                    <CardDescription>
                                        This card has hover shadow effect
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-body text-text-primary">
                                        Card content with proper padding and
                                        spacing
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button size="sm">Action</Button>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Simple Card</CardTitle>
                                    <CardDescription>
                                        Basic card without footer
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-body text-text-primary">
                                        Minimal card design with clean layout
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                {/* Badge Showcase */}
                <Card>
                    <CardHeader>
                        <CardTitle>Badge Component</CardTitle>
                        <CardDescription>
                            Fully rounded, 10px font size, bold uppercase text
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Badge>Essential</Badge>
                            <Badge variant="secondary">New</Badge>
                            <Badge variant="outline">Draft</Badge>
                            <Badge variant="destructive">Urgent</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge>High Priority</Badge>
                            <Badge variant="secondary">Medium</Badge>
                            <Badge variant="outline">Low</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Theme Support Demo */}
                <Card>
                    <CardHeader>
                        <CardTitle>Theme Support</CardTitle>
                        <CardDescription>
                            All components support light and dark themes
                            automatically
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-body text-text-primary mb-4">
                            Toggle the theme using the theme switcher to see how
                            components adapt. All colors are defined using CSS
                            variables that change based on the theme.
                        </p>
                        <div className="space-y-2 text-caption text-text-secondary">
                            <p>✅ Background colors adapt to theme</p>
                            <p>✅ Text colors maintain proper contrast</p>
                            <p>✅ Border colors adjust automatically</p>
                            <p>✅ Shadow effects work in both themes</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
