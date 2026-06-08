import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

  it("should connect to WebSocket and send form data JSON payload on submission", async () => {
    const mockSend = vi.fn();
    const mockClose = vi.fn();

    class MockWebSocket {
      url: string;
      onopen: (() => void) | null = null;
      onerror: (() => void) | null = null;
      onmessage: ((ev: any) => void) | null = null;
      readyState = 1; // OPEN

      constructor(url: string) {
        this.url = url;
        setTimeout(() => {
          if (this.onopen) this.onopen();
        }, 10);
      }

      send = mockSend;
      close = mockClose;
    }

    vi.stubGlobal("WebSocket", MockWebSocket);

    const originalUrl = import.meta.env.VITE_N8N_WS_URL;
    import.meta.env.VITE_N8N_WS_URL = "ws://localhost:5678/webhook";

    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    // Fill form fields
    fireEvent.change(screen.getByPlaceholderText("Primeiro nome"), { target: { value: "Mauro" } });
    fireEvent.change(screen.getByPlaceholderText("Último nome"), { target: { value: "Gunza" } });
    fireEvent.change(screen.getByPlaceholderText("seuemail@dominio.com"), { target: { value: "mauro@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("+244 9xx xxx xxx"), { target: { value: "+244 928 002 093" } });
    fireEvent.change(screen.getByPlaceholderText("Em que podemos ajudar?"), { target: { value: "Orçamento Vídeo" } });
    fireEvent.change(screen.getByPlaceholderText("Descreva o seu projecto"), { target: { value: "Produção de vídeo institucional" } });

    // Submit form
    const submitBtn = screen.getByRole("button", { name: "Solicitar Orçamento Grátis" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockSend).toHaveBeenCalled();
    });

    const sentPayloadStr = mockSend.mock.calls[0][0];
    const payload = JSON.parse(sentPayloadStr);

    expect(payload.event).toBe("form_submission");
    expect(payload.data.firstName).toBe("Mauro");
    expect(payload.data.lastName).toBe("Gunza");
    expect(payload.data.email).toBe("mauro@example.com");
    expect(payload.data.phone).toBe("+244 928 002 093");
    expect(payload.data.subject).toBe("Orçamento Vídeo");
    expect(payload.data.message).toBe("Produção de vídeo institucional");

    import.meta.env.VITE_N8N_WS_URL = originalUrl;
    vi.unstubAllGlobals();
  });

  it("should send HTTP POST request with form data JSON payload on HTTP webhook URL submission", async () => {
    const mockFetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        json: () => Promise.resolve({ status: "success" }),
      })
    );
    vi.stubGlobal("fetch", mockFetch);

    const originalUrl = import.meta.env.VITE_N8N_WS_URL;
    import.meta.env.VITE_N8N_WS_URL = "https://vcatete.app.n8n.cloud/webhook-test/b1132c16-c2f1-43c0-a77a-f2b2b501eaaa";

    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    // Fill form fields
    fireEvent.change(screen.getByPlaceholderText("Primeiro nome"), { target: { value: "Tiago" } });
    fireEvent.change(screen.getByPlaceholderText("Último nome"), { target: { value: "Matias" } });
    fireEvent.change(screen.getByPlaceholderText("seuemail@dominio.com"), { target: { value: "tiago@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("+244 9xx xxx xxx"), { target: { value: "+244 928 002 093" } });
    fireEvent.change(screen.getByPlaceholderText("Em que podemos ajudar?"), { target: { value: "Contacto Comercial" } });
    fireEvent.change(screen.getByPlaceholderText("Descreva o seu projecto"), { target: { value: "Parceria estratégica" } });

    // Submit form
    const submitBtn = screen.getByRole("button", { name: "Solicitar Orçamento Grátis" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    const [calledUrl, options] = mockFetch.mock.calls[0];
    expect(calledUrl).toBe("https://vcatete.app.n8n.cloud/webhook-test/b1132c16-c2f1-43c0-a77a-f2b2b501eaaa");
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");

    const payload = JSON.parse(options.body);
    expect(payload.event).toBe("form_submission");
    expect(payload.data.firstName).toBe("Tiago");
    expect(payload.data.lastName).toBe("Matias");
    expect(payload.data.email).toBe("tiago@example.com");
    expect(payload.data.phone).toBe("+244 928 002 093");
    expect(payload.data.subject).toBe("Contacto Comercial");
    expect(payload.data.message).toBe("Parceria estratégica");

    import.meta.env.VITE_N8N_WS_URL = originalUrl;
    vi.unstubAllGlobals();
  });
});
