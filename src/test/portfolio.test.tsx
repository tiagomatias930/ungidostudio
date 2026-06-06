import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import fs from "fs";
import path from "path";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import Index from "../pages/Index";
import Portfolio from "../pages/Portfolio";

describe("Ungido Studio - Portfolio Page and Navigation Tests", () => {
  beforeAll(() => {
    window.scrollTo = vi.fn();
  });

  it("should verify that the new Catoca image assets exist in the public directory", () => {
    const catoca1Path = path.resolve(__dirname, "../../public/ungido/catoca1.jpg");
    const catoca2Path = path.resolve(__dirname, "../../public/ungido/catoca2.jpg");
    const catoca3Path = path.resolve(__dirname, "../../public/ungido/catoca3.jpg");

    expect(fs.existsSync(catoca1Path)).toBe(true);
    expect(fs.existsSync(catoca2Path)).toBe(true);
    expect(fs.existsSync(catoca3Path)).toBe(true);
  });

  it("should render the Index component and verify the 'Ver mais' button links to /portfolio", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    const verMaisButton = screen.getByText("Ver mais");
    expect(verMaisButton).toBeInTheDocument();
    expect(verMaisButton.closest("a")?.getAttribute("href")).toBe("/portfolio");
  });

  it("should render the Portfolio page and display all portfolio works including Unitel", () => {
    render(
      <MemoryRouter>
        <Portfolio />
      </MemoryRouter>
    );

    // Verify Title
    expect(screen.getByRole("heading", { name: "Nosso Portfólio", level: 1 })).toBeInTheDocument();

    // Verify all portfolio items are rendered by checking alt texts / titles
    expect(screen.getByText("Captação aérea")).toBeInTheDocument();
    expect(screen.getByText("Cenário editorial")).toBeInTheDocument();
    expect(screen.getByText("Produção de estúdio")).toBeInTheDocument();
    expect(screen.getByText("Cobertura documental")).toBeInTheDocument();
    expect(screen.getByText("Mineração Catoca I")).toBeInTheDocument();
    expect(screen.getByText("Mineração Catoca II")).toBeInTheDocument();
    expect(screen.getByText("Mineração Catoca III")).toBeInTheDocument();
    expect(screen.getByText("Unitel I")).toBeInTheDocument();
    expect(screen.getByText("Unitel VII")).toBeInTheDocument();
  });

  it("should filter portfolio items when clicking on category tabs", () => {
    render(
      <MemoryRouter>
        <Portfolio />
      </MemoryRouter>
    );

    // Initial state: all 7 items shown
    expect(screen.getByText("Mineração Catoca I")).toBeInTheDocument();
    expect(screen.getByText("Mineração Catoca II")).toBeInTheDocument();

    // Click on "Multimédia" filter tab
    const multimediaTab = screen.getByRole("button", { name: "Multimédia" });
    fireEvent.click(multimediaTab);

    // Only Multimédia items (Captação aérea, Mineração Catoca II) should be visible
    expect(screen.getByText("Captação aérea")).toBeInTheDocument();
    expect(screen.getByText("Mineração Catoca II")).toBeInTheDocument();
    
    // Fotografia items like Mineração Catoca I should NOT be in the DOM
    expect(screen.queryByText("Mineração Catoca I")).not.toBeInTheDocument();

    // Click back to "Todos" tab
    const allTab = screen.getByRole("button", { name: "Todos" });
    fireEvent.click(allTab);

    // All items should be restored
    expect(screen.getByText("Mineração Catoca I")).toBeInTheDocument();
    expect(screen.getByText("Mineração Catoca II")).toBeInTheDocument();
  });

  it("should open and close the lightbox modal when clicking an item and the close button", () => {
    render(
      <MemoryRouter>
        <Portfolio />
      </MemoryRouter>
    );

    // Lightbox should not be in document initially
    expect(screen.queryByTestId("lightbox")).not.toBeInTheDocument();

    // Click on the first portfolio item ("Captação aérea")
    const itemCard = screen.getByText("Captação aérea").closest("article");
    expect(itemCard).toBeInTheDocument();
    if (itemCard) fireEvent.click(itemCard);

    // Lightbox should now be visible
    const lightbox = screen.getByTestId("lightbox");
    expect(lightbox).toBeInTheDocument();

    // Check lightbox image source and text
    const lightboxImg = screen.getByTestId("lightbox-img");
    expect(lightboxImg.getAttribute("src")).toBe("/ungido/portfolio-1.jpg");
    expect(screen.getAllByText("Captação aérea").length).toBeGreaterThan(1); // One in grid, one in lightbox caption

    // Click the close button
    const closeBtn = screen.getByTestId("lightbox-close");
    fireEvent.click(closeBtn);

    // Lightbox should be removed from DOM
    expect(screen.queryByTestId("lightbox")).not.toBeInTheDocument();
  });

  it("should navigate through the lightbox images using the prev/next navigation buttons", () => {
    render(
      <MemoryRouter>
        <Portfolio />
      </MemoryRouter>
    );

    // Open lightbox on first item
    const itemCard = screen.getByText("Captação aérea").closest("article");
    if (itemCard) fireEvent.click(itemCard);

    // Initial image in lightbox
    let lightboxImg = screen.getByTestId("lightbox-img");
    expect(lightboxImg.getAttribute("src")).toBe("/ungido/portfolio-1.jpg");

    // Click next button -> should move to portfolio-2.jpg ("Cenário editorial")
    const nextBtn = screen.getByTestId("lightbox-next");
    fireEvent.click(nextBtn);

    lightboxImg = screen.getByTestId("lightbox-img");
    expect(lightboxImg.getAttribute("src")).toBe("/ungido/portfolio-2.jpg");

    // Click prev button -> should move back to portfolio-1.jpg
    const prevBtn = screen.getByTestId("lightbox-prev");
    fireEvent.click(prevBtn);

    lightboxImg = screen.getByTestId("lightbox-img");
    expect(lightboxImg.getAttribute("src")).toBe("/ungido/portfolio-1.jpg");
  });

  it("should navigate through lightbox and wrap around boundaries using keyboard arrow keys", () => {
    render(
      <MemoryRouter>
        <Portfolio />
      </MemoryRouter>
    );

    // Open lightbox on the first item (index 0)
    const itemCard = screen.getByText("Captação aérea").closest("article");
    if (itemCard) fireEvent.click(itemCard);

    let lightboxImg = screen.getByTestId("lightbox-img");
    expect(lightboxImg.getAttribute("src")).toBe("/ungido/portfolio-1.jpg");

    // Press ArrowLeft (previous) -> should wrap around to the last item (Unitel VII - index 13, /portfolio_assets/fotos/unitel7.jpg)
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    lightboxImg = screen.getByTestId("lightbox-img");
    expect(lightboxImg.getAttribute("src")).toBe("/portfolio_assets/fotos/unitel7.jpg");

    // Press ArrowRight (next) -> should wrap around back to the first item (Captação aérea - index 0, /ungido/portfolio-1.jpg)
    fireEvent.keyDown(window, { key: "ArrowRight" });
    lightboxImg = screen.getByTestId("lightbox-img");
    expect(lightboxImg.getAttribute("src")).toBe("/ungido/portfolio-1.jpg");

    // Press Escape -> should close the lightbox
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByTestId("lightbox")).not.toBeInTheDocument();
  });
});
