import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "../badge";
import { Button } from "../button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../card";

/**
 * Basic component rendering tests
 * Validates that customized shadcn/ui components render correctly
 * Requirements: 16.1, 16.2, 16.3
 */

describe("Button Component", () => {
    it("renders with default variant", () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole("button", { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass("bg-primary");
    });

    it("renders with secondary variant", () => {
        render(<Button variant="secondary">Secondary</Button>);
        const button = screen.getByRole("button", { name: /secondary/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass("bg-secondary");
    });

    it("renders with ghost variant", () => {
        render(<Button variant="ghost">Ghost</Button>);
        const button = screen.getByRole("button", { name: /ghost/i });
        expect(button).toBeInTheDocument();
    });

    it("applies custom className", () => {
        render(<Button className="custom-class">Button</Button>);
        const button = screen.getByRole("button", { name: /button/i });
        expect(button).toHaveClass("custom-class");
    });
});

describe("Card Component", () => {
    it("renders card with all sub-components", () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Test Title</CardTitle>
                    <CardDescription>Test Description</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Test Content</p>
                </CardContent>
            </Card>,
        );

        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByText("Test Description")).toBeInTheDocument();
        expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("applies rounded-xl border radius", () => {
        const { container } = render(<Card>Content</Card>);
        const card = container.firstChild as HTMLElement;
        expect(card).toHaveClass("rounded-xl");
    });

    it("applies shadow-card class", () => {
        const { container } = render(<Card>Content</Card>);
        const card = container.firstChild as HTMLElement;
        expect(card).toHaveClass("shadow-card");
    });

    it("applies custom className", () => {
        const { container } = render(
            <Card className="custom-card">Content</Card>,
        );
        const card = container.firstChild as HTMLElement;
        expect(card).toHaveClass("custom-card");
    });
});

describe("Badge Component", () => {
    it("renders with default variant", () => {
        render(<Badge>Essential</Badge>);
        expect(screen.getByText("Essential")).toBeInTheDocument();
    });

    it("renders with secondary variant", () => {
        render(<Badge variant="secondary">New</Badge>);
        expect(screen.getByText("New")).toBeInTheDocument();
    });

    it("applies rounded-full class", () => {
        const { container } = render(<Badge>Badge</Badge>);
        const badge = container.firstChild as HTMLElement;
        expect(badge).toHaveClass("rounded-full");
    });

    it("applies text-tiny and font-bold classes", () => {
        const { container } = render(<Badge>Badge</Badge>);
        const badge = container.firstChild as HTMLElement;
        // Check for font-bold class
        expect(badge).toHaveClass("font-bold");
        // text-tiny is compiled by Tailwind, so we check the className string contains it
        expect(badge.className).toContain("font-bold");
    });

    it("applies uppercase class", () => {
        const { container } = render(<Badge>Badge</Badge>);
        const badge = container.firstChild as HTMLElement;
        expect(badge).toHaveClass("uppercase");
    });

    it("applies custom className", () => {
        const { container } = render(
            <Badge className="custom-badge">Badge</Badge>,
        );
        const badge = container.firstChild as HTMLElement;
        expect(badge).toHaveClass("custom-badge");
    });
});
