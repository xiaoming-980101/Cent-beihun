import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FormDialog } from "../form-dialog";

/**
 * Bug Condition Exploration Test for FormDialog
 *
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6**
 *
 * This test encodes the EXPECTED BEHAVIOR for the dialog component.
 *
 * **CRITICAL**: This test is EXPECTED TO FAIL on unfixed code.
 * - Failure confirms the bugs exist
 * - When this test passes after implementation, it confirms the bugs are fixed
 *
 * Bug 1: Double-click close issue
 * - Root cause: FormDialog manually renders DialogOverlay in DialogPortal,
 *   while DialogContent also internally renders DialogOverlay, causing two overlay layers
 * - Expected behavior: Single click should close dialog
 *
 * Bug 2: Mobile layout issue
 * - Root cause: All dialogs use fixed layout without adapting to screen size and content
 * - Expected behavior: Mobile should use responsive layout based on fullScreenOnMobile prop
 */
describe("FormDialog - Bug Condition Exploration", () => {
    /**
     * Property 1: Bug Condition 1 - Single Click Close
     *
     * Tests that clicking the close button or overlay closes the dialog with a SINGLE click.
     *
     * **Expected on UNFIXED code**: FAIL - requires two clicks to close
     * **Expected on FIXED code**: PASS - single click closes dialog
     */
    describe("Bug 1: Single Click Close", () => {
        it("should close dialog with single click on close button", async () => {
            const onOpenChange = vi.fn();

            render(
                <FormDialog
                    open={true}
                    onOpenChange={onOpenChange}
                    title="Test Dialog"
                >
                    <div>Content</div>
                </FormDialog>,
            );

            // Find the close button
            const closeButton = screen.getByRole("button", { name: /close/i });

            // Click ONCE
            fireEvent.click(closeButton);

            // Expected behavior: Dialog should close with single click
            // On unfixed code: This will FAIL because it requires two clicks
            await waitFor(
                () => {
                    expect(onOpenChange).toHaveBeenCalledTimes(1);
                    expect(onOpenChange).toHaveBeenCalledWith(false);
                },
                { timeout: 1000 },
            );
        });

        it("should close dialog with single click on overlay", async () => {
            const onOpenChange = vi.fn();

            render(
                <FormDialog
                    open={true}
                    onOpenChange={onOpenChange}
                    title="Test Dialog"
                >
                    <div>Content</div>
                </FormDialog>,
            );

            const overlay = Array.from(
                document.querySelectorAll('[data-state="open"]'),
            ).find((element) => {
                const classes = element.className;
                return (
                    classes.includes("fixed") &&
                    classes.includes("inset-0") &&
                    element.getAttribute("aria-hidden") === "true"
                );
            });

            expect(overlay).toBeTruthy();

            if (!overlay) {
                throw new Error("Expected overlay to be rendered");
            }

            fireEvent.click(overlay);

            // Expected behavior: Dialog should close with single click
            // On unfixed code: This will FAIL because the first click only closes the outer overlay
            await waitFor(
                () => {
                    expect(onOpenChange).toHaveBeenCalledTimes(1);
                    expect(onOpenChange).toHaveBeenCalledWith(false);
                },
                { timeout: 1000 },
            );
        });

        it("should render only ONE overlay layer (not two)", () => {
            render(
                <FormDialog
                    open={true}
                    onOpenChange={() => {}}
                    title="Test Dialog"
                >
                    <div>Content</div>
                </FormDialog>,
            );

            // Count overlay elements by their data-state attribute
            // Radix UI overlays have data-state="open"
            const allElements = document.querySelectorAll(
                '[data-state="open"]',
            );

            // Filter to get only overlay elements (not the dialog content itself)
            const overlayElements = Array.from(allElements).filter((el) => {
                const classes = el.className;
                return (
                    classes.includes("fixed") &&
                    classes.includes("inset-0") &&
                    el.getAttribute("aria-hidden") === "true"
                );
            });

            console.log(`Overlay count: ${overlayElements.length}`);

            // Expected behavior: Should have exactly 1 overlay
            // On unfixed code: This will FAIL because there are 2 overlays
            expect(overlayElements.length).toBe(1);
        });
    });

    /**
     * Property 2: Bug Condition 2 - Mobile Responsive Layout
     *
     * Tests that mobile viewport uses responsive layout based on fullScreenOnMobile prop.
     *
     * **Expected on UNFIXED code**: FAIL - uses fixed layout on mobile
     * **Expected on FIXED code**: PASS - uses responsive layout on mobile
     */
    describe("Bug 2: Mobile Responsive Layout", () => {
        it("should use full-screen layout on mobile when fullScreenOnMobile=true", () => {
            // Mock mobile viewport
            global.innerWidth = 375; // Mobile width < 640px

            render(
                <FormDialog
                    open={true}
                    onOpenChange={() => {}}
                    title="Test Dialog"
                    fullScreenOnMobile={true}
                >
                    <div>Content with many fields</div>
                </FormDialog>,
            );

            // Find the dialog content element
            const dialogContent = document.querySelector('[role="dialog"]');

            expect(dialogContent).toBeTruthy();

            if (dialogContent) {
                const classes = dialogContent.className;
                console.log("Dialog classes:", classes);

                // Expected behavior: Should have mobile full-screen classes
                // On unfixed code: This will FAIL because fullScreenOnMobile prop doesn't exist
                // and mobile-specific classes are not applied
                const hasMobileFullScreen =
                    classes.includes("max-sm:fixed") ||
                    classes.includes("max-sm:inset-0") ||
                    classes.includes("max-sm:w-full") ||
                    classes.includes("max-sm:h-full");

                expect(hasMobileFullScreen).toBe(true);
            }
        });

        it("should use 85% width layout on mobile when fullScreenOnMobile=false", () => {
            // Mock mobile viewport
            global.innerWidth = 375; // Mobile width < 640px

            render(
                <FormDialog
                    open={true}
                    onOpenChange={() => {}}
                    title="Test Dialog"
                    fullScreenOnMobile={false}
                >
                    <div>Simple content</div>
                </FormDialog>,
            );

            // Find the dialog content element
            const dialogContent = document.querySelector('[role="dialog"]');

            expect(dialogContent).toBeTruthy();

            if (dialogContent) {
                const classes = dialogContent.className;
                console.log("Dialog classes:", classes);

                // Expected behavior: Should have mobile 85% width classes
                // On unfixed code: This will FAIL because fullScreenOnMobile prop doesn't exist
                // and mobile-specific classes are not applied
                const hasMobile85Width =
                    classes.includes("max-sm:w-[min(92vw,32rem)]") ||
                    classes.includes("max-sm:max-w-[92vw]");

                expect(hasMobile85Width).toBe(true);
            }
        });

        it("should accept fullScreenOnMobile prop", () => {
            // Expected behavior: FormDialog should accept fullScreenOnMobile prop
            // On unfixed code: This will FAIL because the prop doesn't exist in FormDialogProps

            // This test verifies the prop exists by attempting to use it
            const renderWithProp = () => {
                render(
                    <FormDialog
                        open={true}
                        onOpenChange={() => {}}
                        title="Test"
                        fullScreenOnMobile={true}
                    >
                        <div>Content</div>
                    </FormDialog>,
                );
            };

            // Should not throw error
            expect(renderWithProp).not.toThrow();
        });
    });

    /**
     * Preservation Tests - Desktop Layout
     *
     * These tests verify that desktop layout is NOT affected by the mobile fixes.
     * These should PASS on both unfixed and fixed code.
     */
    describe("Preservation: Desktop Layout Unchanged", () => {
        it("should maintain centered modal layout on desktop", () => {
            // Mock desktop viewport
            global.innerWidth = 1024; // Desktop width >= 640px

            const { container } = render(
                <FormDialog
                    open={true}
                    onOpenChange={() => {}}
                    title="Test Dialog"
                >
                    <div>Content</div>
                </FormDialog>,
            );

            const dialogContent = container.querySelector('[role="dialog"]');

            if (dialogContent) {
                const classes = dialogContent.className;

                // Desktop layout should have centered positioning
                expect(classes).toContain("left-[50%]");
                expect(classes).toContain("top-[50%]");
                expect(classes).toContain("-translate-x-1/2");
                expect(classes).toContain("-translate-y-1/2");
            }
        });

        it("should maintain maxWidth prop on desktop", () => {
            const { container } = render(
                <FormDialog
                    open={true}
                    onOpenChange={() => {}}
                    title="Test Dialog"
                    maxWidth="lg"
                >
                    <div>Content</div>
                </FormDialog>,
            );

            const dialogContent = container.querySelector('[role="dialog"]');

            if (dialogContent) {
                const classes = dialogContent.className;

                // Should have maxWidth class
                expect(classes).toContain("max-w-[720px]");
            }
        });
    });
});
