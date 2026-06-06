import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import fs from 'fs';
import path from 'path';
import Index from '../pages/Index';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('Ungido Studio - Corporate Theme and Branding Tests', () => {
  it('should verify that corporate brand logo assets exist in the public directory', () => {
    const headerLogoPath = path.resolve(__dirname, '../../public/ungido/logo-header.png');
    const footerLogoPath = path.resolve(__dirname, '../../public/ungido/logo-footer.png');

    expect(fs.existsSync(headerLogoPath)).toBe(true);
    expect(fs.existsSync(footerLogoPath)).toBe(true);
  });

  it('should verify that the CSS color palette is updated to the brand colors', () => {
    const cssPath = path.resolve(__dirname, '../index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    // Check for orange primary color: HSL 35 100% 50%
    expect(cssContent).toContain('--primary: 35 100% 50%;');
    
    // Check for navy blue background color: HSL 221 100% 6.5%
    expect(cssContent).toContain('--background: 221 100% 6.5%;');

    // Check that there are no remaining old RGB gold color values
    expect(cssContent).not.toContain('247, 212, 95');
    expect(cssContent).not.toContain('212, 168, 77');

    // Check that the yellow hex colors have been replaced
    expect(cssContent).not.toContain('#f7d45f');
    expect(cssContent).not.toContain('#d4a84d');
  });

  it('should render the Index component and find the header logo with correct source and alt text', () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    // Find the logos (header + footer)
    const logos = screen.getAllByAltText('Ungido Studio');
    expect(logos.length).toBeGreaterThanOrEqual(2);
    
    // The first one is the header logo
    expect(logos[0].getAttribute('src')).toBe('/ungido/logo-header.png');
    // The second one is the footer logo
    expect(logos[1].getAttribute('src')).toBe('/ungido/logo-footer.png');
  });

  it('should render the main sections of the website', () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    // Verify presence of major navigation labels / section references
    expect(screen.getAllByText('Sobre Nós').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Serviços').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Portfólio').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Contactos').length).toBeGreaterThanOrEqual(1);
  });

  it('should verify that all service icon images exist in the public/ungido directory', () => {
    const videoIconPath = path.resolve(__dirname, '../../public/ungido/video-editing-app.png');
    const photoIconPath = path.resolve(__dirname, '../../public/ungido/picture.png');
    const designIconPath = path.resolve(__dirname, '../../public/ungido/service.png');

    expect(fs.existsSync(videoIconPath)).toBe(true);
    expect(fs.existsSync(photoIconPath)).toBe(true);
    expect(fs.existsSync(designIconPath)).toBe(true);
  });

  it('should render the service cards with the correct image icon sources', () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    // Find all images within the service cards
    const videoIcon = screen.getByAltText('Multimédia');
    const photoIcon = screen.getByAltText('Fotografia');
    const designIcon = screen.getByAltText('Serviços Gráficos');

    expect(videoIcon.getAttribute('src')).toBe('/ungido/video-editing-app.png');
    expect(photoIcon.getAttribute('src')).toBe('/ungido/picture.png');
    expect(designIcon.getAttribute('src')).toBe('/ungido/service.png');
  });
});
