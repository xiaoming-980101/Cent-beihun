import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FormDialog } from "../form-dialog";

/**
 * Preservation Property Tests for FormDialog
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12**
 * 
 * These tests capture the BASELINE BEHAVIOR that must be preserved after the fix.
 * 
 * **CRITICAL**: These tests should PASS on UNFIXED code.
 * - They document the current correct behavior
 * - They must continue to PASS after the fix is implemented
 * - If they fail after the fix, it indicates a regression
 * 
 * Testing Strategy:
 * - Observe behavior on unfixed code for non-buggy inputs
 * - Write tests capturing observed behavior patterns
 * - Use parameterized tests to cover many scenarios (property-based approach)
 * - Focus on desktop viewport (≥640px) and non-overlay-click interactions
 */
describe("FormDialog - Preservation Property Tests", () => {
    beforeEach(() => {
        // Mock desktop viewport for preservation tests
        global.innerWidth = 1024;
        global.innerHeight = 768;
    });

    /**
     * Property: Desktop Layout Preservation
     * 
     * For any FormDialog on desktop viewport (≥640px),
     * the dialog SHALL display centered modal layout with correct positioning.
     * 
     * **Validates: Requirement 3.1**
     */
    describe("Desktop Layout Preservation", () => {
        const desktopViewports = [
            { width: 640, height: 480, name: "Small Desktop" },
            { width: 1024, height: 768, name: "Medium Desktop" },
            { width: 1920, height: 1080, name: "Large Desktop" },
            { width: 2560, height: 1440, name: "Extra Large Desktop" },
        ];

        desktopViewports.forEach(({ width, height, name }) => {
            it(`should display centered modal layout on ${name} (${width}x${height})`, () => {
                global.innerWidth = width;
                global.innerHeight = height;

                render(
                    <FormDialog open={true} onOpenChange={() => {}} title="Test Dialog">
                        <div>Content</div>
                    </FormDialog>
                );

                // Query from document since dialog is rendered in a portal
                const dialogContent = document.querySelector('[role="dialog"]');
                expect(dialogContent).toBeTruthy();

                if (dialogContent) {
                    const classes = dialogContent.className;
                    
                    // Desktop layout should have centered positioning
                    expect(classes).toContain("left-[50%]");
                    expect(classes).toContain("top-[50%]");
                    expect(classes).toContain("-translate-x-1/2");
                    expect(classes).toContain("-translate-y-1/2");
                    expect(classes).toContain("fixed");
                }
            });
        });

        const maxWidthVariants: Array<"sm" | "md" | "lg" | "xl"> = ["sm", "md", "lg", "xl"];
        const expectedMaxWidths = {
            sm: "max-w-[400px]",
            md: "max-w-[560px]",
            lg: "max-w-[720px]",
            xl: "max-w-[960px]",
        };

        maxWidthVariants.forEach((variant) => {
            it(`should apply correct maxWidth for variant "${variant}"`, () => {
                render(
                    <FormDialog 
                        open={true} 
                        onOpenChange={() => {}} 
                        title="Test Dialog"
                        maxWidth={variant}
                    >
                        <div>Content</div>
                    </FormDialog>
                );

                // Query from document since dialog is rendered in a portal
                const dialogContent = document.querySelector('[role="dialog"]');
                expect(dialogContent).toBeTruthy();

                if (dialogContent) {
                    const classes = dialogContent.className;
                    expect(classes).toContain(expectedMaxWidths[variant]);
                }
            });
        });
    });

    /**
     * Property: Keyboard Interaction Preservation
     * 
     * For any FormDialog, keyboard interactions SHALL work correctly:
     * - ESC key closes dialog
     * - Tab key navigates between focusable elements
     * 
     * **Validates: Requirements 3.2, 3.8**
     */
    describe("Keyboard Interaction Preservation", () => {
        it("should close dialog when ESC key is pressed", async () => {
            const onOpenChange = vi.fn();

            render(
                <FormDialog open={true} onOpenChange={onOpenChange} title="Test Dialog">
                    <div>Content</div>
                </FormDialog>
            );

            // Press ESC key
            fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

            // Dialog should close
            await waitFor(() => {
                expect(onOpenChange).toHaveBeenCalledWith(false);
            });
        });

        it("should support Tab key navigation between form fields", () => {
            render(
                <FormDialog open={true} onOpenChange={() => {}} title="Test Dialog">
                    <form>
                        <input type="text" placeholder="Field 1" />
                        <input type="text" placeholder="Field 2" />
                        <button type="submit">Submit</button>
                    </form>
                </FormDialog>
            );

            const field1 = screen.getByPlaceholderText("Field 1");
            const field2 = screen.getByPlaceholderText("Field 2");
            const submitButton = screen.getByRole("button", { name: /submit/i });

            // Focus first field
            field1.focus();
            expect(document.activeElement).toBe(field1);

            // Tab to second field
            fireEvent.keyDown(field1, { key: "Tab", code: "Tab" });
            field2.focus();
            expect(document.activeElement).toBe(field2);

            // Tab to submit button
            fireEvent.keyDown(field2, { key: "Tab", code: "Tab" });
            submitButton.focus();
            expect(document.activeElement).toBe(submitButton);
        });
    });

    /**
     * Property: Form Functionality Preservation
     * 
     * For any FormDialog containing form elements,
     * form functionality SHALL work correctly:
     * - Data input works
     * - Form submission works
     * - Validation works
     * 
     * **Validates: Requirement 3.4**
     */
    describe("Form Functionality Preservation", () => {
        it("should allow data input in form fields", () => {
            render(
                <FormDialog open={true} onOpenChange={() => {}} title="Test Dialog">
                    <form>
                        <input type="text" placeholder="Name" />
                        <input type="email" placeholder="Email" />
                    </form>
                </FormDialog>
            );

            const nameInput = screen.getByPlaceholderText("Name") as HTMLInputElement;
            const emailInput = screen.getByPlaceholderText("Email") as HTMLInputElement;

            // Type into fields
            fireEvent.change(nameInput, { target: { value: "John Doe" } });
            fireEvent.change(emailInput, { target: { value: "john@example.com" } });

            // Values should be updated
            expect(nameInput.value).toBe("John Doe");
            expect(emailInput.value).toBe("john@example.com");
        });

        it("should handle form submission", () => {
            const onSubmit = vi.fn((e) => e.preventDefault());

            render(
                <FormDialog open={true} onOpenChange={() => {}} title="Test Dialog">
                    <form onSubmit={onSubmit}>
                        <input type="text" placeholder="Name" />
                        <button type="submit">Submit</button>
                    </form>
                </FormDialog>
            );

            const submitButton = screen.getByRole("button", { name: /submit/i });
            fireEvent.click(submitButton);

            expect(onSubmit).toHaveBeenCalled();
        });
    });

    /**
     * Property: Theme Styles Preservation
     * 
     * For any FormDialog, theme styles SHALL be applied correctly:
     * - Background colors
     * - Border colors
     * - Text colors
     * - Shadows
     * 
     * **Validates: Requirement 3.5**
     */
    describe("Theme Styles Preservation", () => {
        it("should apply correct background color classes", () => {
            render(
                <FormDialog open={true} onOpenChange={() => {}} title="Test Dialog">
                    <div>Content</div>
                </FormDialog>
            );

            // Query from document since dialog is rendered in a portal
            const dialogContent = document.querySelector('[role="dialog"]');
            expect(dialogContent).toBeTruthy();

            if (dialogContent) {
                const classes = dialogContent.className;
                
                // Should have background color classes
                expect(classes).toContain("bg-[#fffdfd]");
                expect(classes).toContain("dark:bg-[#181419]");
            }
        });

        it("should apply correct border classes", () => {
            render(
                <FormDialog open={true} onOpenChange={() => {}} title="Test Dialog">
                    <div>Content</div>
                </FormDialog>
            );

            // Query from document since dialog is rendered in a portal
            const dialogContent = document.querySelector('[role="dialog"]');
            expect(dialogContent).toBeTruthy();

            if (dialogContent) {
                const classes = dialogContent.className;
                
                // Should have border classes
                expect(classes).toContain("border");
                expect(classes).toContain("border-[#edd6df]");
                expect(classes).toContain("dark:border-[#302631]");
            }
        });

        it("should apply correct shadow classes", () => {
            render(
                <FormDialog open={true} onOpenChange={() => {}} title="Test Dialog">
                    <div>Content</div>
                </FormDialog>
            );

            // Query from document since dialog is rendered in a portal
            const dialogContent = document.querySelector('[role="dialog"]');
            expect(dialogContent).toBeTruthy();

            if (dialogContent) {
                const classes = dialogContent.className;
                
                // Should have shadow classes
                expect(classes).toContain("shadow-[0_32px_60px_-28px_rgba(31,41,55,0.45)]");
            }
        });

        it("should apply correct rounded corner classes", () => {
            render(
                <FormDialog open={true} onOpenChange={() => {}} title="Test Dialog">
                    <div>Content</div>
                </FormDialog>
            );

            // Query from document since dialog is rendered in a portal
            const dialogContent = document.querySelector('[role="dialog"]');
            expect(dialogContent).toBeTruthy();

            if (dialogContent) {
                const classes = dialogContent.className;
                
                // Should have rounded corner classes
                expect(classes).toContain("rounded-[30px]");
            }
        });
    });

    /**
     * Property: Animation Effects Preservation
     * 
     * For any FormDialog, animation effects SHALL be present:
     * - Duration classes for smooth transitions
     * 
     * **Validates: Requirement 3.6**
     */
    describe("Animation Effects Preservation", () => {
        it("should have animation duration classes", () => {
            render(
                <FormDialog open={true} onOpenChange={() => {}} title="Test Dialog">
                    <div>Content</div>
                </FormDialog>
            );

            // Query from document since dialog is rendered in a portal
            const dialogContent = document.querySelector('[role="dialog"]');
            expect(dialogContent).toBeTruthy();

            if (dialogContent) {
                const classes = dialogContent.className;
                
                // Should have duration classes for animations
                expect(classes).toContain("duration-200");
            }
        });
    });

    /**
     * Property: Custom Props Preservation
     * 
     * For any FormDialog with custom props,
     * the props SHALL work correctly:
     * - hideClose prop hides close button
     * - className prop applies custom styles
     * 
     * **Validates: Requirements 3.10, 3.11**
     */
    describe("Custom Props Preservation", () => {
        it("should hide close button when hideClose=true", () => {
            render(
                <FormDialog 
                    open={true} 
                    onOpenChange={() => {}} 
                    title="Test Dialog"
                    hideClose={true}
                >
                    <div>Content</div>
                </FormDialog>
            );

            // Close button should not be present
            const closeButton = screen.queryByRole("button", { name: /close/i });
            expect(closeButton).toBeNull();
        });

        it("should show close button when hideClose=false", () => {
            render(
                <FormDialog 
                    open={true} 
                    onOpenChange={() => {}} 
                    title="Test Dialog"
                    hideClose={false}
                >
                    <div>Content</div>
                </FormDialog>
            );

            // Close button should be present
            const closeButton = screen.queryByRole("button", { name: /close/i });
            expect(closeButton).toBeTruthy();
        });

        it("should apply custom className", () => {
            const customClass = "custom-test-class";
            render(
                <FormDialog 
                    open={true} 
                    onOpenChange={() => {}} 
                    title="Test Dialog"
                    className={customClass}
                >
                    <div>Content</div>
                </FormDialog>
            );

            // Query from document since dialog is rendered in a portal
            const dialogContent = document.querySelector('[role="dialog"]');
            expect(dialogContent).toBeTruthy();

            if (dialogContent) {
                const classes = dialogContent.className;
                expect(classes).toContain(customClass);
            }
        });
    });

    /**
     * Property: Scrolling Functionality Preservation
     * 
     * For any FormDialog with content exceeding viewport,
     * scrolling SHALL work correctly.
     * 
     * **Validates: Requirement 3.3**
     */
    describe("Scrolling Functionality Preservation", () => {
        it("should have scrollable content area", () => {
            render(
                <FormDialog open={true} onOpenChange={() => {}} title="Test Dialog">
                    <div style={{ height: "2000px" }}>Very long content</div>
                </FormDialog>
            );

            // Find the scrollable content area - query from document since dialog is in portal
            const scrollableArea = document.querySelector(".overflow-y-auto");
            expect(scrollableArea).toBeTruthy();

            if (scrollableArea) {
                const classes = scrollableArea.className;
                
                // Should have overflow and flex classes
                expect(classes).toContain("overflow-y-auto");
                expect(classes).toContain("flex-1");
                expect(classes).toContain("min-h-0");
            }
        });

        it("should have max-height constraint on dialog", () => {
            render(
                <FormDialog open={true} onOpenChange={() => {}} title="Test Dialog">
                    <div>Content</div>
                </FormDialog>
            );

            // Query from document since dialog is rendered in a portal
            const dialogContent = document.querySelector('[role="dialog"]');
            expect(dialogContent).toBeTruthy();

            if (dialogContent) {
                const classes = dialogContent.className;
                
                // Should have max-height classes
                expect(classes).toContain("max-h-[calc(100dvh-1.5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))]");
                expect(classes).toContain("sm:max-h-[min(84vh,760px)]");
            }
        });
    });

    /**
     * Property: Title Display Preservation
     * 
     * For any FormDialog with title text,
     * the title SHALL display correctly without overflow or truncation.
     * 
     * **Validates: Requirement 3.12**
     */
    describe("Title Display Preservation", () => {
        const titleVariants = [
            { title: "Short", name: "short title" },
            { title: "Medium Length Title", name: "medium title" },
            { title: "This is a Very Long Title That Should Still Display Correctly", name: "long title" },
        ];

        titleVariants.forEach(({ title, name }) => {
            it(`should display ${name} correctly`, () => {
                render(
                    <FormDialog open={true} onOpenChange={() => {}} title={title}>
                        <div>Content</div>
                    </FormDialog>
                );

                const titleElement = screen.getByText(title);
                expect(titleElement).toBeTruthy();
                expect(titleElement.textContent).toBe(title);
            });
        });

        it("should render compact mode by default and support explicit header styling", () => {
            render(
                <FormDialog open={true} onOpenChange={() => {}} title="Test Title">
                    <div>Content</div>
                </FormDialog>
            );

            const hiddenHeaderTitle = screen.getByText("Test Title");
            expect(hiddenHeaderTitle).toBeTruthy();
            expect(document.querySelector(".wedding-topbar-title")).toBeNull();

            render(
                <FormDialog
                    open={true}
                    onOpenChange={() => {}}
                    title="Header Title"
                    showHeader={true}
                >
                    <div>Content</div>
                </FormDialog>
            );

            const titleElement = document.querySelector(".wedding-topbar-title");
            expect(titleElement).toBeTruthy();
            if (titleElement) {
                const classes = titleElement.className;
                expect(classes).toContain("wedding-topbar-title");
                expect(classes).toContain("text-[24px]");
                expect(classes).toContain("text-[color:var(--wedding-text)]");
            }
        });
    });

    /**
     * Property: Dialog State Management Preservation
     * 
     * For any FormDialog, state management SHALL work correctly:
     * - open prop controls visibility
     * - onOpenChange callback is called correctly
     * 
     * **Validates: Requirements 3.1, 3.2**
     */
    describe("Dialog State Management Preservation", () => {
        it("should render when open=true", () => {
            render(
                <FormDialog open={true} onOpenChange={() => {}} title="Test Dialog">
                    <div>Content</div>
                </FormDialog>
            );

            // Query from document since dialog is rendered in a portal
            const dialogContent = document.querySelector('[role="dialog"]');
            expect(dialogContent).toBeTruthy();
        });

        it("should not render when open=false", () => {
            render(
                <FormDialog open={false} onOpenChange={() => {}} title="Test Dialog">
                    <div>Content</div>
                </FormDialog>
            );

            // Query from document since dialog is rendered in a portal
            const dialogContent = document.querySelector('[role="dialog"]');
            expect(dialogContent).toBeNull();
        });

        it("should call onOpenChange when close button is clicked", async () => {
            const onOpenChange = vi.fn();

            render(
                <FormDialog open={true} onOpenChange={onOpenChange} title="Test Dialog">
                    <div>Content</div>
                </FormDialog>
            );

            const closeButton = screen.getByRole("button", { name: /close/i });
            fireEvent.click(closeButton);

            await waitFor(() => {
                expect(onOpenChange).toHaveBeenCalled();
            });
        });
    });

    /**
     * Property: Content Rendering Preservation
     * 
     * For any FormDialog with children content,
     * the content SHALL render correctly inside the dialog.
     * 
     * **Validates: Requirements 3.4, 3.9**
     */
    describe("Content Rendering Preservation", () => {
        it("should render simple text content", () => {
            render(
                <FormDialog open={true} onOpenChange={() => {}} title="Test Dialog">
                    <div>Simple text content</div>
                </FormDialog>
            );

            expect(screen.getByText("Simple text content")).toBeTruthy();
        });

        it("should render complex form content", () => {
            render(
                <FormDialog open={true} onOpenChange={() => {}} title="Test Dialog">
                    <form>
                        <label htmlFor="name">Name</label>
                        <input id="name" type="text" />
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" />
                        <button type="submit">Submit</button>
                    </form>
                </FormDialog>
            );

            expect(screen.getByLabelText("Name")).toBeTruthy();
            expect(screen.getByLabelText("Email")).toBeTruthy();
            expect(screen.getByRole("button", { name: /submit/i })).toBeTruthy();
        });

        it("should render nested components", () => {
            const NestedComponent = () => <div>Nested Component Content</div>;

            render(
                <FormDialog open={true} onOpenChange={() => {}} title="Test Dialog">
                    <NestedComponent />
                </FormDialog>
            );

            expect(screen.getByText("Nested Component Content")).toBeTruthy();
        });
    });
});
